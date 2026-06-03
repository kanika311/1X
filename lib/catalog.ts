/** @deprecated Use `useCatalog()` from catalog-provider for API-backed catalog */
export {
  buildCatalogItems,
  getCartItemsFromCatalog as getCartItems,
  getCatalogItemFromList as getCatalogItem,
  getWishlistItemsFromCatalog as getWishlistItems,
  parseCartKey,
  type CartLineItem,
  type CatalogItem,
} from "@/lib/catalog-items";

import { buildCatalogItems, getCatalogItemFromList } from "@/lib/catalog-items";
import { offerings } from "@/lib/data/service-catalog";

const staticCatalog = buildCatalogItems(offerings);

export function getCatalogItemStatic(id: string) {
  return getCatalogItemFromList(staticCatalog, id);
}
