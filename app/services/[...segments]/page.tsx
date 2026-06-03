import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CategoryDetailLayout } from "@/components/services/category-detail-layout";
import { OfferingDetailLayout } from "@/components/services/offering-detail-layout";
import {
  getCategoryMeta,
  getOffering,
  getOfferingsByCategory,
  type ServiceCategory,
  type ServiceDomain,
} from "@/lib/data/service-catalog";
import {
  fetchActiveProducts,
  fetchOfferingBySlug,
  getOfferingsByCategoryFrom,
  resolveOfferingsList,
} from "@/lib/products-api";

export const dynamic = "force-dynamic";

const RESERVED = new Set(["cyber", "physio"]);

type Props = { params: Promise<{ segments: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params;
  if (segments.length === 1 && !RESERVED.has(segments[0])) {
    const offering = (await fetchOfferingBySlug(segments[0])) ?? getOfferingFallback(segments[0]);
    if (offering) return { title: offering.title, description: offering.description };
  }
  if (segments.length === 2) {
    const meta = getCategoryMeta(segments[0] as ServiceDomain, segments[1] as ServiceCategory);
    if (meta) return { title: meta.title, description: meta.overview };
  }
  return { title: "Services" };
}

function getOfferingFallback(slug: string) {
  return (
    getOffering("cyber", "courses", slug) ??
    getOffering("cyber", "services", slug) ??
    getOffering("physio", "therapy", slug)
  );
}

export default async function ServicesCatchAllPage({ params }: Props) {
  const { segments } = await params;

  if (segments.length === 3) {
    redirect(`/services/${segments[2]}`);
  }

  if (segments.length === 1) {
    const slug = segments[0].toLowerCase();
    if (RESERVED.has(slug)) notFound();
    const offering = (await fetchOfferingBySlug(slug)) ?? getOfferingFallback(slug);
    if (!offering) notFound();
    return <OfferingDetailLayout offering={offering} />;
  }

  if (segments.length === 2) {
    const [domain, category] = segments;
    const meta = getCategoryMeta(domain as ServiceDomain, category as ServiceCategory);
    if (!meta) notFound();

    const apiList = await fetchActiveProducts();
    const all = resolveOfferingsList(apiList);
    const offerings =
      apiList.length > 0
        ? getOfferingsByCategoryFrom(all, domain as ServiceDomain, category as ServiceCategory)
        : getOfferingsByCategory(domain as ServiceDomain, category as ServiceCategory);

    return <CategoryDetailLayout meta={meta} offerings={offerings} />;
  }

  notFound();
}
