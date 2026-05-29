"use client";

import Link from "next/link";
import { FiHeart } from "react-icons/fi";

import { ProductCard } from "@/components/catalog/product-card";
import { useShop } from "@/components/providers/shop-provider";
import { Button } from "@/components/ui/button";
import { getWishlistItems } from "@/lib/catalog";

export function WishlistContent() {
  const { wishlist } = useShop();
  const items = getWishlistItems(wishlist);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-rose-100 bg-white/80 px-8 py-16 text-center shadow-soft">
        <div className="flex size-16 items-center justify-center rounded-full bg-rose-50 text-rose-400">
          <FiHeart className="text-3xl" />
        </div>
        <h2 className="mt-6 font-serif text-2xl text-ink">Your wishlist is empty</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Tap the heart on any course or therapy service to save it here — only your favourites will appear.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/courses">
            <Button variant="default">Browse courses</Button>
          </Link>
          <Link href="/services">
            <Button variant="outline">Browse services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {items.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </div>
  );
}
