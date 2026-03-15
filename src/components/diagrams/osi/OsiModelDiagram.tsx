"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OSI_LAYERS = [
  { n: 7, name: "Application", color: "#3b82f6", protocols: ["HTTP", "FTP", "SMTP", "DNS", "SSH"], desc: "Provides network services to end-user applications. This is where you interact with the network — browsers, email clients, etc.", pdu: "Data" },
  { n: 6, name: "Presentation", color: "#06b6d4", protocols: ["SSL/TLS", "JPEG", "MPEG", "ASCII"], desc: "Translates data formats — encryption, compression, encoding. Ensures data is in a readable format for the application layer.", pdu: "Data" },
  { n: 5, name: "Session", color: "#8b5cf6", protocols: ["NetBIOS", "RPC", "SQL"], desc: "Manages sessions between applications. Establishes, maintains, and terminates connections between local and remote applications.", pdu: "Data" },
  { n: 4, name: "Transport", color: "#ec4899", protocols: ["TCP", "UDP", "SCTP"], desc: "End-to-end communication, segmentation, flow control, and error recovery. TCP provides reliability; UDP provides speed.", pdu: "Segment" },
  { n: 3, name: "Network", color: "#f59e0b", protocols: ["IP", "ICMP", "OSPF", "BGP"], desc: "Logical addressing (IP addresses) and routing packets across multiple networks to reach the destination.", pdu: "Packet" },
  { n: 2, name: "Data Link", color: "#ef4444", protocols: ["Ethernet", "WiFi", "ARP", "MAC"], desc: "Physical addressing (MAC addresses), error detection, and framing. Transfers data between adjacent network nodes.", pdu: "Frame" },
  { n: 1, name: "Physical", color: "#475569", protocols: ["USB", "Ethernet cable", "Fiber", "Radio"], desc: "Raw bit transmission over physical medium — cables, radio waves, optical fiber. Defines electrical/mechanical specs.", pdu: "Bit" },
];

export function OsiModelDiagram() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const runAnimation = () => {
    if (animating) return;
    setAnimating(true);
    let i = 7;
    const interval = setInterval(() => {
      setExpanded(i);
      i--;
      if (i < 1) { clearInterval(interval); setTimeout(() => { setExpanded(null); setAnimating(false); }, 500); }
    }, 400);
  };

  return (
    <div className="my-8 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-[#f1f5f9] font-heading text-sm">OSI Model — 7 Layers</h4>
          <p className="text-xs text-[#475569] mt-0.5">Click any layer to expand • Click 'Animate' to simulate data flow</p>
        </div>
        <button
          onClick={runAnimation}
          disabled={animating}
          className="px-3 py-1.5 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white text-xs rounded-lg transition-colors font-medium"
        >
          {animating ? "Animating..." : "▶ Animate Data Flow"}
        </button>
      </div>

      <div className="space-y-1">
        {OSI_LAYERS.map((layer) => (
          <motion.div
            key={layer.n}
            layout
            onClick={() => setExpanded(expanded === layer.n ? null : layer.n)}
            className="cursor-pointer rounded-xl overflow-hidden border transition-all"
            style={{
              borderColor: expanded === layer.n ? layer.color : "#1e293b",
              boxShadow: expanded === layer.n ? `0 0 12px ${layer.color}30` : "none",
            }}
            animate={expanded === layer.n ? { scale: 1.01 } : { scale: 1 }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ backgroundColor: expanded === layer.n ? `${layer.color}15` : "#111827" }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-heading shrink-0"
                style={{ backgroundColor: `${layer.color}30`, color: layer.color }}
              >
                {layer.n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#f1f5f9] font-heading">{layer.name}</div>
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  {layer.protocols.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                      style={{ backgroundColor: `${layer.color}20`, color: layer.color }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-[#475569] shrink-0 font-mono">{layer.pdu}</div>
            </div>
            <AnimatePresence>
              {expanded === layer.n && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 text-sm text-[#94a3b8] border-t border-[#1e293b]" style={{ backgroundColor: `${layer.color}08` }}>
                    {layer.desc}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
