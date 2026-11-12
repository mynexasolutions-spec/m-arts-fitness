export interface ReviewItem {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  userEmail?: string;
  userId?: string;
  city?: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  date: string;
  createdAt: string;
  verified: boolean;
  status?: "pending" | "approved" | "rejected";
}

export const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    productId: "wooden-dumbbells",
    productName: "Wooden Dumbbells - Set of 2",
    userName: "Rohit Sharma",
    userEmail: "rohit.sharma@example.com",
    city: "New Delhi",
    rating: 5,
    comment: "Ordered this Wooden Dumbbells for my daily home workout routine. Solid build quality, comfortable grip, and fast delivery at ₹499. The wooden finish is smooth and safe on tile floors.",
    photoUrl: "/wooden-dumbells.jpg",
    date: "2 days ago",
    createdAt: "2026-11-10T10:00:00.000Z",
    verified: true,
    status: "approved",
  },
  {
    id: "rev-2",
    productId: "wooden-dumbbells",
    productName: "Wooden Dumbbells - Set of 2",
    userName: "Ananya Verma",
    userEmail: "ananya.v@example.com",
    city: "Bengaluru",
    rating: 5,
    comment: "Genuine M.art quality! Exactly as shown in the specifications (Set of 2 • Ergonomic & Floor-Friendly). Very durable, floor-friendly, and comfortable for daily sessions.",
    date: "1 week ago",
    createdAt: "2026-11-05T14:30:00.000Z",
    verified: true,
    status: "approved",
  },
  {
    id: "rev-3",
    productId: "wooden-dumbbells",
    productName: "Wooden Dumbbells - Set of 2",
    userName: "Vikramaditya Singh",
    userEmail: "vikram.singh@example.com",
    city: "Mumbai",
    rating: 4,
    comment: "Been using the Wooden Dumbbells for 15 days now. Stays sturdy even with rough daily training and takes very little storage space at home. Highly recommend for home gym lovers.",
    date: "2 weeks ago",
    createdAt: "2026-10-28T09:15:00.000Z",
    verified: true,
    status: "approved",
  },
  {
    id: "rev-4",
    productId: "wooden-dumbbells",
    productName: "Wooden Dumbbells - Set of 2",
    userName: "Karan Malhotra",
    userEmail: "karan.m@example.com",
    city: "Pune",
    rating: 5,
    comment: "Best value for money fitness equipment in this price range. Packaging was secure and the finish feels premium. Great job M.art!",
    photoUrl: "/dumbbells-info-1.jpg",
    date: "3 weeks ago",
    createdAt: "2026-10-21T18:20:00.000Z",
    verified: true,
    status: "approved",
  },
  {
    id: "rev-5",
    productId: "training-cones",
    productName: "Training Cones Set (Pack of 50)",
    userName: "Sameer Khan",
    userEmail: "sameer.k@example.com",
    city: "Hyderabad",
    rating: 5,
    comment: "Super flexible disc cones! Cleats se crush hone ke baad bhi wapas shape mein aa jaate hain. Carry strap aur stand saath mein aata hai jo coaching ke liye bahut convenient hai.",
    photoUrl: "/Training-cones.jpg",
    date: "4 days ago",
    createdAt: "2026-11-08T11:45:00.000Z",
    verified: true,
    status: "approved",
  },
  {
    id: "rev-6",
    productId: "hex-dumbbells-5kg",
    productName: "Rubber Hex Dumbbells (5kg Pair)",
    userName: "Pooja Hegde",
    userEmail: "pooja.h@example.com",
    city: "Chennai",
    rating: 5,
    comment: "Heavy-duty dumbbells with an ergonomic knurled grip. Anti-roll hexagonal design protects the floor. Worth every rupee!",
    photoUrl: "/hex-dumbells-5kg.jpg",
    date: "1 week ago",
    createdAt: "2026-11-04T16:10:00.000Z",
    verified: true,
    status: "approved",
  }
];

const STORAGE_KEY = "mart_customer_reviews";

export function getStoredReviews(): ReviewItem[] {
  if (typeof window === "undefined") return DEFAULT_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REVIEWS));
      return DEFAULT_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_REVIEWS;
  } catch {
    return DEFAULT_REVIEWS;
  }
}

export function saveStoredReviews(reviews: ReviewItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new Event("mart_reviews_updated"));
  } catch (err) {
    console.warn("Could not save reviews to localStorage:", err);
  }
}
