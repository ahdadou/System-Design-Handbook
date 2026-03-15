import { CHAPTERS, getChapter, getTopic, getNextTopic, getPrevTopic } from "@/lib/content";
import { notFound } from "next/navigation";
import { TopicPageClient } from "@/components/topic/TopicPageClient";

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

export async function generateMetadata({ params }: Props) {
  const { chapterId, topicSlug } = await params;
  const id = parseInt(chapterId.replace('chapter-', ''));
  const topic = getTopic(id, topicSlug);
  const chapter = getChapter(id);
  
  if (!topic || !chapter) return {};
  return {
    title: `${topic.title} — System Design Academy`,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: Props) {
  const { chapterId, topicSlug } = await params;
  
  console.log('### params', { chapterId, topicSlug });

  const id = parseInt(chapterId.replace('chapter-', ''));

  console.log('### chapterId', id);
  console.log('### topicSlug', topicSlug);

  if (isNaN(id)) notFound();

  const topic = getTopic(id, topicSlug);
  const chapter = getChapter(id);
  
  if (!topic || !chapter) notFound();

  const next = getNextTopic(id, topicSlug);
  const prev = getPrevTopic(id, topicSlug);

  return (
    <TopicPageClient
      topic={topic}
      chapter={chapter}
      next={next}
      prev={prev}
    />
  );
}
