"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { DatabaseNode, SystemNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { database: DatabaseNode, system: SystemNode };

const masterSlaveNodes: Node[] = [
  { id: "app", type: "system", position: { x: 220, y: 20 }, data: { label: "Application", icon: "🔧", color: "#3b82f6" } },
  { id: "master", type: "database", position: { x: 220, y: 130 }, data: { label: "Primary", type: "Writes + Reads", color: "#3b82f6", description: "Handles all writes. Replicates changes to replicas. Can handle reads but usually offloaded." } },
  { id: "r1", type: "database", position: { x: 60, y: 260 }, data: { label: "Replica 1", type: "Read-only", color: "#10b981" } },
  { id: "r2", type: "database", position: { x: 220, y: 260 }, data: { label: "Replica 2", type: "Read-only", color: "#10b981" } },
  { id: "r3", type: "database", position: { x: 380, y: 260 }, data: { label: "Replica 3", type: "Read-only", color: "#10b981" } },
];

const msEdges: Edge[] = [
  { id: "e1", source: "app", target: "master", label: "Writes", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e2", source: "master", target: "r1", label: "Replicate", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e3", source: "master", target: "r2", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e4", source: "master", target: "r3", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e5", source: "r1", target: "app", label: "Reads", style: { stroke: "#10b981", strokeWidth: 1.5, strokeDasharray: "4,4" }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
];

const questions = [
  {
    question: "What is the main advantage of database replication?",
    options: [
      "Reduces storage costs",
      "Improves write performance",
      "High availability and read scalability",
      "Eliminates the need for backups",
    ],
    correct: 2,
    explanation: "Replication provides: (1) High availability  if primary fails, promote a replica. (2) Read scalability  distribute read traffic across multiple replicas.",
  },
  {
    question: "What is replication lag?",
    options: [
      "Network latency between client and database",
      "The delay between a write on the primary and its appearance on replicas",
      "Slow query execution time",
      "Time to restore from backup",
    ],
    correct: 1,
    explanation: "Replication lag is the delay between a write on the primary and when it appears on replicas. Async replication has more lag but doesn't slow writes. Sync replication has zero lag but every write waits for replicas.",
  },
];

export default function ReplicationContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Database replication</strong> maintains copies of data on multiple servers. When the primary database receives a write, it propagates the change to replica servers. This provides fault tolerance, read scalability, and geographic distribution.
      </p>

      <InteractiveDiagram nodes={masterSlaveNodes} edges={msEdges} nodeTypes={nodeTypes} title="Primary-Replica Replication" description="Writes go to primary, reads distributed across replicas" height={330} />

      <h2 className="text-2xl font-bold font-heading text-txt">Replication Modes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">Synchronous</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Primary waits for replica to confirm write</li>
            <li>• Zero data loss  replica always up to date</li>
            <li>• Higher write latency (must wait for all replicas)</li>
            <li>• Good for: financial data, critical writes</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30">
          <div className="font-bold text-c-success text-sm font-heading mb-2">Asynchronous</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Primary acknowledges write immediately</li>
            <li>• Replicas catch up in the background</li>
            <li>• Possible data loss if primary crashes before replication</li>
            <li>• Good for: analytics replicas, read scaling</li>
          </ul>
        </div>
      </div>

      <KeyTakeaway variant="important">
        Instagram uses MySQL primary-replica replication extensively. Reads (which are 90%+ of queries on social media) go to replicas. Only writes go to primary. This offloads massive read traffic and keeps the primary available for writes.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
