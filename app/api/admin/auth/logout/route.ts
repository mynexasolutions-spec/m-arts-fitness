import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/jwt";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Admin session ended successfully.",
  });

  // Delete HttpOnly JWT cookie
  response.cookies.delete(ADMIN_COOKIE_NAME);

  return response;
}
