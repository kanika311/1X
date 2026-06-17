import {
  offeringId,
  offerings as staticOfferings,
  type ServiceCategory,
  type ServiceDomain,
  type ServiceOffering,
} from "@/lib/data/service-catalog";
import type { ServiceIconKey } from "@/lib/service-icons";
import { getDomainFallbackImage } from "@/lib/image-fallback";
import { resolveApiMediaUrl } from "@/lib/media-url";
import { normalizeFaqList } from "@/lib/normalize-faq";

function findStaticOffering(p: Pick<ApiProduct, "slug" | "domain" | "category">) {
  const slug = p.slug.trim().toLowerCase();
  return staticOfferings.find(
    (o) =>
      o.slug.toLowerCase() === slug && o.domain === p.domain && o.category === p.category,
  );
}

const API = process.env.NEXT_PUBLIC_API_URL;

export type ApiProduct = {
  _id: string;
  slug: string;
  domain: ServiceDomain;
  category: ServiceCategory;
  title: string;
  description: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  iconKey: string;
  bestseller?: boolean;
  benefits?: string[];
  faq?: { q: string; a: string }[];
  cta?: string;
  active?: boolean;
  offeringId?: string;
};

export function productToOffering(p: ApiProduct): ServiceOffering {
  const staticMatch = findStaticOffering(p);
  const resolved = resolveApiMediaUrl(p.image);
  const catalogImage = staticMatch?.image;
  const image = resolved || catalogImage || getDomainFallbackImage(p.domain);

  return {
    slug: p.slug,
    domain: p.domain,
    category: p.category,
    title: p.title,
    description: p.description,
    duration: p.duration,
    price: Number(p.price) || 0,
    rating: Number(p.rating) || 4.8,
    reviews: Number(p.reviews) || 0,
    image,
    catalogImage,
    iconKey: (p.iconKey || "shield") as ServiceIconKey,
    bestseller: Boolean(p.bestseller),
    benefits: Array.isArray(p.benefits) ? p.benefits : [],
    faq: normalizeFaqList(p.faq),
    cta: p.cta || (p.category === "courses" ? "Enroll now" : "Book now"),
  };
}

export function resolveOfferingsList(apiList: ServiceOffering[]): ServiceOffering[] {
  return apiList.length > 0 ? apiList : staticOfferings;
}

export async function fetchActiveProducts(): Promise<ServiceOffering[]> {
  try {
    const res = await fetch(`${API}/products?limit=500&active=true`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !Array.isArray(data.products)) return [];
    return data.products
      .filter((p: ApiProduct) => p.active !== false)
      .map(productToOffering);
  } catch {
    return [];
  }
}

/** Load product by admin slug (primary) */
export async function fetchOfferingBySlug(slug: string): Promise<ServiceOffering | null> {
  const clean = slug.trim().toLowerCase();
  try {
    const res = await fetch(`${API}/products/${encodeURIComponent(clean)}`, {
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.product) return null;
    if (data.product.active === false) return null;
    return productToOffering(data.product as ApiProduct);
  } catch {
    return null;
  }
}

/** @deprecated Use fetchOfferingBySlug — still supports legacy path ids */
export async function fetchOfferingByPath(
  domain: string,
  category: string,
  slug: string,
): Promise<ServiceOffering | null> {
  const fromSlug = await fetchOfferingBySlug(slug);
  if (fromSlug) return fromSlug;
  try {
    const pathId = `${domain}/${category}/${slug}`;
    const res = await fetch(`${API}/products/${encodeURIComponent(pathId)}`, {
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.product) return null;
    if (data.product.active === false) return null;
    return productToOffering(data.product as ApiProduct);
  } catch {
    return null;
  }
}

export function getOfferingsByCategoryFrom(
  list: ServiceOffering[],
  domain: ServiceDomain,
  category: ServiceCategory,
) {
  return list.filter((o) => o.domain === domain && o.category === category);
}

export function getOfferingFromList(
  list: ServiceOffering[],
  domain: string,
  category: string,
  slug: string,
) {
  return list.find((o) => o.domain === domain && o.category === category && o.slug === slug);
}

export function offeringIdFromProduct(p: Pick<ServiceOffering, "domain" | "category" | "slug">) {
  return offeringId(p);
}
