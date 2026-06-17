import { NextRequest, NextResponse } from "next/server";

import {
  buildBridgeRequest,
  createRoute,
  handleBridgeError,
  parseMultipartRequest,
} from "@/lib/api/route-bridge";
import { connectDB } from "@/lib/db/mongoose";
import * as testimonials from "@/services/testimonialController.js";

export const dynamic = "force-dynamic";

export const GET = createRoute(testimonials.listTestimonials, { optionalAuth: true });

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const contentType = request.headers.get("content-type") || "";
    const multipart = contentType.includes("multipart/form-data")
      ? await parseMultipartRequest(request, "photo")
      : null;

    const req = await buildBridgeRequest(request, {}, {
      user: null,
      body: multipart?.body ?? undefined,
      file: multipart?.file,
    });

    const res = {
      statusCode: 200,
      payload: { success: true } as unknown,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: unknown) {
        this.payload = data;
        return this;
      },
    };

    await testimonials.submitTestimonial(req, res);
    return NextResponse.json(res.payload, { status: res.statusCode });
  } catch (error) {
    return handleBridgeError(error);
  }
};
