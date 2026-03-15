"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "client", type: "system", position: { x: 220, y: 20 }, data: { label: "Client", icon: "💻", color: "#3b82f6" } },
  { id: "cmd", type: "system", position: { x: 80, y: 140 }, data: { label: "Command Side", sublabel: "Write Model", icon: "✏️", color: "#ef4444", description: "Handles create/update/delete operations. Optimized for writes. Publishes events on changes." } },
  { id: "qry", type: "system", position: { x: 360, y: 140 }, data: { label: "Query Side", sublabel: "Read Model", icon: "🔍", color: "#10b981", description: "Handles read operations only. Denormalized, optimized for the specific query patterns needed." } },
  { id: "wdb", type: "database", position: { x: 80, y: 280 }, data: { label: "Write DB", type: "Normalized", color: "#ef4444" } },
  { id: "rdb", type: "database", position: { x: 360, y: 280 }, data: { label: "Read DB", type: "Denormalized", color: "#10b981" } },
  { id: "bus", type: "system", position: { x: 220, y: 280 }, data: { label: "Event Bus", sublabel: "Sync read model", icon: "📨", color: "#f59e0b" } },
];

const edges: Edge[] = [
  { id: "e1", source: "client", target: "cmd", label: "Commands", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e2", source: "client", target: "qry", label: "Queries", animated: true, style: { stroke: "#10b981", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e3", source: "cmd", target: "wdb", animated: true, style: { stroke: "#ef4444", strokeWidth: 1.5 } },
  { id: "e4", source: "cmd", target: "bus", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
  { id: "e5", source: "bus", target: "rdb", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
  { id: "e6", source: "qry", target: "rdb", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
];

const questions = [
  {
    question: "What problem does CQRS solve?",
    options: [
      "Database replication lag",
      "Read and write models have different requirements — CQRS separates them for independent optimization",
      "Circular dependency between microservices",
      "Network latency between services",
    ],
    correct: 1,
    explanation: "Read models need denormalized, precomputed data for fast queries. Write models need normalized data for integrity. CQRS lets you optimize each independently.",
  },
];

export default function CqrsContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-[#94a3b8]">
      <p className="text-base leading-relaxed">
        <strong className="text-[#f1f5f9]">CQRS (Command and Query Responsibility Segregation)</strong> is a pattern that separates read and write operations into different models. Commands (writes) go to one model; queries (reads) go to another, often optimized differently.
      </p>
      <p>
        The insight: read and write patterns are fundamentally different. Reads might need denormalized, aggregated views. Writes need normalized data for integrity. Trying to serve both with one model leads to compromises. CQRS lets you optimize each independently.
      </p>

      <InteractiveDiagram nodes={nodes} edges={edges} nodeTypes={nodeTypes} title="CQRS Architecture" description="Commands and queries use separate models and data stores" height={360} />

      <KeyTakeaway variant="important">
        CQRS is often combined with Event Sourcing: commands produce events, events update the write DB and project to read models. This creates an immutable audit trail and enables time-travel debugging.
      </KeyTakeaway>

      <KeyTakeaway variant="warning">
        CQRS adds significant complexity — separate models, eventual consistency between write and read DBs. Only use it when your read and write patterns are genuinely different at scale. For most apps, a single model is fine.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
