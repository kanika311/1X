import type { ProductCardProps } from "@/components/catalog/product-card";
import { offeringId, offeringPath, type ServiceOffering } from "@/lib/data/service-catalog";

export type CatalogItem = Pick<
  ProductCardProps,
  "id" | "href" | "title" | "image" | "price" | "rating" | "duration" | "cta" | "bestseller" | "type"
> & { catalogId: string; catalogImage?: string; domain?: ServiceOffering["domain"] };

export function offeringToCatalogItem(o: ServiceOffering): CatalogItem {
  const isCourse = o.category === "courses";
  return {
    catalogId: offeringId(o),
    id: offeringId(o),
    href: offeringPath(o),
    title: o.title,
    image: o.image,
    catalogImage: o.catalogImage,
    domain: o.domain,
    price: o.price,
    rating: o.rating,
    duration: o.duration,
    cta: o.cta,
    bestseller: o.bestseller,
    type: isCourse ? "course" : "service",
  };
}

export function buildCatalogItems(offerings: ServiceOffering[]): CatalogItem[] {
  return offerings.map(offeringToCatalogItem);
}

function slugFromRef(ref: string) {
  const parts = ref.replace(/^\/+/, "").split("/").filter(Boolean);
  return parts[parts.length - 1]?.toLowerCase() ?? "";
}

export function getCatalogItemFromList(list: CatalogItem[], id: string): CatalogItem | undefined {
  const ref = id.replace(/^\/+/, "").trim();
  const direct = list.find((item) => item.id === ref || item.catalogId === ref);
  if (direct) return direct;
  const slug = slugFromRef(ref);
  if (!slug) return undefined;
  return list.find((item) => slugFromRef(item.id) === slug);
}

export type CartLineItem = CatalogItem & { cartKey: string };

export function parseCartKey(key: string): { type: CatalogItem["type"]; id: string } | null {
  const sep = key.indexOf(":");
  if (sep === -1) return null;
  const type = key.slice(0, sep);
  const id = key.slice(sep + 1);
  if ((type === "course" || type === "service") && id) return { type, id };
  return null;
}

export function getCartItemsFromCatalog(catalog: CatalogItem[], keys: string[]): CartLineItem[] {
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

export function getWishlistItemsFromCatalog(catalog: CatalogItem[], ids: string[]): CatalogItem[] {
  return ids
    .map((id) => getCatalogItemFromList(catalog, id))
    .filter((item): item is CatalogItem => item != null);
}
