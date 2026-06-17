import { NextRequest, NextResponse } from "next/server";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models/User.js";
import { ApiError } from "@/lib/server/helpers.js";
import { ensureUploadDir } from "@/lib/server/ensure-upload-dir.js";
import { UPLOAD_DIR } from "@/lib/server/middleware/upload.js";

export type BridgeUser = {
  _id: string;
  name: string;
  email?: string;
  number?: string;
  role: "user" | "admin";
};

export type BridgeRequest = {
  method: string;
  headers: Record<string, string>;
  body: unknown;
  params: Record<string, string>;
  query: Record<string, string>;
  user: BridgeUser | null;
  file?: { filename: string; mimetype: string; buffer: Buffer };
  get(name: string): string | undefined;
  protocol: string;
};

type Controller = (req: BridgeRequest, res: BridgeResponse) => Promise<void> | void;

class BridgeResponse {
  statusCode = 200;
  payload: unknown = { success: true };

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(data: unknown) {
    this.payload = data;
    return this;
  }
}

function headerMap(request: NextRequest) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });
  return headers;
}

async function resolveUser(request: NextRequest): Promise<BridgeUser | null> {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as JwtPayload & { id: string };
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return null;
    return {
      _id: String(user._id),
      name: user.name,
      email: user.email ?? undefined,
      number: user.number ?? undefined,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function parseMultipartRequest(
  request: NextRequest,
  fileField = "photo",
): Promise<{ body: Record<string, string>; file?: BridgeRequest["file"] }> {
  const form = await request.formData();
  const body: Record<string, string> = {};
  let file: BridgeRequest["file"] | undefined;

  for (const [key, value] of form.entries()) {
    if (key === fileField && value instanceof Blob && value.size > 0) {
      const original = "name" in value && typeof value.name === "string" ? value.name : "photo.jpg";
      const ext = path.extname(original).toLowerCase() || ".jpg";
      const base =
        path
          .basename(original, ext)
          .replace(/[^a-z0-9-]/gi, "-")
          .slice(0, 48) || "photo";
      const filename = `${Date.now()}-${base}${ext}`;
      const buffer = Buffer.from(await value.arrayBuffer());
      ensureUploadDir(UPLOAD_DIR);
      await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
      file = { filename, mimetype: value.type || "image/jpeg", buffer };
      continue;
    }
    body[key] = String(value);
  }

  return { body, file };
}

export async function buildBridgeRequest(
  request: NextRequest,
  params: Record<string, string>,
  options?: { user?: BridgeUser | null; body?: unknown; file?: BridgeRequest["file"] },
): Promise<BridgeRequest> {
  const url = new URL(request.url);
  const headers = headerMap(request);
  let body: unknown = options?.body ?? {};
  if (options?.body === undefined && request.method !== "GET" && request.method !== "HEAD") {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        body = await request.json();
      } catch {
        body = {};
      }
    }
  }

  const proto = (headers["x-forwarded-proto"] || "http").split(",")[0].trim();
  const bridgeUser = options?.user ?? null;

  const req = {
    method: request.method,
    headers,
    body,
    params,
    query: Object.fromEntries(url.searchParams.entries()),
    user: bridgeUser,
    file: options?.file,
    get(name: string) {
      return headers[name.toLowerCase()];
    },
    protocol: proto,
  } as BridgeRequest;

  // Ported Express controllers read req.user
  Object.defineProperty(req, "user", {
    value: bridgeUser,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  return req;
}

export function handleBridgeError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
  }
  console.error("[api]", error);
  return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
}

export function createRoute(
  controller: Controller,
  options?: { auth?: boolean; admin?: boolean; optionalAuth?: boolean },
) {
  return async (request: NextRequest, context: { params: Promise<Record<string, string>> }) => {
    try {
      await connectDB();
      const params = await context.params;
      let user = await resolveUser(request);

      if (options?.auth && !user) {
        return NextResponse.json({ success: false, message: "Not authorized" }, { status: 401 });
      }
      if (options?.admin) {
        if (!user) return NextResponse.json({ success: false, message: "Not authorized" }, { status: 401 });
        if (user.role !== "admin") {
          return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
        }
      }
      if (options?.optionalAuth && !user) {
        user = await resolveUser(request);
      }

      const req = await buildBridgeRequest(request, params, { user });
      const res = new BridgeResponse();
      await controller(req, res);
      return NextResponse.json(res.payload, { status: res.statusCode });
    } catch (error) {
      return handleBridgeError(error);
    }
  };
}
