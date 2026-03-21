"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Topic, Chapter } from "@/lib/content";
import { useLearningStore } from "@/lib/store";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, Circle, BookOpen, Sparkles } from "lucide-react";
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
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.button
                key="completed"
                onClick={() => markIncomplete(topic.slug)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))",
                  border: "1px solid rgba(16,185,129,0.5)",
                  color: "#10b981",
                  boxShadow: "0 0 16px rgba(16,185,129,0.2)",
                }}
              >
                <motion.span
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </motion.span>
                Completed
              </motion.button>
            ) : (
              <motion.button
                key="incomplete"
                onClick={() => markComplete(topic.slug)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(16,185,129,0.5)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  border: "1px solid rgba(16,185,129,0.6)",
                  color: "#ffffff",
                  boxShadow: "0 0 20px rgba(16,185,129,0.35)",
                }}
              >
                {/* Pulsing glow ring */}
                <motion.span
                  className="absolute inset-0 rounded-xl"
                  animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0.4)", "0 0 20px rgba(16,185,129,0.6)", "0 0 0px rgba(16,185,129,0.4)"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Shimmer sweep */}
                <motion.span
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                />
                <motion.span
                  animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Sparkles className="w-4 h-4 relative z-10" />
                </motion.span>
                <span className="relative z-10">Mark Complete</span>
              </motion.button>
            )}
          </AnimatePresence>
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
