"use client";

import { SoftImage } from "@/components/ui/soft-image";
import { getOfferingImageSources } from "@/lib/offering-image";
import type { ServiceOffering } from "@/lib/data/service-catalog";
import type { ComponentProps } from "react";

type OfferingImageProps = Omit<ComponentProps<typeof SoftImage>, "src" | "fallback" | "fallbackChain" | "alt"> & {
  offering: Pick<ServiceOffering, "image" | "catalogImage" | "domain" | "title">;
  alt?: string;
};

/** Service card/detail image with admin upload first, then per-product catalog art. */
export function OfferingImage({ offering, alt, ...props }: OfferingImageProps) {
  const sources = getOfferingImageSources(offering);
  return (
    <SoftImage
      src={sources[0] ?? ""}
      fallbackChain={sources.slice(1)}
      alt={alt ?? offering.title}
      {...props}
    />
  );
}
