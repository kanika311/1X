import type { Metadata } from "next";

import { OffersLanding } from "@/components/offers/offers-landing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gift Cards",
  description:
    "1X gift cards and founding member benefits — premium wellness and cybersecurity programs by Dr. Ayxh.",
};

export default function GiftCardsPage() {
  return <OffersLanding />;
}
