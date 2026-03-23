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
    default: "System Design Academy — Learn System Design Interactively",
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
    "system design handbook",
    "system design guide",
    "FAANG system design",
  ],
  authors: [{ name: "System Design Academy", url: BASE_URL }],
  creator: "System Design Academy",
  publisher: "System Design Academy",
  category: "Education",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "System Design Academy",
    title: "System Design Academy — Learn System Design Interactively",
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
    title: "System Design Academy — Learn System Design Interactively",
    description:
      "55 interactive system design topics: load balancing, caching, databases, microservices, and real-world case studies.",
    images: ["/og-image.png"],
    creator: "@systemdesignacademy",
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "System Design Academy",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/og-image.png`,
    width: 1200,
    height: 630,
  },
  sameAs: [],
  description:
    "System Design Academy is a free, interactive learning platform covering 55 system design topics for engineers preparing for technical interviews.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "System Design Academy",
  url: BASE_URL,
  description:
    "Free interactive system design course with 55 topics, animated diagrams, quizzes, and real-world case studies.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const educationalOrganizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "System Design Academy",
  url: BASE_URL,
  description:
    "Learn system design for free with 55 interactive topics, animated diagrams, and knowledge checks covering networking, databases, architecture, and real-world case studies.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "System Design Curriculum",
    numberOfItems: 55,
    itemListElement: [
      { "@type": "Course", name: "Networking & Infrastructure", url: `${BASE_URL}/chapter-1` },
      { "@type": "Course", name: "Databases & Data Management", url: `${BASE_URL}/chapter-2` },
      { "@type": "Course", name: "System Architecture & Communication", url: `${BASE_URL}/chapter-3` },
      { "@type": "Course", name: "Advanced Concepts & Security", url: `${BASE_URL}/chapter-4` },
      { "@type": "Course", name: "Real-World Case Studies", url: `${BASE_URL}/chapter-5` },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-canvas text-txt min-h-screen theme-transition">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrganizationJsonLd) }}
        />
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
