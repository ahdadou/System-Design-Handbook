"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DATABASES: Record<string, { name: string; type: string; color: string; desc: string }[]> = {
  cp: [
    { name: "MongoDB", type: "CP", color: "#10b981", desc: "Sacrifices availability during partitions to maintain consistency" },
    { name: "HBase", type: "CP", color: "#10b981", desc: "Strongly consistent, may reject writes during network splits" },
    { name: "Zookeeper", type: "CP", color: "#10b981", desc: "Used for distributed coordination, prefers consistency" },
    { name: "Redis", type: "CP", color: "#10b981", desc: "Can be configured CP; single-node is always consistent" },
  ],
  ap: [
    { name: "Cassandra", type: "AP", color: "#8b5cf6", desc: "Always available; uses eventual consistency" },
    { name: "CouchDB", type: "AP", color: "#8b5cf6", desc: "Optimistic replication, prioritizes availability" },
    { name: "DynamoDB", type: "AP", color: "#8b5cf6", desc: "Highly available by default, eventual consistency" },
    { name: "Riak", type: "AP", color: "#8b5cf6", desc: "Designed for AP, configurable consistency levels" },
  ],
  ca: [
    { name: "PostgreSQL", type: "CA", color: "#3b82f6", desc: "ACID-compliant; assumes no network partitions in single-node" },
    { name: "MySQL", type: "CA", color: "#3b82f6", desc: "Traditional RDBMS, CA in single-node deployments" },
    { name: "Oracle", type: "CA", color: "#3b82f6", desc: "Strong ACID guarantees in non-distributed setup" },
  ],
};

export function CapTheoremDiagram() {
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;
  const offset = 35;

  const circles = {
    c: { cx: cx - offset * 0.6, cy: cy - offset, label: "Consistency", id: "c", desc: "Every read receives the most recent write" },
    a: { cx: cx + offset * 0.6, cy: cy - offset, label: "Availability", id: "a", desc: "Every request receives a response (not guaranteed latest)" },
    p: { cx: cx, cy: cy + offset * 0.8, label: "Partition\nTolerance", id: "p", desc: "System continues despite network partition failures" },
  };

  return (
    <div className="my-8 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Venn Diagram */}
        <div className="glass rounded-2xl p-6 border border-[#1e293b] flex-shrink-0">
          <h4 className="text-sm font-semibold text-[#f1f5f9] font-heading mb-4 text-center">CAP Theorem</h4>
          <svg width={size} height={size} className="mx-auto">
            {/* C circle */}
            <circle cx={circles.c.cx} cy={circles.c.cy} r={r}
              fill={highlighted === "cp" || highlighted === "ca" || highlighted === "c" ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.1)"}
              stroke="#3b82f6" strokeWidth="1.5" className="cursor-pointer transition-all"
              onClick={() => setHighlighted(highlighted === "c" ? null : "c")}
            />
            {/* A circle */}
            <circle cx={circles.a.cx} cy={circles.a.cy} r={r}
              fill={highlighted === "ap" || highlighted === "ca" || highlighted === "a" ? "rgba(139,92,246,0.25)" : "rgba(139,92,246,0.1)"}
              stroke="#8b5cf6" strokeWidth="1.5" className="cursor-pointer transition-all"
              onClick={() => setHighlighted(highlighted === "a" ? null : "a")}
            />
            {/* P circle */}
            <circle cx={circles.p.cx} cy={circles.p.cy} r={r}
              fill={highlighted === "cp" || highlighted === "ap" || highlighted === "p" ? "rgba(6,182,212,0.25)" : "rgba(6,182,212,0.1)"}
              stroke="#06b6d4" strokeWidth="1.5" className="cursor-pointer transition-all"
              onClick={() => setHighlighted(highlighted === "p" ? null : "p")}
            />
            {/* Labels */}
            <text x={circles.c.cx - 40} y={circles.c.cy - 55} fill="#3b82f6" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">Consistency</text>
            <text x={circles.a.cx + 5} y={circles.a.cy - 55} fill="#8b5cf6" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">Availability</text>
            <text x={circles.p.cx - 28} y={circles.p.cy + 75} fill="#06b6d4" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">Partition</text>
            <text x={circles.p.cx - 22} y={circles.p.cy + 90} fill="#06b6d4" fontSize="11" fontFamily="Space Grotesk" fontWeight="600">Tolerance</text>

            {/* Intersection labels */}
            <text x={cx - 60} y={cy + 25} fill="#f1f5f9" fontSize="10" fontFamily="Space Grotesk" fontWeight="700" className="cursor-pointer" onClick={() => setHighlighted("ca")}>CA</text>
            <text x={cx + 38} y={cy + 25} fill="#f1f5f9" fontSize="10" fontFamily="Space Grotesk" fontWeight="700" className="cursor-pointer" onClick={() => setHighlighted("ap")}>AP</text>
            <text x={cx - 8} y={cy - 42} fill="#f1f5f9" fontSize="10" fontFamily="Space Grotesk" fontWeight="700" className="cursor-pointer" onClick={() => setHighlighted("cp")}>CP</text>
          </svg>
        </div>

        {/* Database cards */}
        <div className="flex-1 space-y-4">
          {(["cp", "ap", "ca"] as const).map((type) => (
            <motion.div
              key={type}
              onClick={() => setHighlighted(highlighted === type ? null : type)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                highlighted === type
                  ? "border-[#3b82f6]/50 bg-[#3b82f6]/5"
                  : "border-[#1e293b] bg-[#111827] hover:border-[#1e293b]"
              }`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-sm font-heading" style={{
                  color: type === "cp" ? "#10b981" : type === "ap" ? "#8b5cf6" : "#3b82f6"
                }}>
                  {type.toUpperCase()}
                </span>
                <span className="text-xs text-[#475569]">
                  {type === "cp" ? "Consistent & Partition Tolerant" : type === "ap" ? "Available & Partition Tolerant" : "Consistent & Available"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {DATABASES[type].map((db) => (
                  <span
                    key={db.name}
                    className="text-xs px-2 py-1 rounded-lg font-mono"
                    style={{ backgroundColor: `${db.color}15`, color: db.color, border: `1px solid ${db.color}30` }}
                    title={db.desc}
                  >
                    {db.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#1a2332] rounded-xl border border-[#1e293b] text-xs text-[#94a3b8]">
        <strong className="text-[#f59e0b]">⚡ Key Insight:</strong> In distributed systems, network partitions are inevitable. Therefore, you must choose between Consistency and Availability during a partition. Most modern systems choose AP with tunable consistency levels.
      </div>
    </div>
  );
}
