/** Main header links (left nav) — order matters */
export const MAIN_NAV = [
  { href: "/", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gift-cards", label: "Gift Cards" },
  { href: "/contact", label: "Contact" },
] as const;

/** Mobile drawer — same order as header, then shop + legal */
export const MOBILE_NAV = [
  ...MAIN_NAV,
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Shopping Bag" },
] as const;

export const FOOTER_PRIMARY = [

  // { href: "/gift-cards", label: "gift cards" },
  // { href: "/contact", label: "contact us" },

] as const;

export const FOOTER_LEGAL = [
  { href: "/privacy", label: "privacy policy" },
  { href: "/terms", label: "terms & conditions" },
 
] as const;
