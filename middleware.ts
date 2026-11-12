import { NextRequest, NextResponse } from "next/server";
import { verifyAdminJWT, ADMIN_COOKIE_NAME } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Protect Admin API endpoints (exclude auth routes)
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    const token =
      req.cookies.get(ADMIN_COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    const validAdmin = await verifyAdminJWT(token);

    if (!validAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized access: Valid admin JWT token required.",
        },
        { status: 401 }
      );
    }
  }

  // 2. Protect Admin nested pages (e.g. /admin/products/[id])
  if (pathname.startsWith("/admin/") && pathname !== "/admin") {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const validAdmin = await verifyAdminJWT(token);

    if (!validAdmin) {
      const loginUrl = new URL("/admin", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
