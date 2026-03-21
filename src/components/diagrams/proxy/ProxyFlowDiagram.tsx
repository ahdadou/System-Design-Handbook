"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

type Mode = "forward" | "reverse";

interface FlowStep {
  from: string;
  to: string;
  label: string;
  color: string;
  desc: string;
}

const FORWARD_STEPS: FlowStep[] = [
  { from: "client", to: "proxy", label: "Request", color: "#3b82f6", desc: "Client sends request to the forward proxy. Client's real IP: 192.168.1.5" },
  { from: "proxy", to: "internet", label: "Forward", color: "#3b82f6", desc: "Proxy forwards using ITS IP (e.g. 203.0.113.1). The destination server never sees the client's IP." },
  { from: "internet", to: "proxy", label: "Response", color: "#10b981", desc: "Server responds to the proxy's IP address." },
  { from: "proxy", to: "client", label: "Deliver", color: "#10b981", desc: "Proxy forwards the response to the original client. Client's IP is hidden from the world." },
];

const REVERSE_STEPS: FlowStep[] = [
  { from: "client", to: "proxy", label: "Request", color: "#8b5cf6", desc: "Client sends request to your domain. It hits the reverse proxy  client doesn't know servers exist." },
  { from: "proxy", to: "server", label: "Route", color: "#8b5cf6", desc: "Proxy picks a backend server (load balancing, health check). Client never knows the real server IPs." },
  { from: "proxy", to: "proxy", label: "SSL Terminate", color: "#f59e0b", desc: "Proxy decrypts HTTPS here. Backend servers only handle plain HTTP  reducing their CPU load." },
  { from: "server", to: "proxy", label: "Response", color: "#10b981", desc: "Backend server responds to the proxy." },
  { from: "proxy", to: "client", label: "Deliver", color: "#10b981", desc: "Proxy returns the response to the client. Servers remain hidden, protected, and scalable." },
];

// Node positions for the flow
const FORWARD_NODES = {
  client: { x: 10, label: "Client", icon: "💻", color: "#3b82f6" },
  proxy: { x: 37, label: "Forward Proxy", icon: "🔀", color: "#3b82f6" },
  internet: { x: 65, label: "Internet / Server", icon: "🌐", color: "#64748b" },
};

const REVERSE_NODES = {
  client: { x: 8, label: "Client", icon: "💻", color: "#8b5cf6" },
  proxy: { x: 37, label: "Reverse Proxy", icon: "🛡️", color: "#8b5cf6" },
  server: { x: 70, label: "Server Pool", icon: "🖥️", color: "#10b981" },
};

