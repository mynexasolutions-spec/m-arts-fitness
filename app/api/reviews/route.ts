import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_REVIEWS, ReviewItem } from "@/data/reviews";

const dataFilePath = path.join(process.cwd(), "data", "reviews-store.json");

function readReviews(): ReviewItem[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(
        dataFilePath,
        JSON.stringify(DEFAULT_REVIEWS, null, 2),
        "utf8"
      );
      return DEFAULT_REVIEWS;
    }
    const raw = fs.readFileSync(dataFilePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_REVIEWS;
  } catch {
    return DEFAULT_REVIEWS;
  }
}

function writeReviews(reviews: ReviewItem[]): void {
  try {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(reviews, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Failed to write reviews file:", err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const allStatus = searchParams.get("allStatus") === "true";

    let reviews = readReviews();

    if (productId) {
      reviews = reviews.filter((r) => r.productId === productId);
      // Public product view only sees approved reviews
      if (!allStatus) {
        reviews = reviews.filter(
          (r) => r.status === "approved" || (!r.status && !r.id.startsWith("rev-1794"))
        );
      }
    }

    // Sort newest first
    reviews.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ success: true, reviews });
  } catch (err: any) {
    console.error("[Reviews API GET Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      productName,
      userName,
      userEmail,
      userId,
      city,
      rating,
      comment,
      photoUrl,
    } = body;

    if (!productId || !userName || !comment) {
      return NextResponse.json(
        { success: false, error: "Missing required review fields" },
        { status: 400 }
      );
    }

    const newReview: ReviewItem = {
      id: "rev-" + Date.now(),
      productId,
      productName: productName || "M.art Product",
      userName: userName.trim(),
      userEmail: userEmail || undefined,
      userId: userId || undefined,
      city: city || "Verified Buyer",
      rating: Number(rating) || 5,
      comment: comment.trim(),
      photoUrl: photoUrl || undefined,
      date: "Just now",
      createdAt: new Date().toISOString(),
      verified: true,
      status: "pending", // New reviews always start with pending status for admin moderation
    };

    const current = readReviews();
    const updated = [newReview, ...current];
    writeReviews(updated);

    return NextResponse.json({ success: true, review: newReview });
  } catch (err: any) {
    console.error("[Reviews API POST Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Review ID and status are required" },
        { status: 400 }
      );
    }

    const current = readReviews();
    const index = current.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    current[index].status = status;
    writeReviews(current);

    return NextResponse.json({ success: true, review: current[index] });
  } catch (err: any) {
    console.error("[Reviews API PATCH Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update review status" },
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
        { success: false, error: "Review id is required" },
        { status: 400 }
      );
    }

    const current = readReviews();
    const updated = current.filter((r) => r.id !== id);
    writeReviews(updated);

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (err: any) {
    console.error("[Reviews API DELETE Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to delete review" },
      { status: 500 }
    );
  }
}
