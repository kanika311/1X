import { FALLBACK_IMAGE } from "@/lib/image-fallback";

/** Save only /uploads/filename or full Cloudinary URL in MongoDB. */
export function toUploadStoragePath(url: string | undefined | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\/res\.cloudinary\.com\//i.test(trimmed)) return trimmed;
  const match = trimmed.match(/\/uploads\/([^?#]+)/i);
  if (match) return `/uploads/${match[1]}`;
  return trimmed;
}

/**
 * Rewrite upload URLs from API — always serve /uploads from the same origin
 * (fixes production URLs like https://1xdrayxh.com/uploads/... on localhost).
 */
export function resolveApiMediaUrl(url: string | undefined | null): string {
  if (!url) return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  if (/^https?:\/\/res\.cloudinary\.com\//i.test(trimmed)) return trimmed;

  const uploadMatch = trimmed.match(/\/uploads\/([^?#]+)/i);
  if (uploadMatch) return `/uploads/${uploadMatch[1]}`;

  if (trimmed.startsWith("/uploads/")) return trimmed;

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) return trimmed;

  return trimmed;
}

export function resolveApiMediaUrlOrFallback(url: string | undefined | null): string {
  return resolveApiMediaUrl(url) || FALLBACK_IMAGE;
}
