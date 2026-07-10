import { createRoute } from "@/lib/api/route-bridge";
import * as orders from "@/services/orderController.js";

export const POST = createRoute(orders.submitOrderPayment, { auth: true });
export const PATCH = createRoute(orders.submitOrderPayment, { auth: true });
export const dynamic = "force-dynamic";
