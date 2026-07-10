const buckets = new Map();

/**
 * Simple in-memory sliding-window rate limiter.
 * For production at scale, replace with Redis-backed limiter.
 */
export function rateLimit(key, { windowMs = 60_000, max = 10 } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  if (bucket.count > max) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }
  return { allowed: true, remaining: max - bucket.count };
}

export function clientIp(req) {
  const forwarded = req.get?.("x-forwarded-for") || req.headers?.["x-forwarded-for"];
  if (forwarded) return String(forwarded).split(",")[0].trim();
  return req.get?.("x-real-ip") || "unknown";
}

/** Prune stale buckets periodically to avoid memory growth. */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      if (now > bucket.resetAt + 60_000) buckets.delete(key);
    }
  }, 5 * 60_000).unref?.();
}
