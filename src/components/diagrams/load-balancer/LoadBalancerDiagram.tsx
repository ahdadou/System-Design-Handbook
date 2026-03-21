"use client";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Node, Edge, EdgeProps, BaseEdge, getBezierPath } from "@xyflow/react";
import { InteractiveDiagram } from "../InteractiveDiagram";
import { SystemNode } from "../CustomNodes";
import { motion, AnimatePresence } from "framer-motion";

// ── Packet-animated edge ──────────────────────────────────────────────────────
function PacketEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, style, markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const [packets, setPackets] = useState<number[]>([]);
  // null = not yet initialized; we snapshot the current key on first render
  // so remounts with stale non-zero keys don't fire spurious packets
  const prevKey = useRef<number | null>(null);

  useEffect(() => {
    const tk = (data?.triggerKey as number) ?? 0;
    if (prevKey.current === null) {
      prevKey.current = tk; // initialise without firing
      return;
    }
    if (tk > prevKey.current) {
      prevKey.current = tk;
      const pid = Date.now();
      setPackets(p => [...p, pid]);
      setTimeout(() => setPackets(p => p.filter(x => x !== pid)), 700);
    }
  }, [data?.triggerKey]);

  const color = (data?.packetColor as string) || "#f59e0b";

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      {packets.map(pid => (
        <motion.circle
          key={pid}
          r={7}
          cx={0} cy={0}
          fill={color}
          style={{ filter: `drop-shadow(0 0 7px ${color})` }}
          initial={{ x: sourceX, y: sourceY, opacity: 0, scale: 0 }}
          animate={{ x: targetX, y: targetY, opacity: [0, 1, 1, 1, 0], scale: [0, 1.3, 1, 1, 0.8] }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

const nodeTypes = { system: SystemNode };
const edgeTypes = { packet: PacketEdge };

// ─────────────────────────────────────────────────────────────────────────────

const ALGORITHMS = [
  { id: "round-robin", label: "Round Robin",       desc: "Requests go to S1 → S2 → S3 → S1 … sequentially" },
  { id: "least-conn", label: "Least Connections",  desc: "Request goes to the server with fewest active connections" },
  { id: "weighted",   label: "Weighted",            desc: "Servers with higher weight receive more requests" },
  { id: "ip-hash",    label: "IP Hash",             desc: "Same client IP always routes to the same server" },
];

const WEIGHTS = [3, 2, 1];

function pickTarget(algo: string, counts: number[], conns: number[]): number {
  if (algo === "round-robin") return counts.reduce((a, b) => a + b, 0) % 3;
  if (algo === "least-conn")  return conns.indexOf(Math.min(...conns));
  if (algo === "weighted") {
    const rolls: number[] = [];
    WEIGHTS.forEach((w, i) => { for (let j = 0; j < w; j++) rolls.push(i); });
    return rolls[counts.reduce((a, b) => a + b, 0) % rolls.length];
  }
  return 1; // ip-hash fixed demo
}

const DEMO_COUNT = 6;
const DEMO_INTERVAL = 700;

export function LoadBalancerDiagram() {
  const [algorithm, setAlgorithm]     = useState("round-robin");
  const [requestCount, setRequestCount] = useState([0, 0, 0]);
  const [activeServer, setActiveServer] = useState<number | null>(null);
  const [connections, setConnections]   = useState([2, 5, 1]);
  const [triggerKeys, setTriggerKeys]   = useState([0, 0, 0]);
  const [isDemo, setIsDemo]             = useState(false);

  const countRef = useRef([0, 0, 0]);
  const connRef  = useRef([2, 5, 1]);
  useEffect(() => { countRef.current = requestCount; }, [requestCount]);
  useEffect(() => { connRef.current  = connections;  }, [connections]);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  // ── Auto-demo on algorithm change ──────────────────────────────────────────
  useEffect(() => {
    clearTimers();
    const lc = [0, 0, 0];
    const ln = [2, 5, 1];
    setRequestCount([...lc]);
    setConnections([...ln]);
    setActiveServer(null);
    setIsDemo(true);

    for (let i = 0; i < DEMO_COUNT; i++) {
      const t = setTimeout(() => {
        const target = pickTarget(algorithm, lc, ln);
        lc[target]++;
        ln[target]++;

        setActiveServer(target);
        setRequestCount([...lc]);
        setConnections([...ln]);
        setTriggerKeys(prev => { const n = [...prev]; n[target]++; return n; });

        const decay = setTimeout(() => {
          ln[target] = Math.max(0, ln[target] - 1);
          setConnections([...ln]);
        }, 900);
        timers.current.push(decay);

        if (i === DEMO_COUNT - 1) {
          const done = setTimeout(() => { setActiveServer(null); setIsDemo(false); }, 950);
          timers.current.push(done);
        }
      }, i * DEMO_INTERVAL + 150);
      timers.current.push(t);
    }
    return clearTimers;
  }, [algorithm, clearTimers]);

  // ── Manual send ────────────────────────────────────────────────────────────
  const sendRequest = useCallback(() => {
    clearTimers();
    setIsDemo(false);
    const target = pickTarget(algorithm, countRef.current, connRef.current);

    setActiveServer(target);
    setRequestCount(prev => { const n = [...prev]; n[target]++; return n; });
    setTriggerKeys(prev => { const n = [...prev]; n[target]++; return n; });
    setConnections(prev => {
      const n = [...prev];
      n[target]++;
      const t = setTimeout(() => setConnections(p => { const pp = [...p]; pp[target] = Math.max(0, pp[target] - 1); return pp; }), 1500);
      timers.current.push(t);
      return n;
    });
    const t = setTimeout(() => setActiveServer(null), 1200);
    timers.current.push(t);
  }, [algorithm, clearTimers]);

  // ── Nodes ──────────────────────────────────────────────────────────────────
  const nodes: Node[] = useMemo(() => [
    { id: "client", type: "system", position: { x: 0,   y: 120 }, data: { label: "Client",       sublabel: "User Request", icon: "👤", color: "#3b82f6" } },
    { id: "lb",     type: "system", position: { x: 220, y: 120 }, data: { label: "Load Balancer", sublabel: ALGORITHMS.find(a => a.id === algorithm)!.label, icon: "⚖️", color: "#06b6d4" } },
    { id: "s1",     type: "system", position: { x: 460, y: 20  }, data: { label: "Server 1", sublabel: `${requestCount[0]} reqs | ${connections[0]} conn`, icon: activeServer === 0 ? "🔥" : "🖥️", color: activeServer === 0 ? "#f59e0b" : "#10b981" } },
    { id: "s2",     type: "system", position: { x: 460, y: 120 }, data: { label: "Server 2", sublabel: `${requestCount[1]} reqs | ${connections[1]} conn`, icon: activeServer === 1 ? "🔥" : "🖥️", color: activeServer === 1 ? "#f59e0b" : "#10b981" } },
    { id: "s3",     type: "system", position: { x: 460, y: 220 }, data: { label: "Server 3", sublabel: `${requestCount[2]} reqs | ${connections[2]} conn`, icon: activeServer === 2 ? "🔥" : "🖥️", color: activeServer === 2 ? "#f59e0b" : "#10b981" } },
  ], [algorithm, requestCount, activeServer, connections]);

  // ── Edges ──────────────────────────────────────────────────────────────────
  const edges: Edge[] = useMemo(() => [
    { id: "e1", source: "client", target: "lb",
      type: "packet",
      data: { triggerKey: 0, packetColor: "#3b82f6" },
      animated: true,
      style: { stroke: "#3b82f6", strokeWidth: 2 },
    },
    { id: "e2", source: "lb", target: "s1",
      type: "packet",
      data: { triggerKey: triggerKeys[0], packetColor: "#f59e0b" },
      style: { stroke: activeServer === 0 ? "#f59e0b" : "#10b981", strokeWidth: activeServer === 0 ? 2.5 : 1.5 },
    },
    { id: "e3", source: "lb", target: "s2",
      type: "packet",
      data: { triggerKey: triggerKeys[1], packetColor: "#f59e0b" },
      style: { stroke: activeServer === 1 ? "#f59e0b" : "#10b981", strokeWidth: activeServer === 1 ? 2.5 : 1.5 },
    },
    { id: "e4", source: "lb", target: "s3",
      type: "packet",
      data: { triggerKey: triggerKeys[2], packetColor: "#f59e0b" },
      style: { stroke: activeServer === 2 ? "#f59e0b" : "#10b981", strokeWidth: activeServer === 2 ? 2.5 : 1.5 },
    },
  ], [activeServer, triggerKeys]);

  return (
    <div className="my-8 space-y-4">
      {/* Algorithm selector */}
      <div className="flex flex-wrap gap-2 p-4 bg-[#111827] rounded-xl border border-[#1e293b]">
        <span className="text-xs text-[#475569] self-center mr-2">Algorithm:</span>
        {ALGORITHMS.map((alg) => (
          <motion.button
            key={alg.id}
            onClick={() => setAlgorithm(alg.id)}
            whileTap={{ scale: 0.94 }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              algorithm === alg.id
                ? "bg-[#3b82f6] text-white shadow-[0_0_12px_#3b82f640]"
                : "bg-[#1a2332] text-[#94a3b8] border border-[#1e293b] hover:border-[#3b82f6]/40"
            }`}
          >
            {alg.label}
          </motion.button>
        ))}
        <div className="w-full flex items-center gap-2 mt-1">
          <AnimatePresence mode="wait">
            <motion.p key={algorithm} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.2 }} className="text-xs text-[#475569]">
              {ALGORITHMS.find(a => a.id === algorithm)?.desc}
            </motion.p>
          </AnimatePresence>
          <AnimatePresence>
            {isDemo && (
              <motion.span initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} className="text-[10px] px-2 py-0.5 rounded-full bg-[#06b6d4]/15 text-[#06b6d4] border border-[#06b6d4]/30 shrink-0">
                auto demo…
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        title="Load Balancer Simulation"
        description="Switch algorithms to auto-demo • Click 'Send Request' to send manually"
        height={320}
      />

      <div className="flex items-center gap-4 flex-wrap">
        <motion.button whileTap={{ scale: 0.95 }} onClick={sendRequest} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          Send Request →
        </motion.button>
        <div className="flex gap-3 text-xs flex-wrap">
          {requestCount.map((r, i) => (
            <motion.div key={i} animate={activeServer === i ? { scale: [1, 1.06, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}
              className={`px-3 py-1.5 rounded-lg border transition-all ${activeServer === i ? "border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b]" : "border-[#1e293b] bg-[#1a2332] text-[#94a3b8]"}`}>
              Server {i + 1}: {r} reqs
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
