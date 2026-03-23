"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { CHAPTERS } from "@/lib/content";
import { useLearningStore, CHAPTER_TOPIC_SLUGS } from "@/lib/store";
import {
  ArrowRight, Network, Database, Layers, Shield,
  Rocket, Zap, BarChart2, BookOpen,
} from "lucide-react";
import { LogoIcon } from "@/components/ui/LogoIcon";

const CHAPTER_ICONS = [Network, Database, Layers, Shield, Rocket];
const CHAPTER_COLORS = ["#00D8FF", "#FF6B35", "#A855F7", "#FFD600", "#22C55E"];
const CHAPTER_BG = ["#00D8FF18", "#FF6B3518", "#A855F718", "#FFD60018", "#22C55E18"];

/* ── Ambient floating orb ─────────────────────────────────────────────────── */
function Orb({ color, size, x, y, delay, duration }: {
  color: string; size: number; x: string; y: string; delay: number; duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size, left: x, top: y,
        background: `radial-gradient(circle at 35% 35%, ${color}50, ${color}18, transparent 70%)`,
        filter: "blur(48px)",
      }}
      animate={{ y: [0, -28, 0], scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

/* ── 3D perspective grid floor ────────────────────────────────────────────── */
function GridFloor() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none overflow-hidden">
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,214,0,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,214,0,0.08) 1px, transparent 1px)
        `,
        backgroundSize: "52px 52px",
        transform: "perspective(380px) rotateX(68deg)",
        transformOrigin: "bottom center",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
      }} />
    </div>
  );
}

/* ── Small floating geometric ring ───────────────────────────────────────── */
function FloatingRing({ size, color, x, y, delay, duration }: {
  size: number; color: string; x: string; y: string; delay: number; duration: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      animate={{ y: [0, -20, 0], rotate: [0, 360] }}
      transition={{
        y: { duration: duration * 0.6, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration, repeat: Infinity, ease: "linear", delay }
      }}
    >
      <div style={{
        width: size, height: size,
        border: `1.5px solid ${color}40`,
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        boxShadow: `0 0 12px ${color}25, inset 0 0 8px ${color}15`,
      }} />
    </motion.div>
  );
}

/* ── 3D chapter card with mouse-tilt ──────────────────────────────────────── */
function ChapterCard({ chapter, idx, color, bg, pct }: {
  chapter: typeof CHAPTERS[0]; idx: number;
  color: string; bg: string; pct: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const Icon = CHAPTER_ICONS[idx];

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale3d(1.03,1.03,1.03) translateZ(16px)`;
    el.style.transition = "transform 0.08s ease";
  };

  const onMouseLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transform = `perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1) translateZ(0)`;
    el.style.transition = "transform 0.6s cubic-bezier(0.23,1,0.32,1)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 30, y: 70 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <div
        ref={wrapRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ transformStyle: "preserve-3d", transition: "transform 0.08s ease" }}
      >
        <Link
          href={`/chapter-${chapter.id}/${chapter.topics[0]?.slug ?? ""}`}
          className="group relative block rounded-2xl p-5"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--ui-border)",
            borderTop: `3px solid ${color}`,
            transition: "box-shadow 0.3s ease, background 0.2s ease, border-color 0.2s ease",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "var(--bg-elevated)";
            el.style.borderColor = `${color}60`;
            el.style.borderTopColor = color;
            el.style.boxShadow = `0 24px 64px ${color}20, 0 8px 24px rgba(0,0,0,0.5)`;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "var(--bg-surface)";
            el.style.borderColor = "var(--ui-border)";
            el.style.borderTopColor = color;
            el.style.boxShadow = "none";
          }}
        >
          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
            style={{ background: `linear-gradient(135deg, ${color}06 0%, transparent 50%, ${color}04 100%)` }}
          />

          <div className="flex items-start justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: bg, color }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className="font-mono font-black text-3xl leading-none transition-opacity duration-300"
              style={{ color, opacity: 0.12 }}
            >
              {String(chapter.id).padStart(2, "0")}
            </span>
          </div>

          <h3 className="font-heading font-bold text-base mb-1 leading-snug" style={{ color: "var(--ui-text)" }}>
            {chapter.title}
          </h3>
          <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--ui-text-2)" }}>
            {chapter.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 mr-3">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--bg-highlight)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <span className="font-mono text-[10px]" style={{ color }}>{pct}%</span>
            </div>
            <div className="flex items-center gap-1 shrink-0" style={{ color: "var(--ui-text-3)" }}>
              <span className="text-xs">{chapter.topics.length} topics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" style={{ color }} />
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Dashboard ────────────────────────────────────────────────────────────── */
export default function HomeClient() {
  const { completedTopics } = useLearningStore();
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => setMounted(true), []);

  /* Scroll-driven parallax on hero */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const allSlugs = Object.values(CHAPTER_TOPIC_SLUGS).flat();
  const completed = mounted ? allSlugs.filter(s => completedTopics.includes(s)).length : 0;
  const overallPct = allSlugs.length > 0 ? Math.round((completed / allSlugs.length) * 100) : 0;

  const chapterProgress = CHAPTERS.map(ch => {
    const slugs = CHAPTER_TOPIC_SLUGS[ch.id] || [];
    const done = mounted ? slugs.filter(s => completedTopics.includes(s)).length : 0;
    return slugs.length > 0 ? Math.round((done / slugs.length) * 100) : 0;
  });

  const stats = [
    { icon: BookOpen, value: "55", label: "Topics", color: "#00D8FF" },
    { icon: Layers, value: "5", label: "Chapters", color: "#A855F7" },
    { icon: Zap, value: "30+", label: "Diagrams", color: "#FFD600" },
    { icon: BarChart2, value: mounted ? `${overallPct}%` : "", label: "Progress", color: "#22C55E" },
  ];

  return (
    <div className="min-h-full">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex flex-col justify-center overflow-hidden px-6 lg:px-10"
        style={{ minHeight: "82vh" }}
      >
        {/* Ambient orbs */}
        <Orb color="#FFD600" size={520} x="-8%" y="-25%" delay={0} duration={7} />
        <Orb color="#A855F7" size={420} x="52%" y="-15%" delay={1.5} duration={9} />
        <Orb color="#00D8FF" size={300} x="74%" y="45%" delay={3} duration={8} />
        <Orb color="#22C55E" size={240} x="8%" y="55%" delay={2} duration={11} />

        {/* Floating rings */}
        <FloatingRing size={90} color="#FFD600" x="82%" y="12%" delay={0} duration={14} />
        <FloatingRing size={60} color="#A855F7" x="12%" y="20%" delay={2} duration={11} />
        <FloatingRing size={120} color="#00D8FF" x="68%" y="62%" delay={1} duration={18} />
        <FloatingRing size={50} color="#22C55E" x="30%" y="75%" delay={3} duration={13} />

        {/* 3D perspective grid floor */}
        <GridFloor />

        {/* Parallax content wrapper */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-5xl mx-auto w-full py-24"
        >
          {/* Logo + wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="flex items-center gap-4 mb-8"
          >
            <LogoIcon size={58} />
            <div>
              <div className="font-heading font-black text-xl leading-tight" style={{ color: "var(--ui-text)" }}>
                System Design
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "var(--ui-accent)" }}>
                ▊ Academy · v1.0
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-black leading-none tracking-tight mb-5"
            style={{ fontSize: "clamp(3.2rem, 10vw, 7.5rem)" }}
          >
            <span style={{ color: "var(--ui-text)" }}>MASTER</span>
            <br />
            <span style={{
              background: "linear-gradient(90deg, var(--ui-accent) 0%, var(--ui-accent-2) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              SYSTEM DESIGN
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base max-w-lg leading-relaxed mb-8"
            style={{ color: "var(--ui-text-2)" }}
          >
            55 interactive topics across 5 chapters. Diagrams, quizzes, and real-world
            case studies  all progress saved locally, no account needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/chapter-1/ip-addresses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm transition-all duration-200 hover:scale-105"
              style={{
                background: "var(--ui-accent)", color: "#000",
                boxShadow: "0 0 28px color-mix(in srgb, var(--ui-accent) 35%, transparent)",
              }}
            >
              {mounted && overallPct > 0 ? "Continue Learning" : "Start Learning"}
              <ArrowRight className="w-4 h-4" />
            </Link>

            {mounted && overallPct > 0 && (
              <div
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl"
                style={{
                  background: "color-mix(in srgb, var(--ui-accent) 8%, var(--bg-surface))",
                  border: "1px solid color-mix(in srgb, var(--ui-accent) 25%, transparent)",
                }}
              >
                <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-highlight)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${overallPct}%`,
                      background: "linear-gradient(90deg, var(--ui-accent), var(--ui-accent-2))",
                    }}
                  />
                </div>
                <span className="font-mono text-sm font-bold" style={{ color: "var(--ui-accent)" }}>
                  {overallPct}%
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--ui-text-3)" }}>scroll</span>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, var(--ui-accent), transparent)" }}
          />
        </motion.div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-10 py-20 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-mono text-xs uppercase tracking-widest mb-6"
          style={{ color: "var(--ui-text-3)" }}
        >
          By the numbers
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ perspective: "900px" }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, rotateY: 80, scale: 0.8 }}
              whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 px-4 py-4 rounded-2xl"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--ui-border)",
                boxShadow: `inset 0 0 0 1px ${s.color}10`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${s.color}18`, color: s.color }}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono font-black text-xl leading-none" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--ui-text-3)" }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ CHAPTERS ══════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-10 pb-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--ui-text-3)" }}>
            Curriculum
          </span>
          <h2
            className="font-heading font-black mt-2 leading-none"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--ui-text)" }}
          >
            Five chapters.{" "}
            <span style={{
              background: "linear-gradient(90deg, var(--ui-accent), var(--ui-accent-2))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              One complete picture.
            </span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CHAPTERS.map((chapter, idx) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              idx={idx}
              color={CHAPTER_COLORS[idx]}
              bg={CHAPTER_BG[idx]}
              pct={chapterProgress[idx]}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
