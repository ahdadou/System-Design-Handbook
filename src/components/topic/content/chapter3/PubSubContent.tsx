"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { PubSubDiagram } from "@/components/diagrams/pubsub/PubSubDiagram";

const questions = [
  {
    question: "What is the main advantage of Pub/Sub over direct service-to-service calls?",
    options: [
      "Pub/Sub is always faster",
      "Pub/Sub decouples publishers from subscribers  they don't need to know about each other",
      "Pub/Sub provides stronger consistency",
      "Pub/Sub requires fewer servers",
    ],
    correct: 1,
    explanation: "In Pub/Sub, publishers emit events without knowing who receives them. New subscribers can be added without changing the publisher. This loose coupling makes systems more maintainable and scalable.",
  },
  {
    question: "Which messaging system uses a Pub/Sub model?",
    options: ["RabbitMQ (basic queues)", "Apache Kafka (topics)", "PostgreSQL LISTEN/NOTIFY", "Redis LPUSH/RPOP"],
    correct: 1,
    explanation: "Apache Kafka uses a Pub/Sub model with 'topics'. Producers publish to topics; consumer groups subscribe. RabbitMQ can do both queues and pub/sub (exchanges).",
  },
  {
    question: "How does the Pub/Sub pattern differ from a traditional point-to-point message queue?",
    options: [
      "In Pub/Sub, only one subscriber receives each message; in a queue, all consumers receive it",
      "In Pub/Sub, all subscribers receive every message; in a point-to-point queue, only one consumer processes each message",
      "Pub/Sub is synchronous; message queues are asynchronous",
      "Pub/Sub requires a database; message queues do not",
    ],
    correct: 1,
    explanation: "Pub/Sub is a broadcast pattern — every subscriber to a topic receives a copy of each message. Point-to-point queues distribute work: each message is processed by exactly one consumer. Kafka uses Pub/Sub at the topic level, but consumer groups enable point-to-point within a group.",
  },
  {
    question: "A new Analytics Service needs to consume all historical and future order events without affecting existing services. Which Pub/Sub capability makes this possible?",
    options: [
      "Message routing based on consumer priority",
      "Durable message retention — the new service can replay the entire event history from offset 0",
      "Synchronous acknowledgement from all consumers before publishing",
      "Automatic schema migration for new subscribers",
    ],
    correct: 1,
    explanation: "Kafka's durable log stores events on disk for a configurable retention period (days or weeks). A new consumer group can start reading from offset 0 and replay the entire history, then continue with live events. This is impossible with traditional queues that delete messages after consumption.",
  },
  {
    question: "What is a 'topic' in the context of Pub/Sub systems like Kafka?",
    options: [
      "A database table that stores messages permanently",
      "A named channel to which publishers send messages and from which subscribers receive them",
      "A consumer group identifier for load balancing",
      "A network partition within the broker cluster",
    ],
    correct: 1,
    explanation: "A topic is the logical channel or category name in a Pub/Sub system. Publishers send events to a named topic (e.g., 'order-events'); subscribers declare interest in one or more topics and receive all events published there. Topics provide the addressing mechanism that decouples publishers from subscribers.",
  },
  {
    question: "In Kafka's Pub/Sub model, how do multiple independent services each receive every event from a topic?",
    options: [
      "Each service polls the same offset and the broker tracks which received it",
      "Each service has its own consumer group, allowing independent tracking of offsets so each group sees all messages",
      "The broker duplicates the topic for each subscriber",
      "Services must chain events by forwarding them to each other",
    ],
    correct: 1,
    explanation: "Kafka uses consumer groups where each group tracks its own offset independently. If the Inventory Service and Email Service each have separate consumer groups subscribed to 'order-events', both groups receive every event independently. Adding a new service just means creating a new consumer group — zero changes to existing services.",
  },
  {
    question: "What is the trade-off of using Pub/Sub with durable message stores like Kafka compared to synchronous REST calls?",
    options: [
      "Pub/Sub always increases system latency with no benefits",
      "Pub/Sub provides loose coupling and resilience but results in eventual consistency — subscribers process events asynchronously, not immediately",
      "Pub/Sub guarantees stronger consistency than synchronous calls",
      "Pub/Sub requires all services to be online simultaneously",
    ],
    correct: 1,
    explanation: "Pub/Sub systems are asynchronous by nature. When the Order Service publishes an event, the Inventory Service may process it milliseconds or seconds later. The system is eventually consistent, not immediately consistent. This trade-off is acceptable for most use cases and provides resilience — subscribers can be down and catch up when they recover.",
  },
  {
    question: "Which of the following is NOT a valid use case for Pub/Sub architecture?",
    options: [
      "Broadcasting order events to inventory, billing, and notification services",
      "Real-time activity feed updates for social media",
      "Synchronous checkout flow where payment must be confirmed before showing the confirmation page",
      "Log aggregation from multiple services to a central analytics pipeline",
    ],
    correct: 2,
    explanation: "A synchronous checkout confirmation requires an immediate, guaranteed response — the user must see 'payment confirmed' before the page loads. This is a request-response pattern best served by synchronous REST or gRPC calls. Pub/Sub's asynchronous, eventually-consistent nature is inappropriate for flows requiring immediate strong consistency.",
  },
  {
    question: "What is 'fan-out' in a Pub/Sub context?",
    options: [
      "Scaling the publisher to handle more messages",
      "One published event being delivered to multiple independent subscribers simultaneously",
      "A consumer reading from multiple topics at once",
      "Compressing messages before delivery to reduce bandwidth",
    ],
    correct: 1,
    explanation: "Fan-out describes a single published message being delivered to N subscribers. When an 'order.placed' event is published, it fans out to the Inventory, Email, Analytics, and Fraud Detection services simultaneously. This is the defining characteristic of Pub/Sub — one event, multiple reactions, zero coupling.",
  },
  {
    question: "Google Cloud Pub/Sub and AWS SNS are managed Pub/Sub services. What operational burden do they eliminate compared to self-hosted Kafka?",
    options: [
      "They eliminate the need for message schemas",
      "They eliminate cluster management, replication configuration, partition rebalancing, and hardware provisioning",
      "They provide exactly-once delivery by default",
      "They automatically write code for consumers",
    ],
    correct: 1,
    explanation: "Managed Pub/Sub services handle all infrastructure concerns: server provisioning, replication, partition management, upgrades, and scaling. Self-hosted Kafka requires a dedicated team to manage ZooKeeper (or KRaft), monitor broker health, rebalance partitions, and plan capacity. For teams without Kafka expertise, managed services dramatically reduce operational overhead.",
  },
];

