import { NextRequest, NextResponse } from "next/server";
import { verifyAdminJWT, ADMIN_COOKIE_NAME } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    // 1. Extract token from HttpOnly cookie or Authorization Bearer header
    const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    const token = cookieToken || bearerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false, error: "No active admin session found." },
        { status: 401 }
      );
    }

    // 2. Cryptographically verify JWT signature & expiration
    const payload = await verifyAdminJWT(token);

    if (!payload) {
      const res = NextResponse.json(
        { success: false, authenticated: false, error: "Invalid or expired session token." },
        { status: 401 }
      );
      // Clear expired cookie
      res.cookies.delete(ADMIN_COOKIE_NAME);
      return res;
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error("[Admin Auth Verification Error]:", error);
    return NextResponse.json(
      { success: false, authenticated: false, error: "Authentication check failed." },
      { status: 500 }
    );
  }
}
