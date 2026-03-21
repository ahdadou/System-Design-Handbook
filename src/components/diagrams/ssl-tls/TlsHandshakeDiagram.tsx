"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Lock } from "lucide-react";

type Dir = "ltr" | "rtl";

interface Step {
  label: string;
  sub?: string;
  dir: Dir;
  color: string;
  phase: string;
  desc: string;
}

const TLS_STEPS: Step[] = [
  { label: "ClientHello", sub: "TLS 1.3, cipher suites, random nonce", dir: "ltr", color: "#3b82f6", phase: "Negotiation", desc: "Browser sends supported TLS version (1.3), list of cipher suites it supports, and a random nonce." },
  { label: "ServerHello", sub: "Chosen cipher, server nonce", dir: "rtl", color: "#06b6d4", phase: "Negotiation", desc: "Server picks the best cipher suite (e.g. TLS_AES_256_GCM_SHA384), sends its own random nonce." },
  { label: "Certificate", sub: "Public key + CA signature chain", dir: "rtl", color: "#8b5cf6", phase: "Authentication", desc: "Server sends its certificate: public key + a chain of trust signed by a Certificate Authority (CA) like DigiCert." },
  { label: "Verify Cert", sub: "Check CA signature chain", dir: "ltr", color: "#8b5cf6", phase: "Authentication", desc: "Browser verifies the certificate against trusted CAs in its store. If valid, the server's identity is proven." },
  { label: "Key Exchange", sub: "ECDHE pre-master secret", dir: "ltr", color: "#f59e0b", phase: "Key Exchange", desc: "Both sides use Diffie-Hellman to derive the same session key without ever transmitting it. Eavesdroppers can't compute it." },
  { label: "Finished", sub: "Session keys established", dir: "rtl", color: "#10b981", phase: "Handshake Complete", desc: "Server sends 'Finished' encrypted with the new session key  proving it has the same key." },
  { label: "Finished", sub: "Handshake verified", dir: "ltr", color: "#10b981", phase: "Handshake Complete", desc: "Client confirms. Both sides now share symmetric keys. All further traffic is encrypted and authenticated." },
  { label: "Encrypted Data", sub: "AES-256-GCM", dir: "ltr", color: "#22c55e", phase: "Secure Channel", desc: "HTTPS traffic flows! Every byte is encrypted with symmetric keys. mTLS adds client certificate verification too." },
];

const PHASE_COLORS: Record<string, string> = {
  "Negotiation": "#3b82f6", "Authentication": "#8b5cf6",
  "Key Exchange": "#f59e0b", "Handshake Complete": "#10b981", "Secure Channel": "#22c55e",
};

const ROW = 52;
const HEADER = 64;
const CL = 14;
const SV = 86;

