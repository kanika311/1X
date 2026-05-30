"use client";

import { ServiceOfferingCard } from "@/components/services/service-offering-card";
import { SectionHeader } from "@/components/home/section-header";
import type { ServiceOffering } from "@/lib/data/service-catalog";

export function FeaturedOfferings({
  cyber,
  physio,
}: {
  cyber: ServiceOffering[];
  physio: ServiceOffering[];
}) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Cybersecurity" title="Featured Programs" href="/services" linkLabel="View all" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cyber.map((o, i) => (
            <ServiceOfferingCard key={o.slug + o.category} offering={o} index={i} />
          ))}
        </div>
      </section>
      <section className="bg-gradient-to-b from-rose-50/60 via-cream/80 to-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Physiotherapy" title="Featured Therapy" href="/services" linkLabel="Book now" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {physio.map((o, i) => (
              <ServiceOfferingCard key={o.slug + o.category} offering={o} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
