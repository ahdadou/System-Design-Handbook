"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sun, Moon, LogOut, ChevronDown, User } from "lucide-react";
import { useLearningStore, CHAPTER_TOPIC_SLUGS } from "@/lib/store";
import { LoginModal } from "@/components/auth/LoginModal";

export function LandingNav() {
  const { darkMode, toggleDarkMode, isLoggedIn, logout } = useLearningStore();
  const completedTopics = useLearningStore(s => s.completedTopics);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const allSlugs = Object.values(CHAPTER_TOPIC_SLUGS).flat();
  const overallProgress = allSlugs.length > 0
    ? Math.round(allSlugs.filter(s => completedTopics.includes(s)).length / allSlugs.length * 100)
    : 0;

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    router.push("/chapter-1/ip-addresses");
  };

  return (
    <>
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <header
        className="sticky top-0 z-20 theme-transition"
        style={{
          background: "color-mix(in srgb, var(--bg-surface) 85%, transparent)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--ui-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--ui-accent) 0%, var(--ui-accent-2) 100%)" }}
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm" style={{ color: "var(--ui-text)" }}>
                System Design
              </span>
              <span className="mono-label ml-1.5" style={{ fontSize: "0.6rem" }}>Academy</span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {["Chapters", "Features"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                style={{ color: "var(--ui-text-2)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--ui-text)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-elevated)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--ui-text-2)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-all"
              style={{ color: "var(--ui-text-2)", border: "1px solid var(--ui-border)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-text-2)";
              }}
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

            {/* Auth area */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--ui-border)",
                    color: "var(--ui-text)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: "var(--ui-accent)" }}
                  >
                    D
                  </div>
                  <span className="hidden sm:inline">demo</span>
                  {overallProgress > 0 && (
                    <span
                      className="hidden sm:inline text-xs px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: "color-mix(in srgb, var(--ui-accent) 15%, transparent)", color: "var(--ui-accent)" }}
                    >
                      {overallProgress}%
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3" style={{ color: "var(--ui-text-3)" }} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1.5 w-52 rounded-xl overflow-hidden z-20 shadow-xl"
                        style={{
                          background: "var(--bg-surface)",
                          border: "1px solid var(--ui-border)",
                        }}
                      >
                        {/* Progress summary */}
                        <div className="p-3" style={{ borderBottom: "1px solid var(--ui-border)" }}>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span style={{ color: "var(--ui-text-2)" }}>Overall progress</span>
                            <span style={{ color: "var(--ui-accent)" }} className="font-semibold">{overallProgress}%</span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--bg-highlight)" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${overallProgress}%` }}
                              transition={{ duration: 0.6 }}
                              className="h-full rounded-full"
                              style={{ background: "linear-gradient(to right, var(--ui-accent), var(--ui-accent-2))" }}
                            />
                          </div>
                          <p className="text-[10px] mt-1" style={{ color: "var(--ui-text-3)" }}>
                            {allSlugs.filter(s => completedTopics.includes(s)).length} / {allSlugs.length} topics completed
                          </p>
                        </div>

                        {/* Continue */}
                        <Link
                          href="/chapter-1/ip-addresses"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm transition-colors"
                          style={{ color: "var(--ui-text)" }}
                          onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-elevated)"}
                          onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.background = "transparent"}
                        >
                          <User className="w-3.5 h-3.5" style={{ color: "var(--ui-text-3)" }} />
                          Continue Learning
                        </Link>

                        {/* Sign out */}
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors"
                          style={{ color: "var(--ui-danger)" }}
                          onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"}
                          onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "var(--ui-accent)" }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
