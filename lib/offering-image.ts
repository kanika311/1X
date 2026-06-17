import type { ServiceOffering } from "@/lib/data/service-catalog";
import { getDomainFallbackImage } from "@/lib/image-fallback";
import { resolveApiMediaUrl } from "@/lib/media-url";

function uniqueSources(urls: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    const resolved = resolveApiMediaUrl(raw);
    if (!resolved || seen.has(resolved)) continue;
    seen.add(resolved);
    out.push(resolved);
  }
  return out;
}

/** Ordered image sources: admin/backend upload → catalog default → domain placeholder. */
export function getOfferingImageSources(offering: Pick<ServiceOffering, "image" | "catalogImage" | "domain">): string[] {
  return uniqueSources([
    offering.image,
    offering.catalogImage,
    getDomainFallbackImage(offering.domain),
  ]);
}
