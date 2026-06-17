import type { Metadata } from "next";

import { TestimonialsPageContent } from "@/components/testimonials/testimonials-page-content";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read client testimonials for 1X · Dr. Ayxh services and courses, or share your own experience.",
};

export default function TestimonialsPage() {
  return (
    <div className="bg-gradient-to-b from-rose-50/40 via-background to-background">
      <TestimonialsPageContent />
    </div>
  );
}
