import { createRoute } from "@/lib/api/route-bridge";
import * as site from "@/services/siteContentController.js";

export const GET = createRoute(site.getSiteContent);
export const PUT = createRoute(site.upsertSiteContent, { admin: true });
export const dynamic = "force-dynamic";
