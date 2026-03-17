"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode };

const nodes: Node[] = [
  { id: "order", type: "system", position: { x: 175, y: 20 }, data: { label: "Order Service", sublabel: "Event Producer", icon: "📦", color: "#3b82f6", description: "Emits 'order.placed' event after persisting the order. Has no knowledge of downstream consumers." } },
  { id: "bus", type: "system", position: { x: 175, y: 140 }, data: { label: "Event Bus", sublabel: "Kafka / SNS", icon: "⚡", color: "#f59e0b", description: "Durable, distributed event backbone. Retains events, supports multiple consumer groups, enables replay." } },
  { id: "inv", type: "system", position: { x: 30, y: 280 }, data: { label: "Inventory Service", sublabel: "Consumer", icon: "🏪", color: "#10b981", description: "Listens for 'order.placed'. Reserves stock. Emits 'inventory.reserved' or 'inventory.failed'." } },
  { id: "notif", type: "system", position: { x: 195, y: 280 }, data: { label: "Notification Service", sublabel: "Consumer", icon: "🔔", color: "#10b981", description: "Sends order confirmation email/SMS. Decoupled — can be added without touching Order Service." } },
  { id: "analytics", type: "system", position: { x: 360, y: 280 }, data: { label: "Analytics Service", sublabel: "Consumer", icon: "📊", color: "#10b981", description: "Tracks conversion metrics, revenue, funnel stats. Independent of business logic services." } },
];

const edges: Edge[] = [
  { id: "e1", source: "order", target: "bus", label: "order.placed", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e2", source: "bus", target: "inv", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
  { id: "e3", source: "bus", target: "notif", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
  { id: "e4", source: "bus", target: "analytics", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
];

const questions = [
  {
    question: "What is the difference between choreography and orchestration in EDA?",
    options: [
      "They are the same pattern with different names",
      "Choreography: services react to events independently with no central coordinator. Orchestration: a central process tells each service what to do and when.",
      "Orchestration is always better because it provides stricter consistency",
      "Choreography requires a dedicated ESB; orchestration does not",
    ],
    correct: 1,
    explanation: "In choreography, the Order Service emits 'order.placed' and each service reacts autonomously — no one tells Inventory what to do. In orchestration, a Saga Orchestrator explicitly calls Inventory, waits, then calls Notifications. Choreography is more decoupled but harder to debug; orchestration is easier to trace but creates a central dependency.",
  },
  {
    question: "How does Event-Driven Architecture achieve loose coupling between services?",
    options: [
      "By requiring all services to share a common database schema",
      "By using synchronous REST calls with retries",
      "Producers emit events without knowing consumers; consumers subscribe without knowing producers — they only share event schema contracts",
      "By deploying all services in the same container",
    ],
    correct: 2,
    explanation: "EDA achieves loose coupling through the event as a contract. The Order Service emits 'order.placed' with a defined schema. New services can subscribe without any change to the producer. Services can be deployed, scaled, and restarted independently.",
  },
];

export default function EventDrivenArchitectureContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Event-Driven Architecture (EDA)</strong> is a design paradigm where services communicate by producing and consuming events asynchronously. An event is an immutable record of something that happened —{" "}
        <code className="text-accent bg-[#3b82f6]/10 px-1 rounded">order.placed</code>,{" "}
        <code className="text-accent bg-[#3b82f6]/10 px-1 rounded">payment.failed</code>,{" "}
        <code className="text-accent bg-[#3b82f6]/10 px-1 rounded">user.registered</code>. Services react to events they care about without being explicitly called.
      </p>
      <p className="text-base leading-relaxed">
        The key shift from request-driven systems: the Order Service does not call the Inventory Service. It publishes an event and moves on. Inventory, Notifications, and Analytics all react independently. Adding a new reaction requires zero changes to existing services.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Event-Driven Architecture: Order Flow"
        description="Order Service emits one event; multiple consumers react asynchronously with no direct coupling. Click nodes for details."
        height={380}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Choreography vs Orchestration</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">Choreography</div>
          <ul className="text-xs space-y-1.5 text-txt-2">
            <li>• No central coordinator — services react to events</li>
            <li>• Order Service emits <code className="text-accent">order.placed</code></li>
            <li>• Inventory reacts → emits <code className="text-accent">stock.reserved</code></li>
            <li>• Payment reacts → emits <code className="text-accent">payment.captured</code></li>
            <li>• High decoupling; hard to trace full workflow</li>
            <li>• Best for: loosely coupled, independent services</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">Orchestration (Saga Pattern)</div>
          <ul className="text-xs space-y-1.5 text-txt-2">
            <li>• Central Saga Orchestrator controls flow</li>
            <li>• Explicitly calls each service in sequence</li>
            <li>• Handles compensating transactions on failure</li>
            <li>• Easier to trace and debug workflow state</li>
            <li>• Central orchestrator is a dependency</li>
            <li>• Best for: long-running transactions, strict ordering</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Eventual Consistency</h2>
      <p>
        EDA systems are <span className="text-[#f59e0b] font-medium">eventually consistent</span> — after an order is placed, inventory is not updated instantly. The event propagates, the consumer processes it, and the system converges. This is a fundamental trade-off: EDA gains availability and decoupling at the cost of strong consistency.
      </p>
      <p>
        The implication for product design: your UI should account for async updates. Show "Order submitted" rather than "Order confirmed" until the downstream processing completes. Use polling or WebSockets to reflect status changes.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">Kafka as EDA Backbone</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Durable Events", color: "#3b82f6", desc: "Events stored on disk for configurable retention (days/weeks). New consumers can replay the entire event history." },
          { label: "Consumer Groups", color: "#10b981", desc: "Multiple consumer groups each get every event independently. Adding a new service means adding a new consumer group — zero changes to producers." },
          { label: "Ordered Partitions", color: "#8b5cf6", desc: "Events for the same entity (same order ID) land in the same partition, guaranteeing causal ordering without global locking." },
        ].map((k) => (
          <div key={k.label} className="p-3 rounded-xl border" style={{ borderColor: `${k.color}30`, backgroundColor: `${k.color}0a` }}>
            <div className="font-semibold text-sm mb-1" style={{ color: k.color }}>{k.label}</div>
            <p className="text-xs text-txt-2 leading-relaxed">{k.desc}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        Event-Driven Architecture scales extraordinarily well because producers and consumers scale independently. Netflix processes billions of events per day with EDA. The event log is the single source of truth — every service state is a projection of events, making the system auditable and debuggable.
      </KeyTakeaway>

      <KeyTakeaway variant="warning">
        EDA introduces eventual consistency and makes tracing a request across services harder. Invest in distributed tracing (Jaeger, Zipkin) and correlation IDs in event payloads from day one. Without observability, debugging production issues becomes very painful.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
