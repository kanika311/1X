"use client";

import Image from "next/image";
import Link from "next/link";

import { SoftImage } from "@/components/ui/soft-image";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiStar } from "react-icons/fi";

import { useShop } from "@/components/providers/shop-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export type DetailProps = {
  id: string;
  type: "course" | "service";
  title: string;
  images: string[];
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  description: string;
  highlights: string[];
  extra?: { label: string; value: string };
  tabs: { faq: { q: string; a: string }[] };
  cta: string;
  bestseller?: boolean;
};

export function ProductDetailLayout(props: DetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState<"details" | "reviews" | "faq">("details");
  const { toggleWishlist, wishlist, addToCart } = useShop();
  const wished = wishlist.includes(props.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="relative aspect-[4/5] shadow-soft">
            <SoftImage
              src={props.images[activeImage] ?? props.images[0]}
              alt={props.title}
              overlay="card"
              rounded="3xl"
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <div className="mt-4 flex gap-3">
            {props.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative size-20 overflow-hidden rounded-2xl border-2 transition-colors ${i === activeImage ? "border-mauve" : "border-rose-100"}`}
              >
                <Image src={src} alt="" fill className="soft-image object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {props.bestseller ? <Badge className="mb-4">Bestseller</Badge> : null}
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{props.duration}</p>
          <h1 className="mt-2  text-4xl text-ink md:text-5xl">{props.title}</h1>
          <div className="mt-4 flex items-center gap-2">
            <FiStar className="fill-amber-500 text-amber-500" />
            <span className="text-base font-medium text-ink">
              {props.rating} · {props.reviews} reviews
            </span>
          </div>
          {props.extra ? (
            <p className="mt-2 text-sm text-muted">
              {props.extra.label}: <span className="font-medium text-ink">{props.extra.value}</span>
            </p>
          ) : null}
          <p className="mt-6 text-2xl font-medium text-ink">{formatPrice(props.price)}</p>
          <p className="mt-6 text-base leading-relaxed text-muted">{props.description}</p>
          <ul className="mt-6 space-y-2">
            {props.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-base text-ink">
                <span className="text-lavender-400">•</span> {h}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button onClick={() => addToCart(`${props.type}:${props.id}`, { redirect: true })}>{props.cta}</Button>
            <Button variant="outline" onClick={() => toggleWishlist(props.id)}>
              <FiHeart className={wished ? "fill-red-500 text-red-500" : ""} /> Wishlist
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="mt-20 border-t border-ink/10 pt-12">
        <div className="flex gap-8 border-b border-ink/10">
          {(["details", "reviews", "faq"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`pb-4 text-xs font-semibold uppercase tracking-wide ${
                tab === t ? "border-b-2 border-mauve text-ink" : "text-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="py-10">
          {tab === "details" ? (
            <p className="max-w-2xl text-base leading-relaxed text-muted">{props.description}</p>
          ) : null}
          {tab === "reviews" ? (
            <p className="text-base text-muted">Rated {props.rating}/5 from {props.reviews} verified clients.</p>
          ) : null}
          {tab === "faq" ? (
            <dl className="max-w-2xl space-y-6">
              {props.tabs.faq.map(({ q, a }) => (
                <div key={q}>
                  <dt className="font-medium text-ink">{q}</dt>
                  <dd className="mt-2 text-base text-muted">{a}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/services" className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-ink">
          ← Back to services
        </Link>
      </div>
    </div>
  );
}
