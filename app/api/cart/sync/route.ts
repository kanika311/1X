import { createRoute } from "@/lib/api/route-bridge";
import * as cart from "@/services/cartController.js";

export const PUT = createRoute(cart.syncCart, { auth: true });
export const dynamic = "force-dynamic";
