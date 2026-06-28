import { createRoute } from "@/lib/api/route-bridge";
import * as orders from "@/services/orderController.js";

export const PATCH = createRoute(orders.setCustomerStatus, { admin: true });
export const dynamic = "force-dynamic";
