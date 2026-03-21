"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Zap, AlertCircle } from "lucide-react";

type Mode = "hit" | "miss";

interface Step {
  from: number; // node index
  to: number;
  label: string;
  color: string;
  desc: string;
  timing?: string;
}

// Node layout: User(0) | CDN Edge(1) | Origin(2)
const NODES = [
  { label: "User", icon: "👤", color: "#06b6d4", x: 8 },
  { label: "CDN Edge", icon: "⚡", color: "#f59e0b", x: 46 },
  { label: "Origin Server", icon: "🏢", color: "#8b5cf6", x: 84 },
];

const MISS_STEPS: Step[] = [
  { from: 0, to: 1, label: "GET /video.mp4", color: "#06b6d4", desc: "User requests a video. Request hits the nearest CDN edge server in Frankfurt.", timing: "t=0ms" },
  { from: 1, to: 1, label: "Cache MISS", color: "#ef4444", desc: "Edge server checks its cache  not found! This is the first request for this file.", timing: "t=2ms" },
  { from: 1, to: 2, label: "Fetch from origin", color: "#8b5cf6", desc: "CDN must go all the way to the origin server in New York. This is the slow path.", timing: "t=4ms" },
  { from: 2, to: 1, label: "200 OK + content", color: "#8b5cf6", desc: "Origin serves the file to the CDN edge server.", timing: "t=154ms" },
  { from: 1, to: 1, label: "Cache FILL", color: "#f59e0b", desc: "Edge server caches the response locally with TTL. Next requests from this region will be fast.", timing: "t=155ms" },
  { from: 1, to: 0, label: "Deliver to user", color: "#10b981", desc: "User finally receives the file  160ms total (slow because of origin roundtrip).", timing: "t=160ms" },
];

const HIT_STEPS: Step[] = [
  { from: 0, to: 1, label: "GET /video.mp4", color: "#06b6d4", desc: "User requests the same file. Hits the same CDN edge in Frankfurt.", timing: "t=0ms" },
  { from: 1, to: 1, label: "Cache HIT ✓", color: "#10b981", desc: "Edge server finds it in cache  still within TTL! No need to contact origin.", timing: "t=2ms" },
  { from: 1, to: 0, label: "Deliver instantly", color: "#10b981", desc: "File served directly from cache. 8ms total vs 160ms. 20× faster  this is why CDNs exist.", timing: "t=8ms" },
];

