import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TradeOS | Personal Trading Terminal",
  description: "Advanced crypto trading journal and risk calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#020617] text-white min-h-screen flex`}>
        {/* Sidebar di sebelah kiri */}
        <Sidebar />
        
        {/* Main Content Area (Bergeser ke kanan karena ada sidebar) */}
        <main className="ml-64 flex-1 p-8 h-screen overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
