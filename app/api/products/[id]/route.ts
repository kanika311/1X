import { createRoute } from "@/lib/api/route-bridge";
import * as products from "@/services/productController.js";

export const GET = createRoute(products.getProduct, { optionalAuth: true });
export const PUT = createRoute(products.updateProduct, { admin: true });
export const DELETE = createRoute(products.deleteProduct, { admin: true });
export const dynamic = "force-dynamic";
