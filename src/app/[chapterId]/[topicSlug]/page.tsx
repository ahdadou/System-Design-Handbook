import { CHAPTERS, getChapter, getTopic, getNextTopic, getPrevTopic } from "@/lib/content";
import { notFound } from "next/navigation";
import { TopicPageClient } from "@/components/topic/TopicPageClient";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://systemdesignacademy.io";

interface Props {
  params: Promise<{ chapterId: string; topicSlug: string }>;
}

export function generateStaticParams() {
  return CHAPTERS.flatMap((chapter) =>
    chapter.topics.map((topic) => ({
      chapterId: `chapter-${chapter.id}`,
      topicSlug: topic.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterId, topicSlug } = await params;
  const id = parseInt(chapterId.replace("chapter-", ""));
  const topic = getTopic(id, topicSlug);
  const chapter = getChapter(id);

  if (!topic || !chapter) return {};

  const canonicalUrl = `${BASE_URL}/chapter-${chapter.id}/${topic.slug}`;

  return {
    title: topic.seoTitle,
    description: topic.seoDescription,
    keywords: topic.keywords,
    authors: [{ name: "System Design Academy" }],
    openGraph: {
      title: topic.seoTitle,
      description: topic.seoDescription,
      url: canonicalUrl,
      siteName: "System Design Academy",
      type: "article",
      locale: "en_US",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: topic.seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: topic.seoTitle,
      description: topic.seoDescription,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

const PUBLISHED_DATE = "2024-01-01T00:00:00Z";

function buildJsonLd(chapterId: number, topicSlug: string) {
  const topic = getTopic(chapterId, topicSlug);
  const chapter = getChapter(chapterId);
  if (!topic || !chapter) return null;

  const canonicalUrl = `${BASE_URL}/chapter-${chapter.id}/${topic.slug}`;
  const ogImage = `${BASE_URL}/og-image.png`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "System Design Academy",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: chapter.title,
        item: `${BASE_URL}/chapter-${chapter.id}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: topic.title,
        item: canonicalUrl,
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: topic.seoTitle,
    name: topic.seoTitle,
    description: topic.seoDescription,
    abstract: topic.description,
    keywords: topic.keywords.join(", "),
    url: canonicalUrl,
    inLanguage: "en-US",
    datePublished: PUBLISHED_DATE,
    dateModified: PUBLISHED_DATE,
    image: {
      "@type": "ImageObject",
      url: ogImage,
      width: 1200,
      height: 630,
    },
    author: {
      "@type": "Organization",
      name: "System Design Academy",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "System Design Academy",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: ogImage,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    isPartOf: {
      "@type": "Course",
      name: "System Design Academy",
      description: "Master system design with 55 interactive topics across networking, databases, architecture, and real-world case studies.",
      url: BASE_URL,
      provider: {
        "@type": "Organization",
        name: "System Design Academy",
        url: BASE_URL,
      },
    },
    educationalLevel: "intermediate",
    learningResourceType: ["article", "interactive resource"],
    teaches: topic.keywords.slice(0, 6).join(", "),
    timeRequired: `PT${topic.readingTime}M`,
    position: topic.order,
    isAccessibleForFree: true,
    hasPart: {
      "@type": "Course",
      name: chapter.title,
      url: `${BASE_URL}/chapter-${chapter.id}`,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${topic.title} in system design?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: topic.seoDescription,
        },
      },
      {
        "@type": "Question",
        name: `How is ${topic.title} used in system design interviews?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topic.title} is a core system design concept covered in Chapter ${chapter.id}: ${chapter.title}. Understanding ${topic.title} is essential for system design interviews at top tech companies like Google, Meta, Amazon, and Microsoft. Key concepts include: ${topic.keywords.slice(0, 4).join(", ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `Why is ${topic.title} important for system design?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topic.title} is a foundational concept that appears frequently in senior engineering interviews. It relates to: ${topic.keywords.slice(0, 3).join(", ")}. Mastering ${topic.title} helps you design scalable, reliable, and efficient systems.`,
        },
      },
      {
        "@type": "Question",
        name: `How long does it take to learn ${topic.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `This ${topic.title} guide has an estimated reading time of ${topic.readingTime} minutes, including interactive diagrams and a 10-question knowledge check quiz. It is part of ${chapter.title} in the System Design Academy curriculum.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the key concepts of ${topic.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The key concepts of ${topic.title} include: ${topic.keywords.join(", ")}. This topic is part of Chapter ${chapter.id} (${chapter.title}) in the System Design Academy.`,
        },
      },
    ],
  };

  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: topic.seoTitle,
    description: topic.seoDescription,
    url: canonicalUrl,
    learningResourceType: "interactive resource",
    educationalLevel: "intermediate",
    teaches: topic.keywords.slice(0, 5).join(", "),
    timeRequired: `PT${topic.readingTime}M`,
    isAccessibleForFree: true,
    inLanguage: "en-US",
    assesses: topic.title,
    educationalUse: "self assessment",
    interactivityType: "active",
    author: {
      "@type": "Organization",
      name: "System Design Academy",
      url: BASE_URL,
    },
  };

  return { breadcrumbJsonLd, articleJsonLd, faqJsonLd, learningResourceJsonLd };
}

export default async function TopicPage({ params }: Props) {
  const { chapterId, topicSlug } = await params;
  const id = parseInt(chapterId.replace("chapter-", ""));

  if (isNaN(id)) notFound();

  const topic = getTopic(id, topicSlug);
  const chapter = getChapter(id);

  if (!topic || !chapter) notFound();

  const next = getNextTopic(id, topicSlug);
  const prev = getPrevTopic(id, topicSlug);
  const jsonLd = buildJsonLd(id, topicSlug);

  return (
    <>
      {jsonLd && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumbJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.articleJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.faqJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.learningResourceJsonLd) }}
          />
        </>
      )}
      <TopicPageClient
        topic={topic}
        chapter={chapter}
        next={next}
        prev={prev}
      />
    </>
  );
}
