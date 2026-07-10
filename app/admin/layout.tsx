import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "1X Admin CRM",
    template: "%s | 1X Admin",
  },
  description: "Admin panel for 1X · Dr. Ayxh",
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
