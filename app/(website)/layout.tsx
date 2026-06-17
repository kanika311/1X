import { SiteShell } from "@/components/layout/site-shell";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
