import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How 1X · Dr. Ayxh collects and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="We respect your privacy. This policy explains what we collect when you browse, book, or purchase through 1X."
      sections={[
        {
          heading: "Information we collect",
          body: "We may collect your name, email, phone, order details, and messages you send via contact forms or our Ami chat assistant.",
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
