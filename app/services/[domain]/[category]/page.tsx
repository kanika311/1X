import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryDetailLayout } from "@/components/services/category-detail-layout";
import {
  categoryMeta,
  getCategoryMeta,
  getOfferingsByCategory,
  type ServiceCategory,
  type ServiceDomain,
} from "@/lib/data/service-catalog";

type Props = { params: Promise<{ domain: string; category: string }> };

export function generateStaticParams() {
  return categoryMeta.map((c) => ({ domain: c.domain, category: c.category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain, category } = await params;
  const meta = getCategoryMeta(domain as ServiceDomain, category as ServiceCategory);
  if (!meta) return { title: "Not found" };
  return { title: meta.title, description: meta.overview };
}

export default async function CategoryPage({ params }: Props) {
  const { domain, category } = await params;
  const meta = getCategoryMeta(domain as ServiceDomain, category as ServiceCategory);
  if (!meta) notFound();

  const offerings = getOfferingsByCategory(domain as ServiceDomain, category as ServiceCategory);

  return <CategoryDetailLayout meta={meta} offerings={offerings} />;
}
