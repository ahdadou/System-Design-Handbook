"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, ChevronRight, Home } from "lucide-react";
import { useLearningStore } from "@/lib/store";
import { CHAPTERS } from "@/lib/content";
import { useMemo } from "react";

export function TopNav() {
  const { sidebarOpen, toggleSidebar } = useLearningStore();
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [];

    const crumbs = [{ label: "Home", href: "/" }];

    if (parts[0]?.startsWith("chapter-")) {
      const chapterId = parseInt(parts[0].replace("chapter-", ""));
      const chapter = CHAPTERS.find((c) => c.id === chapterId);
      if (chapter) {
        crumbs.push({ label: chapter.title, href: `/${parts[0]}` });
      }
      if (parts[1] && chapter) {
        const topic = chapter.topics.find((t) => t.slug === parts[1]);
        if (topic) {
          crumbs.push({ label: topic.title, href: `/${parts[0]}/${parts[1]}` });
        }
      }
    }

    return crumbs;
  }, [pathname]);

  return (
    <header className="h-14 border-b border-[#1e293b] bg-[#111827]/80 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0 sticky top-0 z-20">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-[#1a2332] transition-colors text-[#94a3b8] hover:text-[#f1f5f9]"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-xs overflow-hidden">
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.href} className="flex items-center gap-1 shrink-0">
            {i > 0 && <ChevronRight className="w-3 h-3 text-[#475569]" />}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-[#f1f5f9] font-medium truncate max-w-48">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-[#475569] hover:text-[#94a3b8] transition-colors flex items-center gap-1">
                {i === 0 && <Home className="w-3 h-3" />}
                <span className="hidden sm:inline">{i === 0 ? "" : crumb.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#f1f5f9] transition-colors">
          <BookOpen className="w-3.5 h-3.5" />
          <span>System Design Academy</span>
        </Link>
      </div>
    </header>
  );
}
