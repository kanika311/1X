import { createRoute } from "@/lib/api/route-bridge";
import * as orders from "@/services/orderController.js";

export const GET = createRoute(orders.getOrder, { admin: true });
export const PATCH = createRoute(orders.updateOrderStatus, { admin: true });
export const dynamic = "force-dynamic";
