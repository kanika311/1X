"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiCheck, FiStar } from "react-icons/fi";

import { ServiceOfferingCard } from "@/components/services/service-offering-card";
import { Button } from "@/components/ui/button";
import { HealthcareFaqSection } from "@/components/services/healthcare-faq-section";
import type { CategoryMeta, ServiceOffering } from "@/lib/data/service-catalog";
import { categoryPath, offeringPath } from "@/lib/data/service-catalog";

type CategoryDetailLayoutProps = {
  meta: CategoryMeta;
  offerings: ServiceOffering[];
};

export function CategoryDetailLayout({ meta, offerings }: CategoryDetailLayoutProps) {
  return (
    <article>
      <section className="border-b border-rose-100/60 bg-gradient-to-b from-rose-50/50 to-background">
        <div className="mx-auto max-w-4xl px-4 pb-14 pt-28 text-center sm:px-6">
          <p className="text-3xl text-black text-center font-[400] mb-10">{meta.para}</p>
          <p className="text-2xl text-blackRead what our clients say about 1X services and courses, or share your own experience.">{meta.subtitle}</p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-5xl text-ink md:text-5xl"
          >
            {meta.title}
          </motion.h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className=" text-2xl text-ink md:text-3xl">Overview</h2>
        <p className="mt-6 text-black leading-relaxed  md:text-xl">{meta.overview}</p>
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
        {/* <h2 className="mb-10 text-center text-2xl text-ink md:text-3xl">Programs</h2> */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((o, i) => (
            <ServiceOfferingCard key={offeringPath(o)} offering={o} index={i} />
          ))}
        </div>
      </section>

      {meta.domain === "physio" ? (
        <HealthcareFaqSection
          serviceTitle={meta.title}
          domain={meta.domain}
          extraFaqs={meta.faq}
          bookHref="/contact"
          bookLabel="Book appointment"
        />
      ) : null}

      {/* <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
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
      </section> */}
    </article>
  );
}