function Arrow({ fromX, toX, label, color, active, completed, isSelf }: {
  fromX: number; toX: number; label: string; color: string;
  active: boolean; completed: boolean; isSelf: boolean;
}) {
  if (isSelf) {
    return (
      <motion.div
        className="absolute flex items-center justify-center"
        style={{ left: `${fromX - 9}%`, width: "18%", top: "30%" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: completed ? 0.35 : 1, scale: 1 }}
        transition={{ duration: 0.28 }}
      >
        <div className="px-2 py-1 rounded-lg text-[9px] font-bold text-center"
          style={{
            background: `${color}20`, color, border: `1px solid ${color}45`,
            boxShadow: active ? `0 0 14px ${color}70` : "none"
          }}>
          {label}
        </div>
      </motion.div>
    );
  }

  const isLtr = fromX < toX;
  const left = Math.min(fromX, toX) + 5;
  const width = Math.abs(toX - fromX) - 10;

  return (
    <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${left}%`, width: `${width}%` }}>
      <motion.div
        style={{ transformOrigin: isLtr ? "left center" : "right center" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: completed ? 0.28 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="relative w-full" style={{ height: 2, background: color, boxShadow: active ? `0 0 12px ${color}90` : "none" }}>
          <div className="absolute top-1/2 -translate-y-1/2" style={{
            [isLtr ? "right" : "left"]: -1,
            width: 0, height: 0,
            borderTop: "5px solid transparent", borderBottom: "5px solid transparent",
            [isLtr ? "borderLeft" : "borderRight"]: `8px solid ${color}`,
          }} />
        </div>
      </motion.div>
      <motion.div
        className="absolute text-[9px] font-mono font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
        style={{ left: "20%", bottom: 5, background: `${color}15`, color, border: `1px solid ${color}30`, opacity: completed ? 0.3 : 1 }}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: completed ? 0.3 : 1, y: 0 }}
        transition={{ delay: 0.16 }}
      >
        {label}
      </motion.div>
    </div>
  );
}

export function CdnCacheFlowDiagram() {
  const [mode, setMode] = useState<Mode>("miss");
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const steps = mode === "miss" ? MISS_STEPS : HIT_STEPS;
  const cur = step >= 0 && step < steps.length ? steps[step] : null;
  const done = step >= steps.length;
  const accentColor = mode === "miss" ? "#ef4444" : "#10b981";

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), step === -1 ? 300 : 1450);
    return () => clearTimeout(t);
  }, [playing, step, steps.length]);

  const reset = () => { setStep(-1); setPlaying(false); };

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--ui-border)", background: "var(--bg-surface)" }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b flex-wrap" style={{ borderColor: "var(--ui-border)", background: "var(--bg-elevated)" }}>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-canvas)" }}>
          {([["miss", "Cache MISS", "#ef4444"], ["hit", "Cache HIT", "#10b981"]] as const).map(([m, lbl, c]) => (
            <button key={m} onClick={() => { setMode(m); reset(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={mode === m
                ? { background: `${c}18`, color: c, border: `1px solid ${c}40` }
                : { color: "var(--ui-text-3)", border: "1px solid transparent" }}>
              {m === "miss" ? <AlertCircle className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {lbl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Latency badge */}
          <div className="text-xs px-2 py-1 rounded-md font-mono hidden sm:block"
            style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}>
            {mode === "miss" ? "~160ms" : "~8ms"} latency
          </div>
          <button onClick={reset} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ color: "var(--ui-text-3)" }}>
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { if (done) { reset(); setTimeout(() => setPlaying(true), 60); } else setPlaying(p => !p); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}40` }}
          >
            {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {playing ? "Pause" : done ? "Replay" : step === -1 ? "Play" : "Resume"}
          </button>
        </div>
      </div>

      {/* Diagram */}
      <div className="relative px-4 py-5" style={{ height: 170 }}>
        {/* Nodes */}
        {NODES.map((n, i) => (
          <div key={i} className="absolute flex flex-col items-center gap-1"
            style={{ left: `${n.x + 4}%`, top: 10, transform: "translateX(-50%)" }}>
            <div className="w-12 h-10 rounded-xl flex items-center justify-center text-lg shadow"
              style={{ background: `${n.color}15`, border: `2px solid ${n.color}35` }}>
              {n.icon}
            </div>
            <span className="text-[9px] font-bold" style={{ color: "var(--ui-text-2)" }}>{n.label}</span>
          </div>
        ))}

        {/* Origin server X'd out on cache HIT */}
        {mode === "hit" && (
          <motion.div
            className="absolute text-xs font-bold"
            style={{ left: `${NODES[2].x + 4}%`, top: 6, transform: "translateX(-50%)", color: "#ef4444", fontSize: 20 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ delay: 0.4 }}
          >✕</motion.div>
        )}

        {/* Connecting line showing geography */}
        <div className="absolute" style={{ left: "14%", right: "14%", top: 30, height: 1, background: "var(--ui-border)" }} />

        {/* Arrows */}
        <div className="absolute inset-x-4" style={{ top: 55, height: 44 }}>
          {steps.slice(0, step + 1).map((s, i) => (
            <Arrow key={`${mode}-${i}`}
              fromX={NODES[s.from].x} toX={NODES[s.to].x}
              label={s.label} color={s.color}
              active={i === step} completed={i < step}
              isSelf={s.from === s.to}
            />
          ))}
        </div>

        {/* Timing badge */}
        {cur?.timing && (
          <motion.div
            className="absolute bottom-2 left-4 text-[9px] px-2 py-1 rounded-md font-mono"
            style={{ background: `${cur.color}15`, color: cur.color, border: `1px solid ${cur.color}30` }}
            key={step}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {cur.timing}
          </motion.div>
        )}
      </div>

      {/* Description */}
      <div className="mx-4 mb-3 px-4 py-3 rounded-xl min-h-[64px] flex items-center gap-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--ui-border)" }}>
        <AnimatePresence mode="wait">
          {step === -1 ? (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm" style={{ color: "var(--ui-text-3)" }}>
              Press <strong style={{ color: "var(--ui-text-2)" }}>Play</strong> to see a {mode === "miss" ? "cache MISS  the slow first-request path that goes all the way to origin" : "cache HIT  the fast path served directly from the edge server"}.
            </motion.p>
          ) : done ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <span className="text-lg">{mode === "miss" ? "📦" : "⚡"}</span>
              <p className="text-sm" style={{ color: "var(--ui-text-2)" }}>
                {mode === "miss"
                  ? "Cache MISS: 160ms because we crossed the Atlantic to reach origin. But now the edge is warmed  future requests will be fast."
                  : "Cache HIT: 8ms because data came from the local edge server. 20× faster! This is why CDN cache-hit ratios matter."}
              </p>
            </motion.div>
          ) : cur ? (
            <motion.div key={step} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
              <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: `${cur.color}18`, color: cur.color, border: `1px solid ${cur.color}40` }}>
                {step + 1}
              </div>
              <p className="text-sm" style={{ color: "var(--ui-text)" }}>{cur.desc}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 pb-4">
        {steps.map((_, i) => (
          <button key={i} onClick={() => { setPlaying(false); setStep(i); }}
            className="rounded-full transition-all duration-200"
            style={{ width: i === step ? 18 : 6, height: 6, background: i <= step ? accentColor : "var(--ui-border)" }} />
        ))}
      </div>
    </div>
  );
}
