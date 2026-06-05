import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { CartContent } from "@/components/cart/cart-content";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Your selected courses and therapy services at 1X · Dr. Ayxh.",
};

export default function CartPage() {
  return (
    <div className="bg-gradient-to-b from-rose-50/80 via-cream to-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <header className="mb-14 text-center">
          <p className="eyebrow">Your selections</p>
          <h1 className="mt-3  text-4xl text-ink md:text-5xl">Shopping Bag</h1>
        
        </header>
        <RequireAuth>
          <CartContent />
        </RequireAuth>
      </div>
    </div>
  );
}
