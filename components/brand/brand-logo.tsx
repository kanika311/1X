import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClass = {
  sm: { img: 32, tag: "text-[10px] tracking-[0.14em]" },
  md: { img: 40, tag: "text-[11px] tracking-[0.14em]" },
  lg: { img: 48, tag: "text-xs tracking-[0.14em]" },
  xl: { img: 56, tag: "text-xs tracking-[0.14em]" },
} as const;

export function BrandLogo({ className, size = "md" }: BrandLogoProps) {
  const s = sizeClass[size];
  return (
    <span className={cn("inline-block text-center text-ink", className)}>
      <span className="inline-flex items-center justify-center" aria-label="1X">
        <Image
          src="/LOGO.jpeg"
          alt="1X"
          width={s.img}
          height={s.img}
          className="rounded-full object-cover"
          style={{ width: s.img, height: s.img }}
        />
      </span>
    </span>
  );
}

export function BrandTagline({ className, size = "md" }: BrandLogoProps) {
  const s = sizeClass[size];
  return (
    <span className={cn("mt-0.5 block font-semibold  text-muted", s.tag, className)}>
      Dr. Ayxh
    </span>
  );
}
