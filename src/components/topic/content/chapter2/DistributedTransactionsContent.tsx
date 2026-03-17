"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "coord", type: "system", position: { x: 200, y: 20 }, data: { label: "Coordinator", sublabel: "Phase 1: Send PREPARE", icon: "🎯", color: "#3b82f6", description: "The coordinator drives the 2PC protocol. It sends PREPARE to all participants and waits for votes before committing." } },
  { id: "p1", type: "database", position: { x: 40, y: 160 }, data: { label: "Participant 1", type: "Order Service DB", color: "#10b981", description: "Locks resources and votes YES if it can commit, NO if it cannot." } },
  { id: "p2", type: "database", position: { x: 200, y: 160 }, data: { label: "Participant 2", type: "Inventory DB", color: "#10b981", description: "Locks resources and votes YES if it can commit, NO if it cannot." } },
  { id: "p3", type: "database", position: { x: 360, y: 160 }, data: { label: "Participant 3", type: "Payment DB", color: "#10b981", description: "Locks resources and votes YES if it can commit, NO if it cannot." } },
  { id: "commit", type: "system", position: { x: 200, y: 300 }, data: { label: "Phase 2: COMMIT / ROLLBACK", sublabel: "After all vote YES", icon: "✅", color: "#8b5cf6" } },
];

