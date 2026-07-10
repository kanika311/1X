/**
 * Public base URL for uploaded files (no trailing slash).
 * Set API_PUBLIC_URL on Render: https://onex-backend-7p9r.onrender.com
 */
import { sanitizeMediaSrc } from "@/lib/server/safeUrl.js";

export function getPublicBaseUrl(req) {
  if (req) {
    const proto = (req.get("x-forwarded-proto") || req.protocol || "http").split(",")[0].trim();
    const host = (req.get("x-forwarded-host") || req.get("host") || "").split(",")[0].trim();
    if (host) return `${proto}://${host}`.replace(/\/$/, "");
  }

  let fromEnv = process.env.API_PUBLIC_URL?.trim();

  if (fromEnv && process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1/i.test(fromEnv)) {
    fromEnv = null;
  }

  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const renderUrl = process.env.RENDER_EXTERNAL_URL?.trim();
  if (renderUrl) return renderUrl.replace(/\/$/, "");

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (site) {
    const base = site.startsWith("http") ? site : `https://${site}`;
    return base.replace(/\/$/, "");
  }

  const port = process.env.PORT || 3000;
  return `http://localhost:${port}`;
}

/** Extract filename from /uploads/... or full URL */
export function uploadFilenameFromValue(value) {
  const s = String(value ?? "").trim();
  const match = s.match(/\/uploads\/([^?#]+)/i) || s.match(/^uploads\/([^?#]+)/i);
  return match ? match[1] : null;
}

/** Full URL for a file stored in /uploads */
export function publicUploadUrl(filename, req) {
  const name = String(filename || "")
    .replace(/^\/+/, "")
    .replace(/^uploads\//i, "");
  return `${getPublicBaseUrl(req)}/uploads/${name}`;
}

/** Store relative path in MongoDB: /uploads/filename.jpg */
export function normalizeImageForStorage(value) {
  if (value == null || value === "") return "";
  const name = uploadFilenameFromValue(value);
  if (name) return `/uploads/${name}`;
  const s = String(value).trim();
  if (!s.includes("/") && /\.(jpe?g|png|webp|gif)$/i.test(s)) return `/uploads/${s}`;
  return sanitizeMediaSrc(s);
}

/**
 * API responses return same-origin paths for /uploads (unified Next.js app).
 */
export function resolveMediaUrl(value, req) {
  if (value == null || value === "") return "";

  const name = uploadFilenameFromValue(value);
  if (name) return `/uploads/${name}`;

  const s = String(value).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) {
    const fromUrl = uploadFilenameFromValue(s);
    if (fromUrl) return `/uploads/${fromUrl}`;
    return sanitizeMediaSrc(s);
  }

  return sanitizeMediaSrc(s);
}

export function resolveProductMedia(product, req) {
  if (!product) return product;
  const doc = product.toObject ? product.toObject({ virtuals: true }) : { ...product };
  if (doc.image) doc.image = resolveMediaUrl(doc.image, req);
  return doc;
}
