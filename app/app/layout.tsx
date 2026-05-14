import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/nav";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SentimentIQ — Amazon Reviews Analysis",
  description:
    "NLP-powered sentiment analysis of Amazon Cell Phone & Accessories reviews across 18 products.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground">
        <Nav />
        {/* pt-14 for desktop nav, pt-12 + pb-16 for mobile (top bar + bottom tabs) */}
        <main className="pt-12 pb-20 md:pt-14 md:pb-0 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
