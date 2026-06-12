import type { Metadata } from "next";

import { ServicesChooser } from "@/components/services/services-chooser";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Choose cybersecurity or physiotherapy — premium programs and care by Dr. Ayxh at 1X.",
};

export default function ServicesPage() {
  return <ServicesChooser />;
}
