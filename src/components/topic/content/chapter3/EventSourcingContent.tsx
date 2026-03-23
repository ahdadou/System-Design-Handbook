"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode, StepNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode, step: StepNode };

const nodes: Node[] = [
  { id: "cmd", type: "step", position: { x: 10, y: 30 }, data: { label: "Command", sublabel: "PlaceOrder", step: 1, color: "#3b82f6" } },
  { id: "handler", type: "step", position: { x: 170, y: 30 }, data: { label: "Command Handler", sublabel: "Validates & processes", step: 2, color: "#06b6d4" } },
  { id: "store", type: "database", position: { x: 330, y: 10 }, data: { label: "Event Store", sublabel: "Append-only log", color: "#8b5cf6" } },
  { id: "proj1", type: "system", position: { x: 250, y: 160 }, data: { label: "Order Projection", sublabel: "Current state view", icon: "📋", color: "#10b981" } },
  { id: "proj2", type: "system", position: { x: 380, y: 160 }, data: { label: "Analytics View", sublabel: "Revenue reporting", icon: "📊", color: "#f59e0b" } },
];

const edges: Edge[] = [
  { id: "e1", source: "cmd", target: "handler", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "handler", target: "store", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e3", source: "store", target: "proj1", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e4", source: "store", target: "proj2", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
];

const questions = [
  {
    question: "In Event Sourcing, what is stored as the source of truth?",
    options: [
      "The current state of each entity",
      "A sequence of immutable events that led to the current state",
      "SQL snapshots taken every hour",
      "A graph of entity relationships",
    ],
    correct: 1,
    explanation: "Event Sourcing stores every state change as an immutable event in an append-only log. The current state is derived by replaying all events. This provides a complete audit trail and the ability to reconstruct any past state.",
  },
  {
    question: "What is a 'snapshot' in the context of Event Sourcing?",
    options: [
      "A database backup",
      "A periodic capture of the current state to avoid replaying all events from the beginning",
      "A read-only copy of the event store",
      "A point-in-time export to CSV",
    ],
    correct: 1,
    explanation: "When an aggregate has thousands of events, replaying all of them on every read is slow. A snapshot captures the current state at a specific event version. Future replays start from the snapshot and only replay newer events.",
  },
  {
    question: "What is an 'aggregate' in Event Sourcing?",
    options: [
      "A database aggregation function like SUM or COUNT applied to events",
      "The domain object whose current state is derived by replaying all of its associated events in order",
      "A batch of events grouped together for efficient storage",
      "A summary report generated from the event log",
    ],
    correct: 1,
    explanation: "An aggregate is a domain entity (Order, Account, ShoppingCart) whose state exists only as a projection of its event history. To determine the current state of an Order, you replay all its events: OrderPlaced → PaymentReceived → ItemPicked → Shipped. The aggregate boundaries also define consistency boundaries for business rules.",
  },
  {
    question: "A developer discovers a bug in the projection logic that computed incorrect revenue totals for 6 months. What unique capability does Event Sourcing provide to fix this?",
    options: [
      "Restore from the last database backup and lose 6 months of data",
      "Manually edit all revenue records to correct values",
      "Fix the projection logic and replay all historical events through the corrected code to rebuild accurate read models",
      "Delete all affected events and ask users to re-enter transactions",
    ],
    correct: 2,
    explanation: "Event Sourcing's replay capability is its most powerful operational feature. Since all events are immutable and stored, you fix the projection code and replay all events from the beginning. The new read model is computed correctly without data loss or manual corrections. This is impossible in systems that store only current state.",
  },
  {
    question: "How does Event Sourcing enable 'time travel' queries?",
    options: [
      "By storing timestamps on all database rows",
      "By replaying all events up to a specific timestamp to reconstruct the exact state of any entity at any point in the past",
      "By maintaining hourly snapshots of the entire database",
      "By versioning all database schema changes",
    ],
    correct: 1,
    explanation: "Because every state change is recorded as an event with a timestamp, you can reconstruct the state of any entity at any historical moment by replaying events up to that point. 'What was the balance of Account X on March 15th at 2:30 PM?' becomes a simple event replay operation.",
  },
  {
    question: "What is a key challenge of Event Sourcing that makes schema evolution difficult?",
    options: [
      "Adding new event types is impossible once the system is in production",
      "Existing events stored in the log cannot be changed — if an event's schema must evolve, you must handle multiple versions or use upcasting to transform old events",
      "Events must be stored in a relational database with rigid schemas",
      "Event Sourcing prevents adding new features to the domain model",
    ],
    correct: 1,
    explanation: "Immutability is both Event Sourcing's strength and its schema evolution challenge. If 'OrderPlaced' events stored for 2 years lack a 'currency' field that is now required, you cannot modify those events. Solutions include: upcasting (transforming old event formats when reading), versioned event types (OrderPlacedV1, OrderPlacedV2), or weak schema formats (JSON with optional fields).",
  },
  {
    question: "Why is Event Sourcing often paired with CQRS (Command Query Responsibility Segregation)?",
    options: [
      "CQRS is required for Event Sourcing to function correctly",
      "Deriving current state by replaying events on every read is slow — CQRS allows separate optimized read models (projections) to be maintained and queried directly",
      "CQRS prevents duplicate events from being stored",
      "CQRS provides the write locking mechanism needed by the event store",
    ],
    correct: 1,
    explanation: "Reading current state in Event Sourcing requires replaying potentially thousands of events per aggregate on every query — very slow. CQRS solves this: commands produce events (written to the event store), and event handlers update denormalized read models (projections) optimized for queries. Reads are fast database lookups against the projection, not event replays.",
  },
  {
    question: "Which type of system benefits most from Event Sourcing's complete audit trail?",
    options: [
      "A static website with mostly read traffic",
      "A social media image hosting service",
      "A financial trading system or banking application where regulatory compliance requires a complete immutable history of every transaction",
      "A CDN serving cached content",
    ],
    correct: 2,
    explanation: "Financial and regulated systems are the ideal fit for Event Sourcing. Regulatory requirements (SOX, PCI-DSS) mandate immutable audit trails of all transactions. Event Sourcing naturally provides this: every state change is recorded permanently and immutably. Auditors can replay any sequence of events to verify correctness without relying on mutable 'audit log' tables.",
  },
  {
    question: "What does it mean to 'project' events in Event Sourcing?",
    options: [
      "To forecast future events based on historical patterns",
      "To process a sequence of events and build a specific read model or view of the current state tailored for a particular query pattern",
      "To export events to an external reporting system",
      "To synchronize events across multiple geographic regions",
    ],
    correct: 1,
    explanation: "A projection processes events to build a specific read model. The same event stream can be projected into multiple different views: an Order projection builds a customer-facing order status view; an Analytics projection aggregates revenue totals; a Search projection builds a product search index. Each projection optimizes for different query patterns without changing the source events.",
  },
  {
    question: "When is Event Sourcing NOT a good architectural choice?",
    options: [
      "When you need a complete audit trail of all data changes",
      "When your domain has complex state transitions that are difficult to track with current-state storage",
      "When your application has simple CRUD patterns with no need for history, audit trails, or temporal queries",
      "When using a microservices architecture",
    ],
    correct: 2,
    explanation: "Event Sourcing adds significant complexity: event schema management, projection maintenance, snapshot strategies, and read model eventual consistency. For simple CRUD applications (a blog, a basic user directory, an inventory counter), storing current state in a relational database is far simpler and just as effective. Adopt Event Sourcing only when its specific benefits (audit trail, replay, multiple projections) are genuine requirements.",
  },
];

export default function EventSourcingContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Event Sourcing</strong> is a pattern where instead of storing only the current state of data, you store the full sequence of events that led to that state. An order isn't a row with status=&quot;SHIPPED&quot;  it's a log of events: OrderPlaced → PaymentReceived → ItemPicked → Shipped.
      </p>
      <p>
        The current state is computed by replaying events. This gives you a perfect audit log, the ability to travel back in time, and the ability to project the same events into multiple different read models simultaneously.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Event Sourcing Flow"
        description="Commands produce events stored immutably; projections build read views"
        height={320}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Core Concepts</h2>
      <div className="space-y-3">
        {[
          { term: "Event Store", def: "An append-only database that persists events in order. Never update or delete events  only append new ones. Kafka, EventStoreDB, or a simple Postgres table work.", color: "#8b5cf6" },
          { term: "Aggregate", def: "The domain object whose state is rebuilt by replaying its events. An Order aggregate replays all order events to compute current status.", color: "#3b82f6" },
          { term: "Projection", def: "A read model built by processing events. Multiple projections can exist for the same events  one for customer UI, another for analytics, another for search.", color: "#10b981" },
          { term: "Snapshot", def: "A periodic capture of an aggregate's state at a specific event sequence number. Avoids replaying thousands of events on every read.", color: "#f59e0b" },
        ].map((item) => (
          <div key={item.term} className="p-3 rounded-lg border border-border-ui bg-surface flex gap-3">
            <div className="w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div>
              <span className="font-semibold text-sm font-heading" style={{ color: item.color }}>{item.term}: </span>
              <span className="text-xs text-txt-2">{item.def}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Benefits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: "Complete Audit Trail", desc: "Every change is recorded. Perfect for compliance, debugging, and understanding exactly what happened.", icon: "📜" },
          { title: "Time Travel", desc: "Rebuild the state of any entity at any point in time by replaying events up to a specific timestamp.", icon: "⏱️" },
          { title: "Multiple Read Models", desc: "Project the same events into different shapes for different use cases  OLTP view, analytics view, search index.", icon: "📊" },
          { title: "Event Replay", desc: "Fix bugs in projections by replaying all events with corrected logic. Eliminates data migration scripts.", icon: "🔄" },
        ].map((item) => (
          <div key={item.title} className="p-4 rounded-xl border border-border-ui bg-surface">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-semibold text-sm text-txt font-heading mb-1">{item.title}</div>
            <p className="text-xs text-txt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="warning">
        Event Sourcing adds complexity. Querying current state requires rebuilding from events. Schema evolution (changing event formats) is hard. Only use it when auditability, temporal queries, or multiple projections are genuine requirements.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
