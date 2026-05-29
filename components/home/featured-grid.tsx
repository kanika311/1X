"use client";

import { ProductCard } from "@/components/catalog/product-card";
import { SectionHeader } from "@/components/home/section-header";
import type { Course } from "@/lib/data/courses";
import type { TherapyService } from "@/lib/data/services";

export function FeaturedCourses({ items }: { items: Course[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Cyber Academy" title="Featured Courses" href="/courses" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {items.map((c) => (
          <ProductCard
            key={c.slug}
            id={c.slug}
            href={`/courses/${c.slug}`}
            title={c.title}
            image={c.image}
            price={c.price}
            rating={c.rating}
            duration={c.duration}
            cta="Enroll"
            bestseller={c.bestseller}
            type="course"
          />
        ))}
      </div>
    </section>
  );
}

export function FeaturedServices({ items }: { items: TherapyService[] }) {
  return (
    <section className="bg-gradient-to-b from-rose-50/60 via-cream/80 to-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Physiotherapy" title="Featured Services" href="/services" linkLabel="Book now" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {items.map((s) => (
            <ProductCard
              key={s.slug}
              id={s.slug}
              href={`/services/${s.slug}`}
              title={s.title}
              image={s.image}
              price={s.price}
              rating={s.rating}
              duration={s.duration}
              cta="Book now"
              bestseller={s.bestseller}
              type="service"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
