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
  {
    question: "What is the primary role of a message queue in a distributed system?",
    options: [
      "To provide a shared database between services",
      "To decouple producers and consumers by buffering messages, allowing them to operate at different rates",
      "To replace synchronous REST API calls with faster alternatives",
      "To store permanent application data",
    ],
    correct: 1,
    explanation: "A message queue acts as a buffer between producers and consumers. Producers enqueue messages without waiting for a consumer; consumers dequeue and process at their own pace. This absorbs traffic spikes and prevents slow consumers from crashing producers.",
  },
  {
    question: "What is 'backpressure' in the context of a message queue?",
    options: [
      "The process of compressing messages before enqueueing",
      "The phenomenon where slow consumers cause the queue depth to grow, signaling that producers are outpacing consumers",
      "The mechanism that forces producers to slow down by blocking their send calls",
      "The automatic deletion of old messages when the queue is full",
    ],
    correct: 1,
    explanation: "Backpressure occurs when consumers process slower than producers produce, causing queue depth to increase. Monitoring queue depth (e.g., SQS ApproximateNumberOfMessagesVisible) is the key operational signal. Auto-scaling consumer fleets based on queue depth is the standard response.",
  },
  {
    question: "Which delivery guarantee risks losing messages but offers the lowest overhead?",
    options: [
      "At-least-once delivery",
      "Exactly-once delivery",
      "At-most-once delivery",
      "First-in-first-out delivery",
    ],
    correct: 2,
    explanation: "At-most-once delivery means a message is sent once; if the consumer fails, the message is not re-delivered. Some messages may be lost. This is acceptable for non-critical use cases like metrics, logs, or telemetry where losing occasional data is tolerable but low overhead is important.",
  },
  {
    question: "Why do FIFO queues typically have lower throughput than standard queues?",
    options: [
      "FIFO queues use a less efficient data structure",
      "FIFO queues require strict ordering, which necessitates serialization and prevents concurrent processing across all messages",
      "FIFO queues store messages in a different format",
      "FIFO queues require additional encryption for each message",
    ],
    correct: 1,
    explanation: "Strict ordering requires that messages be processed sequentially to preserve their order. This limits parallelism. Standard queues sacrifice ordering guarantees in exchange for higher throughput through concurrent delivery. SQS FIFO queues support up to 3,000 messages/second vs. unlimited for standard queues.",
  },
  {
    question: "An email-sending worker consumes from a queue. A malformed email address causes the worker to throw an exception on every attempt. What mechanism prevents this from blocking the queue indefinitely?",
    options: [
      "The queue automatically fixes the malformed address",
      "The visibility timeout ensures the message is never re-delivered",
      "After exceeding the max retry count, the message is moved to a Dead Letter Queue (DLQ)",
      "The producer is notified to resend a corrected message",
    ],
    correct: 2,
    explanation: "A 'poison message' is one that always causes consumer failure. Without a DLQ, it would loop through retries forever, blocking or consuming worker resources. After the configured maxReceiveCount is exceeded, the queue moves the message to the DLQ, allowing engineers to inspect it while the main queue continues processing.",
  },
  {
    question: "What is the SQS 'visibility timeout' and why is it important?",
    options: [
      "The maximum time a message can sit in the queue before expiring",
      "The time period during which a dequeued message is hidden from other consumers, preventing duplicate processing while a consumer works on it",
      "The time SQS waits before delivering a newly enqueued message",
      "The maximum size of a message payload in SQS",
    ],
    correct: 1,
    explanation: "When a consumer receives a message from SQS, the message becomes invisible to other consumers for the visibility timeout duration. If the consumer processes and ACKs the message within this window, SQS deletes it. If it crashes, the timeout expires and the message becomes visible again for another consumer to process.",
  },
  {
    question: "How should a team scale consumer workers when queue depth spikes during peak traffic?",
    options: [
      "Increase the producer's rate limit to slow message production",
      "Enable FIFO ordering to process messages faster",
      "Auto-scale the consumer fleet horizontally based on queue depth metrics",
      "Increase the message retention period",
    ],
    correct: 2,
    explanation: "Auto-scaling consumers based on queue depth is the standard pattern. When depth exceeds a threshold (e.g., >1000 messages), add more consumer instances. When the queue drains, scale in. AWS provides CloudWatch metrics for SQS queue depth that can directly trigger Auto Scaling Group policies.",
  },
  {
    question: "Which of the following is a valid use case for 'exactly-once' delivery semantics?",
    options: [
      "Application log aggregation where occasional duplicates are acceptable",
      "Real-time analytics dashboards where approximate counts are fine",
      "Financial payment processing where processing a payment twice would cause double charges",
      "Email newsletter delivery where sending twice is acceptable",
    ],
    correct: 2,
    explanation: "Exactly-once delivery is expensive (requires distributed transactions or broker-level deduplication) and is only justified when duplicates cause real harm. Financial payments are the classic case: charging a customer twice has direct business consequences. Kafka Streams supports exactly-once semantics for stream processing.",
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
