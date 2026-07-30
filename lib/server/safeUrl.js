/** Block javascript:, data:, and vbscript: URLs in href/src attributes. */
function canonicalizeLocalAssetPath(value) {
  const lower = value.toLowerCase();
  if (lower === "/logo.jpeg") return "/LOGO.jpeg";
  return value;
}

export function sanitizeHttpUrl(url) {
  const trimmed = String(url ?? "").trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return canonicalizeLocalAssetPath(trimmed);
  }

  try {
    const parsed = new URL(trimmed, "https://example.invalid");
    const protocol = parsed.protocol.toLowerCase();
    if (protocol === "http:" || protocol === "https:") {
      return trimmed;
    }
  } catch {
    return "";
  }

  return "";
}

export function sanitizeMediaSrc(url) {
  const trimmed = String(url ?? "").trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("/uploads/")) return trimmed;

  if (/^https?:\/\/res\.cloudinary\.com\//i.test(trimmed)) return trimmed;

  const uploadMatch = trimmed.match(/\/uploads\/([^?#]+)/i);
  if (uploadMatch) return `/uploads/${uploadMatch[1]}`;

  return sanitizeHttpUrl(trimmed);
}

export function sanitizeLinkedInUrl(url) {
  const safe = sanitizeHttpUrl(url);
  if (!safe) return "";
  try {
    const host = new URL(safe).hostname.toLowerCase();
    if (host === "linkedin.com" || host.endsWith(".linkedin.com")) return safe;
  } catch {
    return "";
  }
  return "";
}
