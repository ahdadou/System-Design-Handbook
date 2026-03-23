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
  {
    question: "In the CAP theorem, what does 'Consistency' specifically mean?",
    options: [
      "The database never loses data after a crash",
      "Every read receives the most recent write or an error — all nodes see the same data at the same time",
      "All transactions complete with no errors",
      "The same query always returns results in the same time",
    ],
    correct: 1,
    explanation: "CAP Consistency (also called linearizability) means every read returns the most recent committed write, regardless of which node serves the request. This is a strong guarantee — nodes cannot serve stale data. Note: this is different from ACID Consistency, which is about constraint satisfaction.",
  },
  {
    question: "Why is 'CA' (Consistent + Available, no Partition Tolerance) not a realistic option for distributed systems?",
    options: [
      "CA systems are too expensive to operate",
      "Network partitions are unavoidable in distributed systems, so Partition Tolerance cannot be abandoned",
      "CA systems require specialized hardware not widely available",
      "No database vendor offers CA configurations",
    ],
    correct: 1,
    explanation: "In any distributed system, network partitions will occur (cables fail, switches drop packets). You cannot simply opt out of Partition Tolerance. The real trade-off for distributed systems is always CP vs AP — what to do WHEN a partition happens. 'CA' systems are effectively single-node systems that assume no partitions.",
  },
  {
    question: "A payment processing system that must never process a payment twice opts for CP during a network partition. What is the user experience consequence?",
    options: [
      "Payments may be processed twice during a partition",
      "The service returns an error or becomes unavailable during the partition to maintain consistency",
      "Payments are automatically retried with exponential backoff",
      "The system switches to an AP mode automatically",
    ],
    correct: 1,
    explanation: "CP systems (like ZooKeeper, HBase) refuse to serve requests they cannot satisfy consistently. During a network partition, a CP payment system will reject payment requests rather than risk a double-charge or inconsistent state. This is the correct trade-off for financial systems where consistency is paramount.",
  },
  {
    question: "Which of the following is a CP (Consistent + Partition Tolerant) database?",
    options: [
      "Cassandra",
      "DynamoDB (default configuration)",
      "HBase",
      "CouchDB",
    ],
    correct: 2,
    explanation: "HBase is a CP system — it guarantees strong consistency for reads and writes even during partitions, but may become unavailable if a partition occurs and a quorum cannot be reached. Cassandra and DynamoDB are AP by default, prioritizing availability and eventual consistency.",
  },
  {
    question: "What does 'Partition Tolerance' mean in the CAP theorem?",
    options: [
      "The system can partition its data across multiple tables",
      "The system continues operating correctly when network communication fails between some nodes",
      "The system supports horizontal partitioning (sharding) of data",
      "The system tolerates data loss during network outages",
    ],
    correct: 1,
    explanation: "Partition Tolerance means the system continues to function even when network messages between nodes are lost or delayed (a network partition). In distributed systems, this is not optional — partitions will happen. The question is how the system behaves when they do.",
  },
  {
    question: "A social media platform decides to use an AP database for its news feed. During a network partition, a user in Europe may see a post that a user in the US cannot yet see. What is this called?",
    options: [
      "A race condition",
      "Eventual consistency — different nodes temporarily have different views of the data",
      "A write conflict that requires manual resolution",
      "A dirty read caused by uncommitted transactions",
    ],
    correct: 1,
    explanation: "This is eventual consistency in action. An AP system serves all requests during a partition, but different nodes may temporarily have different data. Given time and no further updates, all nodes will converge. For social feeds, this temporary inconsistency is acceptable — a user seeing a post a few seconds before another is not a critical failure.",
  },
  {
    question: "What is a practical limitation of the CAP theorem's usefulness for system design?",
    options: [
      "The CAP theorem only applies to databases with more than 1,000 nodes",
      "The CAP theorem treats consistency and availability as binary, but real systems offer tunable trade-offs across a spectrum",
      "The CAP theorem has been mathematically disproved and should not be used",
      "The CAP theorem only applies to NoSQL databases, not relational databases",
    ],
    correct: 1,
    explanation: "CAP presents a binary choice, but real systems offer gradations. Cassandra lets you tune consistency level per query (ONE, QUORUM, ALL). DynamoDB offers both eventually consistent and strongly consistent reads. The PACELC theorem improves on CAP by adding the latency vs. consistency trade-off that exists in normal operation, not just during partitions.",
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
