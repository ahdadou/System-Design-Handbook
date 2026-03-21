"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHAPTERS } from "@/lib/content";
import { useLearningStore, CHAPTER_TOPIC_SLUGS } from "@/lib/store";
import {
  ChevronDown, ChevronRight, CheckCircle2, Circle,
  Search, Network, Database, Layers, Shield, Rocket,
} from "lucide-react";
import { LogoIcon } from "@/components/ui/LogoIcon";
import { motion, AnimatePresence } from "framer-motion";

const CHAPTER_ICONS = [Network, Database, Layers, Shield, Rocket];
const CHAPTER_COLORS = ["#00D8FF", "#FF6B35", "#A855F7", "#FFD600", "#22C55E"];

/* ── Full expanded sidebar ───────────────────────────────────────────────── */
export function Sidebar() {
  const pathname = usePathname();
  const { completedTopics, setSidebarCollapsed } = useLearningStore();
  const [search, setSearch] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1, 2, 3, 4, 5]);

  const toggleChapter = (id: number) =>
    setExpandedChapters(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );

  const filteredChapters = useMemo(() => {
    if (!search) return CHAPTERS;
    const lower = search.toLowerCase();
    return CHAPTERS.map(ch => ({
      ...ch,
      topics: ch.topics.filter(
        t => t.title.toLowerCase().includes(lower) || t.description.toLowerCase().includes(lower)
      ),
    })).filter(c => c.topics.length > 0);
  }, [search]);

  return (
    <div
      className="h-full flex flex-col theme-transition"
      style={{ background: "var(--bg-surface)", borderRight: "1px solid var(--ui-border)" }}
    >
      {/* Logo */}
      <div
        className="p-4 flex items-center gap-2"
        style={{ borderBottom: "1px solid var(--ui-border)" }}
      >
        <Link href="/" className="flex items-center gap-2 group flex-1">
          <LogoIcon size={34} />
          <div>
            <div className="font-bold text-sm font-heading" style={{ color: "var(--ui-text)" }}>
              System Design
            </div>
            <div
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: "var(--ui-text-3)" }}
            >
              Academy
            </div>
          </div>
        </Link>
        {/* Collapse button */}
        <button
          onClick={() => setSidebarCollapsed(true)}
          className="p-1.5 rounded-lg transition-all shrink-0"
          style={{ color: "var(--ui-text-3)" }}
          title="Collapse sidebar"
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-text-2)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-text-3)";
          }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3" style={{ borderBottom: "1px solid var(--ui-border)" }}>
        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: "var(--ui-text-3)" }}
          />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none transition-colors"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--ui-border)",
              color: "var(--ui-text)",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--ui-accent)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--ui-border)"; }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {filteredChapters.map((chapter, idx) => {
          const Icon = CHAPTER_ICONS[idx] || Network;
          const color = CHAPTER_COLORS[idx];
          const slugs = CHAPTER_TOPIC_SLUGS[chapter.id] || [];
          const progress = slugs.length > 0
            ? Math.round(slugs.filter(s => completedTopics.includes(s)).length / slugs.length * 100)
            : 0;
          const isExpanded = expandedChapters.includes(chapter.id);

          return (
            <div key={chapter.id} className="mb-1">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-colors"
                style={{ color: "var(--ui-text)" }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="font-mono text-[10px] font-bold shrink-0"
                      style={{ color, letterSpacing: "0.05em" }}
                    >
                      {String(chapter.id).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-medium truncate" style={{ color: "var(--ui-text)" }}>
                      {chapter.title}
                    </span>
                  </div>
                  <div
                    className="mt-0.5 h-1 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-highlight)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
                <span className="text-[10px] shrink-0" style={{ color: "var(--ui-text-3)" }}>
                  {progress}%
                </span>
                {isExpanded
                  ? <ChevronDown className="w-3 h-3 shrink-0" style={{ color: "var(--ui-text-3)" }} />
                  : <ChevronRight className="w-3 h-3 shrink-0" style={{ color: "var(--ui-text-3)" }} />
                }
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
                    <div
                      className="ml-3 pl-3"
                      style={{ borderLeft: "1px solid var(--ui-border)" }}
                    >
                      {chapter.topics.map(topic => {
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
                                  background: `${color}15`,
                                  color,
                                  borderLeft: `2px solid ${color}`,
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
                            {isCompleted
                              ? <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: "var(--ui-success)" }} />
                              : <Circle className="w-3 h-3 shrink-0 opacity-40" />
                            }
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

/* ── Mini (collapsed) sidebar ────────────────────────────────────────────── */
export function SidebarMini() {
  const pathname = usePathname();
  const { completedTopics, setSidebarCollapsed } = useLearningStore();

  return (
    <div
      className="h-full flex flex-col items-center py-3 gap-2 theme-transition"
      style={{
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--ui-border)",
        width: "56px",
      }}
    >
      {/* Logo icon  click to expand */}
      <button
        onClick={() => setSidebarCollapsed(false)}
        className="mb-2 shrink-0 transition-opacity hover:opacity-80"
        title="Expand sidebar"
      >
        <LogoIcon size={38} />
      </button>

      {/* Chapter icon buttons */}
      {CHAPTERS.map((chapter, idx) => {
        const Icon = CHAPTER_ICONS[idx];
        const color = CHAPTER_COLORS[idx];
        const slugs = CHAPTER_TOPIC_SLUGS[chapter.id] || [];
        const isActiveChapter = pathname.includes(`/chapter-${chapter.id}/`);
        const hasProgress = slugs.some(s => completedTopics.includes(s));

        return (
          <Link
            key={chapter.id}
            href={`/chapter-${chapter.id}/${chapter.topics[0]?.slug ?? ""}`}
            title={chapter.title}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0"
            style={{
              background: isActiveChapter ? `${color}25` : `${color}10`,
              color,
              border: isActiveChapter ? `1.5px solid ${color}` : "1.5px solid transparent",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = `${color}25`;
              (e.currentTarget as HTMLAnchorElement).style.borderColor = color;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = isActiveChapter ? `${color}25` : `${color}10`;
              (e.currentTarget as HTMLAnchorElement).style.borderColor = isActiveChapter ? color : "transparent";
            }}
          >
            <Icon className="w-4 h-4" />
            {hasProgress && (
              <span
                className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                style={{ background: color }}
              />
            )}
          </Link>
        );
      })}

      {/* Expand button at bottom */}
      <div className="flex-1" />
      <button
        onClick={() => setSidebarCollapsed(false)}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
        style={{ color: "var(--ui-text-3)", border: "1px solid var(--ui-border)" }}
        title="Expand sidebar"
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-text-2)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-text-3)";
        }}
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ── Overall progress widget ─────────────────────────────────────────────── */
function OverallProgress() {
  const completedTopics = useLearningStore(s => s.completedTopics);
  const allSlugs = Object.values(CHAPTER_TOPIC_SLUGS).flat();
  const total = allSlugs.length;
  const completed = allSlugs.filter(s => completedTopics.includes(s)).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-xl p-3" style={{ background: "var(--bg-elevated)" }}>
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "var(--ui-text-3)" }}
        >
          Overall
        </span>
        <span
          className="font-mono text-xs font-bold"
          style={{ color: "var(--ui-accent)" }}
        >
          {progress}%
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--bg-highlight)" }}
      >
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
        {completed} / {total} topics
      </div>
    </div>
  );
}
