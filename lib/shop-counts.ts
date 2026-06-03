"use client";

import { useMemo } from "react";

import { useCatalog } from "@/components/providers/catalog-provider";
import { useShop } from "@/components/providers/shop-provider";

/** Badge counts match what cart/wishlist pages can actually show */
export function useShopBadgeCounts() {
  const { cart, wishlist } = useShop();
  const { getCartItems, getWishlistItems, loading } = useCatalog();

  return useMemo(() => {
    if (loading) {
      return { cartCount: 0, wishlistCount: 0 };
    }
    return {
      cartCount: getCartItems(cart).length,
      wishlistCount: getWishlistItems(wishlist).length,
    };
  }, [cart, wishlist, loading, getCartItems, getWishlistItems]);
}
