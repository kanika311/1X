import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";

import { FooterNewsletter } from "@/components/layout/footer-newsletter";
import { LINKEDIN_PROFILE } from "@/lib/social";

const PRIMARY_LINKS = [

  { href: "/offers", label: "gift card" },
  { href: "/cart", label: "order tracking" },
] as const;

const LEGAL_LINKS = [
  { href: "/contact", label: "privacy policy" },
  { href: "/contact", label: "terms" },
  { href: "/contact", label: "accessibility" },
  { href: "/contact", label: "cookie policy" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-rose-100 bg-rose-50/60 text-mauve-deep">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <FooterNewsletter />

        <div className="mt-12 flex justify-center">
          <a
            href={LINKEDIN_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-11 items-center justify-center border border-mauve/20 bg-white/50 text-mauve transition-colors hover:border-mauve/40 hover:bg-white hover:text-mauve-deep"
            aria-label="1X on LinkedIn"
          >
            <FaLinkedinIn className="text-lg" />
          </a>
        </div>

        <nav className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm lowercase text-ink">
          {PRIMARY_LINKS.map(({ href, label }) => (
            <Link key={href + label} href={href} className="transition-colors hover:text-mauve">
              {label}
            </Link>
          ))}
        </nav>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs lowercase text-muted">
          {LEGAL_LINKS.map(({ href, label }) => (
            <Link key={label} href={href} className="underline underline-offset-2 transition-colors hover:text-mauve">
              {label}
            </Link>
          ))}
        </nav>

        <p className="mt-10 text-xs lowercase text-subtle">
          © {year} 1x · dr. ayxh. all rights reserved.
        </p>
      </div>
    </footer>
  );
}
