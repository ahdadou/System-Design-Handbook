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
  {
    question: "What is 'split-brain' in a clustered system?",
    options: [
      "A node running out of memory and crashing",
      "Two nodes both believing they are the primary due to a network partition",
      "A cluster splitting into smaller sub-clusters for performance",
      "A load balancer routing to a failed node",
    ],
    correct: 1,
    explanation: "Split-brain occurs when a network partition causes two nodes to both believe they are the primary, leading to conflicting writes and data corruption. Solutions include quorum (majority must agree) and fencing (STONITH).",
  },
  {
    question: "What is a 'heartbeat' in a clustered system?",
    options: [
      "A metric measuring server CPU usage",
      "A periodic signal nodes send to each other to confirm they are still alive",
      "A health check from the load balancer to backend servers",
      "A network packet used to measure latency",
    ],
    correct: 1,
    explanation: "A heartbeat is a periodic signal (usually sent every 1-5 seconds) that nodes exchange to confirm they are operational. If a node misses several heartbeats, the cluster initiates a failover procedure.",
  },
  {
    question: "What is 'quorum' in distributed cluster management?",
    options: [
      "The maximum number of nodes allowed in a cluster",
      "The minimum number of nodes that must agree for a decision to be valid",
      "The process of adding new nodes to a cluster",
      "A protocol for synchronizing data between nodes",
    ],
    correct: 1,
    explanation: "Quorum requires a majority of nodes (N/2 + 1) to agree before making cluster decisions. For example, in a 5-node cluster, 3 nodes must agree. This prevents split-brain by ensuring only one partition can form a quorum.",
  },
  {
    question: "Which clustering mode provides better resource utilization?",
    options: [
      "Active-passive, because standby nodes preserve resources",
      "Active-active, because all nodes handle traffic simultaneously",
      "They have identical resource utilization",
      "It depends on whether the cluster uses shared or distributed storage",
    ],
    correct: 1,
    explanation: "Active-active clusters utilize all nodes simultaneously, so you get full value from your hardware investment. Active-passive wastes the standby node's resources (it sits idle waiting for failover).",
  },
  {
    question: "What is 'failover' time in the context of an active-passive cluster?",
    options: [
      "The time it takes to add a new node to the cluster",
      "The time between a primary node failure and the secondary becoming fully operational",
      "The time required to replicate data between nodes",
      "The maximum uptime before a node must be restarted",
    ],
    correct: 1,
    explanation: "Failover time is the duration from when the primary node fails until the secondary node detects the failure (via missed heartbeats) and takes over. This typically ranges from seconds to minutes depending on configuration.",
  },
  {
    question: "What does STONITH stand for and why is it used in clusters?",
    options: [
      "Stateless Topology Over Network Infrastructure That Heals; used for auto-recovery",
      "Shoot The Other Node In The Head; used to forcefully disable a suspected failed node",
      "Synchronize Traffic On Node Infrastructure That Hibernates; used for load balancing",
      "Store The Output Node In The History; used for audit logging",
    ],
    correct: 1,
    explanation: "STONITH (Shoot The Other Node In The Head) is a fencing technique that forcefully powers off or isolates a suspected failed/split-brain node. This prevents a malfunctioning node from continuing to write data and corrupting the system.",
  },
  {
    question: "Which type of clustering is most suitable for a stateful database like PostgreSQL?",
    options: [
      "Active-active with no coordination",
      "Active-passive with one leader handling writes",
      "Random node selection without replication",
      "DNS round-robin across all nodes",
    ],
    correct: 1,
    explanation: "Stateful databases require coordinated writes to maintain consistency. Active-passive (primary-standby) clustering ensures only one node accepts writes at a time, while the standby replicates data and is ready to take over on failure.",
  },
  {
    question: "What is the role of a cluster coordinator service like Apache ZooKeeper or etcd?",
    options: [
      "Storing application data to reduce database load",
      "Managing distributed consensus, leader election, and cluster configuration",
      "Providing load balancing across cluster nodes",
      "Encrypting communication between cluster nodes",
    ],
    correct: 1,
    explanation: "ZooKeeper and etcd are distributed coordination services. They handle leader election, distributed locks, cluster membership, and configuration management. They use consensus algorithms (Paxos, Raft) to maintain consistent state across the cluster.",
  },
  {
    question: "In a Kubernetes cluster, what is the role of the control plane?",
    options: [
      "Running application workloads (pods) for end users",
      "Managing cluster state, scheduling pods, and handling API requests",
      "Providing network storage for persistent data",
      "Load balancing traffic between worker nodes",
    ],
    correct: 1,
    explanation: "The Kubernetes control plane manages the cluster: the API server handles requests, the scheduler assigns pods to nodes, and the controller manager ensures the desired state matches actual state. Worker nodes run the actual application workloads.",
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
