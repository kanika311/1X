"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";

import { FALLBACK_IMAGE } from "@/lib/image-fallback";
import { cn } from "@/lib/utils";

type SoftImageProps = {
  src: string;
  alt: string;
  fallback?: string;
  /** Tried in order after src fails to load (e.g. catalog image, then domain placeholder). */
  fallbackChain?: string[];
  overlay?: "hero" | "card" | "cta" | "profile" | "none";
  rounded?: "none" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  imageClassName?: string;
} & Pick<ImageProps, "fill" | "priority" | "sizes" | "width" | "height">;

const roundedMap = {
  none: "rounded-none",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-2xl",
  "2xl": "rounded-3xl",
  "3xl": "rounded-[1.75rem]",
} as const;

const overlayMap = {
  hero: "soft-overlay-hero",
  card: "soft-overlay-card",
  cta: "soft-overlay-cta",
  profile: "soft-overlay-profile",
  none: "",
} as const;

export function SoftImage({
  src,
  alt,
  fallback = FALLBACK_IMAGE,
  fallbackChain = [],
  overlay = "card",
  rounded = "2xl",
  className,
  imageClassName,
  fill = true,
  ...props
}: SoftImageProps) {
  const sources = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const item of [src, ...fallbackChain, fallback]) {
      const value = item?.trim();
      if (!value || seen.has(value)) continue;
      seen.add(value);
      list.push(value);
    }
    return list.length ? list : [fallback];
  }, [src, fallback, fallbackChain]);

  const [index, setIndex] = useState(0);
  const imgSrc = sources[Math.min(index, sources.length - 1)];

  useEffect(() => {
    setIndex(0);
  }, [sources.join("|")]);

  return (
    <div
      className={cn(
        "soft-image-wrap relative overflow-hidden bg-rose-50",
        roundedMap[rounded],
        fill && "h-full w-full",
        className,
      )}
    >
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        className={cn("soft-image object-cover", imageClassName)}
        onError={() => {
          setIndex((current) => (current < sources.length - 1 ? current + 1 : current));
        }}
        {...props}
      />
      {overlay !== "none" ? <div className={cn("pointer-events-none absolute inset-0", overlayMap[overlay])} aria-hidden /> : null}
    </div>
  );
}
