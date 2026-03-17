"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, Home, Sun, Moon } from "lucide-react";
import { useLearningStore } from "@/lib/store";
import { CHAPTERS } from "@/lib/content";
import { useMemo } from "react";
import { motion } from "framer-motion";

export function TopNav() {
  const { sidebarOpen, toggleSidebar, darkMode, toggleDarkMode } = useLearningStore();
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [];

    const crumbs: { label: string; href: string }[] = [{ label: "Home", href: "/" }];

    if (parts[0]?.startsWith("chapter-")) {
      const chapterId = parseInt(parts[0].replace("chapter-", ""));
      const chapter = CHAPTERS.find((c) => c.id === chapterId);
      if (chapter) crumbs.push({ label: chapter.title, href: `/${parts[0]}` });
      if (parts[1] && chapter) {
        const topic = chapter.topics.find((t) => t.slug === parts[1]);
        if (topic) crumbs.push({ label: topic.title, href: `/${parts[0]}/${parts[1]}` });
      }
    }
    return crumbs;
  }, [pathname]);

  return (
    <header
      className="h-14 flex items-center px-4 gap-3 shrink-0 sticky top-0 z-20 theme-transition"
      style={{
        background: "color-mix(in srgb, var(--bg-surface) 85%, transparent)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--ui-border)",
      }}
    >
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg transition-all"
        style={{ color: "var(--ui-text-2)" }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-text)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-text-2)";
        }}
        aria-label="Toggle sidebar"
      >
        <motion.div
          key={sidebarOpen ? "open" : "closed"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </motion.div>
      </button>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-xs overflow-hidden flex-1">
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.href} className="flex items-center gap-1 min-w-0">
            {i > 0 && <ChevronRight className="w-3 h-3 shrink-0" style={{ color: "var(--ui-text-3)" }} />}
            {i === breadcrumbs.length - 1 ? (
              <span className="font-medium truncate" style={{ color: "var(--ui-text)" }}>{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="flex items-center gap-1 transition-colors hover:opacity-80"
                style={{ color: "var(--ui-text-3)" }}
              >
                {i === 0 && <Home className="w-3 h-3 shrink-0" />}
                {i > 0 && <span className="hidden sm:inline">{crumb.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Dark / Light toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg transition-all relative overflow-hidden"
          style={{ color: "var(--ui-text-2)", border: "1px solid var(--ui-border)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-accent)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-text-2)";
          }}
          aria-label="Toggle theme"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <motion.div
            key={darkMode ? "dark" : "light"}
            initial={{ scale: 0.5, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.div>
        </button>

      </div>
    </header>
  );
}
