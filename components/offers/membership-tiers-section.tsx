"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";

import { UpiPaymentFlow } from "@/components/checkout/upi-payment-flow";
import { fetchMembershipOffersClient, type MembershipOffer } from "@/lib/offers-api";
import { cn, formatPrice } from "@/lib/utils";

function BenefitList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-ink md:text-base">
          <FiCheck className="mt-0.5 shrink-0 text-mauve" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TierCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "glass rounded-3xl border border-mauve/30 bg-gradient-to-br from-rose-50/90 via-white to-peach-100/80 p-6 shadow-soft transition-all duration-500 hover:shadow-glow sm:p-8",
      )}
    >
      <h3 className="font-serif text-xl text-ink md:text-2xl">{title}</h3>
      {children}
    </motion.div>
  );
}

function MembershipTierCard({ tier }: { tier: MembershipOffer }) {
  const benefits =
    tier.benefits?.length > 0
      ? tier.benefits
      : [
          "Access to exclusive member rewards",
          "Priority booking access",
          "Insider discounts",
          "Special promotional offers",
          "Community member benefits",
        ];

  return (
    <TierCard title={tier.title}>
      <div className="mt-6 rounded-2xl border border-rose-100 bg-gradient-to-br from-mauve-deep via-mauve to-rose-400 p-8 text-white shadow-glow">
        <p className="mt-8 font-serif text-3xl">{tier.cardTitle || "Founding Member"}</p>
        <p className="mt-2 text-sm text-rose-100">{tier.subtitle || "Premium wellness & cyber access"}</p>
        <div className="mt-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-rose-100">{tier.feeLabel || "One-time fee"}</p>
            <p className="font-serif text-4xl">{formatPrice(tier.price ?? 0)}</p>
          </div>
          <div className="size-12 rounded-full border border-white/30 bg-white/10" />
        </div>
      </div>
      <BenefitList items={benefits} />
      <div className="mt-8">
        {tier.price && tier.price > 0 ? (
          <UpiPaymentFlow
            layout="modal"
            triggerLabel={tier.ctaText || "Get Your Membership Card"}
            orderLabel={`${tier.title} membership — 1X`}
            subtotal={tier.price}
            items={[
              {
                cartKey: `membership-${tier.slug}`,
                offeringId: tier.slug,
                type: "membership",
                title: `${tier.title} — ${tier.cardTitle || "Founding Member"}`,
                price: tier.price,
                quantity: 1,
                duration: tier.feeLabel || "One-time fee",
              },
            ]}
          />
        ) : (
          <p className="text-center text-sm text-muted">Membership price not set yet. Please check back soon.</p>
        )}
      </div>
    </TierCard>
  );
}

export function MembershipTiersSection() {
  const [tiers, setTiers] = useState<MembershipOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchMembershipOffersClient().then((data) => {
      if (!cancelled) {
        setTiers(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {loading ? (
        <p className="text-center text-sm text-muted">Loading membership tiers…</p>
      ) : (
        <div className="mx-auto mt-12 grid max-w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <MembershipTierCard key={tier._id || tier.slug} tier={tier} />
          ))}
        </div>
      )}
    </section>
  );
}
