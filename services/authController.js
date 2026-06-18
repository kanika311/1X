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

async function findUserByLoginId(loginId) {
  const trimmed = String(loginId || "").trim();
  if (!trimmed) return null;

  if (trimmed.includes("@")) {
    return User.findOne({ email: trimmed.toLowerCase() }).select("+password");
  }

  const normalizedNumber = normalizePhone(trimmed);
  if (!normalizedNumber) return null;
  return User.findOne({ number: normalizedNumber }).select("+password");
}

export async function register(req, res) {
  const { name, number, password, role } = req.body;

  const normalizedNumber = normalizePhone(number);

  if (!normalizedNumber) {
    throw new ApiError(400, "Enter a valid 10-digit phone number");
  }

  if (await User.findOne({ number: normalizedNumber })) {
    throw new ApiError(409, "Phone number already registered");
  }

  if (role === "admin") {
    throw new ApiError(403, "Admin accounts can only be created from the admin dashboard");
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
    number: normalizedNumber,
    password,
    role: "user",
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

  const user = await findUserByLoginId(loginId);

  if (!user || !(await user.comparePassword(password))) {
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

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getFrontendUrl() {
  const raw =
    process.env.FRONTEND_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
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