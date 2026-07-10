/** Validate required environment variables at startup. */
export function validateEnv() {
  const required = ["JWT_SECRET", "MONGODB_URI"];
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if ((process.env.JWT_SECRET || "").length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters");
  }
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.FRONTEND_URL?.trim() ||
    (process.env.ADMIN_APP_URL || "").replace(/\/admin\/?$/, "") ||
    "http://localhost:3000";
  return String(raw).replace(/\/$/, "");
}
