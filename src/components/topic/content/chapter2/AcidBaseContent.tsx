"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { QuizBlock } from "@/components/ui/QuizBlock";

const questions = [
  {
    question: "In ACID transactions, what does 'Isolation' mean?",
    options: [
      "Transactions run on isolated servers",
      "Concurrent transactions execute as if they run sequentially  no dirty reads",
      "Data is isolated to one database",
      "Transactions are isolated from network failures",
    ],
    correct: 1,
    explanation: "Isolation ensures concurrent transactions don't see each other's partial updates (dirty reads). The highest isolation level (Serializable) makes transactions appear to run one at a time.",
  },
  {
    question: "Which consistency model does Cassandra use by default?",
    options: ["ACID", "BASE  eventually consistent", "SERIALIZABLE", "READ COMMITTED"],
    correct: 1,
    explanation: "Cassandra uses BASE (Basically Available, Soft state, Eventually consistent) by default. Writes propagate to all nodes eventually. You can tune consistency level (ONE, QUORUM, ALL) per query.",
  },
  {
    question: "What is a 'dirty read' and which SQL isolation level prevents it?",
    options: [
      "Reading a row that has been permanently deleted; prevented by Serializable isolation",
      "Reading uncommitted changes from another transaction that may later be rolled back; prevented by Read Committed and higher",
      "Reading a row with NULL values; prevented by Read Uncommitted isolation",
      "Reading an encrypted column without decryption; prevented by any isolation level",
    ],
    correct: 1,
    explanation: "A dirty read occurs when transaction A reads data written by transaction B that has not yet committed. If B then rolls back, A has read data that never officially existed. Read Committed isolation prevents dirty reads by only allowing reads of committed data.",
  },
  {
    question: "A bank transfer debits $100 from Account A and credits $100 to Account B. The server crashes after the debit but before the credit. Which ACID property ensures $100 is not lost?",
    options: [
      "Consistency — because constraints prevent negative balances",
      "Isolation — because no other transaction can see the partial state",
      "Atomicity — because the entire transaction is rolled back on failure",
      "Durability — because the debit was written to disk",
    ],
    correct: 2,
    explanation: "Atomicity guarantees all-or-nothing execution. If the transaction fails at any point, all its changes are rolled back. The debit is undone, so $100 remains in Account A as if the transaction never started. This is typically implemented using an undo log.",
  },
  {
    question: "What does 'Soft State' mean in the BASE model?",
    options: [
      "Data can be deleted at any time by the system without user action",
      "The state of the system may change over time even without new writes, due to eventual consistency propagating updates",
      "Data is stored in a soft (RAM-only) storage layer",
      "The system allows incomplete or malformed data to be stored temporarily",
    ],
    correct: 1,
    explanation: "Soft state means the system's state is not guaranteed to be stable at any given moment. Even without new input from the application, the state may still be changing as replicas propagate updates to reach eventual consistency. This contrasts with ACID's guarantee that the database is in a consistent state after every transaction.",
  },
  {
    question: "Which SQL isolation level provides the strongest consistency guarantee and what is its cost?",
    options: [
      "Read Uncommitted — fastest but allows dirty reads",
      "Read Committed — prevents dirty reads with moderate performance",
      "Repeatable Read — prevents non-repeatable reads, used by MySQL InnoDB by default",
      "Serializable — prevents all anomalies but has the highest locking overhead and lowest throughput",
    ],
    correct: 3,
    explanation: "Serializable isolation ensures that the result of concurrent transactions is identical to some sequential ordering of those transactions. It prevents dirty reads, non-repeatable reads, and phantom reads. However, it requires the most locking or validation overhead, reducing concurrency and throughput significantly.",
  },
  {
    question: "What is a 'phantom read' and which isolation level prevents it?",
    options: [
      "Reading a row that no longer exists; prevented by Read Committed",
      "A situation where a transaction re-executes a range query and finds new rows inserted by another committed transaction; prevented by Serializable isolation",
      "Reading a row whose values have changed between two reads in the same transaction; prevented by Repeatable Read",
      "Reading NULL values from a recently added column; prevented by Read Uncommitted",
    ],
    correct: 1,
    explanation: "A phantom read occurs when a transaction executes a range query twice and the second execution returns additional rows that were inserted and committed by another transaction in between. Repeatable Read prevents value changes in existing rows, but only Serializable isolation (or predicate locking) prevents new rows from appearing.",
  },
  {
    question: "Why is ACID compliance more difficult to achieve in distributed databases than in single-node databases?",
    options: [
      "Distributed databases have slower CPUs that cannot process transactions",
      "Achieving atomicity and isolation across multiple nodes requires coordination protocols like 2PC, which add latency and potential for blocking",
      "SQL is not supported across distributed databases",
      "Distributed databases do not support write operations",
    ],
    correct: 1,
    explanation: "In a single node, ACID is enforced locally with locks and WAL. Across multiple nodes, atomicity requires distributed commit protocols (e.g., Two-Phase Commit), which add network round-trips and can block if a coordinator fails. Isolation requires distributed locking or MVCC coordination. This is why many distributed databases choose BASE over ACID.",
  },
  {
    question: "Which scenario justifies using a BASE-consistent system over an ACID-consistent one?",
    options: [
      "Processing bank transactions where double-charging a customer is unacceptable",
      "Storing medical records where partial updates could cause dangerous inconsistencies",
      "Counting social media post likes where slightly stale counts are acceptable and high write throughput is critical",
      "Processing financial ledger entries that must never be lost",
    ],
    correct: 2,
    explanation: "Like counts on social media posts are a classic BASE use case: they are high-volume write events, slightly stale values are invisible to users, and the cost of BASE (temporary inconsistency) is much less than the benefit (horizontal scalability). ACID systems are appropriate when correctness is non-negotiable, such as financial and medical data.",
  },
  {
    question: "What does 'Consistency' mean in ACID transactions?",
    options: [
      "All nodes in the cluster agree on the same value at the same time",
      "A transaction brings the database from one valid state to another, with all defined constraints satisfied before and after",
      "All transactions complete in the same amount of time",
      "Data is consistent across all geographic regions immediately after a write",
    ],
    correct: 1,
    explanation: "ACID Consistency means that a transaction can only bring the database from one valid state to another valid state. All integrity constraints — foreign keys, uniqueness, NOT NULL, check constraints — must be satisfied after the transaction commits. This is distinct from the 'C' in CAP theorem, which refers to distributed linearizability.",
  },
];

