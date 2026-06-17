import { createRoute } from "@/lib/api/route-bridge";
import * as offers from "@/services/offerController.js";

export const GET = createRoute(offers.listOffers, { optionalAuth: true });
export const POST = createRoute(offers.createOffer, { admin: true });
export const dynamic = "force-dynamic";
