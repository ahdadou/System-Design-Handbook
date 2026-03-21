"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { CapTheoremDiagram } from "@/components/diagrams/cap/CapTheoremDiagram";

const questions = [
  {
    question: "According to the CAP theorem, during a network partition, a distributed system must choose between:",
    options: ["Consistency and Availability", "Performance and Scalability", "Durability and Latency", "Replication and Partitioning"],
    correct: 0,
    explanation: "The CAP theorem states that in the presence of a network Partition, a system must choose between Consistency (every read gets the latest write) and Availability (every request gets a response).",
  },
  {
    question: "Cassandra is described as an AP database. This means:",
    options: [
      "It's always consistent but can be unavailable",
      "It remains available during partitions but may serve stale data",
      "It never has network partitions",
      "It provides both consistency and availability",
    ],
    correct: 1,
    explanation: "AP systems (like Cassandra, DynamoDB) prioritize availability  they always respond, but data may be stale (eventual consistency). During a partition, they serve old data rather than rejecting requests.",
  },
  {
    question: "Why can't a distributed system achieve all three CAP properties simultaneously?",
    options: [
      "Hardware limitations prevent it",
      "Network partitions inevitably occur, and you must choose between C and A when they do",
      "No programming language supports all three",
      "It's a cost constraint, not a technical one",
    ],
    correct: 1,
    explanation: "Network partitions ARE going to happen (cable cuts, network congestion). When they do, you must choose: either reject requests until partition heals (Consistency) or serve potentially stale data (Availability).",
  },
];

export default function CapTheoremContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        The <strong className="text-txt">CAP theorem</strong>, formulated by Eric Brewer in 2000, states that a distributed data store can only guarantee two of three properties simultaneously: <strong className="text-txt">Consistency</strong>, <strong className="text-txt">Availability</strong>, and <strong className="text-txt">Partition Tolerance</strong>.
      </p>
      <p>
        This isn't a limitation of bad engineering  it's a mathematical impossibility. In distributed systems, network partitions will occur. When they do, you're forced to make a choice.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">The Three Properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { prop: "Consistency", icon: "🎯", color: "#3b82f6", desc: "Every read receives the most recent write or an error. All nodes see the same data at the same time." },
          { prop: "Availability", icon: "✅", color: "#8b5cf6", desc: "Every request receives a response (not necessarily the latest data). The system never rejects requests." },
          { prop: "Partition Tolerance", icon: "🔗", color: "#06b6d4", desc: "System continues operating despite network partition (communication failure between nodes)." },
        ].map((p) => (
          <div key={p.prop} className="p-4 rounded-xl border border-border-ui" style={{ backgroundColor: `${p.color}10` }}>
            <div className="text-2xl mb-2">{p.icon}</div>
            <div className="font-bold text-sm font-heading mb-2" style={{ color: p.color }}>{p.prop}</div>
            <p className="text-xs text-txt-2">{p.desc}</p>
          </div>
        ))}
      </div>

      <CapTheoremDiagram />

      <KeyTakeaway variant="important">
        "CA" systems (PostgreSQL, MySQL) are technically not distributed  they assume no partitions. In a truly distributed system, Partition Tolerance is mandatory. So the real choice is always CP vs AP.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">Real-World System Design</h2>
      <p className="text-sm">When designing systems, ask yourself: <em>"What happens to my service when the network between Node A and Node B fails?"</em></p>
      <ul className="space-y-2 text-sm list-none mt-3">
        {[
          "Financial systems (banking, payments): Choose CP. Better to fail the transaction than charge twice.",
          "Shopping carts, social feeds: Choose AP. Better to show slightly stale data than a 500 error.",
          "Most systems use AP with tunable consistency levels (Cassandra's consistency level concept).",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2"><span className="text-accent shrink-0 mt-1">→</span><span>{item}</span></li>
        ))}
      </ul>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
