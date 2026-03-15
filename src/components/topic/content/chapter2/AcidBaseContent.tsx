"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { QuizBlock } from "@/components/ui/QuizBlock";

const questions = [
  {
    question: "In ACID transactions, what does 'Isolation' mean?",
    options: [
      "Transactions run on isolated servers",
      "Concurrent transactions execute as if they run sequentially — no dirty reads",
      "Data is isolated to one database",
      "Transactions are isolated from network failures",
    ],
    correct: 1,
    explanation: "Isolation ensures concurrent transactions don't see each other's partial updates (dirty reads). The highest isolation level (Serializable) makes transactions appear to run one at a time.",
  },
  {
    question: "Which consistency model does Cassandra use by default?",
    options: ["ACID", "BASE — eventually consistent", "SERIALIZABLE", "READ COMMITTED"],
    correct: 1,
    explanation: "Cassandra uses BASE (Basically Available, Soft state, Eventually consistent) by default. Writes propagate to all nodes eventually. You can tune consistency level (ONE, QUORUM, ALL) per query.",
  },
];

export default function AcidBaseContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-[#94a3b8]">
      <p className="text-base leading-relaxed">
        <strong className="text-[#f1f5f9]">ACID</strong> and <strong className="text-[#f1f5f9]">BASE</strong> are competing consistency models for databases. ACID prioritizes correctness; BASE prioritizes availability and performance. The rise of distributed systems made BASE models popular — they're more achievable across multiple machines.
      </p>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">ACID Properties</h2>
      <div className="space-y-3">
        {[
          { prop: "Atomicity", desc: "All operations in a transaction succeed or ALL fail together. No partial updates. If your bank transfer debits one account but crashes before crediting the other, it rolls back.", color: "#3b82f6" },
          { prop: "Consistency", desc: "A transaction brings the database from one valid state to another. Constraints (foreign keys, unique, not-null) are never violated.", color: "#06b6d4" },
          { prop: "Isolation", desc: "Concurrent transactions don't interfere. You never see partial writes from another transaction. Levels: READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE.", color: "#8b5cf6" },
          { prop: "Durability", desc: "Committed transactions survive crashes. Written to disk (WAL logs). Even if power fails, committed data is not lost.", color: "#10b981" },
        ].map((p) => (
          <div key={p.prop} className="p-4 rounded-xl border border-[#1e293b] bg-[#111827] flex gap-3">
            <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            <div>
              <div className="font-bold text-sm font-heading mb-1" style={{ color: p.color }}>{p.prop}</div>
              <p className="text-xs text-[#94a3b8]">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">BASE Properties</h2>
      <p className="text-sm">BASE is the opposite philosophy — sacrifice strict consistency for higher availability and performance in distributed systems.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
        {[
          { prop: "Basically Available", desc: "System is available most of the time — failures are partial, not total", color: "#f59e0b" },
          { prop: "Soft State", desc: "State of the system may change over time, even without new input (replication lag)", color: "#f59e0b" },
          { prop: "Eventually Consistent", desc: "Given enough time with no new updates, all replicas converge to the same value", color: "#f59e0b" },
        ].map((p) => (
          <div key={p.prop} className="p-3 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/5">
            <div className="font-bold text-xs text-[#f59e0b] mb-1 font-heading">{p.prop}</div>
            <p className="text-xs text-[#94a3b8]">{p.desc}</p>
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