export default function PubSubContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Publish-Subscribe (Pub/Sub)</strong> is a messaging pattern where senders (publishers) emit messages to named channels (topics) without knowing who receives them. Subscribers express interest in topics and receive all messages published to them.
      </p>
      <p>
        This pattern is the backbone of event-driven architectures. When a user places an order, the Order Service publishes an <code className="text-accent-2 bg-[#06b6d4]/10 px-1 rounded">order.created</code> event. The Inventory Service, Email Service, and Analytics Service all subscribe independently  no coupling, no cascading failures.
      </p>

      <PubSubDiagram />

      <h2 className="text-2xl font-bold font-heading text-txt">Pub/Sub vs Message Queues</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">Message Queue</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• One consumer processes each message</li>
            <li>• Message deleted after consumption</li>
            <li>• Work distribution pattern</li>
            <li>• Example: Job processing queue</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">Pub/Sub</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• ALL subscribers receive each message</li>
            <li>• Messages persist for subscriber groups</li>
            <li>• Event broadcasting pattern</li>
            <li>• Example: Kafka for event streaming</li>
          </ul>
        </div>
      </div>

      <KeyTakeaway variant="important">
        Kafka is durable Pub/Sub  messages are retained for days/weeks on disk. A new subscriber can replay the entire event history from day 1. This is impossible with traditional message queues and enables powerful event sourcing patterns.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
