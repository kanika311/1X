/** Strip HTML tags and dangerous content from user text before storage.
 * Pure JS — avoids isomorphic-dompurify/jsdom which crashes Vercel serverless. */
export function sanitizeText(value, maxLength = 10_000) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  const cleaned = raw
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.slice(0, maxLength);
}

/** Escape for safe HTML email templates (not for React — React auto-escapes). */
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Prevent NoSQL operator injection in user-supplied object keys/values. */
export function stripMongoOperators(input) {
  if (input == null || typeof input !== "object") return input;
  if (Array.isArray(input)) return input.map(stripMongoOperators);
  const out = {};
  for (const [key, value] of Object.entries(input)) {
    if (key.startsWith("$")) continue;
    out[key] = stripMongoOperators(value);
  }
  return out;
}
