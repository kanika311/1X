import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import { ServicesHub } from "@/components/services/services-hub";
import type { ServiceDomain } from "@/lib/data/service-catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Services",
  description:
    "Explore cybersecurity courses and services, or luxury physiotherapy programs by Dr. Ayxh.",
};

type Props = {
  searchParams: Promise<{ domain?: string }>;
};

export default async function ServicesBrowsePage({ searchParams }: Props) {
  const { domain } = await searchParams;
  const initialDomain: ServiceDomain = domain === "physio" ? "physio" : "cyber";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/services"
        className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-ink"
      >
        <FiArrowLeft className="size-4" />
        Choose another area
      </Link>
      <ServicesHub initialDomain={initialDomain} />
    </div>
  );
}
