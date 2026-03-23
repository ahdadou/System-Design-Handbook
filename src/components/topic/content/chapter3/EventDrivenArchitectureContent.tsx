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
  { id: "notif", type: "system", position: { x: 195, y: 280 }, data: { label: "Notification Service", sublabel: "Consumer", icon: "🔔", color: "#10b981", description: "Sends order confirmation email/SMS. Decoupled  can be added without touching Order Service." } },
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
    explanation: "In choreography, the Order Service emits 'order.placed' and each service reacts autonomously  no one tells Inventory what to do. In orchestration, a Saga Orchestrator explicitly calls Inventory, waits, then calls Notifications. Choreography is more decoupled but harder to debug; orchestration is easier to trace but creates a central dependency.",
  },
  {
    question: "How does Event-Driven Architecture achieve loose coupling between services?",
    options: [
      "By requiring all services to share a common database schema",
      "By using synchronous REST calls with retries",
      "Producers emit events without knowing consumers; consumers subscribe without knowing producers  they only share event schema contracts",
      "By deploying all services in the same container",
    ],
    correct: 2,
    explanation: "EDA achieves loose coupling through the event as a contract. The Order Service emits 'order.placed' with a defined schema. New services can subscribe without any change to the producer. Services can be deployed, scaled, and restarted independently.",
  },
  {
    question: "What is an 'event' in Event-Driven Architecture?",
    options: [
      "A scheduled task that runs at a fixed interval",
      "An immutable record of something that happened in the system, represented as a fact in the past tense",
      "A command sent from one service to another requesting an action",
      "A real-time notification pushed directly to users",
    ],
    correct: 1,
    explanation: "An event is an immutable fact about something that already happened — 'order.placed', 'payment.failed', 'user.registered'. Events are past-tense, cannot be changed, and represent state changes. This is distinct from commands (requests for action) and queries (requests for data). The immutability makes event logs reliable audit trails.",
  },
  {
    question: "Why does EDA result in 'eventual consistency' rather than strong consistency?",
    options: [
      "Because event buses do not support transactions",
      "Because events are processed asynchronously — after an event is published, consuming services update their state independently at different times",
      "Because EDA systems never use databases",
      "Because producers must wait for all consumers to confirm before the event is considered processed",
    ],
    correct: 1,
    explanation: "In EDA, after the Order Service publishes 'order.placed', the Inventory Service processes this event asynchronously. There is a window (milliseconds to seconds) where the order exists in the Order Service's view but inventory has not yet been decremented. The system converges to consistency, but not instantaneously. This is the fundamental trade-off of asynchronous architectures.",
  },
  {
    question: "What is the primary advantage of adding a new service to an EDA system compared to a synchronous REST-based system?",
    options: [
      "The new service gets higher priority access to the database",
      "New services can subscribe to existing events without requiring any changes to existing producers or other consumers",
      "The new service automatically receives historical events without any configuration",
      "Adding a new service eliminates network latency for all other services",
    ],
    correct: 1,
    explanation: "This is EDA's killer feature: extensibility with zero coupling. Adding an Analytics Service that consumes 'order.placed' events requires only: creating the service, creating a consumer group, and subscribing to the topic. The Order Service is never modified. In synchronous systems, the Order Service would need new HTTP call logic added for each new downstream consumer.",
  },
  {
    question: "What is a 'correlation ID' and why is it critical in event-driven systems?",
    options: [
      "A database primary key that links events to their originating records",
      "A unique identifier propagated through all events in a request flow, enabling end-to-end tracing across multiple asynchronous service interactions",
      "An identifier that prevents duplicate event processing",
      "A version number that ensures events are processed in order",
    ],
    correct: 1,
    explanation: "In EDA, a single user action can spawn dozens of events processed by many services asynchronously. Without a correlation ID, debugging production issues becomes nearly impossible. By embedding the same correlation ID in every event derived from a single request, distributed tracing tools can reconstruct the complete causal chain across all services.",
  },
  {
    question: "A notification service goes down for 30 minutes while the order service continues processing orders. When the notification service recovers, what happens to the missed events in a Kafka-backed EDA system?",
    options: [
      "The missed events are permanently lost",
      "The order service must replay all orders from the database",
      "The notification service resumes from its last committed offset and processes all events that accumulated during downtime",
      "The broker automatically sends alerts to the engineering team",
    ],
    correct: 2,
    explanation: "Kafka's durable, offset-based consumption is designed for this scenario. Each consumer group tracks its own offset. When the notification service restarts, it resumes from the last committed offset, processing all events that queued during the outage. The ordering is preserved, and no events are lost. This resilience is impossible with synchronous REST calls.",
  },
  {
    question: "How does EDA handle the problem of a slow downstream service causing cascading failures?",
    options: [
      "EDA forces all services to process at the same speed",
      "EDA eliminates this problem entirely — slow consumers cause event lag (queue buildup) but do not block or crash producers or other consumers",
      "EDA uses circuit breakers that automatically restart slow services",
      "EDA synchronizes all services to the slowest consumer's speed",
    ],
    correct: 1,
    explanation: "Asynchronous decoupling via events means a slow Email Service cannot block the Order Service. Events accumulate in the broker queue (consumer lag increases), but the producer continues at full speed. Other consumers are also unaffected. The Email Service processes its backlog when capacity returns. This is fundamentally impossible in synchronous call chains where one slow service stalls everything upstream.",
  },
  {
    question: "What does Netflix's use of EDA at billions of events per day demonstrate about the pattern's scalability?",
    options: [
      "EDA only works for streaming media companies",
      "EDA scales horizontally — producers, the event bus, and consumers each scale independently based on their specific load",
      "EDA requires specialized hardware to handle high event volumes",
      "EDA scales by reducing the number of events produced",
    ],
    correct: 1,
    explanation: "EDA achieves massive scale through independent horizontal scaling. Producers scale based on incoming requests; the Kafka broker scales by adding partitions and brokers; consumers scale by adding instances within their consumer groups. Each component scales independently based on its bottleneck. Netflix, LinkedIn, and Uber all use this pattern for systems processing millions of events per second.",
  },
  {
    question: "What is the main operational challenge that EDA introduces that synchronous architectures do not?",
    options: [
      "EDA requires more servers than equivalent synchronous architectures",
      "Debugging and tracing failures is harder because request flows are asynchronous and span multiple independent services over time",
      "EDA cannot integrate with REST-based external services",
      "EDA produces stronger consistency guarantees that are harder to maintain",
    ],
    correct: 1,
    explanation: "In synchronous REST systems, you can follow a call stack trace. In EDA, 'what happened when this order failed?' requires reconstructing an asynchronous sequence of events across multiple services, each with its own logs. Without investment in distributed tracing (Jaeger, Zipkin), correlation IDs in event payloads, and centralized logging, production debugging becomes very painful.",
  },
];

