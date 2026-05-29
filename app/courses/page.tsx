import type { Metadata } from "next";

import { ProductCard } from "@/components/catalog/product-card";
import { courses } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "Premium cybersecurity courses — ethical hacking, SOC, penetration testing, and more.",
};

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="mb-14 text-center">
        <p className="eyebrow">Cyber Academy</p>
        <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">All Courses</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted">
          Industry-aligned programs with live labs, certificates, and career support.
        </p>
      </header>
      <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {courses.map((c) => (
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
    </div>
  );
}
