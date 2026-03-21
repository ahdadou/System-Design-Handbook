"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode };

const nodes: Node[] = [
  { id: "lb", type: "system", position: { x: 220, y: 20 }, data: { label: "Load Balancer", icon: "⚖️", color: "#3b82f6" } },
  { id: "primary", type: "system", position: { x: 100, y: 150 }, data: { label: "Primary Node", sublabel: "Active  handles all traffic", icon: "✅", color: "#10b981", description: "Processes all writes and reads. If it fails, the secondary takes over automatically." } },
  { id: "secondary", type: "system", position: { x: 340, y: 150 }, data: { label: "Secondary Node", sublabel: "Standby  ready to take over", icon: "💤", color: "#f59e0b", description: "Continuously synced with primary. Ready to become primary within seconds if primary fails." } },
  { id: "storage", type: "system", position: { x: 220, y: 280 }, data: { label: "Shared Storage", sublabel: "or replicated state", icon: "🗄️", color: "#8b5cf6" } },
];

const edges: Edge[] = [
  { id: "e1", source: "lb", target: "primary", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e2", source: "lb", target: "secondary", style: { stroke: "#f59e0b", strokeWidth: 1.5, strokeDasharray: "6,4" } },
  { id: "e3", source: "primary", target: "storage", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e4", source: "secondary", target: "storage", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 1.5, strokeDasharray: "4,4" } },
  { id: "e5", source: "primary", target: "secondary", label: "heartbeat", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1, strokeDasharray: "3,3" }, labelStyle: { fill: "#475569", fontSize: 9 } },
];

const questions = [
  {
    question: "What is the difference between active-active and active-passive clustering?",
    options: [
      "Active-active = one node active at a time; active-passive = all nodes active",
      "Active-active = all nodes serving traffic; active-passive = one primary serves traffic, others are standbys",
      "They are the same concept",
      "Active-active is for databases; active-passive is for web servers",
    ],
    correct: 1,
    explanation: "Active-active: all nodes serve traffic simultaneously (better utilization, higher throughput). Active-passive: primary serves traffic, secondary stands by ready to take over on failure.",
  },
];

export default function ClusteringContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Clustering</strong> is the practice of running multiple server instances as a single logical unit to improve availability, fault tolerance, and performance. A cluster appears as one system to clients but is actually multiple cooperating machines.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
        <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30">
          <div className="font-bold text-c-success text-sm font-heading mb-2">Active-Active</div>
          <p className="text-xs text-txt-2">All nodes serve traffic simultaneously. Better resource utilization, automatic load distribution. If one fails, the others continue.</p>
          <p className="text-xs text-txt-3 mt-2">Used by: Web servers, stateless APIs, Redis Cluster</p>
        </div>
        <div className="p-4 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30">
          <div className="font-bold text-[#f59e0b] text-sm font-heading mb-2">Active-Passive</div>
          <p className="text-xs text-txt-2">One primary node handles all traffic. Secondary waits in standby. Failover is automatic when primary dies (via heartbeat detection).</p>
          <p className="text-xs text-txt-3 mt-2">Used by: Databases, stateful services, single-leader systems</p>
        </div>
      </div>

      <InteractiveDiagram nodes={nodes} edges={edges} nodeTypes={nodeTypes} title="Active-Passive Cluster" description="Primary handles traffic; secondary is on standby with heartbeat monitoring" height={340} />

      <KeyTakeaway variant="important">
        The hardest problem in clustering is "split-brain"  when the network partitions and two nodes both think they're the primary. This leads to data inconsistency. Solutions include quorum voting (majority must agree) and fencing (forcefully disabling the stale node).
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
