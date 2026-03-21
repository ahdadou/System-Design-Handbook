import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/components/layout/SidebarLayout";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://systemdesignacademy.io";

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
  metadataBase: new URL(BASE_URL),
  title: {
    default: "System Design Academy  Learn System Design Interactively",
    template: "%s | System Design Academy",
  },
  description:
    "Master system design with 55 interactive topics across 5 chapters. Learn load balancing, caching, databases, microservices, and more with diagrams, quizzes, and real-world case studies.",
  keywords: [
    "system design",
    "system design interview",
    "distributed systems",
    "software architecture",
    "system design course",
    "load balancing",
    "caching system design",
    "database system design",
    "microservices",
    "CAP theorem",
    "consistent hashing",
    "system design tutorial",
  ],
  authors: [{ name: "System Design Academy" }],
  creator: "System Design Academy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "System Design Academy",
    title: "System Design Academy  Learn System Design Interactively",
    description:
      "Master system design with 55 interactive topics. Interactive diagrams, quizzes, and real-world case studies for engineers and interview prep.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "System Design Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Design Academy  Learn System Design Interactively",
    description:
      "55 interactive system design topics: load balancing, caching, databases, microservices, and real-world case studies.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
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
