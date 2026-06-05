"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiHeart, FiStar } from "react-icons/fi";

import { useShop } from "@/components/providers/shop-provider";
import { SoftImage } from "@/components/ui/soft-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";

export type ProductCardProps = {
  id: string;
  href: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  duration: string;
  cta: string;
  bestseller?: boolean;
  type: "course" | "service";
};

export function ProductCard({
  id,
  href,
  title,
  image,
  price,
  rating,
  duration,
  cta,
  bestseller,
  type,
}: ProductCardProps) {
  const { toggleWishlist, wishlist, addToCart } = useShop();
  const wished = wishlist.includes(id);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={href} className="relative block shadow-soft transition-shadow duration-500 hover:shadow-glow">
        <div className="relative aspect-[3/4]">
          <SoftImage
            src={image}
            alt={title}
            overlay="card"
            rounded="2xl"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {bestseller ? (
            <div className="absolute left-3 top-3 z-10">
              <Badge>Bestseller</Badge>
            </div>
          ) : null}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(id);
            }}
            className={cn(
              "absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full border border-rose-100 bg-white/95 shadow-soft backdrop-blur-sm transition-colors",
              wished && "text-rose-400",
            )}
            aria-label="Add to wishlist"
          >
            <FiHeart className={wished ? "fill-current" : ""} />
          </button>
        </div>
      </Link>

      <div className="mt-5 space-y-2 text-center sm:text-left">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{duration}</p>
        <Link href={href}>
          <h3 className=" text-xl leading-snug text-ink transition-colors group-hover:text-mauve-deep">{title}</h3>
        </Link>
        <div className="flex items-center justify-center gap-1 sm:justify-start">
          <FiStar className="fill-rose-300 text-rose-400" />
          <span className="text-sm font-medium text-ink">{rating.toFixed(1)}</span>
        </div>
        <p className="text-base font-semibold text-ink">{formatPrice(price)}</p>
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => addToCart(`${type}:${id}`)}
        >
          {cta}
        </Button>
      </div>
    </motion.article>
  );
}
