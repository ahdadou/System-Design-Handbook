"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Strategy = "write-through" | "write-around" | "write-back";

const STRATEGIES = {
  "write-through": {
    label: "Write-Through",
    color: "#3b82f6",
    desc: "Data is written to cache and DB simultaneously. Guarantees consistency but higher write latency.",
    steps: [
      { from: "client", to: "cache", label: "1. Write data", color: "#3b82f6" },
      { from: "cache", to: "db", label: "2. Sync write to DB", color: "#3b82f6" },
      { from: "db", to: "cache", label: "3. Confirm", color: "#10b981" },
      { from: "cache", to: "client", label: "4. Ack to client", color: "#10b981" },
    ],
  },
  "write-around": {
    label: "Write-Around",
    color: "#f59e0b",
    desc: "Data is written directly to DB, bypassing cache. Good for infrequently-read data. Cache populated on read.",
    steps: [
      { from: "client", to: "db", label: "1. Write directly to DB", color: "#f59e0b" },
      { from: "db", to: "client", label: "2. Confirm", color: "#10b981" },
      { from: "client", to: "cache", label: "3. Future read hits cache miss", color: "#ef4444" },
      { from: "cache", to: "db", label: "4. Cache fetches from DB", color: "#f59e0b" },
    ],
  },
  "write-back": {
    label: "Write-Back",
    color: "#8b5cf6",
    desc: "Data is written to cache only. DB is updated asynchronously later. Fast writes but risk of data loss.",
    steps: [
      { from: "client", to: "cache", label: "1. Write to cache only", color: "#8b5cf6" },
      { from: "cache", to: "client", label: "2. Instant ack", color: "#10b981" },
      { from: "cache", to: "db", label: "3. Async write to DB (later)", color: "#8b5cf660" },
    ],
  },
};

export function CachingDiagram() {
  const [strategy, setStrategy] = useState<Strategy>("write-through");
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [eviction, setEviction] = useState("LRU");

  const runAnimation = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(-1);
    const steps = STRATEGIES[strategy].steps;
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setCurrentStep(i);
    }
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentStep(-1);
    setIsRunning(false);
  }, [strategy, isRunning]);

  const s = STRATEGIES[strategy];
  const nodes = [
    { id: "client", label: "Client", icon: "👤", x: 60, y: 140 },
    { id: "cache", label: "Cache", icon: "⚡", x: 260, y: 140, sublabel: eviction },
    { id: "db", label: "Database", icon: "🗄️", x: 460, y: 140 },
  ];

  function getNodePos(id: string) {
    return nodes.find((n) => n.id === id) || { x: 0, y: 0 };
  }

  const activeStep = currentStep >= 0 ? s.steps[currentStep] : null;

  return (
    <div className="my-8 space-y-4">
      {/* Strategy selector */}
      <div className="flex flex-wrap gap-2 p-4 bg-[#111827] rounded-xl border border-[#1e293b]">
        {(Object.keys(STRATEGIES) as Strategy[]).map((k) => (
          <button
            key={k}
            onClick={() => { setStrategy(k); setCurrentStep(-1); setIsRunning(false); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
            style={{
              backgroundColor: strategy === k ? `${STRATEGIES[k].color}20` : "#1a2332",
              borderColor: strategy === k ? STRATEGIES[k].color : "#1e293b",
              color: strategy === k ? STRATEGIES[k].color : "#94a3b8",
            }}
          >
            {STRATEGIES[k].label}
          </button>
        ))}
        <div className="w-full text-xs text-[#94a3b8] mt-1">{s.desc}</div>
      </div>

      {/* SVG Diagram */}
      <div className="bg-[#0a0e17] rounded-xl border border-[#1e293b] p-4">
        <svg width="100%" viewBox="0 0 560 280" className="max-w-xl mx-auto">
          {/* Node boxes */}
          {nodes.map((node) => {
            const isActive = activeStep && (activeStep.from === node.id || activeStep.to === node.id);
            return (
              <g key={node.id}>
                <rect
                  x={node.x - 45} y={node.y - 30} width="90" height="60" rx="10"
                  fill={isActive ? `${s.color}20` : "#111827"}
                  stroke={isActive ? s.color : "#1e293b"}
                  strokeWidth={isActive ? 2 : 1}
                />
                <text x={node.x} y={node.y - 8} textAnchor="middle" fontSize="18">{node.icon}</text>
                <text x={node.x} y={node.y + 10} textAnchor="middle" fill="#f1f5f9" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">{node.label}</text>
                {node.sublabel && <text x={node.x} y={node.y + 25} textAnchor="middle" fill="#475569" fontSize="9">{node.sublabel}</text>}
              </g>
            );
          })}

          {/* Active flow arrow */}
          {activeStep && (() => {
            const from = getNodePos(activeStep.from);
            const to = getNodePos(activeStep.to);
            const mx = (from.x + to.x) / 2;
            const my = from.y - 50;
            return (
              <g>
                <motion.path
                  d={`M ${from.x + (from.x < to.x ? 45 : -45)} ${from.y} Q ${mx} ${my} ${to.x + (to.x < from.x ? 45 : -45)} ${to.y}`}
                  fill="none"
                  stroke={activeStep.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  markerEnd="url(#arrowBlue)"
                />
                <text x={mx} y={my - 8} textAnchor="middle" fill={activeStep.color} fontSize="10" fontFamily="Space Grotesk">
                  {activeStep.label}
                </text>
              </g>
            );
          })()}

          <defs>
            <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={activeStep?.color || "#3b82f6"} />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#475569] font-medium">Steps</span>
          <button
            onClick={runAnimation}
            disabled={isRunning}
            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
            style={{ backgroundColor: s.color, color: "white", opacity: isRunning ? 0.6 : 1 }}
          >
            {isRunning ? "Running..." : "▶ Run Animation"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {s.steps.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2.5 rounded-lg border text-xs transition-all"
              style={{
                borderColor: currentStep === i ? s.color : "#1e293b",
                backgroundColor: currentStep === i ? `${s.color}10` : "#111827",
                color: currentStep === i ? s.color : "#94a3b8",
              }}
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ backgroundColor: currentStep === i ? s.color : "#1e293b", color: currentStep === i ? "white" : "#475569" }}>
                {i + 1}
              </div>
              {step.label}
            </div>
          ))}
        </div>
      </div>

      {/* Eviction policies */}
      <div className="p-4 bg-[#111827] rounded-xl border border-[#1e293b]">
        <div className="text-xs font-medium text-[#f1f5f9] mb-3">Eviction Policies</div>
        <div className="flex flex-wrap gap-2">
          {["LRU", "LFU", "FIFO", "Random", "TTL"].map((policy) => (
            <button
              key={policy}
              onClick={() => setEviction(policy)}
              className={`px-3 py-1.5 text-xs rounded-lg border font-mono transition-all ${
                eviction === policy
                  ? "bg-[#3b82f6]/20 border-[#3b82f6] text-[#3b82f6]"
                  : "bg-[#1a2332] border-[#1e293b] text-[#475569] hover:border-[#3b82f6]/40"
              }`}
            >
              {policy}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
