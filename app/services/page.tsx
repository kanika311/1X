import type { Metadata } from "next";

import { ProductCard } from "@/components/catalog/product-card";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Luxury physiotherapy services by Dr. Ayesha — sports therapy, pain relief, rehab, and more.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="mb-14 text-center">
        <p className="eyebrow">Physiotherapy</p>
        <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">Therapy Services</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted">
          Premium hands-on care — personalized programs for recovery and performance.
        </p>
      </header>
      <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {services.map((s) => (
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
  );
}
