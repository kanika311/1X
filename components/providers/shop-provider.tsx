"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ShopContextValue = {
  wishlist: string[];
  cart: string[];
  toggleWishlist: (id: string) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  cartCount: number;
  wishlistCount: number;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  useEffect(() => {
    try {
      const w = localStorage.getItem("onex-wishlist");
      const c = localStorage.getItem("onex-cart");
      if (w) setWishlist(JSON.parse(w));
      if (c) setCart(JSON.parse(c));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("onex-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("onex-cart", JSON.stringify(cart));
  }, [cart]);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const addToCart = useCallback((id: string) => {
    setCart((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((x) => x !== id));
  }, []);

  const value = useMemo(
    () => ({
      wishlist,
      cart,
      toggleWishlist,
      addToCart,
      removeFromCart,
      cartCount: cart.length,
      wishlistCount: wishlist.length,
    }),
    [wishlist, cart, toggleWishlist, addToCart, removeFromCart],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
