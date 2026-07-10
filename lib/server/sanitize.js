import DOMPurify from "isomorphic-dompurify";

/** Strip all HTML tags and dangerous content from user text before storage. */
export function sanitizeText(value, maxLength = 10_000) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const cleaned = DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
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
