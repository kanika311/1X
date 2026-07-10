import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";
const ADMIN_API_PREFIX = "/api/admin";

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
