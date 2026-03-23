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
  {
    question: "What is a covering index?",
    options: [
      "An index that spans all columns in the table",
      "An index that includes all columns needed to satisfy a query, so the database never needs to access the table rows",
      "An index used as a fallback when the primary index fails",
      "An index that automatically compresses data for storage efficiency",
    ],
    correct: 1,
    explanation: "A covering index contains all columns that a query needs (both filter and select columns). The database can answer the query entirely from the index without a second lookup to the actual table rows, eliminating the extra I/O of 'heap fetches' and making reads significantly faster.",
  },
  {
    question: "For a composite index on (last_name, first_name), which query will NOT efficiently use the index?",
    options: [
      "WHERE last_name = 'Smith'",
      "WHERE last_name = 'Smith' AND first_name = 'John'",
      "WHERE first_name = 'John'",
      "WHERE last_name BETWEEN 'A' AND 'M'",
    ],
    correct: 2,
    explanation: "Composite indexes follow the leftmost prefix rule: the index can be used for queries that start with the first column. A query on first_name alone (skipping last_name) cannot use this index for an index seek — it would require a full index scan. The index only helps when the leftmost column is included in the filter.",
  },
  {
    question: "What is a partial index and why would you use one?",
    options: [
      "An index that only covers half the rows due to storage limits",
      "An index built on a subset of rows that match a WHERE condition, keeping the index small and efficient",
      "An index that only covers some of the columns in a table",
      "An index that is partially built and completed in the background",
    ],
    correct: 1,
    explanation: "A partial index (e.g., CREATE INDEX ON orders (user_id) WHERE status = 'pending') indexes only rows matching a condition. If only 1% of orders are pending, this index is 100x smaller than a full index and faster to scan. It is ideal for queries that always filter on a selective condition.",
  },
  {
    question: "What is a clustered index and how does it differ from a non-clustered index?",
    options: [
      "A clustered index is shared across multiple tables; a non-clustered index is table-specific",
      "A clustered index physically orders table rows on disk to match the index order; a non-clustered index stores pointers to rows separately",
      "A clustered index is built in memory; a non-clustered index is stored on disk",
      "A clustered index covers all columns; a non-clustered index covers only one column",
    ],
    correct: 1,
    explanation: "In a clustered index (e.g., InnoDB primary key), the actual row data is stored in the B-Tree leaf nodes in index order. There can be only one clustered index per table. A non-clustered index stores a copy of the indexed column values plus a pointer (row ID or primary key) to find the actual row.",
  },
  {
    question: "Why should you generally avoid indexing low-cardinality columns like a boolean 'is_active' field?",
    options: [
      "Boolean columns cannot be indexed by any database",
      "Indexes on low-cardinality columns rarely help because the database may find a full table scan faster than using an index that matches 50% of rows",
      "Low-cardinality indexes always cause data corruption",
      "The database automatically creates indexes on boolean columns, so manually adding one wastes resources",
    ],
    correct: 1,
    explanation: "Index effectiveness depends on selectivity. If 60% of rows have is_active = true, the database's query optimizer will often choose a full table scan over the index because reading half the table through an index (which involves random I/O) is slower than a sequential full scan. High-cardinality columns like email or user_id are ideal index candidates.",
  },
  {
    question: "What does the EXPLAIN command in SQL databases tell you?",
    options: [
      "It executes the query and returns a summary of the results",
      "It shows the query execution plan the database intends to use, including index usage and estimated costs",
      "It automatically creates indexes for slow queries",
      "It displays the schema definition of all tables referenced in the query",
    ],
    correct: 1,
    explanation: "EXPLAIN shows the query optimizer's execution plan: which tables are scanned, which indexes are used (or not used), estimated row counts, and estimated cost. Adding ANALYZE (EXPLAIN ANALYZE) actually runs the query and shows real vs. estimated statistics, which is essential for diagnosing index effectiveness.",
  },
  {
    question: "What is an index on an expression (function-based index) and when is it useful?",
    options: [
      "An index that uses a mathematical formula to compress stored values",
      "An index built on the result of a function or expression, allowing queries using that expression to use the index",
      "An index that is computed at query time rather than stored",
      "An index that only exists during the lifetime of a database connection",
    ],
    correct: 1,
    explanation: "A function-based index (e.g., CREATE INDEX ON users (LOWER(email))) stores the computed result. A query WHERE LOWER(email) = 'user@example.com' can then use the index. Without it, applying a function to an indexed column disables index usage and forces a full table scan.",
  },
  {
    question: "Which type of index is most appropriate for full-text search queries?",
    options: [
      "B-Tree index",
      "Hash index",
      "Inverted index (Full-Text Search index)",
      "Composite B-Tree index",
    ],
    correct: 2,
    explanation: "An inverted index maps each unique word (token) to a list of documents containing that word. This enables efficient full-text search across large text fields. B-Tree indexes work well for exact matches and range queries but are inefficient for searching within text content. PostgreSQL's tsvector/tsquery and Elasticsearch both use inverted indexes.",
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
