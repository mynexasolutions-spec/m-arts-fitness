import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch users from Supabase Auth
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (userError) {
      console.error("[Customers API Error]:", userError);
      return NextResponse.json(
        { success: false, error: userError.message, customers: [] },
        { status: 500 }
      );
    }

    const authUsers = userData?.users || [];

    // 2. Fetch orders from orders table to compute metrics
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select(
        "order_id, user_id, customer_email, customer_phone, customer_name, total_amount, status, created_at"
      );

    if (ordersError) {
      console.warn("[Customers API Orders Notice]:", ordersError.message);
    }

    const orderList = orders || [];

    // 3. Map orders stats by user_id and email
    const statsByUser: Record<
      string,
      { count: number; spend: number; phone: string; name: string }
    > = {};

    for (const ord of orderList) {
      const uId = ord.user_id;
      const email = (ord.customer_email || "").toLowerCase().trim();
      const amount = Number(ord.total_amount) || 0;
      const isCancelled = ord.status === "Cancelled";

      const keys: string[] = [];
      if (uId) keys.push(`id:${uId}`);
      if (email) keys.push(`email:${email}`);

      for (const key of keys) {
        if (!statsByUser[key]) {
          statsByUser[key] = { count: 0, spend: 0, phone: "", name: "" };
        }
        if (!isCancelled) {
          statsByUser[key].count += 1;
          statsByUser[key].spend += amount;
        }
        if (ord.customer_phone && !statsByUser[key].phone) {
          statsByUser[key].phone = ord.customer_phone;
        }
        if (ord.customer_name && !statsByUser[key].name) {
          statsByUser[key].name = ord.customer_name;
        }
      }
    }

    const customers = authUsers.map((u) => {
      const emailKey = `email:${(u.email || "").toLowerCase().trim()}`;
      const idKey = `id:${u.id}`;

      const byId = statsByUser[idKey];
      const byEmail = statsByUser[emailKey];

      const orderCount =
        (byId?.count || 0) + (byEmail && !byId ? byEmail.count : 0);
      const totalSpend =
        (byId?.spend || 0) + (byEmail && !byId ? byEmail.spend : 0);
      const phone = u.phone || byId?.phone || byEmail?.phone || "";
      const name =
        u.user_metadata?.full_name ||
        u.user_metadata?.name ||
        byId?.name ||
        byEmail?.name ||
        (u.email ? u.email.split("@")[0] : "Customer");

      return {
        id: u.id,
        name,
        email: u.email || "",
        phone,
        role:
          u.email && u.email.toLowerCase().includes("admin")
            ? "Admin"
            : "Customer",
        orderCount,
        totalSpend,
        createdAt: u.created_at,
        lastSignIn: u.last_sign_in_at || u.created_at,
      };
    });

    // Sort by newest joined
    customers.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const totalUsers = customers.length;
    const totalSpend = customers.reduce((sum, c) => sum + c.totalSpend, 0);
    const repeatBuyers = customers.filter((c) => c.orderCount > 1).length;

    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const newThisMonth = customers.filter(
      (c) => new Date(c.createdAt) >= oneMonthAgo
    ).length;

    return NextResponse.json({
      success: true,
      customers,
      stats: {
        totalUsers,
        totalSpend,
        repeatBuyers,
        newThisMonth,
      },
    });
  } catch (err: any) {
    console.error("[Customers API Fatal]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

