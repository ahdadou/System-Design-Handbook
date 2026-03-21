"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, StepNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, step: StepNode };

const nodes: Node[] = [
  { id: "producer", type: "system", position: { x: 40, y: 180 }, data: { label: "Producer", sublabel: "Email Service", icon: "📤", color: "#3b82f6", description: "Enqueues messages. Does not wait for a consumer. Can produce faster than consumers process  the queue absorbs the burst." } },
  { id: "m1", type: "step", position: { x: 200, y: 50 }, data: { label: "Message 1", sublabel: "oldest  next", step: 1, color: "#06b6d4" } },
  { id: "m2", type: "step", position: { x: 200, y: 130 }, data: { label: "Message 2", step: 2, color: "#06b6d4" } },
  { id: "m3", type: "step", position: { x: 200, y: 210 }, data: { label: "Message 3", step: 3, color: "#06b6d4" } },
  { id: "m4", type: "step", position: { x: 200, y: 290 }, data: { label: "Message 4", sublabel: "newest", step: 4, color: "#06b6d4" } },
  { id: "consumer", type: "system", position: { x: 400, y: 180 }, data: { label: "Consumer", sublabel: "Worker Process", icon: "⚙️", color: "#10b981", description: "Polls or receives messages. Processes one at a time. Sends an ACK when done. The queue deletes the message only after ACK." } },
  { id: "dlq", type: "system", position: { x: 400, y: 310 }, data: { label: "Dead Letter Queue", sublabel: "Failed messages", icon: "☠️", color: "#ef4444", description: "Messages that fail repeatedly (exceed max retries) are moved here for inspection, re-processing, or alerting." } },
];

const edges: Edge[] = [
  { id: "e1", source: "producer", target: "m4", label: "enqueue", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e2", source: "m1", target: "consumer", label: "dequeue (FIFO)", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e3", source: "consumer", target: "dlq", label: "after max retries", style: { stroke: "#ef4444", strokeWidth: 1.5, strokeDasharray: "4 2" }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
];

const questions = [
  {
    question: "What is a Dead Letter Queue (DLQ) used for?",
    options: [
      "Storing messages that have been successfully processed",
      "Holding messages that failed processing after max retries so they can be inspected without blocking the main queue",
      "Routing high-priority messages to faster consumers",
      "Archiving old messages for long-term storage",
    ],
    correct: 1,
    explanation: "A DLQ captures poison messages  ones that repeatedly fail processing. Without a DLQ, a bad message could block the queue forever. With a DLQ, it is moved aside so the main queue keeps flowing and engineers can debug the failure separately.",
  },
  {
    question: "What does 'at-least-once delivery' mean, and what must consumers do to handle it?",
    options: [
      "Every message is processed exactly once  no duplicates are possible",
      "A message may be delivered more than once on failure, so consumers must be idempotent to handle duplicates safely",
      "Messages are delivered in strict order, guaranteed",
      "The producer waits for consumer acknowledgement before sending the next message",
    ],
    correct: 1,
    explanation: "At-least-once means the queue guarantees no message is lost  but if the consumer crashes after processing but before ACKing, the message is re-delivered. Consumers must be idempotent: processing a message twice must have the same effect as processing it once (e.g., 'upsert' not 'insert').",
  },
];

export default function MessageQueuesContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        A <strong className="text-txt">message queue</strong> is a buffer that decouples the rate of production from the rate of consumption. Producers enqueue messages; consumers dequeue and process them. The queue absorbs traffic spikes and provides backpressure  if consumers fall behind, the queue grows rather than dropping messages.
      </p>
      <p className="text-base leading-relaxed">
        Classic implementations include <span className="text-[#f59e0b] font-medium">Amazon SQS</span>, <span className="text-accent font-medium">RabbitMQ queues</span>, and <span className="text-accent font-medium">Redis Lists</span>. Each trades off features like ordering guarantees, visibility timeouts, and delivery semantics.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Message Queue with Dead Letter Queue"
        description="Producer enqueues to the back; consumer dequeues FIFO from the front. Failed messages route to the DLQ. Click nodes for details."
        height={400}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Delivery Guarantees</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            name: "At-Most-Once",
            color: "#f59e0b",
            icon: "1️⃣",
            desc: "Message delivered once; no re-delivery on failure. Some messages may be lost. Acceptable for metrics, logs, and non-critical telemetry.",
          },
          {
            name: "At-Least-Once",
            color: "#3b82f6",
            icon: "✅",
            desc: "Message is never lost but may be delivered multiple times on failure. Consumer must be idempotent. The standard for most production systems.",
          },
          {
            name: "Exactly-Once",
            color: "#10b981",
            icon: "🎯",
            desc: "Message processed exactly once. Requires distributed transactions or deduplication at the broker. Complex and expensive. Kafka Streams supports this.",
          },
        ].map((g) => (
          <div key={g.name} className="p-4 rounded-xl border" style={{ borderColor: `${g.color}40`, backgroundColor: `${g.color}0d` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{g.icon}</span>
              <span className="font-bold text-sm font-heading" style={{ color: g.color }}>{g.name}</span>
            </div>
            <p className="text-xs text-txt-2 leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Ordering and FIFO</h2>
      <p>
        Standard queues offer <span className="text-txt-2">best-effort ordering</span>  messages are generally FIFO but not guaranteed under concurrent consumption or redeliveries. <span className="text-[#f59e0b] font-medium">FIFO queues</span> (SQS FIFO, Kafka partitions) guarantee strict order within a partition or group. They typically have lower throughput because ordering requires serialization.
      </p>
      <div className="p-4 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30">
        <div className="font-bold text-accent-2 text-sm font-heading mb-2">When strict ordering matters</div>
        <ul className="text-xs space-y-1 text-txt-2">
          <li>• Financial transactions  debit must come before credit</li>
          <li>• State machine transitions  cancel cannot arrive before create</li>
          <li>• Audit logs  events must be written in causal order</li>
          <li>• Inventory updates  subtract must not precede the add</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Backpressure</h2>
      <p>
        Backpressure is what happens when consumers are slower than producers: the queue depth grows. Monitoring queue depth (e.g., SQS <code className="text-accent-2 bg-[#06b6d4]/10 px-1 rounded">ApproximateNumberOfMessagesVisible</code>) is the key operational metric. Auto-scaling consumer fleets based on queue depth is a standard pattern  scale out when depth exceeds a threshold, scale in when it drains.
      </p>

      <KeyTakeaway variant="important">
        Message queues are the shock absorbers of distributed systems. A queue between a web server and an email worker means an email spike never crashes the API. The queue buffers the load and workers process at a sustainable rate  even if that takes a few extra minutes.
      </KeyTakeaway>

      <KeyTakeaway variant="warning">
        Design consumers to be idempotent from day one. At-least-once is the most practical guarantee, which means duplicates will happen  not just in theory, but every time a consumer restarts mid-processing. Deduplication keys, database upserts, and conditional updates are your tools.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
