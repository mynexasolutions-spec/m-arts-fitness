import { NextRequest, NextResponse } from "next/server";
import { signAdminJWT, ADMIN_COOKIE_NAME } from "@/lib/jwt";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    let authenticatedUser: { email: string; name: string; role: string } | null = null;

    // Authenticate against Supabase `admin_users` table via secure RPC
    const { data, error } = await supabaseAdmin.rpc("verify_admin_login", {
      p_email: cleanEmail,
      p_password: cleanPassword,
    });

    if (error) {
      console.error("[Admin Login DB Error]:", error.message);
      return NextResponse.json(
        { success: false, error: "Authentication service error." },
        { status: 500 }
      );
    }

    const matchedAdmin = Array.isArray(data) ? data[0] : data;
    if (matchedAdmin && matchedAdmin.email) {
      authenticatedUser = {
        email: matchedAdmin.email,
        name: matchedAdmin.name || "Admin",
        role: matchedAdmin.role || "Administrator",
      };
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { success: false, error: "Invalid administrative credentials." },
        { status: 401 }
      );
    }

    // 3. Issue cryptographically signed JWT Token
    const expirySeconds = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60; // 7 days or 24 hours
    const token = await signAdminJWT(
      {
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        role: authenticatedUser.role,
      },
      expirySeconds
    );

    // 4. Set secure HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: authenticatedUser,
      token, // Also returned for client convenience if needed
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expirySeconds,
    });

    return response;
  } catch (error) {
    console.error("[Admin Login API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Internal authentication error." },
      { status: 500 }
    );
  }
}
