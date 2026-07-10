import { User } from "@/models/User.js";
import { ApiError, normalizePhone } from "@/lib/server/helpers.js";
import { isEmailConfigured, sendPasswordResetEmail } from "@/lib/server/email";
import {
  buildAuthCookies,
  buildClearAuthCookies,
  issueTokenPair,
  revokeRefreshToken,
  rotateRefreshToken,
  REFRESH_COOKIE,
} from "@/lib/server/auth-cookies.js";
import { getSiteUrl } from "@/lib/server/env.js";
import { sanitizeText } from "@/lib/server/sanitize.js";
import { clientIp, rateLimit } from "@/lib/server/rate-limit.js";
import { logAuthFailure, logAuthSuccess } from "@/lib/server/security-log.js";
import { loginSchema, registerSchema } from "@/lib/validation/schemas.ts";
import crypto from "crypto";

function userDto(user) {
  if (!user) throw new ApiError(401, "Not authorized");
  return {
    id: user._id ?? user.id,
    name: user.name,
    number: user.number,
    email: user.email,
    role: user.role,
  };
}

function authMeta(req) {
  return {
    userAgent: req.get?.("user-agent") || "",
    ip: clientIp(req),
  };
}

function enforceRateLimit(req, keyPrefix, max = 10) {
  const ip = clientIp(req);
  const result = rateLimit(`${keyPrefix}:${ip}`, { windowMs: 15 * 60_000, max });
  if (!result.allowed) {
    throw new ApiError(429, "Too many attempts. Please try again later.");
  }
}

function setAuthCookies(res, userId, role, req) {
  return issueTokenPair(userId, role, authMeta(req)).then(({ accessToken, refreshToken }) => {
    res.setCookies(buildAuthCookies(accessToken, refreshToken));
  });
}

async function findUsersByLoginId(loginId) {
  const trimmed = String(loginId || "").trim();
  if (!trimmed) return [];

  if (trimmed.includes("@")) {
    // Email can now belong to both an admin and a user account.
    return User.find({ email: trimmed.toLowerCase() }).select("+password");
  }

  const normalizedNumber = normalizePhone(trimmed);
  if (!normalizedNumber) return [];
  return User.find({ number: normalizedNumber }).select("+password");
}

export async function register(req, res) {
  enforceRateLimit(req, "auth:register", 8);
  const parsed = registerSchema.safeParse(req.body || {});
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || "Invalid registration data");
  }
  const { name, number, password, role } = parsed.data;
  const body = parsed.data;

  if (role === "admin") {
    throw new ApiError(403, "Admin accounts can only be created from the admin dashboard");
  }

  const hasNumberInput = Boolean(String(number ?? "").trim());
  const normalizedNumber = hasNumberInput ? normalizePhone(number) : null;
  if (hasNumberInput && !normalizedNumber) {
    throw new ApiError(400, "Enter a valid phone number");
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Enter a valid email address");
  }

  if (!normalizedNumber && !email) {
    throw new ApiError(400, "Enter a phone number or email to sign up");
  }

  if (String(password || "").length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  if (normalizedNumber && (await User.findOne({ number: normalizedNumber }))) {
    throw new ApiError(409, "Phone number already registered");
  }

  if (email && (await User.findOne({ email, role: "user" }))) {
    throw new ApiError(409, "Email already registered");
  }

  let referredBy;
  if (body.referredBy) {
    const refPhone = normalizePhone(body.referredBy);
    if (refPhone && refPhone !== normalizedNumber) {
      referredBy = refPhone;
    }
  }

  const user = await User.create({
    name: sanitizeText(name, 120),
    password,
    role: "user",
    ...(normalizedNumber ? { number: normalizedNumber } : {}),
    ...(email ? { email } : {}),
    ...(referredBy ? { referredBy } : {}),
  });

  await setAuthCookies(res, user._id, user.role, req);
  logAuthSuccess(user._id, user.role, { action: "register", ip: clientIp(req) });

  res.status(201).json({
    success: true,
    user: userDto(user),
  });
}

