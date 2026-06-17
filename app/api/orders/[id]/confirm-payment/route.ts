import { createRoute } from "@/lib/api/route-bridge";
import * as orders from "@/services/orderController.js";

export const POST = createRoute(orders.submitOrderPayment);
export const PATCH = createRoute(orders.submitOrderPayment);
export const dynamic = "force-dynamic";
