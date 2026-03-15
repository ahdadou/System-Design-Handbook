"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type State = "closed" | "open" | "half-open";

export function CircuitBreakerDiagram() {
  const [state, setState] = useState<State>("closed");
  const [failures, setFailures] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [log, setLog] = useState<{ msg: string; ok: boolean }[]>([]);
  const threshold = 3;

  const addLog = (msg: string, ok: boolean) => {
    setLog((prev) => [{ msg, ok }, ...prev].slice(0, 8));
  };

  const sendRequest = useCallback((forceSuccess?: boolean) => {
    const success = forceSuccess ?? Math.random() > 0.5;

    if (state === "open") {
      addLog("Request BLOCKED — circuit is OPEN", false);
      return;
    }

    if (success) {
      setSuccesses((s) => s + 1);
      if (state === "half-open") {
        setState("closed");
        setFailures(0);
        addLog("Request SUCCESS — circuit CLOSED again ✓", true);
      } else {
        addLog("Request SUCCESS", true);
      }
    } else {
      const newFailures = failures + 1;
      setFailures(newFailures);
      if (newFailures >= threshold) {
        setState("open");
        addLog(`Failure #${newFailures} — circuit OPENED! 🚨`, false);
        setTimeout(() => {
          setState("half-open");
          addLog("Timeout elapsed — circuit HALF-OPEN (testing...)", true);
        }, 3000);
      } else {
        addLog(`Failure #${newFailures}/${threshold}`, false);
      }
    }
  }, [state, failures]);

  const reset = () => {
    setState("closed");
    setFailures(0);
    setSuccesses(0);
    setLog([]);
  };

  const STATE_CONFIG = {
    closed: { color: "#10b981", label: "CLOSED", icon: "✅", desc: "Normal operation. Requests flow through." },
    open: { color: "#ef4444", label: "OPEN", icon: "🚨", desc: "Requests blocked. Service recovering." },
    "half-open": { color: "#f59e0b", label: "HALF-OPEN", icon: "⚠️", desc: "Testing one request. If OK, close circuit." },
  };

  const cfg = STATE_CONFIG[state];

  return (
    <div className="my-8 space-y-4">
      {/* State diagram */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 bg-[#111827] rounded-xl border border-[#1e293b]">
        {(["closed", "half-open", "open"] as State[]).map((s, i) => {
          const c = STATE_CONFIG[s];
          const isActive = state === s;
          return (
            <div key={s} className="flex items-center gap-3">
              <motion.div
                animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={isActive ? { duration: 1, repeat: Infinity } : {}}
                className="w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center"
                style={{
                  borderColor: isActive ? c.color : c.color + "40",
                  backgroundColor: isActive ? c.color + "20" : "#0a0e17",
                  boxShadow: isActive ? `0 0 24px ${c.color}60` : "none",
                }}
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-[10px] font-bold mt-1 font-heading" style={{ color: c.color }}>{c.label}</span>
              </motion.div>
              {i < 2 && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[#475569] text-lg">→</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current state info */}
      <motion.div
        key={state}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl border"
        style={{ borderColor: cfg.color + "40", backgroundColor: cfg.color + "10" }}
      >
        <div className="font-semibold mb-1" style={{ color: cfg.color }}>State: {cfg.label}</div>
        <p className="text-xs text-[#94a3b8]">{cfg.desc}</p>
        {state !== "open" && (
          <div className="mt-2 text-xs text-[#475569]">
            Failures: {failures}/{threshold} threshold
            <div className="h-1.5 bg-[#1e293b] rounded-full mt-1 max-w-32">
              <div className="h-full bg-[#ef4444] rounded-full transition-all" style={{ width: `${(failures / threshold) * 100}%` }} />
            </div>
          </div>
        )}
      </motion.div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => sendRequest(true)}
          className="px-4 py-2 bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-xs rounded-lg font-medium hover:bg-[#10b981]/30 transition-colors"
        >
          Send ✓ Success
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => sendRequest(false)}
          className="px-4 py-2 bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] text-xs rounded-lg font-medium hover:bg-[#ef4444]/30 transition-colors"
        >
          Send ✗ Failure
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => sendRequest()}
          className="px-4 py-2 bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-[#3b82f6] text-xs rounded-lg font-medium hover:bg-[#3b82f6]/30 transition-colors"
        >
          Send Random
        </motion.button>
        <button onClick={reset} className="px-4 py-2 bg-[#1a2332] border border-[#1e293b] text-[#475569] text-xs rounded-lg hover:text-[#94a3b8] transition-colors">
          Reset
        </button>
      </div>

      {/* Log */}
      <div className="bg-[#0a0e17] rounded-xl border border-[#1e293b] p-4 max-h-40 overflow-y-auto">
        <div className="text-[10px] text-[#475569] mb-2 font-mono">// Request Log</div>
        <AnimatePresence>
          {log.length === 0 && <div className="text-xs text-[#475569] font-mono">No requests yet...</div>}
          {log.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 py-1 text-xs font-mono border-b border-[#1e293b] last:border-0"
            >
              <span className={entry.ok ? "text-[#10b981]" : "text-[#ef4444]"}>{entry.ok ? "✓" : "✗"}</span>
              <span className={entry.ok ? "text-[#94a3b8]" : "text-[#ef4444]/80"}>{entry.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
