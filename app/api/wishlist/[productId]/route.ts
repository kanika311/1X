import { createRoute } from "@/lib/api/route-bridge";
import * as wishlist from "@/services/wishlistController.js";

export const DELETE = createRoute(wishlist.removeFromWishlist, { auth: true });
export const dynamic = "force-dynamic";
