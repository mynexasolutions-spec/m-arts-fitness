export interface InquiryItem {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  inquiryType: string;
  message: string;
  isResolved: boolean;
  isNew: boolean;
  createdAt: string;
}

export const DEFAULT_INQUIRIES: InquiryItem[] = [
  {
    id: "inq-1",
    fullName: "Roel Sharma",
    phone: "9876543210",
    email: "roel.sharma@gmail.com",
    city: "New Delhi",
    inquiryType: "Bulk / Wholesale Order",
    message: "Hi M.art team, We run a sports academy in Rohini and need 50 sets of Wooden Dumbbells (2kg to 5kg) and 100 Training Cones. Could you please share the wholesale catalog and discounted price quote for bulk purchase?",
    isResolved: false,
    isNew: true,
    createdAt: "2026-11-12T06:30:00.000Z",
  },
  {
    id: "inq-2",
    fullName: "Vikram Gill",
    phone: "9812345678",
    email: "vikram.gill@ironfit.in",
    city: "Chandigarh",
    inquiryType: "Gym / Academy Setup",
    message: "We are setting up a new cross-training studio in Sector 34. Looking for commercial gym bundles, training accessories, and customized weight plates. Please arrange a callback with your B2B sales lead.",
    isResolved: false,
    isNew: true,
    createdAt: "2026-11-11T14:45:00.000Z",
  },
  {
    id: "inq-3",
    fullName: "Sameera Patel",
    phone: "9823456789",
    email: "sameera.p@patelsports.com",
    city: "Ahmedabad",
    inquiryType: "Bulk / Wholesale Order",
    message: "Interested in reselling M.art fitness essentials in our sports retail stores across Gujarat. Requesting dealership terms, minimum order quantity (MOQ), and shipping timeline from Meerut.",
    isResolved: false,
    isNew: true,
    createdAt: "2026-11-10T09:15:00.000Z",
  },
  {
    id: "inq-4",
    fullName: "Arjun Verma",
    phone: "9711223344",
    email: "arjun.verma@apexfitness.co",
    city: "Bengaluru",
    inquiryType: "Product Inquiry",
    message: "Inquiring if custom laser engraving or gym logo branding is possible on Wooden Dumbbells for bulk orders exceeding 30 pairs.",
    isResolved: true,
    isNew: false,
    createdAt: "2026-11-08T11:20:00.000Z",
  },
];
