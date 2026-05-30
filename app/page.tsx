import { DualCta } from "@/components/home/dual-cta";
import { FeaturedOfferings } from "@/components/home/featured-grid";
import { HeroSlider } from "@/components/home/hero-slider";
import { Testimonials } from "@/components/home/testimonials";
import { ServiceOfferingCard } from "@/components/services/service-offering-card";
import { offerings } from "@/lib/data/service-catalog";

export default function HomePage() {
  const bestsellers = offerings.filter((o) => o.bestseller).slice(0, 4);
  const featuredCyber = offerings.filter((o) => o.domain === "cyber" && o.bestseller).slice(0, 4);
  const featuredPhysio = offerings.filter((o) => o.domain === "physio" && o.bestseller).slice(0, 4);

  return (
    <>
      <HeroSlider />
      <FeaturedOfferings
        cyber={featuredCyber.length ? featuredCyber : offerings.filter((o) => o.domain === "cyber").slice(0, 4)}
        physio={featuredPhysio.length ? featuredPhysio : offerings.filter((o) => o.domain === "physio").slice(0, 4)}
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="eyebrow">Bestselling Programs</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">Curated for You</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((o, i) => (
            <ServiceOfferingCard key={o.domain + o.category + o.slug} offering={o} index={i} />
          ))}
        </div>
      </section>

      <Testimonials />
      <DualCta />
    </>
  );
}
