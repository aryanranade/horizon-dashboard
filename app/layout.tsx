import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Horizon — Travel Intelligence",
  description: "AI-powered travel planning with real-time weather intelligence. Discover personalized itineraries tailored to your vibe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#050a12]">
      <body
        className={`${inter.variable} font-[Inter,system-ui,sans-serif] antialiased bg-[#050a12] text-slate-200 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
