import { courses } from "@/lib/data/courses";
import { services } from "@/lib/data/services";
import type { ProductCardProps } from "@/components/catalog/product-card";

export type CatalogItem = Pick<
  ProductCardProps,
  "id" | "href" | "title" | "image" | "price" | "rating" | "duration" | "cta" | "bestseller" | "type"
>;

const catalog: CatalogItem[] = [
  ...courses.map((c) => ({
    id: c.slug,
    href: `/courses/${c.slug}`,
    title: c.title,
    image: c.image,
    price: c.price,
    rating: c.rating,
    duration: c.duration,
    cta: "Enroll" as const,
    bestseller: c.bestseller,
    type: "course" as const,
  })),
  ...services.map((s) => ({
    id: s.slug,
    href: `/services/${s.slug}`,
    title: s.title,
    image: s.image,
    price: s.price,
    rating: s.rating,
    duration: s.duration,
    cta: "Book now" as const,
    bestseller: s.bestseller,
    type: "service" as const,
  })),
];

export function getCatalogItem(id: string): CatalogItem | undefined {
  return catalog.find((item) => item.id === id);
}

export function getWishlistItems(ids: string[]): CatalogItem[] {
  return ids.map((id) => getCatalogItem(id)).filter((item): item is CatalogItem => item != null);
}

export type CartLineItem = CatalogItem & { cartKey: string };

/** Cart keys are stored as `course:slug` or `service:slug`. */
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
