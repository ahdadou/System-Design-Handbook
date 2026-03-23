import { CHAPTERS } from "@/lib/content";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://systemdesignacademy.io";

// Fixed publish date so search engines see stable lastModified values
const SITE_PUBLISHED = new Date("2024-01-01T00:00:00Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: SITE_PUBLISHED,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const chapterPages: MetadataRoute.Sitemap = CHAPTERS.map((chapter) => ({
    url: `${BASE_URL}/chapter-${chapter.id}`,
    lastModified: SITE_PUBLISHED,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const topicPages: MetadataRoute.Sitemap = CHAPTERS.flatMap((chapter) =>
    chapter.topics.map((topic) => ({
      url: `${BASE_URL}/chapter-${chapter.id}/${topic.slug}`,
      lastModified: SITE_PUBLISHED,
      changeFrequency: "monthly" as const,
      priority: 1.0,
    }))
  );

  return [...staticPages, ...chapterPages, ...topicPages];
}
