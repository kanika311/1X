import { createRoute } from "@/lib/api/route-bridge";
import * as offers from "@/services/offerController.js";

export const GET = createRoute(offers.getOffer, { optionalAuth: true });
export const PUT = createRoute(offers.updateOffer, { admin: true });
export const DELETE = createRoute(offers.deleteOffer, { admin: true });
export const dynamic = "force-dynamic";
