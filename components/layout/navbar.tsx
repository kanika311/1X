"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiHeart, FiMenu, FiSearch, FiShoppingBag, FiUser } from "react-icons/fi";

import { BrandLogo, BrandTagline } from "@/components/brand/brand-logo";
import { useShop } from "@/components/providers/shop-provider";
import { SearchModal } from "@/components/layout/search-modal";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/offers", label: "Offers" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
] as const;

export function Navbar({ scrolled = false }: { scrolled?: boolean }) {
  const pathname = usePathname();
  const { cartCount, wishlistCount } = useShop();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled ? "border-rose-100/80 bg-white/90 shadow-soft backdrop-blur-lg" : "border-transparent bg-background/80 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="icon-btn flex size-10 items-center justify-center text-ink lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu />
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide transition-colors hover:text-mauve-deep",
                  pathname === href || pathname.startsWith(`${href}/`) ? "text-ink" : "text-muted",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <BrandLogo size="md" className="block" />
            <BrandTagline size="md" />
          </Link>

          <div className="icon-btn flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex size-10 items-center justify-center text-ink transition-colors hover:text-mauve-deep"
              aria-label="Search"
            >
              <FiSearch />
            </button>
            <Link
              href="/wishlist"
              className="relative flex size-10 items-center justify-center text-ink transition-colors hover:text-mauve-deep"
              aria-label="Wishlist"
            >
              <FiHeart />
              {wishlistCount > 0 ? (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-mauve text-[9px] text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <Link
              href="/profile"
              className="hidden size-10 items-center justify-center text-ink transition-colors hover:text-mauve-deep sm:flex"
              aria-label="Profile"
            >
              <FiUser />
            </Link>
            <Link
              href="/cart"
              className="relative flex size-10 items-center justify-center text-ink transition-colors hover:text-mauve-deep"
              aria-label="Shopping bag"
            >
              <FiShoppingBag />
              {cartCount > 0 ? (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-mauve text-[9px] text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
