import { NextResponse } from "next/server";
import { getImageKitServer } from "@/lib/imagekit";

export async function GET() {
  try {
    const imagekit = getImageKitServer();
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to generate auth parameters" },
      { status: 500 }
    );
  }
}

