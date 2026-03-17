import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/components/layout/SidebarLayout";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "System Design Academy",
  description: "Master system design through interactive learning. Interactive diagrams, animations, and hands-on experiments.",
  keywords: ["system design", "distributed systems", "architecture", "learning", "interactive"],
  openGraph: {
    title: "System Design Academy",
    description: "Master system design through interactive learning",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-canvas text-txt min-h-screen theme-transition">
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
