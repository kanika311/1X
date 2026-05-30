import { cn } from "@/lib/utils";
import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClass = {
  sm: { mark: "text-xl tracking-[0.08em]", tag: "text-[10px] tracking-[0.14em]" },
  md: { mark: "text-[1.65rem] tracking-[0.08em]", tag: "text-[11px] tracking-[0.14em]" },
  lg: { mark: "text-3xl tracking-[0.08em]", tag: "text-xs tracking-[0.14em]" },
  xl: { mark: "text-4xl tracking-[0.08em]", tag: "text-xs tracking-[0.14em]" },
} as const;

/** Renders "1X" so the numeral reads clearly (serif "1" alone can look like "I"). */
export function BrandLogo({ className, size = "md" }: BrandLogoProps) {
  const s = sizeClass[size];
  return (
    <span className={cn("inline-block text-center text-ink", className)}>
      <span
        className={cn("inline-flex items-baseline justify-center font-semibold", s.mark)}
        aria-label="1X"
      >
        <Image src="/LOGO.jpeg" alt="1X" width={100} height={100} className="w-10 h-10 rounded-full" />
      </span>
    </span>
  );
}

export function BrandTagline({ className, size = "md" }: BrandLogoProps) {
  const s = sizeClass[size];
  return (
    <span className={cn("mt-0.5 block font-semibold uppercase text-muted", s.tag, className)}>
      Dr. Ayxh
    </span>
  );
}
