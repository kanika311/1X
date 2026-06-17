import { createRoute } from "@/lib/api/route-bridge";
import * as newsletter from "@/services/newsletterController.js";

export const POST = createRoute(newsletter.subscribeNewsletter);
export const GET = createRoute(newsletter.listNewsletterSubscribers, { admin: true });
export const dynamic = "force-dynamic";
