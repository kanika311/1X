import { createRoute } from "@/lib/api/route-bridge";
import * as upload from "@/services/uploadController.js";

export const DELETE = createRoute(upload.deleteMedia, { admin: true });
export const dynamic = "force-dynamic";
