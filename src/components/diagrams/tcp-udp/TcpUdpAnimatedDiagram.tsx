"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

type Dir = "ltr" | "rtl";

interface Step {
  label: string;
  sub?: string;
  dir: Dir;
  color: string;
  dropped?: boolean;
  phase: string;
  desc: string;
}

const TCP_STEPS: Step[] = [
  { label: "SYN", sub: "seq=0", dir: "ltr", color: "#3b82f6", phase: "Handshake", desc: "Client sends SYN  'I want to connect, starting at sequence 0'" },
  { label: "SYN-ACK", sub: "seq=0, ack=1", dir: "rtl", color: "#06b6d4", phase: "Handshake", desc: "Server responds  'I hear you, I'm at seq 0, expecting your byte 1'" },
  { label: "ACK", sub: "ack=1", dir: "ltr", color: "#10b981", phase: "Handshake", desc: "Client confirms  connection established. Both sides are synchronized." },
  { label: "DATA", sub: "seq=1, len=512B", dir: "ltr", color: "#10b981", phase: "Transfer", desc: "Client sends data segment. Server must acknowledge before more can be sent (sliding window)." },
  { label: "ACK", sub: "ack=2", dir: "rtl", color: "#10b981", phase: "Transfer", desc: "Server confirms receipt of segment 1, ready for segment 2." },
  { label: "DATA", sub: "seq=2  DROPPED", dir: "ltr", color: "#ef4444", dropped: true, phase: "Packet Loss", desc: "Segment dropped in transit! No ACK comes back  TCP's retransmit timer starts counting." },
  { label: "DATA", sub: "seq=2  RETRANSMIT", dir: "ltr", color: "#f59e0b", phase: "Recovery", desc: "Timer expired → TCP automatically retransmits. This is what 'reliable delivery' means." },
  { label: "ACK", sub: "ack=3", dir: "rtl", color: "#10b981", phase: "Transfer", desc: "All data delivered reliably. TCP guarantees every byte arrives, in order, without duplicates." },
];

const UDP_STEPS: Step[] = [
  { label: "PKT 1", dir: "ltr", color: "#f59e0b", phase: "Fire & Forget", desc: "Packet fires immediately  no handshake, no connection setup, no waiting." },
  { label: "PKT 2", dir: "ltr", color: "#f59e0b", phase: "Fire & Forget", desc: "Next packet sent without waiting for acknowledgment of packet 1." },
  { label: "PKT 3", dir: "ltr", color: "#ef4444", dropped: true, phase: "Dropped!", desc: "Packet 3 dropped in network  UDP never finds out. No retransmission." },
  { label: "PKT 4", dir: "ltr", color: "#f59e0b", phase: "Fire & Forget", desc: "Sender continues at full speed, unaware of the loss." },
  { label: "PKT 5", dir: "ltr", color: "#f59e0b", phase: "Fire & Forget", desc: "Notice: nothing coming back from the server. No ACKs  pure one-direction fire." },
  { label: "PKT 6", dir: "ltr", color: "#ef4444", dropped: true, phase: "Dropped!", desc: "Another drop. Application receives incomplete data  but for video/audio, that's OK." },
  { label: "PKT 7", dir: "ltr", color: "#f59e0b", phase: "Fire & Forget", desc: "Stream continues without pause. Low latency prioritized over reliability." },
  { label: "PKT 8", dir: "ltr", color: "#22c55e", phase: "Complete", desc: "6 of 8 packets delivered at maximum speed. Perfect for live video, gaming, DNS." },
];

const PHASE_COLORS: Record<string, string> = {
  "Handshake": "#3b82f6", "Transfer": "#10b981", "Packet Loss": "#ef4444",
  "Recovery": "#f59e0b", "Fire & Forget": "#f59e0b", "Dropped!": "#ef4444", "Complete": "#22c55e",
};

const ROW = 62;
const HEADER = 64;
const CL = 14; // client lifeline x%
const SV = 86; // server lifeline x%

