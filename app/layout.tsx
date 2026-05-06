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
      <body className={`${inter.className} bg-[#09090b] text-zinc-300 min-h-screen flex relative overflow-x-hidden`}>
        
        {/* POLA BACKGROUND GRID TIPIS (Opacity 20%) */}
        <div className="fixed inset-0 z-[-1] h-full w-full bg-[#09090b] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* EFEK CAHAYA GLOWING DI TENGAH ATAS */}
        <div className="fixed left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-[0.03] blur-[100px]"></div>

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