function FlowArrow({ fromPct, toPct, label, color, active, completed }: {
  fromPct: number; toPct: number; label: string; color: string; active: boolean; completed: boolean;
}) {
  const isLtr = fromPct < toPct;
  const left = Math.min(fromPct, toPct);
  const width = Math.abs(toPct - fromPct);

  // Self-arrow (proxy to proxy for SSL termination)
  if (fromPct === toPct) {
    return (
      <motion.div
        className="absolute flex items-center justify-center"
        style={{ left: `${fromPct - 8}%`, width: "16%", top: "35%", height: 28 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: completed ? 0.35 : 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 py-1 rounded-lg text-[9px] font-bold"
          style={{ background: `${color}20`, color, border: `1px solid ${color}40`, boxShadow: active ? `0 0 12px ${color}60` : "none" }}>
          {label}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${left}%`, width: `${width}%` }}>
      <motion.div style={{ transformOrigin: isLtr ? "left center" : "right center" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: completed ? 0.3 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="relative w-full" style={{ height: 2, background: color, boxShadow: active ? `0 0 10px ${color}` : "none" }}>
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
        style={{ left: "30%", bottom: 4, background: `${color}15`, color, border: `1px solid ${color}30`, opacity: completed ? 0.35 : 1 }}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: completed ? 0.35 : 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        {label}
      </motion.div>
    </div>
  );
}

export function ProxyFlowDiagram() {
  const [mode, setMode] = useState<Mode>("forward");
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const steps = mode === "forward" ? FORWARD_STEPS : REVERSE_STEPS;
  const nodes = mode === "forward" ? FORWARD_NODES : REVERSE_NODES;
  const accentColor = mode === "forward" ? "#3b82f6" : "#8b5cf6";
  const cur = step >= 0 && step < steps.length ? steps[step] : null;
  const done = step >= steps.length;

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), step === -1 ? 300 : 1400);
    return () => clearTimeout(t);
  }, [playing, step, steps.length]);

  const reset = () => { setStep(-1); setPlaying(false); };

  // Map node name to x position
  const getX = (name: string) => (nodes as Record<string, { x: number }>)[name]?.x ?? 50;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--ui-border)", background: "var(--bg-surface)" }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b flex-wrap" style={{ borderColor: "var(--ui-border)", background: "var(--bg-elevated)" }}>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-canvas)" }}>
          {([["forward", "Forward Proxy"], ["reverse", "Reverse Proxy"]] as const).map(([m, lbl]) => (
            <button key={m} onClick={() => { setMode(m); reset(); }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={mode === m
                ? { background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}40` }
                : { color: "var(--ui-text-3)", border: "1px solid transparent" }}
            >{lbl}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ color: "var(--ui-text-3)" }}><RotateCcw className="w-3.5 h-3.5" /></button>
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

      {/* Diagram area */}
      <div className="relative px-6 py-6" style={{ height: 180 }}>
        {/* Nodes */}
        {Object.entries(nodes).map(([key, n]) => (
          <div key={key} className="absolute flex flex-col items-center gap-1"
            style={{ left: `${n.x + 4}%`, top: 16, transform: "translateX(-50%)" }}>
            <div className="w-12 h-10 rounded-xl flex items-center justify-center text-lg shadow"
              style={{ background: `${n.color}15`, border: `2px solid ${n.color}35` }}>
              {n.icon}
            </div>
            <span className="text-[9px] font-bold text-center leading-tight max-w-[60px]"
              style={{ color: "var(--ui-text-2)" }}>{n.label}</span>
          </div>
        ))}

        {/* Arrows */}
        <div className="absolute inset-x-6" style={{ top: 55, height: 40 }}>
          {steps.slice(0, step + 1).map((s, i) => (
            <FlowArrow key={i}
              fromPct={getX(s.from)} toPct={getX(s.to)}
              label={s.label} color={s.color}
              active={i === step} completed={i < step}
            />
          ))}
        </div>

        {/* IP badge  Forward proxy: show client IP hidden */}
        {mode === "forward" && step >= 1 && (
          <motion.div
            className="absolute bottom-3 right-4 text-[9px] px-2 py-1 rounded-md font-mono"
            style={{ background: "#10b98115", border: "1px solid #10b98135", color: "#10b981" }}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          >
            Server sees: 203.0.113.1 (proxy) ✓ not client IP
          </motion.div>
        )}
        {mode === "reverse" && step >= 1 && (
          <motion.div
            className="absolute bottom-3 right-4 text-[9px] px-2 py-1 rounded-md font-mono"
            style={{ background: "#8b5cf615", border: "1px solid #8b5cf635", color: "#8b5cf6" }}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          >
            Client sees: yourdomain.com ✓ not server IPs
          </motion.div>
        )}
      </div>

      {/* Step description */}
      <div className="mx-4 mb-3 px-4 py-3 rounded-xl min-h-[64px] flex items-center gap-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--ui-border)" }}>
        <AnimatePresence mode="wait">
          {step === -1 ? (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm" style={{ color: "var(--ui-text-3)" }}>
              Press <strong style={{ color: "var(--ui-text-2)" }}>Play</strong> to see how a {mode === "forward" ? "forward proxy hides the client" : "reverse proxy protects and routes to backend servers"}.
            </motion.p>
          ) : done ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <span className="text-lg">{mode === "forward" ? "🕵️" : "🛡️"}</span>
              <p className="text-sm" style={{ color: "var(--ui-text-2)" }}>
                {mode === "forward"
                  ? "Forward proxy: the internet never sees the client's real IP. Used for anonymity, VPNs, content filtering."
                  : "Reverse proxy: clients never see your server IPs. Handles load balancing, SSL termination, and protection."}
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