export function TcpUdpAnimatedDiagram() {
  const [mode, setMode] = useState<"tcp" | "udp">("tcp");
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const steps = mode === "tcp" ? TCP_STEPS : UDP_STEPS;
  const cur = step >= 0 && step < steps.length ? steps[step] : null;
  const done = step >= steps.length;
  const tcpColor = "#3b82f6";
  const udpColor = "#f59e0b";
  const accentColor = mode === "tcp" ? tcpColor : udpColor;

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), step === -1 ? 300 : 1350);
    return () => clearTimeout(t);
  }, [playing, step, steps.length]);

  const reset = () => { setStep(-1); setPlaying(false); };
  const switchMode = (m: "tcp" | "udp") => { setMode(m); setStep(-1); setPlaying(false); };

  const diagramH = HEADER + steps.length * ROW + 24;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--ui-border)", background: "var(--bg-surface)" }}>
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b flex-wrap" style={{ borderColor: "var(--ui-border)", background: "var(--bg-elevated)" }}>
        {/* Mode tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-canvas)" }}>
          {(["tcp", "udp"] as const).map(m => (
            <button key={m} onClick={() => switchMode(m)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              style={mode === m
                ? { background: `${m === "tcp" ? tcpColor : udpColor}18`, color: m === "tcp" ? tcpColor : udpColor, border: `1px solid ${m === "tcp" ? tcpColor : udpColor}40` }
                : { color: "var(--ui-text-3)", border: "1px solid transparent" }}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        <span className="text-xs hidden sm:block" style={{ color: "var(--ui-text-3)" }}>
          {mode === "tcp" ? "Reliable, ordered, connection-oriented" : "Fast, connectionless, best-effort"}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button onClick={reset} title="Reset" className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ color: "var(--ui-text-3)" }}>
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (done) { reset(); setTimeout(() => setPlaying(true), 60); }
              else setPlaying(p => !p);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}40` }}
          >
            {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {playing ? "Pause" : done ? "Replay" : step === -1 ? "Play" : "Resume"}
          </button>
        </div>
      </div>

      {/* Sequence diagram */}
      <div className="relative px-4 pt-3" style={{ height: diagramH }}>

        {/* CLIENT node */}
        <div className="absolute flex flex-col items-center z-10" style={{ left: `${CL}%`, top: 0, transform: "translateX(-50%)" }}>
          <div className="w-14 h-10 rounded-xl flex items-center justify-center text-xl shadow" style={{ background: `${tcpColor}12`, border: `2px solid ${tcpColor}35` }}>💻</div>
          <span className="mt-1 text-[10px] font-bold" style={{ color: "var(--ui-text-2)" }}>Client</span>
        </div>

        {/* SERVER node */}
        <div className="absolute flex flex-col items-center z-10" style={{ left: `${SV}%`, top: 0, transform: "translateX(-50%)" }}>
          <div className="w-14 h-10 rounded-xl flex items-center justify-center text-xl shadow" style={{ background: `${accentColor}12`, border: `2px solid ${accentColor}35` }}>🖥️</div>
          <span className="mt-1 text-[10px] font-bold" style={{ color: "var(--ui-text-2)" }}>Server</span>
        </div>

        {/* Lifelines */}
        <div className="absolute" style={{ left: `${CL}%`, top: HEADER, bottom: 16, width: 2, transform: "translateX(-50%)", background: `linear-gradient(to bottom, ${tcpColor}50, ${tcpColor}15)` }} />
        <div className="absolute" style={{ left: `${SV}%`, top: HEADER, bottom: 16, width: 2, transform: "translateX(-50%)", background: `linear-gradient(to bottom, ${accentColor}50, ${accentColor}15)` }} />

        {/* Step arrows */}
        {steps.map((s, i) => {
          const visible = i <= step;
          const active = i === step;
          const completed = i < step;
          const isLtr = s.dir === "ltr";
          const arrowSpan = SV - CL; // % width
          const topY = HEADER + i * ROW + ROW / 2 - 1;

          return (
            <div key={i} className="absolute" style={{ left: `${CL}%`, width: `${arrowSpan}%`, top: HEADER + i * ROW, height: ROW }}>
              {visible && (
                <div className="relative h-full flex items-center">
                  {/* Arrow line */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{
                      width: s.dropped ? "55%" : "100%",
                      left: isLtr ? 0 : undefined,
                      right: isLtr ? undefined : 0,
                      transformOrigin: isLtr ? "left center" : "right center",
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: completed ? 0.3 : 1 }}
                    transition={{ duration: 0.42, ease: "easeOut" }}
                  >
                    <div className="relative w-full" style={{ height: 2, background: s.color, boxShadow: active ? `0 0 10px ${s.color}90` : "none" }}>
                      {/* Arrowhead */}
                      {!s.dropped && (
                        <div className="absolute top-1/2 -translate-y-1/2" style={{
                          [isLtr ? "right" : "left"]: -1,
                          width: 0, height: 0,
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                          [isLtr ? "borderLeft" : "borderRight"]: `8px solid ${s.color}`,
                        }} />
                      )}
                    </div>
                  </motion.div>

                  {/* Dropped X marker */}
                  {s.dropped && (
                    <motion.div
                      className="absolute flex items-center justify-center w-5 h-5 rounded-full font-bold text-xs z-10"
                      style={{ left: "calc(55% - 10px)", top: "50%", transform: "translateY(-50%)", background: "#ef444418", border: "1.5px solid #ef4444", color: "#ef4444" }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, opacity: completed ? 0.35 : 1 }}
                      transition={{ delay: 0.42 }}
                    >✕</motion.div>
                  )}

                  {/* Label pill */}
                  <motion.div
                    className="absolute text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md whitespace-nowrap"
                    style={{
                      top: "50%", transform: "translateY(-130%)", marginTop: -2,
                      left: isLtr ? "22%" : undefined, right: isLtr ? undefined : "22%",
                      background: `color-mix(in srgb, ${s.color} 22%, var(--bg-surface, #111))`,
                      color: s.color,
                      border: `1px solid ${s.color}60`,
                      opacity: completed ? 0.45 : 1,
                      letterSpacing: "0.02em",
                    }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: completed ? 0.45 : 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    {s.label}
                  </motion.div>

                  {/* Sub label */}
                  {s.sub && (
                    <motion.div
                      className="absolute text-[9px] font-mono whitespace-nowrap px-1.5 py-px rounded"
                      style={{
                        top: "10%", marginTop: 6,
                        left: isLtr ? "10%" : undefined, right: isLtr ? undefined : "22%",
                        color: s.color,
                        background: `color-mix(in srgb, ${s.color} 10%, var(--bg-surface, #111))`,
                        opacity: completed ? 0.3 : 0.85,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: completed ? 0.3 : 0.85 }}
                      transition={{ delay: 0.28 }}
                    >
                      {s.sub}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step description */}
      <div className="mx-4 mb-3 px-4 py-3 rounded-xl min-h-[68px] flex items-center gap-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--ui-border)" }}>
        <AnimatePresence mode="wait">
          {step === -1 ? (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm" style={{ color: "var(--ui-text-3)" }}>
              Press <strong style={{ color: "var(--ui-text-2)" }}>Play</strong> to watch the {mode === "tcp" ? "TCP 3-way handshake, data transfer, and automatic loss recovery" : "UDP fire-and-forget packet stream"} step by step.
            </motion.p>
          ) : done ? (
            <motion.div key="done" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
              <span className="text-lg">{mode === "tcp" ? "✅" : "⚡"}</span>
              <p className="text-sm" style={{ color: "var(--ui-text-2)" }}>
                {mode === "tcp"
                  ? "TCP delivered all data reliably  including automatic retransmission of the lost segment. Zero data loss."
                  : "UDP delivered 6 of 8 packets at maximum speed. 2 dropped silently. No retransmission, no delay."}
              </p>
            </motion.div>
          ) : cur ? (
            <motion.div key={step} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
              <div className="shrink-0 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide"
                style={{ background: `${PHASE_COLORS[cur.phase] || "#888"}18`, color: PHASE_COLORS[cur.phase] || "#888", border: `1px solid ${PHASE_COLORS[cur.phase] || "#888"}35` }}>
                {cur.phase}
              </div>
              <div>
                <div className="text-[11px] font-semibold mb-0.5" style={{ color: "var(--ui-text-3)" }}>Step {step + 1} / {steps.length}</div>
                <div className="text-sm" style={{ color: "var(--ui-text)" }}>{cur.desc}</div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 pb-4">
        {steps.map((_, i) => (
          <button key={i} onClick={() => { setPlaying(false); setStep(i); }}
            className="rounded-full transition-all duration-200 hover:opacity-80"
            style={{ width: i === step ? 18 : 6, height: 6, background: i <= step ? accentColor : "var(--ui-border)" }}
          />
        ))}
      </div>
    </div>
  );
}
