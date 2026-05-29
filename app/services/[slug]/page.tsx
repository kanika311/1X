import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailLayout } from "@/components/product/detail-layout";
import { getService, services } from "@/lib/data/services";
import { IMG } from "@/lib/images";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found" };
  return { title: service.title, description: service.description };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <ProductDetailLayout
      id={service.slug}
      type="service"
      title={service.title}
      images={[service.image, IMG.serviceAlt, IMG.service]}
      price={service.price}
      rating={service.rating}
      reviews={service.reviews}
      duration={service.duration}
      description={service.description}
      highlights={[...service.highlights, ...service.includes.map((i) => `Includes: ${i}`)]}
      extra={{ label: "Therapist", value: service.therapist }}
      cta="Book Now"
      bestseller={service.bestseller}
      tabs={{
        faq: [
          { q: "How do I book?", a: "Select Book Now or contact us for same-week appointments." },
          { q: "Home visits available?", a: "Yes — see Home Consultation for Delhi NCR coverage." },
          { q: "Cancellation policy?", a: "Free reschedule up to 12 hours before your session." },
        ],
      }}
    />
  );
}
