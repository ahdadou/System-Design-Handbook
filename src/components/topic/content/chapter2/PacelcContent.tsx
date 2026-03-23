"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "start", type: "system", position: { x: 215, y: 20 }, data: { label: "Network Partition?", icon: "❓", color: "#06b6d4" } },
  { id: "yes", type: "system", position: { x: 70, y: 140 }, data: { label: "YES → PAC", sublabel: "Choose: Availability or Consistency", icon: "⚡", color: "#ef4444" } },
  { id: "no", type: "system", position: { x: 370, y: 140 }, data: { label: "NO → ELC", sublabel: "Choose: Latency or Consistency", icon: "✅", color: "#10b981" } },
  { id: "avail", type: "database", position: { x: 10, y: 290 }, data: { label: "Availability", type: "PA: Serve stale data", color: "#f59e0b" } },
  { id: "cons1", type: "database", position: { x: 160, y: 290 }, data: { label: "Consistency", type: "PC: Reject requests", color: "#3b82f6" } },
  { id: "latency", type: "database", position: { x: 320, y: 290 }, data: { label: "Low Latency", type: "EL: Eventual consistency", color: "#8b5cf6" } },
  { id: "cons2", type: "database", position: { x: 465, y: 290 }, data: { label: "Consistency", type: "EC: Synchronous writes", color: "#3b82f6" } },
];

