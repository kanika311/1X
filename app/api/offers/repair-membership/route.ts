import { createRoute } from "@/lib/api/route-bridge";
import * as offers from "@/services/offerController.js";

export const POST = createRoute(offers.repairMembershipOffers, { admin: true });
export const dynamic = "force-dynamic";
