import { createRoute } from "@/lib/api/route-bridge";
import * as cart from "@/services/cartController.js";

export const POST = createRoute(cart.removeCartItems, { auth: true });
export const dynamic = "force-dynamic";