const edges: Edge[] = [
  { id: "e1", source: "start", target: "yes", label: "Partition", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e2", source: "start", target: "no", label: "No Partition", animated: true, style: { stroke: "#10b981", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e3", source: "yes", target: "avail", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e4", source: "yes", target: "cons1", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e5", source: "no", target: "latency", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e6", source: "no", target: "cons2", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
];

const questions = [
  {
    question: "What problem does PACELC solve that the CAP theorem doesn't address?",
    options: [
      "PACELC adds Partition Tolerance as a new guarantee",
      "PACELC describes the latency vs consistency trade-off that exists even when no partition is occurring",
      "PACELC replaces Consistency with Correctness for clearer terminology",
      "PACELC applies only to cloud databases, while CAP applies to on-premise systems",
    ],
    correct: 1,
    explanation: "CAP only addresses behavior during a network partition. PACELC adds the 'Else' (no partition) scenario: even in normal operation, systems must choose between lower latency (by not waiting for all replicas to acknowledge) or strong consistency (by waiting). This is the trade-off that affects every request, not just during failures.",
  },
  {
    question: "DynamoDB is classified as PA/EL in PACELC. What does EL mean?",
    options: [
      "Eventually consistent Logging",
      "During normal operation (Else), it chooses Latency over strict Consistency",
      "External Locking for concurrent writes",
      "Elastic Load balancing for high availability",
    ],
    correct: 1,
    explanation: "EL means that when no partition exists, DynamoDB trades Consistency for low Latency. Writes are acknowledged quickly by a subset of nodes rather than waiting for all replicas, allowing stale reads in exchange for faster responses. Strong consistency is available but costs extra latency.",
  },
  {
    question: "What does PC/EC classification mean in PACELC?",
    options: [
      "During partitions, choose Consistency over Availability; during normal operation, choose Consistency over low Latency",
      "During partitions, choose Availability; during normal operation, choose low Latency",
      "The system is eventually consistent in all scenarios",
      "The system is partition-tolerant only in cloud environments",
    ],
    correct: 0,
    explanation: "PC/EC means: during a Partition, the system chooses Consistency (rejects requests rather than serving stale data); during normal operation (Else), it also chooses Consistency over low Latency (waits for all replicas to acknowledge writes). MongoDB and PostgreSQL with synchronous replication are examples of PC/EC systems.",
  },
  {
    question: "Who proposed the PACELC theorem and when?",
    options: [
      "Eric Brewer in 2000",
      "Seth Gilbert and Nancy Lynch in 2002",
      "Daniel Abadi in 2012",
      "Werner Vogels in 2007",
    ],
    correct: 2,
    explanation: "Daniel Abadi proposed the PACELC theorem in 2012 as an extension to Eric Brewer's CAP theorem. Abadi argued that CAP was incomplete because it only described behavior during network partitions, ignoring the ever-present latency vs. consistency trade-off during normal operation.",
  },
  {
    question: "In PACELC terms, why does choosing low latency (EL) inherently imply accepting weaker consistency?",
    options: [
      "Lower latency requires less powerful hardware that cannot maintain consistency",
      "To acknowledge a write quickly, the primary cannot wait for all replicas to confirm — some replicas may lag, creating temporary inconsistency",
      "Low-latency systems bypass the WAL, which is required for consistency",
      "EL systems use compression that introduces checksum errors",
    ],
    correct: 1,
    explanation: "When a system prioritizes low latency, it acknowledges writes to the client immediately after one or a few nodes confirm, without waiting for all replicas. Replicas that haven't received the update yet will serve stale data if read at that moment. Achieving full consistency requires waiting for all replicas, which adds the round-trip time of the slowest replica to every write.",
  },
  {
    question: "ZooKeeper is classified as PC/EC in PACELC. What practical implication does this have?",
    options: [
      "ZooKeeper will serve stale configuration data during a network partition to stay available",
      "ZooKeeper rejects reads and writes during a partition rather than return potentially inconsistent data, and adds latency to ensure all writes are durably committed before acknowledging",
      "ZooKeeper automatically switches to PA/EL mode when latency exceeds a threshold",
      "ZooKeeper replicates data with eventual consistency in all scenarios",
    ],
    correct: 1,
    explanation: "ZooKeeper is used for distributed coordination (locks, leader election, configuration). Stale data in these contexts could be catastrophic — a distributed lock that two nodes think they hold simultaneously is a correctness disaster. PC/EC means ZooKeeper will refuse to serve requests during partitions and incurs latency to ensure linearizable consistency in normal operation.",
  },
  {
    question: "Cassandra's tunable consistency allows a query to use consistency level QUORUM. How does this map to PACELC's latency-consistency spectrum?",
    options: [
      "QUORUM moves Cassandra from PA/EL toward PC/EC — higher consistency at the cost of higher latency",
      "QUORUM moves Cassandra from PC/EC toward PA/EL — lower consistency for lower latency",
      "QUORUM has no effect on latency, only on availability",
      "QUORUM is a partition-handling strategy, not related to the ELC trade-off",
    ],
    correct: 0,
    explanation: "By requiring a quorum of nodes to acknowledge a write or read, QUORUM adds latency (must wait for a majority) but provides stronger consistency (reads will always reflect the most recent quorum write). This shifts Cassandra from its default PA/EL position toward more consistency at the cost of latency — demonstrating that PACELC classifications describe defaults, not fixed behavior.",
  },
  {
    question: "What is the key insight PACELC adds compared to CAP for evaluating databases in real production systems?",
    options: [
      "PACELC adds geographic distribution as a new dimension",
      "PACELC captures that the latency-consistency trade-off exists on every request during normal operation, not just during rare network partitions",
      "PACELC proves that all distributed systems must choose availability over consistency",
      "PACELC introduces a fifth database property beyond CAP's three",
    ],
    correct: 1,
    explanation: "Network partitions are rare events. The latency-consistency trade-off in PACELC's 'Else' branch affects every single request in normal operation. This makes the EL vs EC trade-off far more impactful in practice than the partition-time CAP choice. PACELC gives engineers a more complete model for evaluating everyday database behavior.",
  },
  {
    question: "An online banking application requires that account balance reads always reflect the latest committed transaction. Which PACELC classification should the database have?",
    options: [
      "PA/EL — to ensure fast response times for customers",
      "PA/EC — available during partitions, consistent otherwise",
      "PC/EC — consistent during partitions and during normal operation",
      "PC/EL — consistent during partitions, but low latency otherwise",
    ],
    correct: 2,
    explanation: "A banking application requires linearizable reads (every read sees the latest write) at all times. PC/EC means: during partitions, reject requests rather than serve stale balances; during normal operation, wait for all replicas to confirm before acknowledging — ensuring every read reflects the latest committed state, at the cost of availability and latency.",
  },
  {
    question: "MongoDB's default configuration is classified as PC/EC. What happens to MongoDB during a network partition?",
    options: [
      "All nodes continue accepting writes independently and merge changes later",
      "Writes are rejected until the partition heals and a new primary is elected via Raft consensus",
      "MongoDB automatically switches to PA/EL mode to maintain availability",
      "MongoDB returns cached (potentially stale) reads from all nodes during the partition",
    ],
    correct: 1,
    explanation: "MongoDB uses a Raft-based consensus protocol for primary election. During a partition where the primary cannot communicate with a majority of the replica set, it steps down and stops accepting writes. This prevents split-brain (two primaries accepting conflicting writes) at the cost of write availability — a PC behavior.",
  },
];

export default function PacelcContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        The <strong className="text-txt">PACELC theorem</strong>, proposed by Daniel Abadi in 2012, extends the CAP theorem to describe trade-offs in distributed systems even when no network partition is occurring. CAP only captures failure behavior; PACELC captures normal operation as well.
      </p>
      <p className="text-sm leading-relaxed">
        The formula is: <strong className="text-txt">P → A|C, E → L|C</strong>. When a <strong className="text-txt">P</strong>artition occurs, choose <strong className="text-txt">A</strong>vailability or <strong className="text-txt">C</strong>onsistency. <strong className="text-txt">E</strong>lse (no partition), choose <strong className="text-txt">L</strong>atency or <strong className="text-txt">C</strong>onsistency.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="PACELC Decision Tree"
        description="Every distributed system must navigate two trade-offs: one during partitions, one during normal operation"
        height={360}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">CAP vs PACELC</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">CAP Theorem</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Formalized by Eric Brewer (2000)</li>
            <li>• Only addresses network partition behavior</li>
            <li>• Partition Tolerance is mandatory in distributed systems</li>
            <li>• Real choice: Consistency vs Availability (during failure)</li>
            <li>• Ignores the normal (no failure) operating case</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30">
          <div className="font-bold text-accent-2 text-sm font-heading mb-2">PACELC Theorem</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Extended by Daniel Abadi (2012)</li>
            <li>• Captures both failure AND normal operation</li>
            <li>• Adds latency as an explicit trade-off dimension</li>
            <li>• More accurate model for evaluating real database trade-offs</li>
            <li>• A system classified as PA/EL may still allow tunable consistency</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Real-World Database Classifications</h2>
      <div className="space-y-3">
        {[
          {
            db: "DynamoDB",
            classification: "PA/EL",
            color: "#f59e0b",
            desc: "Available during partitions (serves stale data). In normal operation, prioritizes low latency over strict consistency. Eventual consistency by default, with optional strong consistency at higher cost.",
          },
          {
            db: "Cassandra",
            classification: "PA/EL",
            color: "#8b5cf6",
            desc: "Highly available during partitions using hinted handoff. Tunable consistency levels (ONE, QUORUM, ALL) let operators choose the latency-consistency balance per query. Defaults favor availability.",
          },
          {
            db: "MongoDB",
            classification: "PC/EC",
            color: "#10b981",
            desc: "Prefers consistency during partitions (primary election must complete before writes resume). In normal operation, write concerns and read preferences give consistency over latency.",
          },
          {
            db: "PostgreSQL / MySQL",
            classification: "PC/EC",
            color: "#3b82f6",
            desc: "Synchronous replication (when configured) ensures strong consistency. The ELC trade-off is clear: writes wait for replica acknowledgment, adding latency to guarantee durability and consistency.",
          },
          {
            db: "ZooKeeper / etcd",
            classification: "PC/EC",
            color: "#ef4444",
            desc: "Designed for coordination and consensus. Consistency is paramount  a stale read in a distributed lock manager would be catastrophic. Latency is sacrificed for linearizability.",
          },
        ].map((item) => (
          <div key={item.db} className="p-3 rounded-lg border border-border-ui bg-surface flex gap-3">
            <div className="w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-txt font-heading">{item.db}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: `${item.color}20`, color: item.color }}>{item.classification}</span>
              </div>
              <p className="text-xs text-txt-2">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        PACELC classifications are not fixed. Most modern databases offer tunable consistency (Cassandra's consistency levels, DynamoDB's strongly consistent reads). PA/EL vs PC/EC describes the default behavior. In interviews, say "X defaults to PA/EL but can be tuned toward consistency at the cost of latency."
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">Latency-Consistency Trade-off in Practice</h2>
      <p className="text-sm leading-relaxed">
        The EL vs EC trade-off is present in every write to a multi-node database. To achieve consistency (EC), the primary must wait for replicas to acknowledge the write before confirming to the client. This adds round-trip latency. To achieve low latency (EL), the primary acknowledges immediately and replicates in the background  but a crash before replication completes means data loss.
      </p>
      <ul className="space-y-2 text-sm mt-3">
        {[
          "Financial transactions, inventory management: use EC  the cost of stale data exceeds the latency penalty.",
          "Social media feeds, product recommendations: use EL  slight staleness is invisible to users, but latency spikes hurt engagement.",
          "Leaderboards, view counts: use EL  approximate values are acceptable and fast enough.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2 list-none">
            <span className="text-accent-2 shrink-0 mt-1">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
