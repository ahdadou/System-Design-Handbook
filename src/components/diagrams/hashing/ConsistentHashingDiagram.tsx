"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ServerNode { id: string; angle: number; color: string; label: string; }
interface KeyItem { id: string; angle: number; label: string; server: string; }

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

function angleDiff(a: number, b: number) {
  const diff = ((b - a) % 360 + 360) % 360;
  return diff;
}

function findServer(servers: ServerNode[], keyAngle: number): string {
  if (servers.length === 0) return "none";
  const sorted = [...servers].sort((a, b) => a.angle - b.angle);
  const next = sorted.find((s) => s.angle >= keyAngle) || sorted[0];
  return next.id;
}

export function ConsistentHashingDiagram() {
  const [servers, setServers] = useState<ServerNode[]>([
    { id: "S1", angle: 60, color: COLORS[0], label: "Server A" },
    { id: "S2", angle: 160, color: COLORS[1], label: "Server B" },
    { id: "S3", angle: 280, color: COLORS[2], label: "Server C" },
  ]);
  const [keys, setKeys] = useState<KeyItem[]>([
    { id: "k1", angle: 20, label: "user:123", server: "" },
    { id: "k2", angle: 100, label: "post:456", server: "" },
    { id: "k3", angle: 200, label: "img:789", server: "" },
    { id: "k4", angle: 320, label: "sess:abc", server: "" },
  ]);
  const [virtualNodes, setVirtualNodes] = useState(false);

  const getUpdatedKeys = useCallback((srvs: ServerNode[]) => {
    return keys.map((k) => ({ ...k, server: findServer(srvs, k.angle) }));
  }, [keys]);

  const addServer = () => {
    if (servers.length >= 6) return;
    const angle = Math.floor(Math.random() * 360);
    const id = `S${servers.length + 1}`;
    const newServer = { id, angle, color: COLORS[servers.length], label: `Server ${String.fromCharCode(65 + servers.length)}` };
    setServers((prev) => [...prev, newServer]);
  };

  const removeServer = () => {
    if (servers.length <= 1) return;
    setServers((prev) => prev.slice(0, -1));
  };

  const updatedKeys = getUpdatedKeys(servers);

  const cx = 180, cy = 180, r = 140;

  function getPoint(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  const allVirtualNodes = virtualNodes
    ? servers.flatMap((s) =>
        [0, 120, 240].map((offset) => ({
          ...s,
          angle: (s.angle + offset) % 360,
          id: `${s.id}_v${offset}`,
          virtual: true,
        }))
      )
    : servers;

  return (
    <div className="my-8 space-y-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Ring visualization */}
        <div className="glass rounded-2xl p-6 border border-[#1e293b] flex-shrink-0">
          <svg width={cx * 2} height={cy * 2}>
            {/* Ring */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx={cx} cy={cy} r={r - 20} fill="rgba(10,14,23,0.8)" />

            {/* Virtual nodes */}
            {virtualNodes && allVirtualNodes.filter((n: any) => n.virtual).map((vn: any) => {
              const pt = getPoint(vn.angle, r);
              return (
                <circle key={vn.id} cx={pt.x} cy={pt.y} r={5}
                  fill={vn.color + "60"} stroke={vn.color} strokeWidth="1" strokeDasharray="2 2"
                />
              );
            })}

            {/* Key-to-server arcs */}
            {updatedKeys.map((k) => {
              const server = servers.find((s) => s.id === k.server);
              if (!server) return null;
              const kPt = getPoint(k.angle, r);
              const sPt = getPoint(server.angle, r - 20);
              return (
                <line key={k.id} x1={kPt.x} y1={kPt.y} x2={sPt.x} y2={sPt.y}
                  stroke={server.color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4"
                />
              );
            })}

            {/* Server nodes */}
            {servers.map((s) => {
              const pt = getPoint(s.angle, r);
              return (
                <g key={s.id}>
                  <circle cx={pt.x} cy={pt.y} r={14} fill={s.color + "25"} stroke={s.color} strokeWidth="2" />
                  <text x={pt.x} y={pt.y + 1} textAnchor="middle" dominantBaseline="middle" fill={s.color} fontSize="9" fontWeight="bold" fontFamily="Space Grotesk">
                    {s.id}
                  </text>
                </g>
              );
            })}

            {/* Key nodes */}
            {updatedKeys.map((k) => {
              const pt = getPoint(k.angle, r + 20);
              const server = servers.find((s) => s.id === k.server);
              return (
                <g key={k.id}>
                  <circle cx={pt.x} cy={pt.y} r={8} fill={server?.color + "20" || "#3b82f620"} stroke={server?.color || "#3b82f6"} strokeWidth="1.5" />
                  <text x={pt.x} y={pt.y + 16} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="Space Grotesk">
                    {k.label.split(":")[0]}
                  </text>
                </g>
              );
            })}

            {/* Center label */}
            <text x={cx} y={cy - 8} textAnchor="middle" fill="#475569" fontSize="10" fontFamily="Space Grotesk">Hash</text>
            <text x={cx} y={cy + 8} textAnchor="middle" fill="#475569" fontSize="10" fontFamily="Space Grotesk">Ring</text>
          </svg>
        </div>

        {/* Controls and info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={addServer}
              disabled={servers.length >= 6}
              className="px-3 py-2 bg-[#10b981] hover:bg-[#059669] disabled:opacity-40 text-white text-xs rounded-lg font-medium transition-colors"
            >
              + Add Server
            </button>
            <button
              onClick={removeServer}
              disabled={servers.length <= 1}
              className="px-3 py-2 bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-40 text-white text-xs rounded-lg font-medium transition-colors"
            >
              - Remove Server
            </button>
            <button
              onClick={() => setVirtualNodes(!virtualNodes)}
              className={`px-3 py-2 text-xs rounded-lg font-medium transition-colors border ${virtualNodes ? "bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6]" : "bg-[#1a2332] border-[#1e293b] text-[#94a3b8]"}`}
            >
              Virtual Nodes: {virtualNodes ? "ON" : "OFF"}
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-[#475569] font-medium uppercase tracking-wider">Key → Server Mapping</div>
            {updatedKeys.map((k) => {
              const server = servers.find((s) => s.id === k.server);
              return (
                <div key={k.id} className="flex items-center gap-3 p-2.5 bg-[#111827] rounded-lg border border-[#1e293b]">
                  <code className="text-xs text-[#06b6d4] font-mono flex-1">{k.label}</code>
                  <span className="text-[#475569] text-xs">→</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: server?.color + "20", color: server?.color }}>
                    {server?.label || "?"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#1a2332] rounded-lg border border-[#1e293b] text-xs text-[#94a3b8]">
            <strong className="text-[#8b5cf6]">Add/remove servers</strong> to see how only adjacent keys get remapped — not all keys!
          </div>
        </div>
      </div>
    </div>
  );
}
