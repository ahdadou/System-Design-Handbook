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
  {
    question: "What happens in Phase 1 (Prepare) of Two-Phase Commit?",
    options: [
      "The coordinator sends COMMIT to all participants and they apply the changes",
      "The coordinator sends PREPARE to all participants, who lock resources and vote YES or NO on whether they can commit",
      "Participants independently decide whether to commit and notify the coordinator",
      "The coordinator rolls back all participants as a safety check before committing",
    ],
    correct: 1,
    explanation: "In Phase 1, the coordinator sends a PREPARE message to all participants. Each participant checks if it can commit (resources available, no constraint violations), writes to its undo log, acquires necessary locks, and votes YES or NO. After voting YES, a participant cannot unilaterally abort — it must wait for the coordinator's decision.",
  },
  {
    question: "What is the difference between Choreography and Orchestration in the Saga pattern?",
    options: [
      "Choreography uses a central coordinator; Orchestration uses event-driven, decentralized communication",
      "Choreography uses event-driven, decentralized reactions between services; Orchestration uses a central coordinator to direct each step",
      "Choreography is only for synchronous operations; Orchestration is only for asynchronous operations",
      "Choreography applies to databases; Orchestration applies to microservices",
    ],
    correct: 1,
    explanation: "In Choreography, each service reacts to events published by others — no central controller. In Orchestration, a central orchestrator (e.g., AWS Step Functions, Temporal) explicitly tells each service what to do next and tracks saga state. Choreography is more decoupled but harder to debug; Orchestration centralizes visibility but creates a coupling point.",
  },
  {
    question: "Why do distributed transactions not scale as well as local transactions?",
    options: [
      "Distributed transactions require more disk space than local transactions",
      "Distributed transactions require coordination protocols (2PC) with multiple network round-trips and cross-service locks, increasing latency and reducing throughput",
      "Distributed transactions can only run sequentially, never in parallel",
      "Distributed transactions are not supported by any database above 100GB",
    ],
    correct: 1,
    explanation: "Distributed transactions involve multiple network round-trips (PREPARE, vote, COMMIT/ROLLBACK) and hold locks across multiple databases simultaneously. Each additional participant adds latency proportional to the slowest node, and the lock hold time spans the entire 2PC protocol, reducing the system's ability to process concurrent requests.",
  },
  {
    question: "What is a compensating transaction in a Saga and why must it be idempotent?",
    options: [
      "A transaction that speeds up the saga; idempotency is not required",
      "A transaction that undoes a completed step; it must be idempotent because the compensating transaction itself might be retried on failure",
      "A transaction that verifies the saga state; idempotency ensures the check runs only once",
      "A transaction that replaces the failed step with an alternative action",
    ],
    correct: 1,
    explanation: "A compensating transaction reverses the effect of a previously committed step (e.g., issue a refund to undo a charge). It must be idempotent because the message broker or workflow engine may deliver or retry the compensation multiple times on failure. Executing an idempotent compensation twice produces the same result as once (e.g., a refund that checks 'already refunded' before proceeding).",
  },
  {
    question: "When would you prefer 2PC over the Saga pattern for a distributed transaction?",
    options: [
      "When the transaction spans services owned by different teams across different companies",
      "When all participants are within the same datacenter, use compatible databases, and you need strong ACID guarantees with immediate consistency",
      "When you need the highest possible write throughput across all services",
      "When the transaction involves more than 10 participant services",
    ],
    correct: 1,
    explanation: "2PC is most appropriate when participants are tightly coupled — same organization, same or compatible databases, low-latency network — and you need strong atomicity. Its blocking risk and latency cost are acceptable in these constrained environments. For loosely coupled microservices across teams or networks, Sagas are preferred.",
  },
  {
    question: "What is the 'outbox pattern' and why is it used with Sagas?",
    options: [
      "A pattern where completed saga steps are stored in an outbox table before being deleted",
      "A pattern that writes an event to a local database table atomically with the business operation, ensuring the event is reliably published even if the process crashes",
      "A pattern that routes saga messages through a central outbox service for logging",
      "A cache layer that temporarily stores saga state during choreography",
    ],
    correct: 1,
    explanation: "The outbox pattern solves the 'dual write' problem: you cannot atomically write to your database AND publish an event to a message broker. Instead, you write the event to an 'outbox' table in the same local transaction as the business data. A separate relay process reads the outbox and publishes events, guaranteeing at-least-once delivery even if the process crashes between the DB write and broker publish.",
  },
  {
    question: "In an e-commerce order flow using Sagas, the payment step fails after inventory was already reserved. What should happen?",
    options: [
      "The order is marked as failed and no further action is taken",
      "A compensating transaction releases the inventory reservation, and the order is cancelled",
      "The system retries the payment indefinitely until it succeeds",
      "The inventory remains reserved and the customer is notified to retry payment",
    ],
    correct: 1,
    explanation: "When the payment step fails, the Saga executes compensating transactions for all previously completed steps. The inventory reservation compensating transaction releases the reserved stock. Without this, the inventory would be permanently locked for an order that will never complete, preventing other customers from purchasing the item.",
  },
  {
    question: "What consistency model do Sagas provide, and what anomaly can they produce?",
    options: [
      "Strong consistency (ACID) — Sagas provide the same guarantees as local transactions",
      "Eventual consistency — Sagas can produce intermediate states where some steps have committed but others have not, visible to other services",
      "Linearizable consistency — all saga steps appear instantaneous to external observers",
      "Read-your-own-writes consistency — only the saga initiator sees intermediate states",
    ],
    correct: 1,
    explanation: "Sagas provide eventual consistency, not ACID isolation. Between the time step 1 commits and the compensating transaction runs after step 3 fails, other services can observe the partially completed state (e.g., inventory is reserved but no order is confirmed). This is called the 'lost update' or 'dirty read at the saga level' problem. Design sagas to tolerate and handle these intermediate states.",
  },
];

export default function DistributedTransactionsContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        A <strong className="text-txt">distributed transaction</strong> is one that spans multiple databases, services, or nodes and must either fully commit on all of them or fully roll back  preserving atomicity across a distributed boundary. This is one of the hardest problems in distributed systems.
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
            <li>• No central coordinator  fully decentralized</li>
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
