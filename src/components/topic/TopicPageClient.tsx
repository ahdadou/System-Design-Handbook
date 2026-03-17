"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Topic, Chapter } from "@/lib/content";
import { useLearningStore } from "@/lib/store";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, BookOpen } from "lucide-react";
import { TopicContent } from "./TopicContent";

interface Props {
  topic: Topic;
  chapter: Chapter;
  next?: { chapter: number; topic: Topic };
  prev?: { chapter: number; topic: Topic };
}

export function TopicPageClient({ topic, chapter, next, prev }: Props) {
  const { completedTopics, markComplete, markIncomplete } = useLearningStore();
  const isCompleted = completedTopics.includes(topic.slug);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Content scrolls inside <main>, not window
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;
    const handleScroll = () => {
      const scrolled = scrollContainer.scrollTop;
      const total = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      if (total <= 0) return;
      setScrollProgress(Math.min(100, (scrolled / total) * 100));
    };
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && next) {
        window.location.href = `/chapter-${next.chapter}/${next.topic.slug}`;
      }
      if (e.key === "ArrowLeft" && prev) {
        window.location.href = `/chapter-${prev.chapter}/${prev.topic.slug}`;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const CHAPTER_COLORS = ["#6d54e8", "#0d9488", "#db2777", "#f59e0b", "#10b981"];
  const chapterColor = CHAPTER_COLORS[chapter.id - 1] || "var(--ui-accent)";

  return (
    <div ref={contentRef} className="max-w-4xl mx-auto px-4 py-8">
      {/* Scroll progress bar */}
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        {/* Chapter badge */}
        <div className="flex items-center gap-3 mb-4">
          <Link href={`/chapter-${chapter.id}`}>
            <span
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: `${chapterColor}20`, color: chapterColor, border: `1px solid ${chapterColor}30` }}
            >
              <BookOpen className="w-3 h-3" />
              Chapter {chapter.id}: {chapter.title}
            </span>
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-3" style={{ color: "var(--ui-text)" }}>
          {topic.title}
        </h1>
        <p className="text-lg mb-4" style={{ color: "var(--ui-text-2)" }}>{topic.description}</p>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--ui-text-3)" }}>
            <Clock className="w-4 h-4" />
            <span>{topic.readingTime} min read</span>
            <span className="mx-2">·</span>
            <span>Topic {topic.order} of {chapter.topics.length}</span>
          </div>
          <button
            onClick={() => isCompleted ? markIncomplete(topic.slug) : markComplete(topic.slug)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={
              isCompleted
                ? { background: "var(--ui-success-bg, rgba(16,185,129,0.15))", border: "1px solid rgba(16,185,129,0.4)", color: "var(--ui-success)" }
                : { background: "var(--bg-elevated)", border: "1px solid var(--ui-border)", color: "var(--ui-text-3)" }
            }
            onMouseEnter={e => {
              if (!isCompleted) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(16,185,129,0.4)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-success, #10b981)";
              }
            }}
            onMouseLeave={e => {
              if (!isCompleted) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--ui-border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-text-3)";
              }
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? "Completed" : "Mark Complete"}
          </button>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="h-px mb-8" style={{ background: "linear-gradient(to right, transparent, var(--ui-border), transparent)" }} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TopicContent slug={topic.slug} chapterId={chapter.id} />
      </motion.div>

      {/* Navigation */}
      <div className="mt-16 pt-8 flex items-center justify-between gap-4" style={{ borderTop: "1px solid var(--ui-border)" }}>
        {prev ? (
          <Link href={`/chapter-${prev.chapter}/${prev.topic.slug}`} className="group flex items-center gap-2 flex-1 max-w-xs">
            <div
              className="p-2 rounded-lg transition-colors"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--ui-border)" }}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: "var(--ui-text-2)" }} />
            </div>
            <div className="min-w-0">
              <div className="text-xs" style={{ color: "var(--ui-text-3)" }}>Previous</div>
              <div className="text-sm truncate" style={{ color: "var(--ui-text-2)" }}>
                {prev.topic.title}
              </div>
            </div>
          </Link>
        ) : <div />}

        {next ? (
          <Link href={`/chapter-${next.chapter}/${next.topic.slug}`} className="group flex items-center gap-2 flex-1 max-w-xs justify-end text-right">
            <div className="min-w-0">
              <div className="text-xs" style={{ color: "var(--ui-text-3)" }}>Next</div>
              <div className="text-sm truncate" style={{ color: "var(--ui-text-2)" }}>
                {next.topic.title}
              </div>
            </div>
            <div
              className="p-2 rounded-lg transition-colors"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--ui-border)" }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: "var(--ui-text-2)" }} />
            </div>
          </Link>
        ) : <div />}
      </div>

      <div className="mt-4 text-center text-xs" style={{ color: "var(--ui-text-3)" }}>
        Use ← → arrow keys to navigate between topics
      </div>
    </div>
  );
}
