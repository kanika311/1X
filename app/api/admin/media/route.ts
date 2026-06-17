import { createRoute } from "@/lib/api/route-bridge";
import * as upload from "@/services/uploadController.js";

export const GET = createRoute(upload.listMedia, { admin: true });
export const dynamic = "force-dynamic";
