"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Chapter } from "@/lib/content";
import { useLearningStore } from "@/lib/store";
import { CheckCircle2, Circle, Clock, ArrowRight, ChevronLeft, Network, Database, Layers, Shield, Rocket } from "lucide-react";

const CHAPTER_ICONS = [Network, Database, Layers, Shield, Rocket];
const CHAPTER_GRADIENTS = [
  "from-[#3b82f6] to-[#06b6d4]",
  "from-[#06b6d4] to-[#8b5cf6]",
  "from-[#8b5cf6] to-[#ec4899]",
  "from-[#f59e0b] to-[#ef4444]",
  "from-[#10b981] to-[#3b82f6]",
];

interface Props {
  chapter: Chapter;
}

export function ChapterOverview({ chapter }: Props) {
  const { completedTopics, getChapterProgress } = useLearningStore();
  const Icon = CHAPTER_ICONS[chapter.id - 1] || Network;
  const gradient = CHAPTER_GRADIENTS[chapter.id - 1];
  const progress = getChapterProgress(chapter.id);

  return (
    <div className="min-h-full px-4 py-8 max-w-4xl mx-auto">
      {/* Back link */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#94a3b8] transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" />
          All Chapters
        </Link>
      </motion.div>

      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="relative">
          {/* Large number watermark */}
          <div className="absolute -top-4 -left-4 text-[120px] font-bold font-heading text-[#1a2332] select-none pointer-events-none leading-none">
            0{chapter.id}
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-xs text-[#475569] uppercase tracking-wider mb-1">Chapter {chapter.id}</div>
                <h1 className="text-3xl font-bold font-heading text-[#f1f5f9]">{chapter.title}</h1>
              </div>
            </div>
            <p className="text-[#94a3b8] text-lg max-w-2xl">{chapter.description}</p>

            {/* Progress bar */}
            <div className="mt-6 max-w-xs">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#475569]">Chapter Progress</span>
                <span className="text-[#3b82f6] font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                />
              </div>
              <div className="text-xs text-[#475569] mt-1">
                {chapter.topics.filter((t) => completedTopics.includes(t.slug)).length} / {chapter.topics.length} completed
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Topics Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#3b82f6]/50 via-[#8b5cf6]/30 to-transparent" />

        <div className="space-y-2">
          {chapter.topics.map((topic, idx) => {
            const isCompleted = completedTopics.includes(topic.slug);
            const href = `/chapter-${chapter.id}/${topic.slug}`;

            return (
              <motion.div
                key={topic.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <Link href={href}>
                  <div className="group flex items-start gap-4 p-4 ml-4 rounded-xl hover:bg-[#1a2332] transition-all duration-200 border border-transparent hover:border-[#1e293b]">
                    {/* Node */}
                    <div className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isCompleted
                        ? "bg-[#10b981] border-[#10b981]"
                        : "bg-[#111827] border-[#1e293b] group-hover:border-[#3b82f6]"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      ) : (
                        <Circle className="w-2 h-2 text-[#475569]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#475569] font-mono">{String(idx + 1).padStart(2, "0")}</span>
                        <h3 className={`font-semibold transition-colors ${isCompleted ? "text-[#10b981]" : "text-[#f1f5f9] group-hover:text-[#3b82f6]"}`}>
                          {topic.title}
                        </h3>
                        <span className="flex items-center gap-1 text-xs text-[#475569] ml-auto shrink-0">
                          <Clock className="w-3 h-3" />
                          {topic.readingTime} min
                        </span>
                      </div>
                      <p className="text-sm text-[#94a3b8] mt-0.5 line-clamp-1">{topic.description}</p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#475569] shrink-0 mt-1 group-hover:text-[#3b82f6] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Start CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <Link
          href={`/chapter-${chapter.id}/${chapter.topics[0].slug}`}
          className={`inline-flex items-center gap-2 bg-gradient-to-r ${gradient} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity`}
        >
          Start Chapter {chapter.id}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
