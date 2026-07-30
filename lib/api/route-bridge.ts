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
import { ACCESS_COOKIE } from "@/lib/server/auth-cookies.js";
import { assertAllowedUpload, safeUploadFilename } from "@/lib/server/file-validation.js";
import { validateEnv, isProduction } from "@/lib/server/env.js";

let envValidated = false;
function ensureEnv() {
  if (!envValidated) {
    validateEnv();
    envValidated = true;
  }
}

export type BridgeUser = {
  _id: string;
  name: string;
  email?: string;
  number?: string;
  role: "user" | "admin";
  active?: boolean;
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
  cookies: Record<string, string>;
};

type CookieSpec = {
  name: string;
  value: string;
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    path?: string;
    maxAge?: number;
  };
};

type Controller = (req: BridgeRequest, res: BridgeResponse) => Promise<void> | void;

export class BridgeResponse {
  statusCode = 200;
  payload: unknown = { success: true };
  cookies: CookieSpec[] = [];

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(data: unknown) {
    this.payload = data;
    return this;
  }

  setCookies(specs: CookieSpec[]) {
    this.cookies.push(...specs);
    return this;
  }

  clearAuthCookies(specs: CookieSpec[]) {
    this.cookies.push(...specs);
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

function cookieMap(request: NextRequest) {
  const cookies: Record<string, string> = {};
  request.cookies.getAll().forEach((c) => {
    cookies[c.name] = c.value;
  });
  return cookies;
}

function extractBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
}

export async function resolveUser(request: NextRequest): Promise<BridgeUser | null> {
  const cookies = cookieMap(request);
  const token = cookies[ACCESS_COOKIE] || extractBearerToken(request);
  if (!token) return null;

  ensureEnv();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
      id: string;
      role?: "user" | "admin";
    };
    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.active === false) return null;
    return {
      _id: String(user._id),
      name: user.name,
      email: user.email ?? undefined,
      number: user.number ?? undefined,
      role: user.role,
      active: user.active !== false,
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
      if (value.size > 5 * 1024 * 1024) {
        throw new ApiError(400, "Image must be under 5 MB");
      }

      const original = "name" in value && typeof value.name === "string" ? value.name : "photo.jpg";
      const ext = path.extname(original).toLowerCase() || ".jpg";
      const buffer = Buffer.from(await value.arrayBuffer());
      const validated = assertAllowedUpload({ buffer, ext, declaredMime: value.type, allowVideo: false });
      const filename = safeUploadFilename(original, ext);
      ensureUploadDir(UPLOAD_DIR);
      await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
      file = { filename, mimetype: validated.mime, buffer };
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
    cookies: cookieMap(request),
    get(name: string) {
      return headers[name.toLowerCase()];
    },
    protocol: proto,
  } as BridgeRequest;

  Object.defineProperty(req, "user", {
    value: bridgeUser,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  return req;
}

function applyCookies(response: NextResponse, cookies: CookieSpec[]) {
  for (const cookie of cookies) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }
}

export function handleBridgeError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
  }

  if (error instanceof Error && error.message.includes("environment variable")) {
    return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 503 });
  }

  if (error instanceof Error && error.message.includes("JWT_SECRET")) {
    return NextResponse.json(
      { success: false, message: "Server configuration error: JWT_SECRET must be at least 32 characters" },
      { status: 503 },
    );
  }

  if (error && typeof error === "object") {
    const name = "name" in error ? String((error as { name?: string }).name) : "";
    const message = "message" in error ? String((error as { message?: string }).message) : "";
    const combined = `${name} ${message}`.toLowerCase();

    const isMongoConnectivity =
      combined.includes("mongooseserverselectionerror") ||
      combined.includes("mongodbnetworkerror") ||
      combined.includes("ecconnrefused") ||
      combined.includes("querysrv econnrefused") ||
      combined.includes("failed to connect") ||
      combined.includes("server selection timed out");

    if (isMongoConnectivity && !isProduction()) {
      const hint = combined.includes("127.0.0.1:27017")
        ? "Database is not reachable at 127.0.0.1:27017. Start MongoDB locally, or change MONGODB_URI in .env.local."
        : "Database is not reachable. Check MONGODB_URI in .env.local.";

      console.error("[api] DB connection error:", error);
      return NextResponse.json({ success: false, message: hint }, { status: 503 });
    }
  }

  console.error("[api]", error);
  return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
}

export type RouteOptions = {
  auth?: boolean;
  admin?: boolean;
  optionalAuth?: boolean;
  rateLimit?: { windowMs?: number; max?: number; keyPrefix?: string };
};

export function createRoute(controller: Controller, options?: RouteOptions) {
  return async (request: NextRequest, context: { params: Promise<Record<string, string>> }) => {
    try {
      const params = await context.params;

      if (options?.rateLimit) {
        const { rateLimit, clientIp } = await import("@/lib/server/rate-limit.js");
        const ip = clientIp({ get: (n: string) => request.headers.get(n) || undefined, headers: headerMap(request) });
        const key = `${options.rateLimit.keyPrefix || request.nextUrl.pathname}:${ip}`;
        const result = rateLimit(key, options.rateLimit);
        if (!result.allowed) {
          return NextResponse.json(
            { success: false, message: "Too many requests. Please try again later." },
            { status: 429, headers: { "Retry-After": String(Math.ceil((result.retryAfterMs || 60000) / 1000)) } },
          );
        }
      }

      const hasCredentials = Boolean(
        request.cookies.get(ACCESS_COOKIE)?.value || extractBearerToken(request),
      );
      if ((options?.auth || options?.admin) && !hasCredentials) {
        return NextResponse.json({ success: false, message: "Not authorized" }, { status: 401 });
      }

      ensureEnv();
      await connectDB();
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
      const response = NextResponse.json(res.payload, { status: res.statusCode });
      applyCookies(response, res.cookies);
      return response;
    } catch (error) {
      return handleBridgeError(error);
    }
  };
}
