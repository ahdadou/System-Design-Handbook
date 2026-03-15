import { CHAPTERS, getChapter } from "@/lib/content";
import { notFound } from "next/navigation";
import { ChapterOverview } from "@/components/chapter/ChapterOverview";

interface Props {
  params: Promise<{ chapterId: string }>;
}

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ chapterId: `chapter-${c.id}` }));
}

export async function generateMetadata({ params }: Props) {
  const { chapterId } = await params;
  const id = parseInt(chapterId.replace('chapter-', ''));
  const chapter = getChapter(id);
  
  if (!chapter) return {};
  return {
    title: `Chapter ${chapter.id}: ${chapter.title} — System Design Academy`,
    description: chapter.description,
  };
}

export default async function ChapterPage({ params }: Props) {
  const { chapterId } = await params;
  const id = parseInt(chapterId.replace('chapter-', ''));
  
  if (isNaN(id)) notFound();

  const chapter = getChapter(id);
  if (!chapter) notFound();
  
  return <ChapterOverview chapter={chapter} />;
}
