import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  buildContentSecurityPolicy,
  buildSecurityHeaders,
  generateNonce,
} from "@/lib/security/csp";

const ADMIN_PREFIX = "/admin";
const ADMIN_API_PREFIX = "/api/admin";
const isDev = process.env.NODE_ENV === "development";

function applySecurityHeaders(response: NextResponse, nonce: string) {
  const csp = buildContentSecurityPolicy(nonce, isDev);
  const headers = buildSecurityHeaders(csp);
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(ADMIN_PREFIX) && !pathname.startsWith(`${ADMIN_PREFIX}/login`)) {
    const hasSession = Boolean(request.cookies.get("onex_at")?.value);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith(ADMIN_API_PREFIX)) {
    const hasSession = Boolean(request.cookies.get("onex_at")?.value);
    if (!hasSession) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 401 });
    }
  }

  // CSP nonces apply to HTML document routes only (not JSON API responses).
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const nonce = generateNonce();
  const csp = buildContentSecurityPolicy(nonce, isDev);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  applySecurityHeaders(response, nonce);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|woff2?)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
