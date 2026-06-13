import type { Metadata } from "next";

import { AboutLanding } from "@/components/about/about-landing";

export const metadata: Metadata = {
  title: "1X · Dr. Ayxh",
  description:
    "Where clinical excellence meets digital defense — premium physiotherapy and cybersecurity by Dr. Ayxh.",
};

export default function HomePage() {
  return <AboutLanding />;
}
