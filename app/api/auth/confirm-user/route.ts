import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find the user in Supabase auth
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const matchedUser = data.users.find(
      (u) => (u.email || "").toLowerCase() === cleanEmail
    );

    if (matchedUser) {
      // Auto-confirm the user account
      const updateRes = await supabaseAdmin.auth.admin.updateUserById(
        matchedUser.id,
        {
          email_confirm: true,
        }
      );

      if (updateRes.error) {
        return NextResponse.json(
          { error: updateRes.error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        confirmed: true,
        message: `Account ${cleanEmail} confirmed successfully.`,
      });
    }

    return NextResponse.json(
      { error: "User not found with this email." },
      { status: 404 }
    );
  } catch (err: any) {
    console.error("[Confirm-User API Error]:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

