import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OfferingDetailLayout } from "@/components/services/offering-detail-layout";
import { getOffering, offerings, type ServiceCategory, type ServiceDomain } from "@/lib/data/service-catalog";

type Props = { params: Promise<{ domain: string; category: string; slug: string }> };

export function generateStaticParams() {
  return offerings.map((o) => ({ domain: o.domain, category: o.category, slug: o.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain, category, slug } = await params;
  const offering = getOffering(domain, category, slug);
  if (!offering) return { title: "Not found" };
  return { title: offering.title, description: offering.description };
}

export default async function OfferingDetailPage({ params }: Props) {
  const { domain, category, slug } = await params;
  const offering = getOffering(domain, category, slug);
  if (!offering) notFound();

  return <OfferingDetailLayout offering={offering} />;
}
