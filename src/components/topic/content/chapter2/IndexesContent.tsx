"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";

const questions = [
  {
    question: "What is the main tradeoff of adding database indexes?",
    options: [
      "Indexes use more network bandwidth",
      "Indexes speed up reads but slow down writes and use extra storage",
      "Indexes only work on primary keys",
      "Indexes cause data inconsistency",
    ],
    correct: 1,
    explanation: "Indexes store extra data structures (B-trees) to speed up lookups. But every INSERT/UPDATE/DELETE must also update all relevant indexes, adding write overhead.",
  },
  {
    question: "If your table has 1 billion rows and no index, what is the query complexity of finding a record by a non-primary-key column?",
    options: ["O(1)", "O(log n)", "O(n)  full table scan", "O(n²)"],
    correct: 2,
    explanation: "Without an index, the database must scan every row (O(n) full table scan). On a billion-row table, this could take minutes. An index reduces this to O(log n)  milliseconds.",
  },
];

export default function IndexesContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        A <strong className="text-txt">database index</strong> is a data structure that improves the speed of data retrieval operations at the cost of additional storage and slower writes. Without indexes, every query would require a full table scan  reading every row to find matches.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">How Indexes Work</h2>
      <p className="text-sm">Most databases use <strong className="text-txt">B-tree indexes</strong> (balanced binary search tree). They maintain sorted copies of column values pointing to row locations. A B-tree lookup is O(log n)  searching 1 billion rows takes only ~30 comparisons.</p>

      <h2 className="text-2xl font-bold font-heading text-txt">Dense vs Sparse Indexes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">Dense Index</div>
          <p className="text-xs text-txt-2">An entry for every single row in the table. Direct pointer to each row. Faster lookups but uses more storage.</p>
          <p className="text-xs text-txt-3 mt-2">MySQL InnoDB secondary indexes, most B-tree indexes</p>
        </div>
        <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30">
          <div className="font-bold text-c-success text-sm font-heading mb-2">Sparse Index</div>
          <p className="text-xs text-txt-2">Only entries for some rows (e.g., first row of each disk page). Smaller index but requires scanning after finding the page.</p>
          <p className="text-xs text-txt-3 mt-2">PostgreSQL heap indexes, clustered primary keys</p>
        </div>
      </div>

      <KeyTakeaway variant="warning">
        Don't over-index. Each index must be updated on every write. A table with 10 indexes has 10x write overhead. Only add indexes for columns you actually query frequently. Use EXPLAIN ANALYZE to check if indexes are being used.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">Index Best Practices</h2>
      <ul className="space-y-2 text-sm list-none">
        {[
          "Always index foreign keys  JOINs without indexed FKs are extremely slow",
          "Use composite indexes for multi-column WHERE clauses (index on (user_id, created_at))",
          "Index columns used in ORDER BY to avoid expensive sort operations",
          "Partial indexes for subsets of data (WHERE status = 'active') to keep indexes small",
          "Use covering indexes to answer queries entirely from the index without touching the table",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2"><span className="text-accent mt-1 shrink-0">→</span><span>{item}</span></li>
        ))}
      </ul>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