const edges: Edge[] = [
  { id: "e1", source: "coord", target: "p1", label: "PREPARE", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e2", source: "coord", target: "p2", label: "PREPARE", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e3", source: "coord", target: "p3", label: "PREPARE", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e4", source: "p1", target: "commit", label: "VOTE YES", style: { stroke: "#10b981", strokeWidth: 1.5 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e5", source: "p2", target: "commit", style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e6", source: "p3", target: "commit", label: "VOTE YES", style: { stroke: "#10b981", strokeWidth: 1.5 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
];

const questions = [
  {
    question: "What is the main problem with Two-Phase Commit (2PC)?",
    options: [
      "It requires all participants to use the same database engine",
      "The coordinator is a single point of failure that can leave participants blocked indefinitely",
      "It only supports two database participants, not more",
      "It does not guarantee atomicity across all participants",
    ],
    correct: 1,
    explanation: "In 2PC, if the coordinator crashes after sending PREPARE but before sending COMMIT, all participants are blocked in the 'prepared' state with locks held. They cannot proceed without hearing from the coordinator, causing indefinite blocking. This is the fundamental weakness of 2PC.",
  },
  {
    question: "In the Saga pattern, what is the role of a compensating transaction?",
    options: [
      "A transaction that runs in parallel to increase throughput",
      "A read-only transaction that verifies the saga completed successfully",
      "A transaction that undoes the effect of a previously completed step when a later step fails",
      "A transaction that retries a failed step automatically",
    ],
    correct: 2,
    explanation: "Sagas break a distributed transaction into a sequence of local transactions. If step N fails, compensating transactions are executed for steps N-1, N-2, etc. to undo their effects. For example, if payment fails after inventory was reserved, a compensation releases the reservation.",
  },
];

export default function DistributedTransactionsContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        A <strong className="text-txt">distributed transaction</strong> is one that spans multiple databases, services, or nodes and must either fully commit on all of them or fully roll back — preserving atomicity across a distributed boundary. This is one of the hardest problems in distributed systems.
      </p>
      <p className="text-sm leading-relaxed">
        In a microservices architecture, a single business operation (e.g., place an order) may write to the Order Service, deduct from the Inventory Service, and charge the Payment Service. All three must succeed or the system is in an inconsistent state.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Two-Phase Commit (2PC)"
        description="Coordinator sends PREPARE to all participants, waits for votes, then sends COMMIT or ROLLBACK"
        height={380}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Two-Phase Commit (2PC)</h2>
      <p className="text-sm leading-relaxed">
        2PC is the classic protocol for distributed atomicity. A coordinator node drives two phases:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">Phase 1: Prepare</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Coordinator sends PREPARE to all participants</li>
            <li>• Each participant locks resources and writes to its undo log</li>
            <li>• Each votes YES (can commit) or NO (must abort)</li>
            <li>• Participants wait, holding locks</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30">
          <div className="font-bold text-c-success text-sm font-heading mb-2">Phase 2: Commit or Rollback</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• If all voted YES → coordinator sends COMMIT</li>
            <li>• If any voted NO → coordinator sends ROLLBACK</li>
            <li>• Each participant applies the decision and releases locks</li>
            <li>• Participants acknowledge; coordinator logs completion</li>
          </ul>
        </div>
      </div>

      <KeyTakeaway variant="warning">
        The blocking problem: if the coordinator crashes after Phase 1, participants are stuck holding locks until the coordinator recovers. This can block for minutes or hours. Three-Phase Commit (3PC) adds a pre-commit phase to reduce blocking, but adds round-trips and still can't handle network partitions fully.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">The Saga Pattern</h2>
      <p className="text-sm leading-relaxed">
        The <strong className="text-txt">Saga pattern</strong> avoids distributed locks entirely by decomposing a distributed transaction into a sequence of local transactions, each publishing an event or message when it completes. If any step fails, compensating transactions undo the already-completed steps.
      </p>
      <div className="p-4 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 mt-2">
        <div className="font-bold text-accent text-sm font-heading mb-2">Example: Place Order Saga</div>
        <ol className="text-xs space-y-1 text-txt-2 list-none">
          {[
            { step: "1. Order Service creates order (status: PENDING)", comp: "→ compensate: cancel order" },
            { step: "2. Inventory Service reserves stock", comp: "→ compensate: release reservation" },
            { step: "3. Payment Service charges card", comp: "→ compensate: issue refund" },
            { step: "4. Order Service marks order CONFIRMED", comp: "" },
          ].map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent shrink-0">{s.step}</span>
              {s.comp && <span className="text-[#ef4444]">{s.comp}</span>}
            </li>
          ))}
        </ol>
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Choreography vs Orchestration</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30">
          <div className="font-bold text-accent-2 text-sm font-heading mb-2">Choreography</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Services react to events from other services</li>
            <li>• No central coordinator — fully decentralized</li>
            <li>• Pros: loose coupling, no single point of failure</li>
            <li>• Cons: hard to track saga state, debugging is difficult</li>
            <li>• Tools: Kafka, RabbitMQ, SNS/SQS</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30">
          <div className="font-bold text-[#f59e0b] text-sm font-heading mb-2">Orchestration</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• A central orchestrator tells each service what to do</li>
            <li>• Saga state is tracked in one place</li>
            <li>• Pros: easier to reason about, visible saga state</li>
            <li>• Cons: orchestrator becomes a coupling point</li>
            <li>• Tools: AWS Step Functions, Temporal, Conductor</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">2PC vs Sagas</h2>
      <div className="space-y-3">
        {[
          { aspect: "Consistency model", twopc: "Strong (ACID)", saga: "Eventual (BASE)", color: "#3b82f6" },
          { aspect: "Locking", twopc: "Holds locks across all participants", saga: "No distributed locks", color: "#06b6d4" },
          { aspect: "Failure handling", twopc: "Coordinator crash → blocking", saga: "Compensating transactions", color: "#8b5cf6" },
          { aspect: "Performance", twopc: "Higher latency (round-trips)", saga: "Lower latency (local commits)", color: "#10b981" },
          { aspect: "Best for", twopc: "Same-datacenter, same-team DBs", saga: "Microservices, cross-service flows", color: "#f59e0b" },
        ].map((row) => (
          <div key={row.aspect} className="p-3 rounded-lg border border-border-ui bg-surface flex gap-3">
            <div className="w-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
            <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
              <span className="font-semibold text-txt">{row.aspect}</span>
              <span className="text-txt-2">2PC: {row.twopc}</span>
              <span className="text-txt-2">Saga: {row.saga}</span>
            </div>
          </div>
        ))}
      </div>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
