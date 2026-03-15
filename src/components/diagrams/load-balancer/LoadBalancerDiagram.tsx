"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Node, Edge } from "@xyflow/react";
import { InteractiveDiagram } from "../InteractiveDiagram";
import { SystemNode } from "../CustomNodes";
import { motion } from "framer-motion";

const nodeTypes = { system: SystemNode };

const ALGORITHMS = [
  { id: "round-robin", label: "Round Robin", desc: "Requests distributed sequentially across all servers" },
  { id: "least-conn", label: "Least Connections", desc: "Request goes to server with fewest active connections" },
  { id: "weighted", label: "Weighted", desc: "Servers with higher weight receive more requests" },
  { id: "ip-hash", label: "IP Hash", desc: "Same client IP always routes to same server" },
];

const WEIGHTS = [3, 2, 1];

export function LoadBalancerDiagram() {
  const [algorithm, setAlgorithm] = useState("round-robin");
  const [requestCount, setRequestCount] = useState([0, 0, 0]);
  const [activeServer, setActiveServer] = useState<number | null>(null);
  const [connections, setConnections] = useState([2, 5, 1]);

  const sendRequest = useCallback(() => {
    let target = 0;
    if (algorithm === "round-robin") {
      const total = requestCount.reduce((a, b) => a + b, 0);
      target = total % 3;
    } else if (algorithm === "least-conn") {
      target = connections.indexOf(Math.min(...connections));
    } else if (algorithm === "weighted") {
      const rolls: number[] = [];
      WEIGHTS.forEach((w, i) => { for (let j = 0; j < w; j++) rolls.push(i); });
      const total = requestCount.reduce((a, b) => a + b, 0);
      target = rolls[total % rolls.length];
    } else if (algorithm === "ip-hash") {
      target = 1; // fixed for demo
    }

    setActiveServer(target);
    setRequestCount((prev) => {
      const next = [...prev];
      next[target]++;
      return next;
    });
    setConnections((prev) => {
      const next = [...prev];
      next[target]++;
      setTimeout(() => setConnections((p) => { const pp = [...p]; pp[target] = Math.max(0, pp[target] - 1); return pp; }), 1500);
      return next;
    });
    setTimeout(() => setActiveServer(null), 1200);
  }, [algorithm, requestCount, connections]);

  const nodes: Node[] = useMemo(() => [
    { id: "client", type: "system", position: { x: 0, y: 120 }, data: { label: "Client", sublabel: "User Request", icon: "👤", color: "#3b82f6" } },
    { id: "lb", type: "system", position: { x: 220, y: 120 }, data: { label: "Load Balancer", sublabel: algorithm.replace("-", " "), icon: "⚖️", color: "#06b6d4", description: `Currently using: ${algorithm.replace("-", " ")}` } },
    { id: "s1", type: "system", position: { x: 460, y: 20 }, data: { label: "Server 1", sublabel: `${requestCount[0]} reqs | ${connections[0]} conn`, icon: activeServer === 0 ? "🔥" : "🖥️", color: activeServer === 0 ? "#f59e0b" : "#10b981" } },
    { id: "s2", type: "system", position: { x: 460, y: 120 }, data: { label: "Server 2", sublabel: `${requestCount[1]} reqs | ${connections[1]} conn`, icon: activeServer === 1 ? "🔥" : "🖥️", color: activeServer === 1 ? "#f59e0b" : "#10b981" } },
    { id: "s3", type: "system", position: { x: 460, y: 220 }, data: { label: "Server 3", sublabel: `${requestCount[2]} reqs | ${connections[2]} conn`, icon: activeServer === 2 ? "🔥" : "🖥️", color: activeServer === 2 ? "#f59e0b" : "#10b981" } },
  ], [algorithm, requestCount, activeServer, connections]);

  const edges: Edge[] = useMemo(() => [
    { id: "e1", source: "client", target: "lb", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
    { id: "e2", source: "lb", target: "s1", animated: activeServer === 0, style: { stroke: activeServer === 0 ? "#f59e0b" : "#10b981", strokeWidth: activeServer === 0 ? 3 : 1.5 } },
    { id: "e3", source: "lb", target: "s2", animated: activeServer === 1, style: { stroke: activeServer === 1 ? "#f59e0b" : "#10b981", strokeWidth: activeServer === 1 ? 3 : 1.5 } },
    { id: "e4", source: "lb", target: "s3", animated: activeServer === 2, style: { stroke: activeServer === 2 ? "#f59e0b" : "#10b981", strokeWidth: activeServer === 2 ? 3 : 1.5 } },
  ], [activeServer]);

  return (
    <div className="my-8 space-y-4">
      {/* Algorithm selector */}
      <div className="flex flex-wrap gap-2 p-4 bg-[#111827] rounded-xl border border-[#1e293b]">
        <span className="text-xs text-[#475569] self-center mr-2">Algorithm:</span>
        {ALGORITHMS.map((alg) => (
          <button
            key={alg.id}
            onClick={() => { setAlgorithm(alg.id); setRequestCount([0, 0, 0]); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              algorithm === alg.id
                ? "bg-[#3b82f6] text-white"
                : "bg-[#1a2332] text-[#94a3b8] border border-[#1e293b] hover:border-[#3b82f6]/40"
            }`}
          >
            {alg.label}
          </button>
        ))}
        <p className="w-full text-xs text-[#475569] mt-1">
          {ALGORITHMS.find((a) => a.id === algorithm)?.desc}
        </p>
      </div>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Load Balancer Simulation"
        description="Click 'Send Request' to simulate traffic distribution"
        height={320}
      />

      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={sendRequest}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          Send Request →
        </motion.button>
        <div className="flex gap-4 text-xs">
          {requestCount.map((r, i) => (
            <div key={i} className={`px-3 py-1.5 rounded-lg border ${activeServer === i ? "border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b]" : "border-[#1e293b] bg-[#1a2332] text-[#94a3b8]"}`}>
              Server {i + 1}: {r} reqs
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
