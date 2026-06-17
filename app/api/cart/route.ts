import { createRoute } from "@/lib/api/route-bridge";
import * as cart from "@/services/cartController.js";

export const GET = createRoute(cart.getCart, { auth: true });
export const POST = createRoute(cart.addToCart, { auth: true });
export const dynamic = "force-dynamic";
