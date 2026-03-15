"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHAPTERS } from "@/lib/content";
import { useLearningStore } from "@/lib/store";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Search, BookOpen, Network, Database, Layers, Shield, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CHAPTER_ICONS = [Network, Database, Layers, Shield, Rocket];
const CHAPTER_COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981"];

export function Sidebar() {
  const pathname = usePathname();
  const { completedTopics, getChapterProgress } = useLearningStore();
  const [search, setSearch] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1, 2, 3, 4, 5]);

  const toggleChapter = (id: number) => {
    setExpandedChapters((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const filteredChapters = useMemo(() => {
    if (!search) return CHAPTERS;
    const lower = search.toLowerCase();
    return CHAPTERS.map((chapter) => ({
      ...chapter,
      topics: chapter.topics.filter(
        (t) => t.title.toLowerCase().includes(lower) || t.description.toLowerCase().includes(lower)
      ),
    })).filter((c) => c.topics.length > 0);
  }, [search]);

  return (
    <div className="h-full flex flex-col bg-[#111827] border-r border-[#1e293b]">
      {/* Logo */}
      <div className="p-4 border-b border-[#1e293b]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-[#f1f5f9] font-heading">System Design</div>
            <div className="text-[10px] text-[#475569]">Academy</div>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-[#1e293b]">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569]" />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a2332] border border-[#1e293b] rounded-lg pl-8 pr-3 py-2 text-xs text-[#f1f5f9] placeholder:text-[#475569] focus:outline-none focus:border-[#3b82f6] transition-colors"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {filteredChapters.map((chapter, idx) => {
          const Icon = CHAPTER_ICONS[idx] || Network;
          const color = CHAPTER_COLORS[idx];
          const progress = getChapterProgress(chapter.id);
          const isExpanded = expandedChapters.includes(chapter.id);

          return (
            <div key={chapter.id} className="mb-1">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#1a2332] transition-colors group"
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-medium text-[#f1f5f9] truncate">
                    Ch {chapter.id}: {chapter.title}
                  </div>
                  <div className="mt-0.5 h-1 rounded-full bg-[#1e293b] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-[#475569] shrink-0">{progress}%</span>
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-[#475569] shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-[#475569] shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-3 pl-3 border-l border-[#1e293b]">
                      {chapter.topics.map((topic) => {
                        const isActive = pathname === `/chapter-${chapter.id}/${topic.slug}`;
                        const isCompleted = completedTopics.includes(topic.slug);

                        return (
                          <Link
                            key={topic.slug}
                            href={`/chapter-${chapter.id}/${topic.slug}`}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all group ${
                              isActive
                                ? "bg-[#3b82f6]/10 text-[#3b82f6] border-l-2 border-[#3b82f6] -ml-px"
                                : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1a2332]"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-3 h-3 text-[#10b981] shrink-0" />
                            ) : (
                              <Circle className="w-3 h-3 shrink-0 opacity-40" />
                            )}
                            <span className="truncate">{topic.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Overall Progress */}
      <div className="p-3 border-t border-[#1e293b]">
        <OverallProgress />
      </div>
    </div>
  );
}

function OverallProgress() {
  const { getOverallProgress, completedTopics } = useLearningStore();
  const progress = getOverallProgress();
  const total = 55;

  return (
    <div className="glass-light rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#94a3b8]">Overall Progress</span>
        <span className="text-xs font-bold text-[#3b82f6]">{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#1e293b] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#8b5cf6]"
        />
      </div>
      <div className="mt-1.5 text-[10px] text-[#475569]">
        {completedTopics.length} / {total} topics completed
      </div>
    </div>
  );
}
