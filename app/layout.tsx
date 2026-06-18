import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
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
  metadataBase: new URL("https://1xdrayxh.com"),

  title: {
    default: "1X | Cybersecurity Training & Physiotherapy Services",
    template: "%s | 1X",
  },

  description:
    "Professional cybersecurity training, ethical hacking courses, SOC analyst programs, and expert physiotherapy services. Learn, heal, and grow with 1X.",

  keywords: [
    "cybersecurity",
    "ethical hacking",
    "SOC analyst",
    "penetration testing",
    "cybersecurity training",
    "cybersecurity course",
    "physiotherapy",
    "physiotherapist",
    "rehabilitation therapy",
    "pain management",
    "sports injury recovery",
    "healthcare services",
    "online cybersecurity courses",
    "Dr Ayxh",
    "1X",
  ],

  authors: [
    {
      name: "Dr. Ayxh",
    },
  ],

  creator: "Dr. Ayxh",

  publisher: "1X",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://1xdrayxh.com",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://1xdrayxh.com",
    siteName: "1X",

    title: "1X | Cybersecurity Training & Physiotherapy Services",

    description:
      "Professional cybersecurity education and physiotherapy services designed to help you build skills and improve well-being.",

    images: [
      {
        url: "/LOGO.jpeg",
        width: 1200,
        height: 630,
        alt: "1X Cybersecurity & Physiotherapy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "1X | Cybersecurity Training & Physiotherapy Services",
    description:
      "Professional cybersecurity training and physiotherapy services by 1X.",

    images: ["/LOGO.jpeg"],
  },

  verification: {
    google: "ADD_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
  },

  category: "Education & Healthcare",

  icons: {
    icon: "/LOGO.jpeg",
    shortcut: "/LOGO.jpeg",
    apple: "/LOGO.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cormorant.variable} bg-background text-ink antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}