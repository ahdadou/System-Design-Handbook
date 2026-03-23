import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://systemdesignacademy.io";

export const metadata: Metadata = {
  title: "System Design Academy — Free Interactive System Design Course",
  description:
    "Master system design for interviews with 55 interactive topics: load balancing, caching, databases, microservices, CAP theorem, consistent hashing, and real-world case studies. Free, no account needed.",
  keywords: [
    "system design interview",
    "system design tutorial",
    "learn system design",
    "system design course free",
    "system design for beginners",
    "system design interview prep",
    "distributed systems tutorial",
    "software architecture course",
    "system design handbook",
    "system design guide",
    "load balancing explained",
    "caching system design",
    "database system design interview",
    "microservices system design",
    "CAP theorem explained",
    "consistent hashing tutorial",
    "system design case studies",
    "FAANG system design interview",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "System Design Academy — Free Interactive System Design Course",
    description:
      "55 interactive system design topics with diagrams, quizzes, and real-world case studies. The complete system design interview handbook — free, no account needed.",
    url: BASE_URL,
    siteName: "System Design Academy",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "System Design Academy — Master System Design Interactively",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Design Academy — Free Interactive System Design Course",
    description:
      "55 interactive system design topics: load balancing, caching, databases, microservices, and real-world case studies. Free, no account needed.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
