const API = process.env.NEXT_PUBLIC_API_URL ;
console.log("NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);
console.log("API =", API);
export const MEMBERSHIP_SLUGS = ["silver-membership", "gold-membership", "diamond-membership"] as const;

export type MembershipOffer = {
  _id: string;
  slug: string;
  offerType?: "membership" | "promo";
  title: string;
  subtitle: string;
  cardTitle: string;
  price: number;
  contactPhone?: string;
  feeLabel: string;
  benefits: string[];
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  active: boolean;
};

const FALLBACK_MEMBERSHIPS: MembershipOffer[] = [
  {
    _id: "fallback-silver",
    slug: "silver-membership",
    title: "Silver",
    subtitle: "Premium wellness & cyber access",
    cardTitle: "Founding Member",
    price: 1500,
    feeLabel: "One-time fee",
    benefits: [
      "Access to exclusive member rewards",
      "Priority booking access",
      "Insider discounts",
      "Special promotional offers",
      "Community member benefits",
    ],
    ctaText: "Get Your Membership Card",
    ctaLink: "/contact",
    sortOrder: 1,
    active: true,
  },
  {
    _id: "fallback-gold",
    slug: "gold-membership",
    title: "Gold",
    subtitle: "Premium wellness & cyber access",
    cardTitle: "Founding Member",
    price: 2500,
    feeLabel: "One-time fee",
    benefits: [
      "Access to exclusive member rewards",
      "Priority booking access",
      "Insider discounts",
      "Special promotional offers",
      "Community member benefits",
    ],
    ctaText: "Get Your Membership Card",
    ctaLink: "/contact",
    sortOrder: 2,
    active: true,
  },
  {
    _id: "fallback-diamond",
    slug: "diamond-membership",
    title: "Diamond",
    subtitle: "Premium wellness & cyber access",
    cardTitle: "Founding Member",
    price: 5000,
    feeLabel: "One-time fee",
    benefits: [
      "Access to exclusive member rewards",
      "Priority booking access",
      "Insider discounts",
      "Special promotional offers",
      "Community member benefits",
    ],
    ctaText: "Get Your Membership Card",
    ctaLink: "/contact",
    sortOrder: 3,
    active: true,
  },
];

function pickMembershipTiers(offers: MembershipOffer[]): MembershipOffer[] {
  return offers
    .filter((o) => MEMBERSHIP_SLUGS.includes(o.slug as (typeof MEMBERSHIP_SLUGS)[number]))
    .filter((o) => o.active !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

async function fetchFromApi(): Promise<MembershipOffer[]> {
  const res = await fetch(`${API}/offers?offerType=membership`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok || !Array.isArray(data.offers)) return [];
  return pickMembershipTiers(data.offers as MembershipOffer[]);
}

/** Server / SSR — always fresh */
export async function fetchMembershipOffers(): Promise<MembershipOffer[]> {
  try {
    const tiers = await fetchFromApi();
    return tiers.length > 0 ? tiers : FALLBACK_MEMBERSHIPS;
  } catch {
    return FALLBACK_MEMBERSHIPS;
  }
}

/** Client — refetch after admin edits */
export async function fetchMembershipOffersClient(): Promise<MembershipOffer[]> {
  try {
    const tiers = await fetchFromApi();
    return tiers.length > 0 ? tiers : FALLBACK_MEMBERSHIPS;
  } catch {
    return FALLBACK_MEMBERSHIPS;
  }
}