export default function EventDrivenArchitectureContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Event-Driven Architecture (EDA)</strong> is a design paradigm where services communicate by producing and consuming events asynchronously. An event is an immutable record of something that happened {" "}
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
            <li>• No central coordinator  services react to events</li>
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
        EDA systems are <span className="text-[#f59e0b] font-medium">eventually consistent</span>  after an order is placed, inventory is not updated instantly. The event propagates, the consumer processes it, and the system converges. This is a fundamental trade-off: EDA gains availability and decoupling at the cost of strong consistency.
      </p>
      <p>
        The implication for product design: your UI should account for async updates. Show "Order submitted" rather than "Order confirmed" until the downstream processing completes. Use polling or WebSockets to reflect status changes.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">Kafka as EDA Backbone</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Durable Events", color: "#3b82f6", desc: "Events stored on disk for configurable retention (days/weeks). New consumers can replay the entire event history." },
          { label: "Consumer Groups", color: "#10b981", desc: "Multiple consumer groups each get every event independently. Adding a new service means adding a new consumer group  zero changes to producers." },
          { label: "Ordered Partitions", color: "#8b5cf6", desc: "Events for the same entity (same order ID) land in the same partition, guaranteeing causal ordering without global locking." },
        ].map((k) => (
          <div key={k.label} className="p-3 rounded-xl border" style={{ borderColor: `${k.color}30`, backgroundColor: `${k.color}0a` }}>
            <div className="font-semibold text-sm mb-1" style={{ color: k.color }}>{k.label}</div>
            <p className="text-xs text-txt-2 leading-relaxed">{k.desc}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        Event-Driven Architecture scales extraordinarily well because producers and consumers scale independently. Netflix processes billions of events per day with EDA. The event log is the single source of truth  every service state is a projection of events, making the system auditable and debuggable.
      </KeyTakeaway>

      <KeyTakeaway variant="warning">
        EDA introduces eventual consistency and makes tracing a request across services harder. Invest in distributed tracing (Jaeger, Zipkin) and correlation IDs in event payloads from day one. Without observability, debugging production issues becomes very painful.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
