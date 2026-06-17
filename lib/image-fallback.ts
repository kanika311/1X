import { IMG } from "@/lib/images";
import { resolveApiMediaUrl } from "@/lib/media-url";
import type { ServiceDomain } from "@/lib/data/service-catalog";

/** Cyber-themed placeholder — not a fitness/wellness stock photo. */
export const FALLBACK_CYBER_IMAGE = "/cybersecurity.jpeg";
/** Physio-themed placeholder. */
export const FALLBACK_PHYSIO_IMAGE = "/physiotherapy.png";
/** Generic site fallback (logo). */
export const FALLBACK_IMAGE = "/LOGO.jpeg";

export function getDomainFallbackImage(domain?: ServiceDomain | string): string {
  if (domain === "cyber") return FALLBACK_CYBER_IMAGE;
  if (domain === "physio") return FALLBACK_PHYSIO_IMAGE;
  return FALLBACK_IMAGE;
}

export function withImageFallback(
  url: string | undefined | null,
  domain?: ServiceDomain | string,
): string {
  const resolved = resolveApiMediaUrl(url);
  return resolved || getDomainFallbackImage(domain);
}

/** Wellness stock — only for physio marketing sections, not cyber cards. */
export const WELLNESS_STOCK_IMAGE = IMG.service;
