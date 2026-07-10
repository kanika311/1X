import crypto from "crypto";
import jwt from "jsonwebtoken";

import { RefreshToken } from "@/models/RefreshToken.js";
import { isProduction } from "@/lib/server/env.js";

export const ACCESS_COOKIE = "onex_at";
export const REFRESH_COOKIE = "onex_rt";

const ACCESS_TTL = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_TTL_MS = Number(process.env.JWT_REFRESH_TTL_MS || 7 * 24 * 60 * 60 * 1000);

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function signAccessToken(userId, role) {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: ACCESS_TTL });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export async function issueTokenPair(userId, role, meta = {}) {
  const accessToken = signAccessToken(userId, role);
  const refreshToken = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

  await RefreshToken.create({
    user: userId,
    tokenHash: hashToken(refreshToken),
    expiresAt,
    userAgent: meta.userAgent || "",
    ip: meta.ip || "",
  });

  return { accessToken, refreshToken, expiresAt };
}

export async function rotateRefreshToken(refreshToken, meta = {}) {
  const tokenHash = hashToken(refreshToken);
  const stored = await RefreshToken.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  }).populate("user");

  if (!stored?.user) return null;

  stored.revokedAt = new Date();
  await stored.save();

  const user = stored.user;
  if (user.active === false) return null;

  return issueTokenPair(user._id, user.role, meta);
}

export async function revokeRefreshToken(refreshToken) {
  if (!refreshToken) return;
  await RefreshToken.updateOne(
    { tokenHash: hashToken(refreshToken), revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}

export async function revokeAllUserTokens(userId) {
  await RefreshToken.updateMany(
    { user: userId, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}

export function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(maxAgeMs / 1000),
  };
}

export function buildAuthCookies(accessToken, refreshToken) {
  return [
    { name: ACCESS_COOKIE, value: accessToken, options: cookieOptions(15 * 60 * 1000) },
    { name: REFRESH_COOKIE, value: refreshToken, options: cookieOptions(REFRESH_TTL_MS) },
  ];
}

export function buildClearAuthCookies() {
  const clear = { httpOnly: true, secure: isProduction(), sameSite: "lax", path: "/", maxAge: 0 };
  return [
    { name: ACCESS_COOKIE, value: "", options: clear },
    { name: REFRESH_COOKIE, value: "", options: clear },
  ];
}
