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
      "Read and write models have different requirements  CQRS separates them for independent optimization",
      "Circular dependency between microservices",
      "Network latency between services",
    ],
    correct: 1,
    explanation: "Read models need denormalized, precomputed data for fast queries. Write models need normalized data for integrity. CQRS lets you optimize each independently.",
  },
  {
    question: "What does CQRS stand for?",
    options: [
      "Command Queue with Relational Storage",
      "Command Query Responsibility Segregation",
      "Centralized Query and Routing System",
      "Concurrent Query with Reliable Synchronization",
    ],
    correct: 1,
    explanation: "CQRS — Command Query Responsibility Segregation — separates the model used to handle write operations (commands that change state) from the model used to handle read operations (queries that return data). The pattern is named after Bertrand Meyer's 'Command Query Separation' principle, extended to the architectural level.",
  },
  {
    question: "In CQRS, what is a 'command'?",
    options: [
      "A read operation that returns data from the database",
      "An operation that changes system state (create, update, delete) and returns no data or only an acknowledgement",
      "A scheduled batch job that processes multiple operations",
      "A database query that locks rows during processing",
    ],
    correct: 1,
    explanation: "Commands are write operations: PlaceOrder, CancelPayment, UpdateProfile. They mutate state but typically return only success/failure. In strict CQRS, commands are one-way — they do not return domain data. This separation allows the write side to be optimized for consistency and integrity independently of reads.",
  },
  {
    question: "Why is the read model (query side) in CQRS typically denormalized?",
    options: [
      "Denormalization is required by the CQRS pattern specification",
      "Denormalized, precomputed views allow reads to be served from a single table or cache without expensive joins, optimizing query performance",
      "Normalization is too complex to implement on the read side",
      "The write side handles all normalization, so the read side doesn't need to",
    ],
    correct: 1,
    explanation: "Read patterns often need aggregated, joined data (e.g., 'show me this order with customer name, product details, and shipping status'). Joining normalized tables at query time is expensive. CQRS allows maintaining a denormalized read table that contains exactly the fields needed for common queries — updated asynchronously via events from the write side.",
  },
  {
    question: "How is data synchronized between the write model and read model in CQRS?",
    options: [
      "Through a shared database transaction that updates both simultaneously",
      "Via events published by the write side that are consumed by event handlers to update the read model",
      "By running scheduled batch jobs that copy write model data to the read model",
      "Through direct database replication between write and read databases",
    ],
    correct: 1,
    explanation: "When a command is processed and the write model is updated, an event (e.g., 'OrderPlaced') is published. Event handlers consume this event and update the read model accordingly. This makes the read model eventually consistent with the write model — there is a propagation delay, but the read side is always up-to-date within a short window.",
  },
  {
    question: "What consistency trade-off does CQRS introduce?",
    options: [
      "CQRS guarantees stronger consistency than single-model architectures",
      "The read model is eventually consistent with the write model — there is a short delay between a write and the read model reflecting it",
      "CQRS eliminates consistency requirements entirely",
      "CQRS requires two-phase commit across all models",
    ],
    correct: 1,
    explanation: "Because the read model is updated asynchronously via events, there is a propagation delay. Immediately after a command is processed, the read model may not yet reflect the change. Systems using CQRS must account for this in UX (e.g., showing 'processing' states) and in business logic (not relying on immediate read-your-writes consistency across models).",
  },
  {
    question: "When does CQRS provide the most value?",
    options: [
      "For simple CRUD applications with similar read and write patterns",
      "For small single-page applications with one user type",
      "For systems where read and write loads are significantly different — high read volume with complex query patterns versus write-heavy with strict consistency needs",
      "For all applications regardless of complexity",
    ],
    correct: 2,
    explanation: "CQRS adds significant complexity (two models, event synchronization, eventual consistency). It provides value when read and write patterns genuinely differ: a write-heavy order processing system combined with a read-heavy analytics dashboard can scale each side independently using different databases (OLTP for writes, Elasticsearch for reads). For uniform patterns, it is over-engineering.",
  },
  {
    question: "A user places an order and immediately navigates to 'My Orders'. The order doesn't appear yet. What CQRS concept explains this?",
    options: [
      "The order was rejected by the write model",
      "Eventual consistency — the read model updates asynchronously from the write model, so there is a brief propagation delay",
      "The query model cached the old result and needs to be invalidated",
      "CQRS prohibits showing order data immediately after creation",
    ],
    correct: 1,
    explanation: "This is eventual consistency in action. The command (PlaceOrder) succeeded and the write model is updated. But the event propagating to update the read model takes milliseconds to seconds. Good UX handles this by optimistically showing the new order in the UI before the read model catches up, or by polling until the read model reflects the change.",
  },
  {
    question: "How does combining CQRS with Event Sourcing benefit debugging?",
    options: [
      "It automatically generates bug reports",
      "The immutable event log provides a complete audit trail — every command and its resulting events can be replayed to reproduce any system state for debugging",
      "It eliminates all bugs by providing strong consistency",
      "It generates stack traces for all command failures",
    ],
    correct: 1,
    explanation: "When CQRS commands produce events stored in an event log (Event Sourcing), you have a complete, ordered record of everything that happened. To debug 'why is this order in a weird state?', replay its events chronologically. You can reproduce the exact sequence that led to the issue in a development environment, something impossible with mutable state storage.",
  },
  {
    question: "Which real-world system architecture would most benefit from implementing CQRS?",
    options: [
      "A personal blog with a single author",
      "A static company website with no user interactions",
      "An e-commerce platform handling millions of daily orders with complex analytics queries and separate reporting dashboards",
      "A simple to-do list application for personal use",
    ],
    correct: 2,
    explanation: "An e-commerce platform has naturally divergent read and write patterns: writes are transactional (order placement, payment, inventory updates) requiring strict consistency; reads are complex (product search, order history, analytics dashboards) requiring high throughput and flexible query patterns. CQRS allows using PostgreSQL for writes and Elasticsearch or a data warehouse for reads, each optimized for its pattern.",
  },
];

export default function CqrsContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">CQRS (Command and Query Responsibility Segregation)</strong> is a pattern that separates read and write operations into different models. Commands (writes) go to one model; queries (reads) go to another, often optimized differently.
      </p>
      <p>
        The insight: read and write patterns are fundamentally different. Reads might need denormalized, aggregated views. Writes need normalized data for integrity. Trying to serve both with one model leads to compromises. CQRS lets you optimize each independently.
      </p>

      <InteractiveDiagram nodes={nodes} edges={edges} nodeTypes={nodeTypes} title="CQRS Architecture" description="Commands and queries use separate models and data stores" height={360} />

      <KeyTakeaway variant="important">
        CQRS is often combined with Event Sourcing: commands produce events, events update the write DB and project to read models. This creates an immutable audit trail and enables time-travel debugging.
      </KeyTakeaway>

      <KeyTakeaway variant="warning">
        CQRS adds significant complexity  separate models, eventual consistency between write and read DBs. Only use it when your read and write patterns are genuinely different at scale. For most apps, a single model is fine.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
