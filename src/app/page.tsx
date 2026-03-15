"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { CHAPTERS } from "@/lib/content";
import { useLearningStore } from "@/lib/store";
import { ArrowRight, BookOpen, Zap, Network, Database, Layers, Shield, Rocket, Star, CheckCircle2, Play } from "lucide-react";

const CHAPTER_ICONS = [Network, Database, Layers, Shield, Rocket];
const CHAPTER_GRADIENTS = [
  "from-[#3b82f6] to-[#06b6d4]",
  "from-[#06b6d4] to-[#8b5cf6]",
  "from-[#8b5cf6] to-[#ec4899]",
  "from-[#f59e0b] to-[#ef4444]",
  "from-[#10b981] to-[#3b82f6]",
];

// Constellation background component
function ConstellationBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();

    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
      });
    }

    let animFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59, 130, 246, 0.6)";
        ctx.fill();
      });

      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animFrame = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", resizeCanvas);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function HomePage() {
  const { getChapterProgress, getOverallProgress } = useLearningStore();
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const overallProgress = mounted ? getOverallProgress() : 0;

  return (
    <div className="min-h-full">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-60" />
        {/* Constellation */}
        <div className="absolute inset-0">
          <ConstellationBg />
        </div>
        {/* Radial glow */}
        <div className="absolute inset-0 bg-radial-glow" />

        <motion.div
          style={{ y: heroY }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-full px-4 py-1.5 text-sm text-[#3b82f6] mb-6"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Learning Platform</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 font-heading leading-tight"
          >
            <span className="gradient-text">System Design</span>
            <br />
            <span className="text-[#f1f5f9]">Academy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-[#94a3b8] mb-8 max-w-2xl mx-auto"
          >
            Master system design through{" "}
            <span className="text-[#06b6d4]">interactive diagrams</span>,{" "}
            <span className="text-[#8b5cf6]">visual simulations</span>, and{" "}
            <span className="text-[#10b981]">hands-on experiments</span>.
            From networking fundamentals to real-world architectures.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/chapter-1/ip-addresses"
              className="group flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#3b82f6]/30"
            >
              <Play className="w-4 h-4" />
              Start Learning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/chapter-1"
              className="flex items-center gap-2 bg-[#1a2332] hover:bg-[#1e293b] border border-[#1e293b] text-[#94a3b8] hover:text-[#f1f5f9] px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              <BookOpen className="w-4 h-4" />
              Browse Chapters
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm"
          >
            {[
              { label: "Topics", value: "55" },
              { label: "Chapters", value: "5" },
              { label: "Diagrams", value: "30+" },
              { label: "Quizzes", value: "55+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold font-heading gradient-text">{stat.value}</div>
                <div className="text-[#475569] text-xs">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-[#1e293b] rounded-full flex items-start justify-center pt-2"
          >
            <div className="w-1 h-2 bg-[#3b82f6] rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Progress section (if started) */}
      {mounted && overallProgress > 0 && (
        <section className="px-4 py-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-[#3b82f6]/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-5 h-5 text-[#f59e0b]" />
              <h2 className="font-heading font-bold text-[#f1f5f9]">Continue Learning</h2>
              <span className="ml-auto text-lg font-bold text-[#3b82f6]">{overallProgress}%</span>
            </div>
            <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#8b5cf6] rounded-full"
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* Chapters Grid */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4 text-[#f1f5f9]">
            5 Chapters, 55 Topics
          </h2>
          <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
            A structured journey from networking fundamentals to designing real-world systems at scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAPTERS.map((chapter, idx) => {
            const Icon = CHAPTER_ICONS[idx];
            const gradient = CHAPTER_GRADIENTS[idx];
            const progress = mounted ? getChapterProgress(chapter.id) : 0;

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={`/chapter-${chapter.id}`}>
                  <div className="glass rounded-2xl p-6 border border-[#1e293b] hover:border-[#3b82f6]/40 transition-all duration-300 h-full cursor-pointer hover:shadow-lg hover:shadow-[#3b82f6]/10">
                    {/* Icon + Number */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-4xl font-bold font-heading text-[#1e293b] group-hover:text-[#1a2332] transition-colors">
                        0{chapter.id}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-heading font-bold text-[#f1f5f9] text-lg mb-2">
                      {chapter.title}
                    </h3>
                    <p className="text-[#94a3b8] text-sm mb-4 line-clamp-2">
                      {chapter.description}
                    </p>

                    {/* Topics count */}
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-xs text-[#475569]">{chapter.topics.length} topics</span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#475569]">Progress</span>
                        <span className="text-[#94a3b8]">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Start button */}
                    <div className="mt-4 flex items-center gap-1 text-xs text-[#475569] group-hover:text-[#3b82f6] transition-colors">
                      <span>{progress > 0 ? "Continue" : "Start"} Chapter</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features section */}
      <section className="px-4 py-16 bg-[#111827]/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold font-heading text-[#f1f5f9] mb-4">
              Learning, Reimagined
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Interactive Diagrams",
                desc: "Drag, zoom, and explore system architectures. Every concept has a live diagram you can interact with.",
              },
              {
                icon: "⚡",
                title: "Visual Simulations",
                desc: "Watch algorithms run in real-time. Toggle between strategies and see how data flows change.",
              },
              {
                icon: "🧠",
                title: "Knowledge Quizzes",
                desc: "Test your understanding with contextual quizzes at the end of every topic.",
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                desc: "Track your journey through all 55 topics with persistent progress saved locally.",
              },
              {
                icon: "🔗",
                title: "Real-World Cases",
                desc: "Design WhatsApp, Netflix, Uber, and Twitter from scratch with annotated architecture diagrams.",
              },
              {
                icon: "⌨️",
                title: "Keyboard Navigation",
                desc: "Navigate between topics with arrow keys. Built for speed learners.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-5 border border-[#1e293b] hover:border-[#3b82f6]/30 transition-colors"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-[#f1f5f9] mb-2 font-heading">{feature.title}</h3>
                <p className="text-sm text-[#94a3b8]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] py-8 px-4 text-center">
        <p className="text-[#475569] text-sm">
          Built for learning. Content based on{" "}
          <span className="text-[#3b82f6]">system design principles</span>.
        </p>
      </footer>
    </div>
  );
}
