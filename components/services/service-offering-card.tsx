"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { ServiceIcon } from "@/components/services/service-icon";
import { Button } from "@/components/ui/button";
import { SoftImage } from "@/components/ui/soft-image";
import type { ServiceOffering } from "@/lib/data/service-catalog";
import { categoryPath, offeringPath } from "@/lib/data/service-catalog";
import { formatPrice } from "@/lib/utils";

type ServiceOfferingCardProps = {
  offering: ServiceOffering;
  index?: number;
};

export function ServiceOfferingCard({ offering, index = 0 }: ServiceOfferingCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-rose-100/90 bg-white/80 shadow-soft transition-all duration-500 hover:border-rose-200 hover:shadow-glow"
    >
      <Link href={offeringPath(offering)} className="relative block">
        <div className="relative aspect-[4/3]">
          <SoftImage
            src={offering.image}
            alt={offering.title}
            overlay="card"
            rounded="none"
            sizes="(max-width:768px) 100vw, 33vw"
            className="rounded-t-3xl"
          />
          <div className="absolute left-4 top-4 z-10 flex size-11 items-center justify-center rounded-2xl border border-white/60 bg-white/90 text-mauve shadow-soft backdrop-blur-sm">
            <ServiceIcon name={offering.iconKey} className="text-lg" />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Link href={offeringPath(offering)}>
          <h3 className="font-serif text-xl leading-snug text-ink transition-colors group-hover:text-mauve-deep">
            {offering.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">{offering.description}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-ink">{formatPrice(offering.price)}</span>
          <span className="text-xs text-subtle">{offering.duration}</span>
        </div>
        <div className="mt-5 flex gap-2">
          <Link href={offeringPath(offering)} className="flex-1">
            <Button variant="default" size="sm" className="w-full">
              {offering.cta}
            </Button>
          </Link>
          <Link href={categoryPath(offering.domain, offering.category)} className={`View all ${offering.category}`}>
            <Button variant="outline" size="sm" className="px-3">
              <FiArrowRight />
            </Button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

type CategorySectionProps = {
  label: string;
  domain: ServiceOffering["domain"];
  category: ServiceOffering["category"];
  items: ServiceOffering[];
};

export function CategorySection({ label, domain, category, items }: CategorySectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{label}</p>
          <h2 className="mt-1 font-serif text-2xl text-ink md:text-3xl">{label}</h2>
        </div>
        <Link
          href={categoryPath(domain, category)}
          className="text-xs font-semibold uppercase tracking-wide text-mauve transition-colors hover:text-mauve-deep"
        >
          View all ΓåÆ
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, i) => (
          <ServiceOfferingCard key={offeringPath(item)} offering={item} index={i} />
        ))}
      </div>
    </section>
  );
}
