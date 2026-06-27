import { User } from "@/models/User.js";
import { signToken } from "@/lib/server/jwt.js";
import { ApiError, normalizePhone } from "@/lib/server/helpers.js";
import { isEmailConfigured, sendPasswordResetEmail } from "@/lib/server/email";
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
  const { name, number, password, role } = req.body;

  if (role === "admin") {
    throw new ApiError(403, "Admin accounts can only be created from the admin dashboard");
  }

  // Phone is optional — a member can sign up with just an email instead.
  const hasNumberInput = Boolean(String(number ?? "").trim());
  const normalizedNumber = hasNumberInput ? normalizePhone(number) : null;
  if (hasNumberInput && !normalizedNumber) {
    throw new ApiError(400, "Enter a valid phone number");
  }

  const email = String(req.body.email || "").trim().toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Enter a valid email address");
  }

  if (!normalizedNumber && !email) {
    throw new ApiError(400, "Enter a phone number or email to sign up");
  }

  if (normalizedNumber && (await User.findOne({ number: normalizedNumber }))) {
    throw new ApiError(409, "Phone number already registered");
  }

  // Email only needs to be unique within the user role — admins can share the same email.
  if (email && (await User.findOne({ email, role: "user" }))) {
    throw new ApiError(409, "Email already registered");
  }

  let referredBy;

  if (req.body.referredBy) {
    const refPhone = normalizePhone(req.body.referredBy);

    if (refPhone && refPhone !== normalizedNumber) {
      referredBy = refPhone;
    }
  }

  const user = await User.create({
    name,
    password,
    role: "user",
    ...(normalizedNumber ? { number: normalizedNumber } : {}),
    ...(email ? { email } : {}),
    ...(referredBy ? { referredBy } : {}),
  });

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: userDto(user),
  });

}

export async function login(req, res) {
  const { number, identifier, password } = req.body;
  const loginId = identifier || number;

  const candidates = await findUsersByLoginId(loginId);

  // An email may match both an admin and a user account — sign in whichever password matches.
  let user = null;
  for (const candidate of candidates) {
    if (await candidate.comparePassword(password)) {
      user = candidate;
      break;
    }
  }

  if (!user) {
    throw new ApiError(401, "Invalid email, phone, or password");
  }

  res.json({
    success: true,
    token: signToken(user._id),
    user: userDto(user),
  });
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
    const name = String(req.body.name).trim();
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

function getFrontendUrl(req) {
  // Prefer the actual origin the request came from so reset links always point
  // at the live domain (https://1xdrayxh.com) in prod and localhost in dev —
  // without depending on a (possibly stale) FRONTEND_URL env var.
  if (req) {
    const origin = req.get?.("origin");
    if (origin && /^https?:\/\//i.test(origin)) {
      return origin.replace(/\/$/, "");
    }
    const host = req.get?.("x-forwarded-host") || req.get?.("host");
    if (host) {
      const proto = (req.get?.("x-forwarded-proto") || req.protocol || "https")
        .split(",")[0]
        .trim();
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  }

  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.FRONTEND_URL ||
    (process.env.ADMIN_APP_URL || "").replace(/\/admin\/?$/, "") ||
    "http://localhost:3000";
  return String(raw).replace(/\/$/, "");
}

export async function forgotPassword(req, res) {
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

  const resetUrl = `${getFrontendUrl(req)}/admin/reset-password?token=${rawToken}`;

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
  if (!password || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
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

  const resetUrl = `${getFrontendUrl(req)}/reset-password?token=${rawToken}`;

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
  if (!password || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
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