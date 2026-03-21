"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarMini } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useLearningStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, darkMode } = useLearningStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useLearningStore.persist.rehydrate();
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // On small screens default to sidebar closed (but not collapsed  mini still shows)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  if (!mounted) return null;

  // Show full sidebar: explicitly open AND not collapsed
  const showFull = sidebarOpen && !sidebarCollapsed;
  // Show mini sidebar: collapsed (always, any screen size)
  const showMini = sidebarCollapsed;

  return (
    <div className="flex h-screen overflow-hidden bg-canvas theme-transition">

      {/* ── Full sidebar ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFull && (
          <motion.aside
            key="full"
            initial={{ x: -288, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -288, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed lg:relative z-40 h-full w-72 shrink-0"
          >
            <Sidebar />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Mini sidebar ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showMini && (
          <motion.aside
            key="mini"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 56, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-40 h-full shrink-0"
            style={{ width: 56, minWidth: 56 }}
          >
            <SidebarMini />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay for full sidebar */}
      <AnimatePresence>
        {showFull && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