export function TlsHandshakeDiagram() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const cur = step >= 0 && step < TLS_STEPS.length ? TLS_STEPS[step] : null;
  const done = step >= TLS_STEPS.length;
  const diagramH = HEADER + TLS_STEPS.length * ROW + 24;

  useEffect(() => {
    if (!playing) return;
    if (step >= TLS_STEPS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), step === -1 ? 300 : 1400);
    return () => clearTimeout(t);
  }, [playing, step]);

  const reset = () => { setStep(-1); setPlaying(false); };

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--ui-border)", background: "var(--bg-surface)" }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--ui-border)", background: "var(--bg-elevated)" }}>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" style={{ color: "#10b981" }} />
          <span className="text-sm font-bold" style={{ color: "var(--ui-text)" }}>TLS 1.3 Handshake</span>
          <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: "#10b98115", color: "#10b981", border: "1px solid #10b98130" }}>1-RTT</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ color: "var(--ui-text-3)" }}><RotateCcw className="w-3.5 h-3.5" /></button>
          <button
            onClick={() => { if (done) { reset(); setTimeout(() => setPlaying(true), 60); } else setPlaying(p => !p); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: "#10b98118", color: "#10b981", border: "1px solid #10b98140" }}
          >
            {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {playing ? "Pause" : done ? "Replay" : step === -1 ? "Play" : "Resume"}
          </button>
        </div>
      </div>

      {/* Sequence diagram */}
      <div className="relative px-4 pt-3" style={{ height: diagramH }}>
        {/* Client node */}
        <div className="absolute flex flex-col items-center z-10" style={{ left: `${CL}%`, top: 0, transform: "translateX(-50%)" }}>
          <div className="w-14 h-10 rounded-xl flex items-center justify-center text-xl shadow" style={{ background: "#3b82f612", border: "2px solid #3b82f635" }}>💻</div>
          <span className="mt-1 text-[10px] font-bold" style={{ color: "var(--ui-text-2)" }}>Browser</span>
        </div>

        {/* Server node */}
        <div className="absolute flex flex-col items-center z-10" style={{ left: `${SV}%`, top: 0, transform: "translateX(-50%)" }}>
          <div className="w-14 h-10 rounded-xl flex items-center justify-center text-xl shadow" style={{ background: "#10b98112", border: "2px solid #10b98135" }}>🔒</div>
          <span className="mt-1 text-[10px] font-bold" style={{ color: "var(--ui-text-2)" }}>Server</span>
        </div>

        {/* Lifelines */}
        <div className="absolute" style={{ left: `${CL}%`, top: HEADER, bottom: 16, width: 2, transform: "translateX(-50%)", background: "linear-gradient(to bottom, #3b82f650, #3b82f615)" }} />
        <div className="absolute" style={{ left: `${SV}%`, top: HEADER, bottom: 16, width: 2, transform: "translateX(-50%)", background: "linear-gradient(to bottom, #10b98150, #10b98115)" }} />

        {/* Phase indicator at step 7  green glow on both lifelines */}
        {step >= 7 && (
          <motion.div className="absolute inset-x-0" style={{ top: HEADER + 7 * ROW, bottom: 16 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="absolute" style={{ left: `${CL}%`, top: 0, bottom: 0, width: 2, transform: "translateX(-50%)", background: "linear-gradient(to bottom, #22c55e80, #22c55e20)", boxShadow: "0 0 12px #22c55e" }} />
            <div className="absolute" style={{ left: `${SV}%`, top: 0, bottom: 0, width: 2, transform: "translateX(-50%)", background: "linear-gradient(to bottom, #22c55e80, #22c55e20)", boxShadow: "0 0 12px #22c55e" }} />
          </motion.div>
        )}

        {/* Arrows */}
        {TLS_STEPS.map((s, i) => {
          const visible = i <= step;
          const active = i === step;
          const completed = i < step;
          const isLtr = s.dir === "ltr";

          return (
            <div key={i} className="absolute" style={{ left: `${CL}%`, width: `${SV - CL}%`, top: HEADER + i * ROW, height: ROW }}>
              {visible && (
                <div className="relative h-full flex items-center">
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ width: "100%", left: isLtr ? 0 : undefined, right: isLtr ? undefined : 0, transformOrigin: isLtr ? "left center" : "right center" }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: completed ? 0.28 : 1 }}
                    transition={{ duration: 0.42, ease: "easeOut" }}
                  >
                    <div className="relative w-full" style={{ height: 2, background: s.color, boxShadow: active ? `0 0 10px ${s.color}90` : "none" }}>
                      <div className="absolute top-1/2 -translate-y-1/2" style={{
                        [isLtr ? "right" : "left"]: -1,
                        width: 0, height: 0,
                        borderTop: "5px solid transparent", borderBottom: "5px solid transparent",
                        [isLtr ? "borderLeft" : "borderRight"]: `8px solid ${s.color}`,
                      }} />
                    </div>
                  </motion.div>

                  {/* Label */}
                  <motion.div
                    className="absolute text-[10px] font-mono font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                    style={{ top: "50%", transform: "translateY(-100%)", marginTop: -2, left: isLtr ? "22%" : undefined, right: isLtr ? undefined : "22%", background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30`, opacity: completed ? 0.4 : 1 }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: completed ? 0.4 : 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >{s.label}</motion.div>

                  {s.sub && (
                    <motion.div
                      className="absolute text-[9px] font-mono whitespace-nowrap"
                      style={{ top: "50%", marginTop: 4, left: isLtr ? "22%" : undefined, right: isLtr ? undefined : "22%", color: s.color, opacity: completed ? 0.22 : 0.6 }}
                      initial={{ opacity: 0 }} animate={{ opacity: completed ? 0.22 : 0.6 }} transition={{ delay: 0.28 }}
                    >{s.sub}</motion.div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Description */}
      <div className="mx-4 mb-3 px-4 py-3 rounded-xl min-h-[68px] flex items-center gap-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--ui-border)" }}>
        <AnimatePresence mode="wait">
          {step === -1 ? (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm" style={{ color: "var(--ui-text-3)" }}>
              Press <strong style={{ color: "var(--ui-text-2)" }}>Play</strong> to watch the TLS 1.3 handshake  how HTTPS establishes a secure encrypted channel before any data is sent.
            </motion.p>
          ) : done ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Lock className="w-5 h-5 shrink-0" style={{ color: "#22c55e" }} />
              <p className="text-sm" style={{ color: "var(--ui-text-2)" }}>
                Secure channel established in 1-RTT (one round trip). TLS 1.3 improved on 1.2 by reducing to 1-RTT from 2-RTT. Session tickets allow 0-RTT resumption for returning connections.
              </p>
            </motion.div>
          ) : cur ? (
            <motion.div key={step} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
              <div className="shrink-0 px-2 py-1 rounded-md text-[10px] font-bold uppercase"
                style={{ background: `${PHASE_COLORS[cur.phase] || "#888"}18`, color: PHASE_COLORS[cur.phase] || "#888", border: `1px solid ${PHASE_COLORS[cur.phase] || "#888"}35` }}>
                {cur.phase}
              </div>
              <div>
                <div className="text-[11px] font-semibold mb-0.5" style={{ color: "var(--ui-text-3)" }}>Step {step + 1} / {TLS_STEPS.length}</div>
                <div className="text-sm" style={{ color: "var(--ui-text)" }}>{cur.desc}</div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 pb-4">
        {TLS_STEPS.map((_, i) => (
          <button key={i} onClick={() => { setPlaying(false); setStep(i); }}
            className="rounded-full transition-all duration-200"
            style={{ width: i === step ? 18 : 6, height: 6, background: i <= step ? "#10b981" : "var(--ui-border)" }} />
        ))}
      </div>
    </div>
  );
}
