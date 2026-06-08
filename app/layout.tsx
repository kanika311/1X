import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: {
    default: "1X · Dr. Ayxh Cybersecurity & Physiotherapy",
    template: "%s | 1X · Dr. Ayxh",
  },
  description:
    "Premium cybersecurity courses and luxury physiotherapy by Dr. Ayxh — secure your future, heal your life.",
  keywords: ["cybersecurity courses", "physiotherapy", "Dr. Ayxh", "ethical hacking", "SOC analyst"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} bg-background text-ink antialiased`}>
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}
