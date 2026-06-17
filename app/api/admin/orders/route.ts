import { createRoute } from "@/lib/api/route-bridge";
import * as orders from "@/services/orderController.js";

export const GET = createRoute(orders.listOrders, { admin: true });
export const dynamic = "force-dynamic";
