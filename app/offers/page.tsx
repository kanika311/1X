import type { Metadata } from "next";

import { OffersLanding } from "@/components/offers/offers-landing";

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Exclusive founding member offers — premium benefits, daily wellness access, and member-only discounts at 1X · Dr. Ayesha.",
};

export default function OffersPage() {
  return <OffersLanding />;
}