export async function login(req, res) {
  enforceRateLimit(req, "auth:login", 12);
  const parsed = loginSchema.safeParse(req.body || {});
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || "Invalid login data");
  }
  const { number, identifier, password, scope = "user" } = parsed.data;
  const loginId = identifier || number;

  const candidates = await findUsersByLoginId(loginId);

  let user = null;
  for (const candidate of candidates) {
    if (await candidate.comparePassword(password)) {
      user = candidate;
      break;
    }
  }

  if (!user) {
    logAuthFailure("invalid_credentials", { ip: clientIp(req), scope });
    throw new ApiError(401, "Invalid email, phone, or password");
  }

  if (user.active === false) {
    logAuthFailure("deactivated_account", { userId: String(user._id), ip: clientIp(req) });
    throw new ApiError(403, "This account has been deactivated. Please contact support to reactivate it.");
  }

  if (scope === "admin" && user.role !== "admin") {
    logAuthFailure("admin_scope_denied", { userId: String(user._id), ip: clientIp(req) });
    throw new ApiError(403, "This account is not an admin");
  }

  if (scope === "user" && user.role !== "user") {
    logAuthFailure("user_scope_denied", { userId: String(user._id), ip: clientIp(req) });
    throw new ApiError(403, "Please use the admin login page for admin accounts");
  }

  await setAuthCookies(res, user._id, user.role, req);
  logAuthSuccess(user._id, user.role, { action: "login", scope, ip: clientIp(req) });

  res.json({
    success: true,
    user: userDto(user),
  });
}

/** Member deactivates their own account — they will no longer be able to sign in. */
export async function deactivateAccount(req, res) {
  if (!req.user) throw new ApiError(401, "Not authorized");

  const updated = await User.findByIdAndUpdate(
    req.user._id ?? req.user.id,
    { $set: { active: false } },
    { new: true },
  );
  if (!updated) throw new ApiError(404, "Account not found");

  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  await revokeRefreshToken(refreshToken);
  res.clearAuthCookies(buildClearAuthCookies());

  res.json({ success: true, message: "Your account has been deactivated." });
}

export async function logout(req, res) {
  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  await revokeRefreshToken(refreshToken);
  res.clearAuthCookies(buildClearAuthCookies());
  res.json({ success: true, message: "Signed out." });
}

export async function refreshSession(req, res) {
  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  if (!refreshToken) {
    throw new ApiError(401, "Session expired. Please sign in again.");
  }

  const rotated = await rotateRefreshToken(refreshToken, authMeta(req));
  if (!rotated) {
    res.clearAuthCookies(buildClearAuthCookies());
    throw new ApiError(401, "Session expired. Please sign in again.");
  }

  res.setCookies(buildAuthCookies(rotated.accessToken, rotated.refreshToken));
  res.json({ success: true });
}

export async function me(req, res) {
  if (!req.user) throw new ApiError(401, "Not authorized");
  res.json({
    success: true,
    user: userDto(req.user),
  });
}

/** Update the signed-in member's name / email (email enables password reset). */
export async function updateProfile(req, res) {
  if (!req.user) throw new ApiError(401, "Not authorized");

  const user = await User.findById(req.user._id ?? req.user.id);
  if (!user) throw new ApiError(404, "Account not found");

  if (req.body.name !== undefined) {
    const name = sanitizeText(req.body.name, 120);
    if (!name) throw new ApiError(400, "Name cannot be empty");
    user.name = name;
  }

  if (req.body.email !== undefined) {
    const email = String(req.body.email).trim().toLowerCase();
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ApiError(400, "Enter a valid email address");
      }
      const existing = await User.findOne({ email, role: user.role, _id: { $ne: user._id } });
      if (existing) {
        throw new ApiError(409, "Email already in use by another account");
      }
      user.email = email;
    } else {
      user.email = undefined;
    }
  }

  await user.save();

  res.json({
    success: true,
    user: userDto(user),
  });
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getFrontendUrl() {
  return getSiteUrl();
}

