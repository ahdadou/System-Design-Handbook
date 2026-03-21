import { CHAPTERS, getChapter } from "@/lib/content";
import { notFound } from "next/navigation";
import { ChapterOverview } from "@/components/chapter/ChapterOverview";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://systemdesignacademy.io";

interface Props {
  params: Promise<{ chapterId: string }>;
}

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ chapterId: `chapter-${c.id}` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterId } = await params;
  const id = parseInt(chapterId.replace("chapter-", ""));
  const chapter = getChapter(id);

  if (!chapter) return {};

  const canonicalUrl = `${BASE_URL}/chapter-${chapter.id}`;

  return {
    title: `Chapter ${chapter.id}: ${chapter.title}  System Design`,
    description: chapter.seoDescription,
    keywords: [
      ...chapter.keywords,
      ...chapter.topics.flatMap((t) => t.keywords.slice(0, 2)),
    ].slice(0, 20),
    openGraph: {
      title: `Chapter ${chapter.id}: ${chapter.title} | System Design Academy`,
      description: chapter.seoDescription,
      url: canonicalUrl,
      siteName: "System Design Academy",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Chapter ${chapter.id}: ${chapter.title}`,
      description: chapter.seoDescription,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ChapterPage({ params }: Props) {
  const { chapterId } = await params;
  const id = parseInt(chapterId.replace("chapter-", ""));

  if (isNaN(id)) notFound();

  const chapter = getChapter(id);
  if (!chapter) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `Chapter ${chapter.id}: ${chapter.title}`,
    description: chapter.seoDescription,
    url: `${BASE_URL}/chapter-${chapter.id}`,
    provider: {
      "@type": "Organization",
      name: "System Design Academy",
      url: BASE_URL,
    },
    hasCourseInstance: chapter.topics.map((topic) => ({
      "@type": "CourseInstance",
      name: topic.seoTitle,
      url: `${BASE_URL}/chapter-${chapter.id}/${topic.slug}`,
      description: topic.seoDescription,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChapterOverview chapter={chapter} />
    </>
  );
}
