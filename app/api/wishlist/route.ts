import { createRoute } from "@/lib/api/route-bridge";
import * as wishlist from "@/services/wishlistController.js";

export const GET = createRoute(wishlist.getWishlist, { auth: true });
export const POST = createRoute(wishlist.addToWishlist, { auth: true });
export const dynamic = "force-dynamic";
