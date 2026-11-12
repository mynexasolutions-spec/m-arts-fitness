import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_INQUIRIES, InquiryItem } from "@/data/inquiries";

const dataFilePath = path.join(process.cwd(), "data", "inquiries-store.json");

function readInquiries(): InquiryItem[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(
        dataFilePath,
        JSON.stringify(DEFAULT_INQUIRIES, null, 2),
        "utf8"
      );
      return DEFAULT_INQUIRIES;
    }
    const raw = fs.readFileSync(dataFilePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_INQUIRIES;
  } catch {
    return DEFAULT_INQUIRIES;
  }
}

function writeInquiries(inquiries: InquiryItem[]): void {
  try {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(inquiries, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Failed to write inquiries file:", err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const list = readInquiries();

    // Sort by createdAt descending
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = list.length;
    const unresolved = list.filter((i) => !i.isResolved).length;
    const resolved = total - unresolved;

    return NextResponse.json({
      success: true,
      inquiries: list,
      stats: {
        total,
        unresolved,
        resolved,
      },
    });
  } catch (err: any) {
    console.error("[Inquiries API GET Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, email, city, inquiryType, message } = body;

    if (!fullName || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "Name, phone and message are required" },
        { status: 400 }
      );
    }

    const newInquiry: InquiryItem = {
      id: "inq-" + Date.now(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      city: city ? city.trim() : "Direct Store Inquiry",
      inquiryType: inquiryType || "General Support",
      message: message.trim(),
      isResolved: false,
      isNew: true,
      createdAt: new Date().toISOString(),
    };

    const current = readInquiries();
    const updated = [newInquiry, ...current];
    writeInquiries(updated);

    return NextResponse.json({ success: true, inquiry: newInquiry });
  } catch (err: any) {
    console.error("[Inquiries API POST Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isResolved } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    const current = readInquiries();
    const updated = current.map((item) =>
      item.id === id
        ? {
            ...item,
            isResolved:
              typeof isResolved === "boolean" ? isResolved : !item.isResolved,
            isNew: false,
          }
        : item
    );
    writeInquiries(updated);

    const changedItem = updated.find((i) => i.id === id);

    return NextResponse.json({ success: true, inquiry: changedItem });
  } catch (err: any) {
    console.error("[Inquiries API PATCH Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update inquiry" },
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
        { success: false, error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    const current = readInquiries();
    const updated = current.filter((item) => item.id !== id);
    writeInquiries(updated);

    return NextResponse.json({ success: true, message: "Inquiry deleted" });
  } catch (err: any) {
    console.error("[Inquiries API DELETE Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
