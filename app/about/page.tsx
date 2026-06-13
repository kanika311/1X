import type { Metadata } from "next";

import { AboutFounderPage } from "@/components/about/about-founder-page";
import { fetchSiteContent, resolveFounderFields } from "@/lib/site-content-api";

export const metadata: Metadata = {
  title: "About the Founder",
  description:
    "Meet Dr. Ayxh — founder of 1X, blending luxury care, cybersecurity, and human-first service.",
};

export default async function AboutPage() {
  const content = await fetchSiteContent();
  const founder = resolveFounderFields(content);

  return (
    <div className="bg-gradient-to-b from-rose-50/30 via-background to-background">
      <AboutFounderPage initialFounder={founder} />
    </div>
  );
}
