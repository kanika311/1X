import type { Metadata } from "next";

import { ServicesHub } from "@/components/services/services-hub";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Premium cybersecurity consultancy, courses, and managed services — plus luxury physiotherapy by Dr. Ayesha.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <ServicesHub />
    </div>
  );
}
