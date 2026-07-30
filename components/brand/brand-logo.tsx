import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/** Home / About landing — same as main nav "About" link */
export const BRAND_HOME_HREF = "/";

type BrandLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClass = {
  sm: { img: "size-10", px: 40, tag: "text-[10px] tracking-[0.14em]" },
  md: { img: "size-[52px]", px: 52, tag: "text-[11px] tracking-[0.14em]" },
  lg: { img: "size-[58px]", px: 58, tag: "text-xs tracking-[0.14em]" },
  xl: { img: "size-16", px: 64, tag: "text-xs tracking-[0.14em]" },
} as const;

export function BrandLogo({ className, size = "md" }: BrandLogoProps) {
  const s = sizeClass[size];
  return (
    <span className={cn("inline-block text-center text-ink", className)}>
      <span className="inline-flex items-center justify-center" aria-label="1X">
        <Image
          src="/LOGO.jpeg"
          alt="1X"
          width={s.px}
          height={s.px}
          unoptimized
          priority
          className={cn("rounded-full object-cover", s.img)}
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

type BrandHomeLinkProps = BrandLogoProps & {
  onNavigate?: () => void;
};

export function BrandHomeLink({ className, size = "md", onNavigate }: BrandHomeLinkProps) {
  return (
    <Link
      href={BRAND_HOME_HREF}
      onClick={onNavigate}
      className={cn("inline-block shrink-0", className)}
      aria-label="1X — go to homepage"
    >
      <BrandLogo size={size} />
    </Link>
  );
}
