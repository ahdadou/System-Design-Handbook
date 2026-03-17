"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHAPTERS } from "@/lib/content";
import { useLearningStore, CHAPTER_TOPIC_SLUGS } from "@/lib/store";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Search, BookOpen, Network, Database, Layers, Shield, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CHAPTER_ICONS = [Network, Database, Layers, Shield, Rocket];
const CHAPTER_COLORS = [
  "var(--ui-accent)",
  "var(--ui-accent-2)",
  "var(--ui-accent-3)",
  "#f59e0b",
  "#10b981",
];
const CHAPTER_COLORS_HEX = ["#6d54e8", "#0d9488", "#db2777", "#f59e0b", "#10b981"];

export function Sidebar() {
  const pathname = usePathname();
  const completedTopics = useLearningStore(s => s.completedTopics);
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
    <div
      className="h-full flex flex-col theme-transition"
      style={{ background: "var(--bg-surface)", borderRight: "1px solid var(--ui-border)" }}
    >
      {/* Logo */}
      <div className="p-4" style={{ borderBottom: "1px solid var(--ui-border)" }}>
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--ui-accent) 0%, var(--ui-accent-2) 100%)" }}
          >
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm font-heading" style={{ color: "var(--ui-text)" }}>System Design</div>
            <div className="mono-label" style={{ fontSize: "0.6rem" }}>Academy</div>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="p-3" style={{ borderBottom: "1px solid var(--ui-border)" }}>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--ui-text-3)" }} />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none transition-colors"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--ui-border)",
              color: "var(--ui-text)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--ui-accent)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--ui-border)";
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {filteredChapters.map((chapter, idx) => {
          const Icon = CHAPTER_ICONS[idx] || Network;
          const colorHex = CHAPTER_COLORS_HEX[idx];
          const slugs = CHAPTER_TOPIC_SLUGS[chapter.id] || [];
          const progress = slugs.length > 0
            ? Math.round(slugs.filter(s => completedTopics.includes(s)).length / slugs.length * 100)
            : 0;
          const isExpanded = expandedChapters.includes(chapter.id);

          return (
            <div key={chapter.id} className="mb-1">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-colors group"
                style={{ color: "var(--ui-text)" }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${colorHex}20`, color: colorHex }}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-[10px] font-bold shrink-0" style={{ color: colorHex, letterSpacing: "0.05em" }}>
                      {String(chapter.id).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-medium truncate" style={{ color: "var(--ui-text)" }}>
                      {chapter.title}
                    </span>
                  </div>
                  <div className="mt-0.5 h-1 rounded-full overflow-hidden" style={{ background: "var(--bg-highlight)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, backgroundColor: colorHex }}
                    />
                  </div>
                </div>
                <span className="text-[10px] shrink-0" style={{ color: "var(--ui-text-3)" }}>{progress}%</span>
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 shrink-0" style={{ color: "var(--ui-text-3)" }} />
                ) : (
                  <ChevronRight className="w-3 h-3 shrink-0" style={{ color: "var(--ui-text-3)" }} />
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
                    <div className="ml-3 pl-3" style={{ borderLeft: "1px solid var(--ui-border)" }}>
                      {chapter.topics.map((topic) => {
                        const isActive = pathname === `/chapter-${chapter.id}/${topic.slug}`;
                        const isCompleted = completedTopics.includes(topic.slug);

                        return (
                          <Link
                            key={topic.slug}
                            href={`/chapter-${chapter.id}/${topic.slug}`}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all"
                            style={
                              isActive
                                ? {
                                    background: `${colorHex}15`,
                                    color: colorHex,
                                    borderLeft: `2px solid ${colorHex}`,
                                    marginLeft: "-1px",
                                  }
                                : { color: "var(--ui-text-2)" }
                            }
                            onMouseEnter={e => {
                              if (!isActive) {
                                (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-elevated)";
                                (e.currentTarget as HTMLAnchorElement).style.color = "var(--ui-text)";
                              }
                            }}
                            onMouseLeave={e => {
                              if (!isActive) {
                                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                                (e.currentTarget as HTMLAnchorElement).style.color = "var(--ui-text-2)";
                              }
                            }}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: "var(--ui-success)" }} />
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
      <div className="p-3" style={{ borderTop: "1px solid var(--ui-border)" }}>
        <OverallProgress />
      </div>
    </div>
  );
}

function OverallProgress() {
  const completedTopics = useLearningStore(s => s.completedTopics);
  const allSlugs = Object.values(CHAPTER_TOPIC_SLUGS).flat();
  const total = allSlugs.length;
  const completed = allSlugs.filter(s => completedTopics.includes(s)).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-lg p-3" style={{ background: "var(--bg-elevated)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="mono-label">overall progress</span>
        <span className="font-mono text-xs font-bold" style={{ color: "var(--ui-accent)" }}>{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-highlight)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(to right, var(--ui-accent), var(--ui-accent-2))",
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <div className="mt-1.5 text-[10px]" style={{ color: "var(--ui-text-3)" }}>
        {completed} / {total} topics completed
      </div>
    </div>
  );
}
