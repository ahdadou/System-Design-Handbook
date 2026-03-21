"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";

const questions = [
  {
    question: "A transaction that has written data but hasn't committed yet is in which state?",
    options: ["Committed", "Active", "Aborted", "Terminated"],
    correct: 1,
    explanation: "An 'Active' transaction is currently executing  it can read and write data. It hasn't committed yet, so its changes aren't visible to others (depending on isolation level).",
  },
  {
    question: "What happens when a transaction is aborted?",
    options: [
      "Changes are permanently saved",
      "All changes are rolled back as if the transaction never happened",
      "Only the last operation is undone",
      "The database shuts down",
    ],
    correct: 1,
    explanation: "When a transaction aborts (due to error, timeout, or explicit ROLLBACK), all its changes are rolled back. The database returns to the state before the transaction began.",
  },
];

export default function TransactionsContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        A <strong className="text-txt">database transaction</strong> is a sequence of operations treated as a single unit of work. Either all operations succeed (commit) or none do (rollback). Transactions are what make databases trustworthy for financial and business-critical operations.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">Transaction States</h2>
      <div className="relative">
        <div className="flex flex-wrap items-center gap-3 justify-center p-6 bg-surface rounded-xl border border-border-ui">
          {[
            { state: "Active", color: "#3b82f6", desc: "Executing operations" },
            { state: "→" },
            { state: "Partially Committed", color: "#f59e0b", desc: "Last op executed, not yet saved" },
            { state: "→" },
            { state: "Committed", color: "#10b981", desc: "Permanently saved to DB" },
          ].map((s, i) => (
            s.state === "→" ? (
              <span key={i} className="text-txt-3 text-xl font-bold">→</span>
            ) : (
              <div key={i} className="p-3 rounded-xl text-center min-w-32 border" style={{ borderColor: `${s.color}40`, backgroundColor: `${s.color}10` }}>
                <div className="font-bold text-xs font-heading" style={{ color: s.color }}>{s.state}</div>
                <div className="text-[10px] text-txt-3 mt-1">{s.desc}</div>
              </div>
            )
          ))}
        </div>
        <div className="flex justify-center mt-3 gap-6">
          <div className="p-3 rounded-xl text-center border border-[#ef4444]/30 bg-[#ef4444]/10">
            <div className="font-bold text-xs text-[#ef4444] font-heading">Failed</div>
            <div className="text-[10px] text-txt-3 mt-1">Error detected</div>
          </div>
          <span className="text-txt-3 text-xl font-bold self-center">→</span>
          <div className="p-3 rounded-xl text-center border border-[#8b5cf6]/30 bg-[#8b5cf6]/10">
            <div className="font-bold text-xs text-accent font-heading">Aborted</div>
            <div className="text-[10px] text-txt-3 mt-1">Rolled back</div>
          </div>
          <span className="text-txt-3 text-xl font-bold self-center">→</span>
          <div className="p-3 rounded-xl text-center border border-[#475569]/30 bg-[#475569]/10">
            <div className="font-bold text-xs text-txt-3 font-heading">Terminated</div>
            <div className="text-[10px] text-txt-3 mt-1">Transaction ends</div>
          </div>
        </div>
      </div>

      <KeyTakeaway variant="important">
        Classic example: Bank transfer. Transaction debits Account A, then credits Account B. Without transactions, a crash between the two operations would lose money. With transactions, the whole thing rolls back on failure.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
