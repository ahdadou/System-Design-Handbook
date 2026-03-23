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
  {
    question: "What mechanism does a database use to implement transaction rollback?",
    options: [
      "The Buffer Pool, which retains uncommitted pages in memory",
      "The Undo Log, which records the before-image of every changed row",
      "The Write-Ahead Log replay, which re-applies the previous state",
      "A snapshot stored in the operating system's swap space",
    ],
    correct: 1,
    explanation: "The undo log (also called the rollback segment) stores the before-image of every row changed by a transaction. If the transaction is aborted, the database uses the undo log to restore all affected rows to their previous values, as if the transaction never happened.",
  },
  {
    question: "What is the difference between COMMIT and ROLLBACK in SQL?",
    options: [
      "COMMIT saves only the last operation; ROLLBACK undoes only the first operation",
      "COMMIT permanently saves all changes in the transaction; ROLLBACK discards all changes and ends the transaction",
      "COMMIT creates a savepoint; ROLLBACK restores the most recent savepoint",
      "COMMIT and ROLLBACK are synonyms in modern SQL databases",
    ],
    correct: 1,
    explanation: "COMMIT permanently writes all transaction changes to the database, making them visible to other transactions and durable through crashes. ROLLBACK discards all changes made since the transaction began, returning the database to the state before the transaction started.",
  },
  {
    question: "What is a SAVEPOINT in database transactions?",
    options: [
      "A scheduled backup triggered after a large transaction completes",
      "A named marker within a transaction that allows partial rollback to that point without aborting the entire transaction",
      "A checkpoint that flushes the buffer pool to disk",
      "A snapshot of the entire database at a specific timestamp",
    ],
    correct: 1,
    explanation: "A SAVEPOINT creates a named rollback point within a transaction. ROLLBACK TO SAVEPOINT name undoes only the work done after that savepoint, leaving earlier work intact. This is useful for complex operations where you want to retry part of a transaction without restarting from scratch.",
  },
  {
    question: "Why is it important to keep database transactions short?",
    options: [
      "Long transactions consume more disk space permanently",
      "Long transactions hold locks for extended periods, blocking other transactions and reducing throughput",
      "Databases automatically cancel transactions exceeding 1 second",
      "Long transactions prevent the use of indexes",
    ],
    correct: 1,
    explanation: "Transactions hold locks on the rows (or pages, or tables) they have modified. A long-running transaction holds these locks for its entire duration, blocking other transactions that need those same rows. This causes contention, increased latency, and potentially deadlocks. Keeping transactions short and focused minimizes lock hold time.",
  },
  {
    question: "What is a deadlock in database transactions?",
    options: [
      "A transaction that runs for so long it exhausts available memory",
      "A situation where two or more transactions are each waiting for the other to release a lock, causing all to wait indefinitely",
      "A lock that cannot be released because the transaction coordinator has crashed",
      "A transaction that has been rolled back but whose locks were not released",
    ],
    correct: 1,
    explanation: "A deadlock occurs when Transaction A holds a lock on Row 1 and waits for Row 2, while Transaction B holds a lock on Row 2 and waits for Row 1. Neither can proceed. Databases detect deadlocks using a wait-for graph and abort one of the transactions (the 'victim') to break the cycle.",
  },
  {
    question: "What is the 'partially committed' state in a transaction lifecycle?",
    options: [
      "A transaction that has committed on some replicas but not others",
      "The state after a transaction executes its final operation but before the changes are durably written to disk",
      "A transaction that has been aborted but not yet cleaned up",
      "A transaction that is waiting for a lock held by another transaction",
    ],
    correct: 1,
    explanation: "Partially committed means the transaction has finished executing all its operations but the COMMIT has not yet been durably persisted to disk (via the WAL flush). If the system crashes at this point, the transaction may or may not complete depending on whether the WAL flush succeeded before the crash.",
  },
  {
    question: "Which SQL statement explicitly begins a transaction in most databases?",
    options: [
      "EXECUTE TRANSACTION",
      "BEGIN or START TRANSACTION",
      "OPEN TRANSACTION",
      "INIT TRANSACTION",
    ],
    correct: 1,
    explanation: "Most SQL databases use BEGIN (PostgreSQL, SQLite) or START TRANSACTION (MySQL) to explicitly begin a transaction. In auto-commit mode, each SQL statement is its own implicit transaction. Explicitly starting a transaction groups multiple statements to be committed or rolled back atomically.",
  },
  {
    question: "What guarantees does a committed transaction have regarding data persistence?",
    options: [
      "The data will be available for reads immediately but may be lost on a controlled shutdown",
      "The data is permanently stored and will survive crashes, power failures, and server restarts",
      "The data is saved but only for 24 hours before being archived",
      "The data is stored on the primary but not guaranteed to reach replicas",
    ],
    correct: 1,
    explanation: "ACID Durability guarantees that once a transaction is committed, its changes are permanent and survive any subsequent failure — including power loss, system crashes, and restarts. This is achieved by flushing the Write-Ahead Log to durable storage before acknowledging the commit to the client.",
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
