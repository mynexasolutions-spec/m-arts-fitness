import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let query = supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("[Orders API GET Notice]:", error.message);
      return NextResponse.json(
        { success: false, error: error.message, orders: [] },
        { status: 200 }
      );
    }

    const mapped = (data || []).map((row: any) => ({
      orderId: row.order_id || row.id,
      customerName: row.customer_name || "Customer",
      customerPhone: row.customer_phone || "",
      customerEmail: row.customer_email || "",
      addressSummary: row.shipping_address || "",
      total: Number(row.total_amount || row.subtotal || 0),
      payment: row.payment_method || "Online",
      status: (row.status || "Confirmed") as
        | "Confirmed"
        | "Processing"
        | "Shipped"
        | "Delivered"
        | "Cancelled",
      date: row.created_at || new Date().toISOString(),
      couponCode: row.coupon_code || undefined,
      couponDiscount: Number(row.coupon_discount || 0),
      items: Array.isArray(row.items) ? row.items : [],
      userId: row.user_id || undefined,
    }));

    return NextResponse.json({ success: true, orders: mapped });
  } catch (err: any) {
    console.error("[Orders API GET Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error", orders: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.orderId || !body.customerName || !body.customerPhone) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields." },
        { status: 400 }
      );
    }

    const rowToInsert = {
      order_id: body.orderId,
      customer_name: body.customerName,
      customer_email: body.customerEmail || null,
      customer_phone: body.customerPhone,
      shipping_address: body.addressSummary || "",
      payment_method: body.payment || "COD",
      items: Array.isArray(body.items) ? body.items : [],
      subtotal: body.total || 0,
      total_amount: body.total || 0,
      status: body.status || "Confirmed",
      coupon_code: body.couponCode || null,
      coupon_discount: body.couponDiscount || 0,
      user_id: body.userId || null,
      created_at: body.date || new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert([rowToInsert])
      .select()
      .single();

    if (error) {
      console.error("[Orders API POST Error]:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: any) {
    console.error("[Orders API POST Exception]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create order." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "orderId and status are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("order_id", orderId)
      .select();

    if (error) {
      console.error("[Orders API PATCH Error]:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, updated: data });
  } catch (err: any) {
    console.error("[Orders API PATCH Exception]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update order." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "orderId is required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("order_id", orderId);

    if (error) {
      console.error("[Orders API DELETE Error]:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Order deleted." });
  } catch (err: any) {
    console.error("[Orders API DELETE Exception]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to delete order." },
      { status: 500 }
    );
  }
}
