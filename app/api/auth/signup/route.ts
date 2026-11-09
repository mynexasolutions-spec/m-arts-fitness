import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Create user with email_confirm: true to completely bypass email confirmation!
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name: (fullName || "").trim(),
      },
    });

    if (error) {
      // Check if user already exists
      if (
        error.message.toLowerCase().includes("already registered") ||
        error.message.toLowerCase().includes("already been registered") ||
        error.message.toLowerCase().includes("unique constraint")
      ) {
        return NextResponse.json(
          {
            error:
              "An account with this email address already exists. Please log in.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      message: "Account created and confirmed successfully.",
    });
  } catch (err: any) {
    console.error("[SignUp API Error]:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error during account creation." },
      { status: 500 }
    );
  }
}

