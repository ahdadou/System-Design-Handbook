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
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const scrolled = window.scrollY;
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      setScrollProgress(Math.min(100, (scrolled / total) * 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const CHAPTER_COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981"];
  const chapterColor = CHAPTER_COLORS[chapter.id - 1] || "#3b82f6";

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

        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#f1f5f9] mb-3">
          {topic.title}
        </h1>
        <p className="text-[#94a3b8] text-lg mb-4">{topic.description}</p>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-[#475569]">
            <Clock className="w-4 h-4" />
            <span>{topic.readingTime} min read</span>
            <span className="mx-2">·</span>
            <span>Topic {topic.order} of {chapter.topics.length}</span>
          </div>
          <button
            onClick={() => isCompleted ? markIncomplete(topic.slug) : markComplete(topic.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isCompleted
                ? "bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] hover:bg-[#10b981]/10"
                : "bg-[#1a2332] border border-[#1e293b] text-[#475569] hover:border-[#10b981]/40 hover:text-[#10b981]"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? "Completed" : "Mark Complete"}
          </button>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#1e293b] to-transparent mb-8" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TopicContent slug={topic.slug} chapterId={chapter.id} />
      </motion.div>

      {/* Navigation */}
      <div className="mt-16 pt-8 border-t border-[#1e293b] flex items-center justify-between gap-4">
        {prev ? (
          <Link href={`/chapter-${prev.chapter}/${prev.topic.slug}`} className="group flex items-center gap-2 flex-1 max-w-xs">
            <div className="p-2 rounded-lg bg-[#1a2332] border border-[#1e293b] group-hover:border-[#3b82f6]/40 transition-colors">
              <ChevronLeft className="w-4 h-4 text-[#94a3b8] group-hover:text-[#3b82f6] transition-colors" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-[#475569]">Previous</div>
              <div className="text-sm text-[#94a3b8] group-hover:text-[#f1f5f9] transition-colors truncate">
                {prev.topic.title}
              </div>
            </div>
          </Link>
        ) : <div />}

        {next ? (
          <Link href={`/chapter-${next.chapter}/${next.topic.slug}`} className="group flex items-center gap-2 flex-1 max-w-xs justify-end text-right">
            <div className="min-w-0">
              <div className="text-xs text-[#475569]">Next</div>
              <div className="text-sm text-[#94a3b8] group-hover:text-[#f1f5f9] transition-colors truncate">
                {next.topic.title}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-[#1a2332] border border-[#1e293b] group-hover:border-[#3b82f6]/40 transition-colors">
              <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#3b82f6] transition-colors" />
            </div>
          </Link>
        ) : <div />}
      </div>

      <div className="mt-4 text-center text-xs text-[#475569]">
        Use ← → arrow keys to navigate between topics
      </div>
    </div>
  );
}
