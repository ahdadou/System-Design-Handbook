"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "producer", type: "system", position: { x: 40, y: 150 }, data: { label: "Producer", sublabel: "Order Service", icon: "📤", color: "#3b82f6", description: "Publishes messages to the broker. Does not know which consumers receive the message." } },
  { id: "broker", type: "system", position: { x: 200, y: 150 }, data: { label: "Message Broker", sublabel: "Kafka / RabbitMQ", icon: "🔀", color: "#f59e0b", description: "Receives messages from producers. Routes them to the correct queues/topics. Provides durability, ordering, and delivery guarantees." } },
  { id: "c1", type: "system", position: { x: 400, y: 55 }, data: { label: "Consumer 1", sublabel: "Inventory Service", icon: "📦", color: "#10b981" } },
  { id: "c2", type: "system", position: { x: 400, y: 155 }, data: { label: "Consumer 2", sublabel: "Notification Service", icon: "🔔", color: "#10b981" } },
  { id: "c3", type: "system", position: { x: 400, y: 255 }, data: { label: "Consumer 3", sublabel: "Analytics Service", icon: "📊", color: "#10b981" } },
];

const edges: Edge[] = [
  { id: "e1", source: "producer", target: "broker", label: "publish", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e2", source: "broker", target: "c1", label: "route", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e3", source: "broker", target: "c2", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
  { id: "e4", source: "broker", target: "c3", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
];

const questions = [
  {
    question: "What is the key difference between Kafka and RabbitMQ?",
    options: [
      "Kafka only supports one consumer per topic",
      "Kafka retains messages on disk for replay; RabbitMQ deletes messages after successful consumption",
      "RabbitMQ is faster than Kafka in all cases",
      "Kafka does not support consumer groups",
    ],
    correct: 1,
    explanation: "Kafka is a durable log  messages persist on disk and consumers can replay them from any offset. RabbitMQ is a traditional message queue where messages are removed once acknowledged. Kafka is ideal for event sourcing and audit logs; RabbitMQ for task queues and complex routing.",
  },
  {
    question: "Which exchange type in RabbitMQ delivers a message to ALL bound queues regardless of routing key?",
    options: [
      "Direct exchange",
      "Topic exchange",
      "Fanout exchange",
      "Headers exchange",
    ],
    correct: 2,
    explanation: "A fanout exchange broadcasts every message to all queues bound to it  routing keys are ignored. This is the pub/sub pattern in RabbitMQ. Direct exchange routes by exact routing key; topic exchange by pattern matching.",
  },
  {
    question: "What is the primary benefit a message broker provides to a distributed system?",
    options: [
      "It guarantees exactly-once delivery with no configuration",
      "It decouples producers and consumers so they do not need to know about each other's address, format, or availability",
      "It replaces the need for a database in write-heavy systems",
      "It automatically scales all downstream services",
    ],
    correct: 1,
    explanation: "A message broker acts as an intermediary: producers publish to the broker and consumers subscribe from it. Neither side needs to know about the other. This temporal and spatial decoupling means services can be deployed, scaled, and restarted independently without coordination.",
  },
  {
    question: "In Kafka, what does a 'consumer group' allow?",
    options: [
      "Multiple consumers to each receive every message (broadcast)",
      "Parallel processing of a topic's partitions across multiple consumer instances, where each partition is assigned to exactly one consumer in the group",
      "Consumers to write messages back to the same topic",
      "Producers to batch messages before sending",
    ],
    correct: 1,
    explanation: "A Kafka consumer group enables horizontal scaling of consumers. Each partition in a topic is consumed by exactly one consumer within the group, distributing the load. Multiple consumer groups can independently consume the same topic — each group gets all messages.",
  },
  {
    question: "What delivery guarantee does a message broker provide when a consumer crashes before acknowledging a message?",
    options: [
      "The message is permanently lost",
      "The message is re-delivered to another consumer (at-least-once delivery)",
      "The message is delivered exactly once to a new consumer",
      "The broker deletes the message to prevent duplicate processing",
    ],
    correct: 1,
    explanation: "Brokers track acknowledgements (ACKs). If a consumer crashes without ACKing, the broker marks the message as unacknowledged and re-delivers it. This gives at-least-once delivery — no message is lost, but consumers must be idempotent to handle possible duplicates.",
  },
  {
    question: "Which scenario is best suited for Apache Kafka rather than RabbitMQ?",
    options: [
      "Complex routing of tasks to different worker queues based on priority",
      "RPC-style request-reply patterns between services",
      "Event sourcing and audit logging where consumers need to replay historical events",
      "Simple task queues for background job processing at low volume",
    ],
    correct: 2,
    explanation: "Kafka's durable, append-only log with configurable retention makes it ideal for event sourcing and audit logging. Consumers can seek to any offset and replay the complete event history. RabbitMQ deletes messages after ACK, so replay is impossible.",
  },
  {
    question: "What is a RabbitMQ 'topic exchange' used for?",
    options: [
      "Broadcasting to all queues with no routing key consideration",
      "Routing messages to queues whose binding key pattern-matches the routing key using wildcards (* and #)",
      "Routing based on message header attributes",
      "Routing by exact routing key match only",
    ],
    correct: 1,
    explanation: "A topic exchange routes messages using routing key patterns. The '*' wildcard matches one word; '#' matches zero or more words. For example, a queue bound to 'order.#' receives 'order.placed', 'order.shipped', and 'order.cancelled'. This enables flexible, hierarchical routing.",
  },
  {
    question: "What does 'idempotent consumer' mean in the context of message brokers?",
    options: [
      "A consumer that processes messages at exactly-once semantics natively",
      "A consumer where processing the same message multiple times produces the same result as processing it once",
      "A consumer that acknowledges messages before processing them",
      "A consumer that can receive messages from multiple brokers simultaneously",
    ],
    correct: 1,
    explanation: "Because at-least-once delivery can cause duplicates (e.g., consumer crashes after processing but before ACKing), consumers must be idempotent. An idempotent operation — like an upsert or a conditional update — produces the same result whether applied once or many times, making duplicates safe.",
  },
  {
    question: "How does a message broker enable the 'fan-out' pattern?",
    options: [
      "By creating multiple copies of the producer service",
      "By routing one published message to multiple consumers or queues simultaneously, so one event triggers N downstream services",
      "By load-balancing messages across a single consumer pool",
      "By batching messages and sending them in bulk",
    ],
    correct: 1,
    explanation: "When an Order Service publishes an 'order.placed' event, the broker delivers it to all subscribed consumers (Inventory, Notifications, Analytics) simultaneously. Each consumer reacts independently. Adding a new consumer requires zero changes to the producer — the broker handles all fan-out routing.",
  },
  {
    question: "What happens in Kafka when the consumer's processing rate falls behind the producer's publishing rate?",
    options: [
      "Kafka drops the oldest messages to maintain throughput",
      "Kafka blocks the producer until consumers catch up",
      "Messages accumulate in the log (consumer lag increases) and consumers can catch up by processing at their own pace",
      "Kafka automatically spins up new consumer instances",
    ],
    correct: 2,
    explanation: "Kafka's durable log absorbs producer/consumer rate mismatches. Messages are retained on disk regardless of consumer progress. Consumers track their own offset and catch up whenever they have capacity. Consumer lag (offset difference between latest and consumer position) is the key metric to monitor.",
  },
];

export default function MessageBrokersContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        A <strong className="text-txt">message broker</strong> is middleware that receives messages from producers, optionally transforms or routes them, and delivers them to consumers. It decouples services so they do not need to know about each other  producers send to the broker, consumers receive from the broker.
      </p>
      <p className="text-base leading-relaxed">
        Without a broker, Service A must know Service B's address, format, and availability. With a broker, Service A publishes an{" "}
        <code className="text-[#f59e0b] bg-[#f59e0b]/10 px-1 rounded">order.placed</code> message and is done. Three services might consume it  Service A does not care.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Message Broker Topology"
        description="A single producer publishes to the broker; the broker routes to multiple consumers. Click nodes for details."
        height={370}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Routing Patterns</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: "Direct", color: "#3b82f6", icon: "➡️", desc: "Messages are routed to queues whose binding key exactly matches the routing key. One producer → one specific queue." },
          { name: "Topic", color: "#8b5cf6", icon: "🎯", desc: "Routing key is matched by pattern (e.g. order.* or #.error). Allows flexible, wildcard-based routing to multiple queues." },
          { name: "Fanout", color: "#06b6d4", icon: "📢", desc: "Message is broadcast to every bound queue, ignoring the routing key entirely. Classic pub/sub broadcast." },
          { name: "Headers", color: "#10b981", icon: "🏷️", desc: "Routing is based on message header attributes instead of routing key. Powerful but less common." },
        ].map((r) => (
          <div key={r.name} className="p-4 rounded-xl border" style={{ borderColor: `${r.color}30`, backgroundColor: `${r.color}0a` }}>
            <div className="flex items-center gap-2 mb-2">
              <span>{r.icon}</span>
              <span className="font-bold text-sm font-heading" style={{ color: r.color }}>{r.name} Exchange</span>
            </div>
            <p className="text-xs text-txt-2 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Kafka vs RabbitMQ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30">
          <div className="font-bold text-[#f59e0b] text-sm font-heading mb-3">Apache Kafka</div>
          <ul className="text-xs space-y-1.5 text-txt-2">
            <li>• Distributed commit log  messages stored on disk</li>
            <li>• Consumers track their own offset (can replay)</li>
            <li>• Optimized for high throughput (millions/sec)</li>
            <li>• Retention-based deletion (not ack-based)</li>
            <li>• Consumer groups for parallel processing</li>
            <li>• Best for: event sourcing, activity feeds, log aggregation</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-3">RabbitMQ</div>
          <ul className="text-xs space-y-1.5 text-txt-2">
            <li>• Traditional message queue with smart routing</li>
            <li>• Messages deleted after consumer acknowledgement</li>
            <li>• Rich routing via exchanges (direct/topic/fanout/headers)</li>
            <li>• Supports message priorities and TTL</li>
            <li>• Easier to reason about at small scale</li>
            <li>• Best for: task queues, RPC, complex routing scenarios</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Durability and Guarantees</h2>
      <p>
        Brokers provide configurable delivery semantics. Producers can require acknowledgement before the broker confirms receipt. Consumers acknowledge messages to prevent re-delivery. Together these enable{" "}
        <span className="text-accent-2 font-medium">at-least-once delivery</span>  the most common guarantee  where every message is processed, though possibly more than once on failure. Idempotent consumers handle duplicates safely.
      </p>

      <KeyTakeaway variant="important">
        The broker pattern solves the "fan-out" problem elegantly: one event triggers N downstream services with zero coupling. As you add services, you add consumers  the producer is never modified. This is the foundation of event-driven microservices at companies like LinkedIn, Uber, and Airbnb.
      </KeyTakeaway>

      <KeyTakeaway variant="tip">
        Choose Kafka when you need replay, high throughput, or event sourcing. Choose RabbitMQ when you need flexible routing, priority queues, or task distribution at moderate scale. Both are production-proven  it is a use-case decision, not a quality decision.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