export default function AcidBaseContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">ACID</strong> and <strong className="text-txt">BASE</strong> are competing consistency models for databases. ACID prioritizes correctness; BASE prioritizes availability and performance. The rise of distributed systems made BASE models popular  they're more achievable across multiple machines.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">ACID Properties</h2>
      <div className="space-y-3">
        {[
          { prop: "Atomicity", desc: "All operations in a transaction succeed or ALL fail together. No partial updates. If your bank transfer debits one account but crashes before crediting the other, it rolls back.", color: "#3b82f6" },
          { prop: "Consistency", desc: "A transaction brings the database from one valid state to another. Constraints (foreign keys, unique, not-null) are never violated.", color: "#06b6d4" },
          { prop: "Isolation", desc: "Concurrent transactions don't interfere. You never see partial writes from another transaction. Levels: READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE.", color: "#8b5cf6" },
          { prop: "Durability", desc: "Committed transactions survive crashes. Written to disk (WAL logs). Even if power fails, committed data is not lost.", color: "#10b981" },
        ].map((p) => (
          <div key={p.prop} className="p-4 rounded-xl border border-border-ui bg-surface flex gap-3">
            <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            <div>
              <div className="font-bold text-sm font-heading mb-1" style={{ color: p.color }}>{p.prop}</div>
              <p className="text-xs text-txt-2">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">BASE Properties</h2>
      <p className="text-sm">BASE is the opposite philosophy  sacrifice strict consistency for higher availability and performance in distributed systems.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
        {[
          { prop: "Basically Available", desc: "System is available most of the time  failures are partial, not total", color: "#f59e0b" },
          { prop: "Soft State", desc: "State of the system may change over time, even without new input (replication lag)", color: "#f59e0b" },
          { prop: "Eventually Consistent", desc: "Given enough time with no new updates, all replicas converge to the same value", color: "#f59e0b" },
        ].map((p) => (
          <div key={p.prop} className="p-3 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/5">
            <div className="font-bold text-xs text-[#f59e0b] mb-1 font-heading">{p.prop}</div>
            <p className="text-xs text-txt-2">{p.desc}</p>
          </div>
        ))}
      </div>

      <ComparisonTable
        title="ACID vs BASE"
        columns={[{ key: "acid", label: "ACID", color: "#3b82f6" }, { key: "base", label: "BASE", color: "#f59e0b" }]}
        rows={[
          { feature: "Consistency", acid: "Strong (immediate)", base: "Eventual" },
          { feature: "Availability", acid: "May reject requests", base: "Always available" },
          { feature: "Scalability", acid: "Harder to scale", base: "Scales easily" },
          { feature: "Typical DB", acid: "PostgreSQL, MySQL", base: "Cassandra, DynamoDB" },
          { feature: "Best For", acid: "Financial, critical data", base: "Social media, analytics" },
        ]}
      />

      <KeyTakeaway variant="important">
        Most modern systems use a hybrid approach: ACID for critical transactions (orders, payments) and BASE for non-critical data (activity feeds, view counts). Design your data model to isolate what needs strong consistency.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
