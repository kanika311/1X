import { DualCta } from "@/components/home/dual-cta";
import { FeaturedCourses, FeaturedServices } from "@/components/home/featured-grid";
import { HeroSlider } from "@/components/home/hero-slider";
import { Testimonials } from "@/components/home/testimonials";
import { ProductCard } from "@/components/catalog/product-card";
import { courses } from "@/lib/data/courses";
import { services } from "@/lib/data/services";

export default function HomePage() {
  const featuredCourses = courses.filter((c) => c.bestseller).slice(0, 4);
  const featuredServices = services.filter((s) => s.bestseller).slice(0, 4);

  const bestsellers = [
    ...courses.filter((c) => c.bestseller).map((c) => ({ ...c, kind: "course" as const })),
    ...services.filter((s) => s.bestseller).map((s) => ({ ...s, kind: "service" as const })),
  ].slice(0, 4);

  return (
    <>
      <HeroSlider />
      <FeaturedCourses items={featuredCourses.length ? featuredCourses : courses.slice(0, 4)} />
      <FeaturedServices items={featuredServices.length ? featuredServices : services.slice(0, 4)} />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="eyebrow">Bestselling Programs</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">Curated for You</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 lg:gap-x-6">
          {bestsellers.map((item) =>
            item.kind === "course" ? (
              <ProductCard
                key={`c-${item.slug}`}
                id={item.slug}
                href={`/courses/${item.slug}`}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
                duration={item.duration}
                cta="Enroll"
                bestseller
                type="course"
              />
            ) : (
              <ProductCard
                key={`s-${item.slug}`}
                id={item.slug}
                href={`/services/${item.slug}`}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
                duration={item.duration}
                cta="Book now"
                bestseller
                type="service"
              />
            ),
          )}
        </div>
      </section>

      <Testimonials />
      <DualCta />
    </>
  );
}
