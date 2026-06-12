import type { Metadata } from "next";

import { ContactContent } from "@/components/contact/contact-content";
import { fetchSiteContent } from "@/lib/site-content-api";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with 1X · Dr. Ayxh and book a consultation.",
};

export default async function ContactPage() {
  const content = await fetchSiteContent();
  return <ContactContent initialContent={content} />;
}
