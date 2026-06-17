import type { Metadata } from "next";

import { LegalPageDynamic } from "@/components/legal/legal-page-dynamic";
import { fetchSiteContent } from "@/lib/site-content-api";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How 1X · Dr. Ayxh collects and protects your personal information.",
};

export default async function PrivacyPage() {
  const content = await fetchSiteContent();
  return (
    <LegalPageDynamic
      doc={content?.privacy}
      fallbackTitle="Privacy Policy"
      fallbackIntro="We respect your privacy. This policy explains what we collect when you browse, book, or purchase through 1X."
      fallbackSections={[
        {
          heading: "Information we collect",
          body: "We may collect your name, email, phone, order details, and messages you send via contact forms or our 1X Assistant chat assistant.",
        },
        {
          heading: "How we use it",
          body: "Your data is used to process bookings and orders, respond to enquiries, improve our services, and send updates you opt into.",
        },
        {
          heading: "Sharing",
          body: "We do not sell personal data. Information is shared only with trusted providers needed to deliver courses, therapy, or payment processing.",
        },
        {
          heading: "Your rights",
          body: "You may request access, correction, or deletion of your data by contacting us. We respond within a reasonable timeframe.",
        },
        {
          heading: "Security",
          body: "We use industry-standard measures to protect data in transit and at rest. No method is 100% secure; please use strong passwords for accounts.",
        },
      ]}
    />
  );
}