export async function forgotPassword(req, res) {
  enforceRateLimit(req, "auth:forgot-password", 6);
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Enter a valid email address");
  }

  const successMessage = "Password reset link sent to your email.";
  const user = await User.findOne({ email, role: "admin" });

  if (!user) {
    return res.json({ success: true, message: successMessage });
  }

  if (!isEmailConfigured()) {
    console.error("[forgot-password] EMAIL_USER and EMAIL_PASS are not configured");
    const devHint =
      process.env.NODE_ENV === "development"
        ? " Add EMAIL_USER and EMAIL_PASS (Gmail App Password) to .env.local, then restart npm run dev."
        : "";
    throw new ApiError(500, `Email service is not configured.${devHint}`);
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = hashResetToken(rawToken);
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetUrl = `${getFrontendUrl()}/admin/reset-password?token=${rawToken}`;

  try {
    await sendPasswordResetEmail({
      to: email,
      name: user.name,
      resetUrl,
    });

    console.info("[forgot-password] Reset email queued", { email });
    res.json({ success: true, message: successMessage });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const detail = err instanceof Error ? err.message : String(err);
    console.error("[forgot-password] Failed to send reset email", { email, error: detail });
    throw new ApiError(500, "Could not send reset email. Please try again later.");
  }
}

export async function resetPassword(req, res) {
  const token = String(req.body.token || "").trim();
  const password = String(req.body.password || "");

  if (!token) {
    throw new ApiError(400, "Reset token is required");
  }
  if (!password || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const user = await User.findOne({
    resetPasswordToken: hashResetToken(token),
    resetPasswordExpires: { $gt: new Date() },
    role: "admin",
  }).select("+password +resetPasswordToken +resetPasswordExpires");

  if (!user) {
    throw new ApiError(400, "Reset link is invalid or has expired");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Password updated. You can sign in now.",
  });
}

/** Member (user) forgot password — emails a reset link to the website /reset-password page. */
export async function userForgotPassword(req, res) {
  enforceRateLimit(req, "auth:user-forgot-password", 6);
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Enter a valid email address");
  }

  const successMessage = "If that email is registered, a reset link has been sent.";
  const user = await User.findOne({ email, role: "user" });

  if (!user) {
    return res.json({ success: true, message: successMessage });
  }

  if (!isEmailConfigured()) {
    console.error("[user-forgot-password] EMAIL_USER and EMAIL_PASS are not configured");
    throw new ApiError(500, "Email service is not configured. Please contact support.");
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = hashResetToken(rawToken);
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetUrl = `${getFrontendUrl()}/reset-password?token=${rawToken}`;

  try {
    await sendPasswordResetEmail({ to: email, name: user.name, resetUrl });
    console.info("[user-forgot-password] Reset email queued", { email });
    res.json({ success: true, message: successMessage });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const detail = err instanceof Error ? err.message : String(err);
    console.error("[user-forgot-password] Failed to send reset email", { email, error: detail });
    throw new ApiError(500, "Could not send reset email. Please try again later.");
  }
}

/** Member (user) reset password using the emailed token. */
export async function userResetPassword(req, res) {
  const token = String(req.body.token || "").trim();
  const password = String(req.body.password || "");

  if (!token) {
    throw new ApiError(400, "Reset token is required");
  }
  if (!password || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const user = await User.findOne({
    resetPasswordToken: hashResetToken(token),
    resetPasswordExpires: { $gt: new Date() },
    role: "user",
  }).select("+password +resetPasswordToken +resetPasswordExpires");

  if (!user) {
    throw new ApiError(400, "Reset link is invalid or has expired");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Password updated. You can sign in now.",
  });
}