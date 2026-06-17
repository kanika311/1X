import { createRoute } from "@/lib/api/route-bridge";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, users: [], message: "Module ready — connect to MongoDB collection" });
}
export const dynamic = "force-dynamic";
