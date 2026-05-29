import type { Metadata } from "next";

import { WishlistContent } from "@/components/wishlist/wishlist-content";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved courses and therapy services at 1X · Dr. Ayesha.",
};

export default function WishlistPage() {
  return (
    <div className="bg-gradient-to-b from-rose-50/80 via-cream to-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <header className="mb-14 text-center">
          <p className="eyebrow">Saved for you</p>
          <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">Wishlist</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            Only the courses and services you have hearted appear here.
          </p>
        </header>
        <WishlistContent />
      </div>
    </div>
  );
}
