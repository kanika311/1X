/**
 * Resolve the API base URL for browser and server requests.
 * Falls back to same-origin `/api` when no external API is configured.
 */
export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  if (typeof window !== "undefined") {
    return "/api";
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (site) {
    const base = site.startsWith("http") ? site : `https://${site}`;
    return `${base.replace(/\/$/, "")}/api`;
  }

  return "http://localhost:3000/api";
}
