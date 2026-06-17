import { createRoute } from "@/lib/api/route-bridge";
import * as products from "@/services/productController.js";

export const GET = createRoute(products.listProducts, { optionalAuth: true });
export const POST = createRoute(products.createProduct, { admin: true });
export const dynamic = "force-dynamic";
