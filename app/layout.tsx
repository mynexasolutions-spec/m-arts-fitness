import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "M.art Sports & Fitness | Premium Sports & Fitness Equipment",
  description:
    "Gear up for a healthier you with premium sports, gym, and fitness equipment for every age and every goal.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-full flex flex-col bg-white text-stone-900 overflow-x-clip`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <StoreProvider>
            {children}
            <AuthModal />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
