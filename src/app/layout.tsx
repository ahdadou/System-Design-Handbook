import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/components/layout/SidebarLayout";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${inter.variable} ${firaCode.variable}`}>
      <body className="bg-[#0a0e17] text-[#f1f5f9] min-h-screen">
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
