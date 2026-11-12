import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_SUBSCRIBERS, SubscriberItem } from "@/data/subscribers";

const dataFilePath = path.join(process.cwd(), "data", "subscribers-store.json");

function readSubscribers(): SubscriberItem[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(
        dataFilePath,
        JSON.stringify(DEFAULT_SUBSCRIBERS, null, 2),
        "utf8"
      );
      return DEFAULT_SUBSCRIBERS;
    }
    const raw = fs.readFileSync(dataFilePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_SUBSCRIBERS;
  } catch {
    return DEFAULT_SUBSCRIBERS;
  }
}

function writeSubscribers(list: SubscriberItem[]): void {
  try {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(list, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Failed to write subscribers file:", err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const list = readSubscribers();

    // Sort newest first
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = list.length;
    const active = list.filter((s) => s.status === "Active").length;

    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const thisMonth = list.filter(
      (s) => new Date(s.createdAt) >= oneMonthAgo
    ).length;

    return NextResponse.json({
      success: true,
      subscribers: list,
      stats: {
        total,
        active,
        thisMonth,
      },
    });
  } catch (err: any) {
    console.error("[Newsletter API GET Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load subscribers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const current = readSubscribers();
    const existing = current.find(
      (s) => s.email.toLowerCase() === trimmedEmail
    );

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: "You're already subscribed with this email address!",
      });
    }

    const newSubscriber: SubscriberItem = {
      id: "sub-" + Date.now(),
      email: trimmedEmail,
      source: source || "Homepage Banner",
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    const updated = [newSubscriber, ...current];
    writeSubscribers(updated);

    return NextResponse.json({
      success: true,
      alreadySubscribed: false,
      message: "Thank you! You're now subscribed to M.art Sports updates.",
      subscriber: newSubscriber,
    });
  } catch (err: any) {
    console.error("[Newsletter API POST Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    const current = readSubscribers();
    const updated = current.filter((s) => s.id !== id);
    writeSubscribers(updated);

    return NextResponse.json({
      success: true,
      message: "Subscriber removed successfully",
    });
  } catch (err: any) {
    console.error("[Newsletter API DELETE Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
