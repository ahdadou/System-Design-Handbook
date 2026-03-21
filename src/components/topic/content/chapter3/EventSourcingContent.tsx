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
