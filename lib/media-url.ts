/**
 * Rewrite upload URLs from API (fixes localhost URLs stored in MongoDB).
 */
export function resolveApiMediaUrl(url: string | undefined | null): string {
  if (!url) return "";

  const trimmed = url.trim();
  const apiRoot =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/i, "") ||
    process.env.NEXT_PUBLIC_API_ORIGIN?.replace(/\/$/, "") ||
    "";

  const uploadMatch = trimmed.match(/\/uploads\/([^?#]+)/i);
  if (uploadMatch && apiRoot) {
    return `${apiRoot}/uploads/${uploadMatch[1]}`;
  }

  return trimmed;
}
