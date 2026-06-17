import { createRoute } from "@/lib/api/route-bridge";
import * as newsletter from "@/services/newsletterController.js";

export const DELETE = createRoute(newsletter.deleteNewsletterSubscriber, { admin: true });
export const dynamic = "force-dynamic";
