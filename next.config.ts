import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/offers", destination: "/gift-cards", permanent: true },
      { source: "/gift_cards", destination: "/gift-cards", permanent: true },
      { source: "/about", destination: "/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
