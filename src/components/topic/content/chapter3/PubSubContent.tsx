"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { PubSubDiagram } from "@/components/diagrams/pubsub/PubSubDiagram";

const questions = [
  {
    question: "What is the main advantage of Pub/Sub over direct service-to-service calls?",
    options: [
      "Pub/Sub is always faster",
      "Pub/Sub decouples publishers from subscribers — they don't need to know about each other",
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
];

export default function PubSubContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-[#94a3b8]">
      <p className="text-base leading-relaxed">
        <strong className="text-[#f1f5f9]">Publish-Subscribe (Pub/Sub)</strong> is a messaging pattern where senders (publishers) emit messages to named channels (topics) without knowing who receives them. Subscribers express interest in topics and receive all messages published to them.
      </p>
      <p>
        This pattern is the backbone of event-driven architectures. When a user places an order, the Order Service publishes an <code className="text-[#06b6d4] bg-[#06b6d4]/10 px-1 rounded">order.created</code> event. The Inventory Service, Email Service, and Analytics Service all subscribe independently — no coupling, no cascading failures.
      </p>

      <PubSubDiagram />

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Pub/Sub vs Message Queues</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-[#3b82f6] text-sm font-heading mb-2">Message Queue</div>
          <ul className="text-xs space-y-1 text-[#94a3b8]">
            <li>• One consumer processes each message</li>
            <li>• Message deleted after consumption</li>
            <li>• Work distribution pattern</li>
            <li>• Example: Job processing queue</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30">
          <div className="font-bold text-[#8b5cf6] text-sm font-heading mb-2">Pub/Sub</div>
          <ul className="text-xs space-y-1 text-[#94a3b8]">
            <li>• ALL subscribers receive each message</li>
            <li>• Messages persist for subscriber groups</li>
            <li>• Event broadcasting pattern</li>
            <li>• Example: Kafka for event streaming</li>
          </ul>
        </div>
      </div>

      <KeyTakeaway variant="important">
        Kafka is durable Pub/Sub — messages are retained for days/weeks on disk. A new subscriber can replay the entire event history from day 1. This is impossible with traditional message queues and enables powerful event sourcing patterns.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
