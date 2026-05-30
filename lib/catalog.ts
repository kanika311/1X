import type { ProductCardProps } from "@/components/catalog/product-card";
import {
  offerings,
  offeringId,
  offeringPath,
  type ServiceOffering,
} from "@/lib/data/service-catalog";

export type CatalogItem = Pick<
  ProductCardProps,
  "id" | "href" | "title" | "image" | "price" | "rating" | "duration" | "cta" | "bestseller" | "type"
> & { catalogId: string };

function toCatalogItem(o: ServiceOffering): CatalogItem {
  const isCourse = o.category === "courses";
  return {
    catalogId: offeringId(o),
    id: offeringId(o),
    href: offeringPath(o),
    title: o.title,
    image: o.image,
    price: o.price,
    rating: o.rating,
    duration: o.duration,
    cta: o.cta,
    bestseller: o.bestseller,
    type: isCourse ? "course" : "service",
  };
}

const catalog: CatalogItem[] = offerings.map(toCatalogItem);

export function getCatalogItem(id: string): CatalogItem | undefined {
  return catalog.find((item) => item.id === id || item.catalogId === id);
}

export function getWishlistItems(ids: string[]): CatalogItem[] {
  return ids.map((id) => getCatalogItem(id)).filter((item): item is CatalogItem => item != null);
}

export type CartLineItem = CatalogItem & { cartKey: string };

/** Cart keys: `course:domain/category/slug` or `service:domain/category/slug` */
export function parseCartKey(key: string): { type: CatalogItem["type"]; id: string } | null {
  const sep = key.indexOf(":");
  if (sep === -1) return null;
  const type = key.slice(0, sep);
  const id = key.slice(sep + 1);
  if ((type === "course" || type === "service") && id) return { type, id };
  return null;
}

export function getCartItems(keys: string[]): CartLineItem[] {
  return keys
    .map((cartKey) => {
      const parsed = parseCartKey(cartKey);
      if (!parsed) return null;
      const item = catalog.find((c) => c.id === parsed.id && c.type === parsed.type);
      if (!item) return null;
      return { ...item, cartKey };
    })
    .filter((item): item is CartLineItem => item != null);
}
