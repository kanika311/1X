"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiCheck, FiHeart, FiStar } from "react-icons/fi";

import { ServiceIcon } from "@/components/services/service-icon";
import { useShop } from "@/components/providers/shop-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SoftImage } from "@/components/ui/soft-image";
import { Testimonials } from "@/components/home/testimonials";
import type { ServiceOffering } from "@/lib/data/service-catalog";
import {
  CATEGORY_LABELS,
  DOMAIN_LABELS,
  categoryPath,
  offeringId,
  offeringPath,
} from "@/lib/data/service-catalog";
import { formatPrice } from "@/lib/utils";

export function OfferingDetailLayout({ offering }: { offering: ServiceOffering }) {
  const { toggleWishlist, wishlist, addToCart } = useShop();
  const id = offeringId(offering);
  const wished = wishlist.includes(id);
  const cartType = offering.category === "courses" ? "course" : "service";

  return (
    <article>
      <section className="relative min-h-[50vh] overflow-hidden">
        <SoftImage src={offering.image} alt={offering.title} overlay="hero" rounded="none" priority sizes="100vw" className="min-h-[50vh]" />
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-28 text-center sm:px-6">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-rose-100 bg-white/90 text-mauve shadow-soft">
            <ServiceIcon name={offering.iconKey} className="text-2xl" />
          </div>
          {offering.bestseller ? (
            <Badge className="mb-3">Bestseller</Badge>
          ) : null}
          <p className="eyebrow">
            {DOMAIN_LABELS[offering.domain]} · {CATEGORY_LABELS[offering.category]}
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3  text-4xl text-ink md:text-5xl"
          >
            {offering.title}
          </motion.h1>
          <div className="mt-4 flex items-center justify-center gap-2">
            <FiStar className="fill-rose-400 text-rose-400" />
            <span className="text-base font-medium text-ink">
              {offering.rating} · {offering.reviews} reviews
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <h2 className=" text-2xl text-ink">Overview</h2>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{offering.description}</p>
          <p className="mt-6 text-2xl font-semibold text-ink">{formatPrice(offering.price)}</p>
          <p className="mt-1 text-sm text-subtle">{offering.duration}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => addToCart(`${cartType}:${id}`)}>{offering.cta}</Button>
            <Button variant="outline" onClick={() => toggleWishlist(id)}>
              <FiHeart className={wished ? "fill-rose-400 text-rose-400" : ""} /> Save
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-2xl text-ink">Benefits</h2>
          <ul className="mt-6 space-y-3">
            {offering.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-2xl border border-rose-100/80 bg-white/60 p-4">
                <FiCheck className="mt-0.5 shrink-0 text-mauve" />
                <span className="text-base text-ink">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials />

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h2 className="text-center  text-2xl text-ink">FAQ</h2>
        <dl className="mt-10 space-y-8">
          {offering.faq.map(({ q, a }) => (
            <div key={q} className="border-b border-rose-100 pb-6">
              <dt className="font-medium text-ink">{q}</dt>
              <dd className="mt-2 text-base text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
        <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-peach-100 p-10 shadow-glow">
          <h2 className="text-2xl text-ink">Start your journey</h2>
          <p className="mt-3 text-muted">Book {offering.title} or speak with our team for a personalized plan.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button variant="default">{offering.cta}</Button>
            </Link>
            <Link href={categoryPath(offering.domain, offering.category)}>
              <Button variant="outline">View category</Button>
            </Link>
          </div>
        </div>
        <Link
          href="/services"
          className="mt-10 inline-block text-xs font-semibold uppercase tracking-wide text-muted hover:text-ink"
        >
          ← Back to all services
        </Link>
      </section>
    </article>
  );
}
