import { CHAPTERS } from "@/lib/content";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://systemdesignacademy.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const chapterPages: MetadataRoute.Sitemap = CHAPTERS.map((chapter) => ({
    url: `${BASE_URL}/chapter-${chapter.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const topicPages: MetadataRoute.Sitemap = CHAPTERS.flatMap((chapter) =>
    chapter.topics.map((topic) => ({
      url: `${BASE_URL}/chapter-${chapter.id}/${topic.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }))
  );

  return [...staticPages, ...chapterPages, ...topicPages];
}
