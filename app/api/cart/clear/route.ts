import { createRoute } from "@/lib/api/route-bridge";
import * as cart from "@/services/cartController.js";

export const DELETE = createRoute(cart.clearCart, { auth: true });
export const dynamic = "force-dynamic";
