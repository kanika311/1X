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
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { isRegisteredUser, LOGIN_PATH } from "@/lib/auth-utils";
import {
  addCartItem,
  addWishlistItem,
  fetchCartKeys,
  fetchWishlistIds,
  offeringIdFromCartKey,
  clearCartOnServer,
  removeCartItem,
  removeCartItemsOnServer,
  removeWishlistItem,
} from "@/lib/shop-api";

type ShopContextValue = {
  wishlist: string[];
  cart: string[];
  toggleWishlist: (id: string) => void;
  addToCart: (id: string, options?: { redirect?: boolean }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => Promise<void>;
  removeCartItems: (cartKeys: string[]) => Promise<void>;
  cartCount: number;
  wishlistCount: number;
  shopLoading: boolean;
  shopError: string | null;
  clearShopError: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isReady: authReady } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [shopLoading, setShopLoading] = useState(false);
  const [shopError, setShopError] = useState<string | null>(null);

  const clearShopError = useCallback(() => setShopError(null), []);

  const handleShopError = useCallback((e: unknown) => {
    setShopError(e instanceof Error ? e.message : "Could not update wishlist or cart");
  }, []);

  const requireLogin = useCallback(() => {
    if (!authReady) return false;
    if (isRegisteredUser(session)) return true;
    const next = pathname && pathname !== LOGIN_PATH ? pathname : "/";
    router.push(`${LOGIN_PATH}?next=${encodeURIComponent(next)}`);
    return false;
  }, [authReady, session, router, pathname]);

  const loadFromServer = useCallback(async () => {
    if (pathname?.startsWith("/admin")) return;
    if (!isRegisteredUser(session)) {
      setWishlist([]);
      setCart([]);
      return;
    }
    setShopLoading(true);
    try {
      const [wIds, cKeys] = await Promise.all([fetchWishlistIds(), fetchCartKeys()]);
      setWishlist(wIds);
      setCart(cKeys);
    } catch (e) {
      setWishlist([]);
      setCart([]);
      handleShopError(e);
    } finally {
      setShopLoading(false);
    }
  }, [session, handleShopError, pathname]);

  useEffect(() => {
    if (!authReady) return;
    void loadFromServer();
  }, [authReady, session?.number, session?.token, loadFromServer]);

  const toggleWishlist = useCallback(
    async (id: string) => {
      if (!requireLogin()) return;
      clearShopError();
      const removing = wishlist.includes(id);
      try {
        if (removing) {
          await removeWishlistItem(id);
          setWishlist((prev) => prev.filter((x) => x !== id));
        } else {
          await addWishlistItem(id);
          setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]));
        }
      } catch (e) {
        handleShopError(e);
        void loadFromServer();
      }
    },
    [requireLogin, wishlist, loadFromServer, clearShopError, handleShopError],
  );

  const addToCart = useCallback(
    async (cartKey: string, options?: { redirect?: boolean }) => {
      if (!requireLogin()) return;
      clearShopError();
      if (!cart.includes(cartKey)) {
        const productId = offeringIdFromCartKey(cartKey);
        try {
          await addCartItem(productId);
          setCart((prev) => [...prev, cartKey]);
        } catch (e) {
          handleShopError(e);
          void loadFromServer();
          return;
        }
      }
      if (options?.redirect) router.push("/cart");
    },
    [requireLogin, cart, loadFromServer, clearShopError, handleShopError, router],
  );

  const removeFromCart = useCallback(
    async (cartKey: string) => {
      if (!requireLogin()) return;
      try {
        await removeCartItem(cartKey);
        setCart((prev) => prev.filter((x) => x !== cartKey));
      } catch {
        void loadFromServer();
      }
    },
    [requireLogin, loadFromServer],
  );

  const clearCart = useCallback(async () => {
    if (!isRegisteredUser(session)) {
      setCart([]);
      return;
    }
    try {
      await clearCartOnServer();
      setCart([]);
    } catch {
      setCart([]);
      void loadFromServer();
    }
  }, [session, loadFromServer]);

  const removeCartItems = useCallback(
    async (cartKeys: string[]) => {
      if (cartKeys.length === 0) return;
      if (!isRegisteredUser(session)) {
        setCart((prev) => prev.filter((k) => !cartKeys.includes(k)));
        return;
      }
      const drop = new Set(cartKeys);
      try {
        await removeCartItemsOnServer(cartKeys);
        setCart((prev) => prev.filter((k) => !drop.has(k)));
      } catch {
        void loadFromServer();
      }
    },
    [session, loadFromServer],
  );

  const value = useMemo(
    () => ({
      wishlist,
      cart,
      toggleWishlist,
      addToCart,
      removeFromCart,
      clearCart,
      removeCartItems,
      cartCount: cart.length,
      wishlistCount: wishlist.length,
      shopLoading,
      shopError,
      clearShopError,
    }),
    [
      wishlist,
      cart,
      toggleWishlist,
      addToCart,
      removeFromCart,
      clearCart,
      removeCartItems,
      shopLoading,
      shopError,
      clearShopError,
    ],
  );

  return (
    <ShopContext.Provider value={value}>
      {shopError && !pathname?.startsWith("/admin") ? (
        <div
          role="alert"
          className="fixed bottom-4 left-1/2 z-[100] max-w-md -translate-x-1/2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm text-ink shadow-lg"
        >
          <p>{shopError}</p>
          <button
            type="button"
            className="mt-2 text-xs font-semibold uppercase tracking-wide text-mauve hover:text-ink"
            onClick={clearShopError}
          >
            Dismiss
          </button>
        </div>
      ) : null}
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
