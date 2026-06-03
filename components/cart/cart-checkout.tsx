"use client";

import { UpiPaymentFlow } from "@/components/checkout/upi-payment-flow";
import { useShop } from "@/components/providers/shop-provider";
import type { CartLineItem } from "@/lib/catalog";
import { saveCartPromo, type AppliedPromo } from "@/lib/spin-rewards";

type Props = {
  items: CartLineItem[];
  subtotal: number;
  total: number;
  promo: AppliedPromo | null;
  discount: number;
};

export function CartCheckout({ items, subtotal, total, promo, discount }: Props) {
  const { removeCartItems } = useShop();

  return (
    <UpiPaymentFlow
      layout="inline"
      triggerLabel="Place order & pay"
      orderLabel="Cart order — 1X"
      purchasedCartKeys={items.map((i) => i.cartKey)}
      items={items.map((item) => ({
        cartKey: item.cartKey,
        offeringId: item.catalogId,
        type: item.type,
        title: item.title,
        price: item.price,
        quantity: 1,
        image: item.image,
        duration: item.duration,
      }))}
      subtotal={total}
      lineSubtotal={subtotal}
      promoCode={promo?.code}
      discountPercent={promo?.percent ?? 0}
      discountAmount={discount}
      onSuccess={(keys) => {
        saveCartPromo(null);
        removeCartItems(keys ?? items.map((i) => i.cartKey));
      }}
      className="mt-8"
    />
  );
}
