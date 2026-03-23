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
  {
    question: "In a primary-replica replication setup, what happens if the primary database crashes?",
    options: [
      "All data is permanently lost",
      "The replicas stop accepting reads until the primary recovers",
      "A replica is promoted to become the new primary through a failover process",
      "Writes are automatically buffered in the application until the primary restarts",
    ],
    correct: 2,
    explanation: "When the primary fails, a failover process promotes one of the replicas to become the new primary. This can be automatic (using tools like Patroni for PostgreSQL or MHA for MySQL) or manual. The other replicas then replicate from the newly elected primary.",
  },
  {
    question: "What is the key trade-off between synchronous and asynchronous replication?",
    options: [
      "Synchronous replication is faster; asynchronous replication provides stronger consistency",
      "Synchronous replication ensures zero data loss but increases write latency; asynchronous is faster but risks data loss on primary failure",
      "Asynchronous replication blocks writes until all replicas acknowledge; synchronous does not",
      "There is no meaningful trade-off — synchronous replication is always better",
    ],
    correct: 1,
    explanation: "With synchronous replication the primary waits for at least one replica to confirm the write before acknowledging to the client — zero data loss but higher latency. Asynchronous replication acknowledges immediately and replicates in the background — lower latency but potential data loss if the primary crashes before replication completes.",
  },
  {
    question: "What is 'read-your-own-writes' consistency and why is it important?",
    options: [
      "A guarantee that any user can read data written by any other user immediately",
      "A guarantee that after a user writes data, their subsequent reads will reflect that write, even when reading from a replica",
      "A requirement that reads and writes go to the same server",
      "A feature that logs all read operations following a write for auditing",
    ],
    correct: 1,
    explanation: "Read-your-own-writes (also called read-after-write consistency) guarantees that after you write data, you will always see your own write when you subsequently read it. With async replication lag, reading from a replica immediately after a write may return stale data. Solutions include routing reads to the primary after a write, or using session-based routing.",
  },
  {
    question: "Which replication topology allows multiple nodes to accept writes simultaneously?",
    options: [
      "Primary-Replica (Master-Slave)",
      "Multi-Primary (Multi-Master)",
      "Cascading Replication",
      "Read-Replica Fanout",
    ],
    correct: 1,
    explanation: "Multi-primary (multi-master) replication allows writes to be accepted on multiple nodes simultaneously. This eliminates the write bottleneck of a single primary but introduces conflict resolution complexity when two nodes receive conflicting writes to the same record.",
  },
  {
    question: "What is cascading replication and when is it useful?",
    options: [
      "A replication method where data cascades into child tables automatically",
      "A topology where replicas replicate from other replicas rather than directly from the primary, reducing primary load",
      "A pattern where all replicas send their changes back to the primary",
      "A backup strategy that triggers replication only during low-traffic periods",
    ],
    correct: 1,
    explanation: "In cascading replication, Replica B replicates from Replica A instead of directly from the Primary. This reduces the replication fan-out load on the primary, which is useful when you have many replicas or geographically distributed nodes. The trade-off is increased replication lag for downstream replicas.",
  },
  {
    question: "A social media application routes all writes to the primary and all reads to replicas. A user posts a new photo and immediately navigates to their profile. What problem might they encounter?",
    options: [
      "The photo upload will fail due to the read-write split",
      "The user may not see their newly posted photo if the replica has not yet caught up with the primary",
      "The primary will block reads until all replicas are synchronized",
      "The replica will automatically request the latest data from the primary on each read",
    ],
    correct: 1,
    explanation: "This is the read-your-own-writes problem caused by replication lag. The write went to the primary, but the user's profile read goes to a replica that hasn't received the update yet. The fix is to route the user's own reads to the primary for a short window after a write, or to use a monotonic read guarantee.",
  },
  {
    question: "What does 'semi-synchronous replication' mean?",
    options: [
      "Replication that alternates between synchronous and asynchronous modes randomly",
      "The primary waits for at least one replica to acknowledge the write, then proceeds without waiting for others",
      "A replication mode where only 50% of writes are replicated",
      "Replication that occurs at fixed time intervals rather than continuously",
    ],
    correct: 1,
    explanation: "Semi-synchronous replication is a middle ground: the primary waits for acknowledgment from at least one replica before confirming the write to the client, then the remaining replicas catch up asynchronously. This provides much stronger durability than pure async replication while limiting latency impact.",
  },
  {
    question: "How does replication differ from database backups?",
    options: [
      "Replication and backups are identical — both protect against the same failure modes",
      "Replication provides live copies of data for availability and read scaling, but replicates errors too; backups provide point-in-time recovery from mistakes",
      "Backups are faster to restore than replicas",
      "Replication requires more storage than backups",
    ],
    correct: 1,
    explanation: "Replication keeps live synchronized copies for high availability and read scaling, but it also replicates mistakes — if you accidentally DELETE a table, every replica replicates the DELETE. Backups capture point-in-time snapshots, allowing recovery from logical errors like accidental deletion. Production systems need both.",
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
