import type { Metadata } from "next";

import { LegalPageDynamic } from "@/components/legal/legal-page-dynamic";
import { fetchSiteContent } from "@/lib/site-content-api";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of use for 1X · Dr. Ayxh website, courses, and services.",
};

export default async function TermsPage() {
  const content = await fetchSiteContent();
  return (
    <LegalPageDynamic
      doc={content?.terms}
      fallbackTitle="Terms & Conditions"
      fallbackIntro="By using this website and purchasing programs or therapy, you agree to the following terms."
      fallbackSections={[
        {
          heading: "Services",
          body: "Course content, pricing, and therapy availability may change. Descriptions on the site are for information; final booking terms are confirmed at checkout or consultation.",
        },
        {
          heading: "Payments & refunds",
          body: "Fees are stated in INR unless noted. Refund and cancellation rules depend on the program or session booked and will be communicated before payment.",
        },
        {
          heading: "Accounts",
          body: "You are responsible for keeping login credentials secure. Misuse of accounts or automated scraping may result in suspension.",
        },
        {
          heading: "Intellectual property",
          body: "All branding, course materials, and site content belong to 1X · Dr. Ayxh unless otherwise stated. Reproduction without permission is not allowed.",
        },
        {
          heading: "Limitation of liability",
          body: "We provide education and wellness services with professional care but cannot guarantee specific career or health outcomes. Use clinical advice as appropriate for your situation.",
        },
      ]}
    />
  );
}
