import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | M.art Sports & Fitness",
  description:
    "Secure administrative login and management console for M.art Sports & Fitness operations.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

