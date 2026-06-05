"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { FiShoppingBag, FiTrash2 } from "react-icons/fi";

import { CartCheckout } from "@/components/cart/cart-checkout";
import { CartPromo } from "@/components/cart/cart-promo";
import { useCatalog } from "@/components/providers/catalog-provider";
import { useShop } from "@/components/providers/shop-provider";
import { Button } from "@/components/ui/button";
import { calcPromoDiscount, calcTotalAfterPromo, type AppliedPromo } from "@/lib/spin-rewards";
import { formatPrice } from "@/lib/utils";

export function CartContent() {
  const { cart, removeFromCart } = useShop();
  const { getCartItems } = useCatalog();
  const [promo, setPromo] = useState<AppliedPromo | null>(null);
  const onPromoChange = useCallback((p: AppliedPromo | null) => setPromo(p), []);

  const items = getCartItems(cart);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = promo ? calcPromoDiscount(subtotal, promo.percent) : 0;
  const total = useMemo(() => calcTotalAfterPromo(subtotal, promo?.percent ?? 0), [subtotal, promo]);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-rose-100 bg-white/80 px-8 py-16 text-center shadow-soft">
        <div className="flex size-16 items-center justify-center rounded-full bg-rose-50 text-mauve">
          <FiShoppingBag className="text-3xl" />
        </div>
        <h2 className="mt-6  text-2xl text-ink">Your bag is empty</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Add programs from the services page ΓÇö only what you add to cart will appear here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/services">
            <Button variant="default">Browse services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ul className="divide-y divide-rose-100 rounded-3xl border border-rose-100 bg-white/80 shadow-soft">
        {items.map((item) => (
          <li key={item.cartKey} className="flex gap-4 p-4 sm:gap-6 sm:p-6">
            <Link href={item.href} className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-rose-50 sm:size-28">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="112px" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-mauve">
                  {item.type === "course" ? "Course" : "Service"}
                </p>
                <Link href={item.href}>
                  <h3 className="mt-1  text-lg leading-snug text-ink hover:text-mauve">{item.title}</h3>
                </Link>
                <p className="mt-1 text-xs text-muted">{item.duration}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-ink">{formatPrice(item.price)}</p>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.cartKey)}
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-mauve-deep"
                  aria-label={`Remove ${item.title} from cart`}
                >
                  <FiTrash2 className="text-sm" /> Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <CartPromo subtotal={subtotal} onPromoChange={onPromoChange} />

      <div className="mt-4 space-y-1 rounded-2xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-sm">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {promo && discount > 0 ? (
          <div className="flex justify-between text-emerald-700">
            <span>Promo ({promo.code})</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-rose-100/80 pt-2 font-semibold text-ink">
          <span>Total</span>
          <span className=" text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      <CartCheckout items={items} subtotal={subtotal} total={total} promo={promo} discount={discount} />
    </div>
  );
}
