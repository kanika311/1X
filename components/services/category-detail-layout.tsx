"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiCheck, FiStar } from "react-icons/fi";

import { ServiceOfferingCard } from "@/components/services/service-offering-card";
import { Button } from "@/components/ui/button";
import { SoftImage } from "@/components/ui/soft-image";
import { Testimonials } from "@/components/home/testimonials";
import type { CategoryMeta, ServiceOffering } from "@/lib/data/service-catalog";
import { categoryPath, offeringPath } from "@/lib/data/service-catalog";

type CategoryDetailLayoutProps = {
  meta: CategoryMeta;
  offerings: ServiceOffering[];
};

export function CategoryDetailLayout({ meta, offerings }: CategoryDetailLayoutProps) {
  return (
    <article>
      <section className="relative min-h-[45vh] overflow-hidden">
        <SoftImage src={meta.image} alt={meta.title} overlay="hero" rounded="none" priority sizes="100vw" className="min-h-[45vh]" />
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-28 text-center sm:px-6">
          <p className="eyebrow">{meta.subtitle}</p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-4xl text-ink md:text-5xl"
          >
            {meta.title}
          </motion.h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className=" text-2xl text-ink md:text-3xl">Overview</h2>
        <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">{meta.overview}</p>
      </section>

      <section className="bg-gradient-to-b from-rose-50/50 to-cream py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center  text-2xl text-ink md:text-3xl">Benefits</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {meta.benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-2xl border border-rose-100/80 bg-white/70 p-5 shadow-soft"
              >
                <FiCheck className="mt-0.5 shrink-0 text-mauve" />
                <span className="text-base text-ink">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl text-ink md:text-3xl">Programs</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((o, i) => (
            <ServiceOfferingCard key={offeringPath(o)} offering={o} index={i} />
          ))}
        </div>
      </section>

      <Testimonials />

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h2 className="text-center  text-2xl text-ink">FAQ</h2>
        <dl className="mt-10 space-y-8">
          {meta.faq.map(({ q, a }) => (
            <div key={q} className="border-b border-rose-100 pb-6">
              <dt className="font-medium text-ink">{q}</dt>
              <dd className="mt-2 text-base text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
        <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-peach-100 p-10 shadow-glow">
          <div className="flex justify-center gap-1 text-rose-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar key={i} className="fill-current" />
            ))}
          </div>
          <h2 className="mt-4  text-2xl text-ink">Ready to begin?</h2>
          <p className="mt-3 text-muted">Book a consultation or explore individual programs below.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button variant="default">Contact us</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline">All services</Button>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
