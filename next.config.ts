import type { NextConfig } from "next";

import { buildBaselineSecurityHeaders } from "./lib/security/csp";

function buildRemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "onex-backend-7p9r.onrender.com",
      pathname: "/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "3000",
      pathname: "/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "5000",
      pathname: "/**",
    },
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "5000",
      pathname: "/**",
    },
  ];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (apiUrl) {
    try {
      const parsed = new URL(apiUrl);
      const protocol = parsed.protocol.replace(":", "") as "http" | "https";
      if (protocol === "http" || protocol === "https") {
        patterns.push({
          protocol,
          hostname: parsed.hostname,
          port: parsed.port || undefined,
          pathname: "/**",
        });
      }
    } catch {
      /* ignore invalid URL */
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (siteUrl) {
    try {
      const parsed = new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`);
      patterns.push({
        protocol: parsed.protocol.replace(":", "") as "http" | "https",
        hostname: parsed.hostname,
        pathname: "/**",
      });
    } catch {
      /* ignore */
    }
  }

  return patterns;
}

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  async headers() {
    const baseline = buildBaselineSecurityHeaders(isProduction);
    return [
      {
        source: "/(.*)",
        headers: Object.entries(baseline).map(([key, value]) => ({ key, value })),
      },
    ];
  },

  async redirects() {
    return [
      { source: "/offers", destination: "/gift-cards", permanent: true },
      { source: "/gift_cards", destination: "/gift-cards", permanent: true },
      // Legacy standalone admin (onex-admin) paths → unified /admin routes
      { source: "/dashboard", destination: "/admin/dashboard", permanent: false },
      { source: "/dashboard/:path*", destination: "/admin/dashboard/:path*", permanent: false },
    ];
  },

  images: {
    remotePatterns: buildRemotePatterns(),
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
