import { apiRequest } from "@/lib/api-client";

/** Catalog offering id, e.g. cyber/courses/ethical-hacking */
export async function fetchWishlistIds(): Promise<string[]> {
  const data = await apiRequest<{
    wishlist: { productIds: string[]; products: { offeringId: string }[] };
  }>("/wishlist", { auth: true });
  const resolved = (data.wishlist.products ?? []).map((p) => p.offeringId).filter(Boolean);
  return resolved.length > 0 ? resolved : (data.wishlist.productIds ?? []);
}

export async function addWishlistItem(productId: string) {
  await apiRequest("/wishlist", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ productId }),
  });
}

export async function removeWishlistItem(productId: string) {
  await apiRequest(`/wishlist/${encodeURIComponent(productId)}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function fetchCartKeys(): Promise<string[]> {
  const data = await apiRequest<{ cart: { items: { cartKey: string }[] } }>("/cart", { auth: true });
  return (data.cart.items ?? []).map((i) => i.cartKey).filter(Boolean);
}

export async function addCartItem(productId: string) {
  await apiRequest("/cart", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ productId }),
  });
}

export async function removeCartItem(cartKey: string) {
  await apiRequest(`/cart/${encodeURIComponent(cartKey)}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function clearCartOnServer() {
  await apiRequest("/cart/clear", { method: "DELETE", auth: true });
}

export async function removeCartItemsOnServer(cartKeys: string[]) {
  if (cartKeys.length === 0) return;
  await apiRequest("/cart/remove-items", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ cartKeys }),
  });
}

/** cartKey is course:domain/cat/slug — API wants domain/cat/slug */
export function offeringIdFromCartKey(cartKey: string): string {
  const sep = cartKey.indexOf(":");
  return sep === -1 ? cartKey : cartKey.slice(sep + 1);
}
