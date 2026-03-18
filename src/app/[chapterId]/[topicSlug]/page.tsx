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

function buildJsonLd(chapterId: number, topicSlug: string) {
  const topic = getTopic(chapterId, topicSlug);
  const chapter = getChapter(chapterId);
  if (!topic || !chapter) return null;

  const canonicalUrl = `${BASE_URL}/chapter-${chapter.id}/${topic.slug}`;

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
    description: topic.seoDescription,
    keywords: topic.keywords.join(", "),
    url: canonicalUrl,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "Course",
      name: "System Design Academy",
      description: "Master system design with 55 interactive topics",
      url: BASE_URL,
      provider: {
        "@type": "Organization",
        name: "System Design Academy",
        url: BASE_URL,
      },
    },
    educationalLevel: "intermediate",
    learningResourceType: "article",
    teaches: topic.keywords.slice(0, 5).join(", "),
    timeRequired: `PT${topic.readingTime}M`,
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
          text: `${topic.title} is a core system design concept covered in Chapter ${chapter.id}: ${chapter.title}. Understanding ${topic.title} is essential for system design interviews at top tech companies. Key concepts include: ${topic.keywords.slice(0, 4).join(", ")}.`,
        },
      },
    ],
  };

  return { breadcrumbJsonLd, articleJsonLd, faqJsonLd };
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
