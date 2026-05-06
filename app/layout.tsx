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
      {/* UPDATE WARNA BACKGROUND DI SINI */}
      <body className={`${inter.className} bg-[#09090b] text-zinc-300 min-h-screen flex`}>
        <Sidebar />
        <main className="pl-20 w-full min-h-screen selection:bg-cyan-500/30">
          <div className="p-8 max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </body>
    </html>
  );
}
