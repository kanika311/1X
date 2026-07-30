/** Block javascript:, data:, and vbscript: URLs in href/src attributes. */
function canonicalizeLocalAssetPath(value: string): string {
  const lower = value.toLowerCase();
  if (lower === "/logo.jpeg") return "/LOGO.jpeg";
  return value;
}

export function sanitizeHttpUrl(url: string | undefined | null): string {
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

/** Allow only http(s) and same-origin upload paths for media src. */
export function sanitizeMediaSrc(url: string | undefined | null): string {
  const trimmed = String(url ?? "").trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("/uploads/")) return trimmed;

  if (/^https?:\/\/res\.cloudinary\.com\//i.test(trimmed)) return trimmed;

  const uploadMatch = trimmed.match(/\/uploads\/([^?#]+)/i);
  if (uploadMatch) return `/uploads/${uploadMatch[1]}`;

  return sanitizeHttpUrl(trimmed);
}

/** LinkedIn profile links only — blocks arbitrary javascript: payloads. */
export function sanitizeLinkedInUrl(url: string | undefined | null): string {
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

/** tel: and mailto: links with stripped dangerous characters. */
export function sanitizeTelHref(phone: string | undefined | null): string {
  const digits = String(phone ?? "").replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "#";
}

export function sanitizeMailtoHref(email: string | undefined | null): string {
  const trimmed = String(email ?? "").trim();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "#";
  return `mailto:${trimmed}`;
}
