import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

type SoftImageProps = {
  src: string;
  alt: string;
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
  overlay = "card",
  rounded = "2xl",
  className,
  imageClassName,
  fill = true,
  ...props
}: SoftImageProps) {
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
        src={src}
        alt={alt}
        fill={fill}
        className={cn("soft-image object-cover", imageClassName)}
        {...props}
      />
      {overlay !== "none" ? <div className={cn("pointer-events-none absolute inset-0", overlayMap[overlay])} aria-hidden /> : null}
    </div>
  );
}
