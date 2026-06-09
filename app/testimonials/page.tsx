import type { Metadata } from "next";

import { TestimonialForm } from "@/components/testimonials/testimonial-form";
import { Testimonials } from "@/components/home/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Share your 1X experience or read what our clients say about Dr. Ayxh services and courses.",
};

export default function TestimonialsPage() {
  return (
    <div className="bg-gradient-to-b from-rose-50/40 via-background to-background">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <TestimonialForm />
      </section>
      <Testimonials showHeading />
    </div>
  );
}
