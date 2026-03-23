"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "app", type: "system", position: { x: 200, y: 20 }, data: { label: "Application", icon: "🖥️", color: "#3b82f6" } },
  { id: "orm", type: "system", position: { x: 200, y: 120 }, data: { label: "ORM Layer", sublabel: "Sequelize / Prisma / Hibernate", icon: "🔄", color: "#06b6d4", description: "Maps object models to SQL queries. Convenient but can generate inefficient queries if used carelessly." } },
  { id: "primary", type: "database", position: { x: 100, y: 240 }, data: { label: "Primary DB", type: "Reads + Writes", color: "#3b82f6", description: "Handles all writes. Changes stream to read replicas asynchronously." } },
  { id: "replica", type: "database", position: { x: 320, y: 240 }, data: { label: "Read Replica", type: "Read-only", color: "#10b981", description: "Serves read-heavy queries. May serve slightly stale data due to replication lag." } },
  { id: "cache", type: "system", position: { x: 200, y: 340 }, data: { label: "Query Cache / CDN", sublabel: "Materialized results", icon: "⚡", color: "#f59e0b" } },
];

const edges: Edge[] = [
  { id: "e1", source: "app", target: "orm", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "orm", target: "primary", label: "Writes", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e3", source: "orm", target: "replica", label: "Reads", animated: true, style: { stroke: "#10b981", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e4", source: "primary", target: "replica", label: "Replicate", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5, strokeDasharray: "4,4" }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e5", source: "primary", target: "cache", style: { stroke: "#f59e0b", strokeWidth: 1.5, strokeDasharray: "4,4" } },
];

const questions = [
  {
    question: "Which of these best describes the N+1 query problem?",
    options: [
      "Running the same query N times in parallel for performance",
      "Fetching N parent records with one query, then issuing one additional query per record to fetch related data",
      "A query that scans N+1 more rows than necessary due to a missing index",
      "Joining N+1 tables in a single SQL statement",
    ],
    correct: 1,
    explanation: "N+1 occurs when you load a list of N items and then, for each item, fire an individual query to get its related data. For 100 posts, that's 1 + 100 = 101 queries. Fix it with JOIN or eager loading (e.g., Prisma's `include`, Django's `select_related`).",
  },
  {
    question: "What does a materialized view store compared to a regular view?",
    options: [
      "Only the SQL definition  it executes the query every time it is read",
      "The precomputed, cached result set on disk  it must be refreshed to reflect new data",
      "A compressed copy of the base table with fewer columns",
      "An encrypted snapshot of the view for security purposes",
    ],
    correct: 1,
    explanation: "A regular view runs its query every time you SELECT from it. A materialized view stores the actual result rows on disk. Reads are instant, but the data can go stale until you run REFRESH MATERIALIZED VIEW (PostgreSQL) or the database refreshes it on a schedule.",
  },
  {
    question: "What does the 'D' in ACID stand for, and how is it typically achieved?",
    options: [
      "Determinism — by using fixed query plans",
      "Durability — by writing committed data to disk via the Write-Ahead Log",
      "Distribution — by replicating data to multiple nodes",
      "Deduplication — by eliminating redundant rows on commit",
    ],
    correct: 1,
    explanation: "Durability guarantees that once a transaction is committed, it survives crashes. This is achieved using the Write-Ahead Log (WAL): changes are persisted to an append-only log on disk before being applied to data files. On crash recovery, the WAL is replayed to restore committed state.",
  },
  {
    question: "Which SQL isolation level prevents dirty reads but still allows non-repeatable reads?",
    options: [
      "Read Uncommitted",
      "Read Committed",
      "Repeatable Read",
      "Serializable",
    ],
    correct: 1,
    explanation: "Read Committed prevents dirty reads (you never see uncommitted data from other transactions), but a row you read once may change if another transaction commits between your two reads in the same transaction — a non-repeatable read. This is the default isolation level in PostgreSQL.",
  },
  {
    question: "What is the primary advantage of using keyset pagination over OFFSET-based pagination?",
    options: [
      "Keyset pagination is easier to implement",
      "Keyset pagination avoids scanning and skipping rows, making it O(log n) regardless of page number",
      "Keyset pagination supports random page access by page number",
      "Keyset pagination works without any indexes",
    ],
    correct: 1,
    explanation: "OFFSET pagination scans and discards all preceding rows, making page 1000 scan 1000 * page_size rows. Keyset pagination uses a WHERE clause with the last seen value (e.g., WHERE id > last_id LIMIT 20), which uses an index directly and is O(log n) regardless of how deep you paginate.",
  },
  {
    question: "Why is SELECT * generally discouraged in production SQL queries?",
    options: [
      "SELECT * causes SQL syntax errors in some databases",
      "SELECT * fetches all columns, increasing I/O and network transfer even when only a few columns are needed",
      "SELECT * prevents the use of indexes entirely",
      "SELECT * is slower than individual column selection because of alphabetic sorting",
    ],
    correct: 1,
    explanation: "SELECT * fetches every column including large text and blob fields you may not need. This increases disk I/O, network bandwidth, and memory usage. Selecting only needed columns reduces data transfer and can enable covering indexes (answering the query entirely from the index without touching the table).",
  },
  {
    question: "What does EXPLAIN ANALYZE do in PostgreSQL?",
    options: [
      "It analyzes the table statistics and rebuilds indexes",
      "It executes the query and shows the actual execution plan with real row counts and timing",
      "It validates the SQL syntax without executing the query",
      "It creates an optimized stored procedure from the query",
    ],
    correct: 1,
    explanation: "EXPLAIN shows the planned execution strategy. EXPLAIN ANALYZE actually runs the query and shows both the planned and actual row counts, timing, and node-by-node costs. This lets you identify full table scans, bad row count estimates, and inefficient join strategies.",
  },
  {
    question: "What is a foreign key constraint in SQL?",
    options: [
      "A key used to encrypt data stored in the database",
      "A column or set of columns that references the primary key of another table, enforcing referential integrity",
      "A backup primary key used when the main key is unavailable",
      "An index on a column belonging to a remote (foreign) database",
    ],
    correct: 1,
    explanation: "A foreign key is a referential integrity constraint. It ensures that a value in column A of table T1 must match a value in the primary key of table T2. The database rejects inserts or updates that would create orphaned references.",
  },
  {
    question: "Which SQL join type returns all rows from the left table even if there is no matching row in the right table?",
    options: [
      "INNER JOIN",
      "CROSS JOIN",
      "LEFT OUTER JOIN",
      "FULL JOIN",
    ],
    correct: 2,
    explanation: "LEFT OUTER JOIN returns all rows from the left table. For rows where no matching row exists in the right table, the right-table columns are filled with NULL. This is commonly used to find records with no related records (e.g., users who have never placed an order).",
  },
  {
    question: "What is a composite index and when should you use one?",
    options: [
      "An index that compresses data using multiple algorithms simultaneously",
      "An index spanning multiple columns, best used when queries filter on those columns together",
      "An index that covers all columns in a table automatically",
      "An index shared between multiple tables via foreign keys",
    ],
    correct: 1,
    explanation: "A composite index covers multiple columns in a defined order, e.g., INDEX(user_id, created_at). It speeds up queries that filter on both columns together. The column order matters: the index can satisfy queries filtering on the leftmost prefix but not arbitrary column subsets.",
  },
];

export default function SqlDatabasesContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Relational databases (RDBMS)</strong> organize data into tables of rows and columns with strict, predefined schemas. SQL (Structured Query Language) provides a declarative way to query, insert, update, and delete data. PostgreSQL, MySQL, and SQLite are among the most widely deployed software systems in the world.
      </p>
      <p className="text-sm leading-relaxed">
        The relational model was introduced by Edgar Codd in 1970. Its enduring power comes from two things: <strong className="text-txt">expressive JOIN operations</strong> that let you combine data across tables without duplicating it, and <strong className="text-txt">ACID guarantees</strong> that make transactional consistency predictable.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="SQL Database with Read Replica"
        description="Writes go to the primary, reads are served by a replica to distribute load"
        height={400}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">ACID Guarantees</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { letter: "A", word: "Atomicity", color: "#3b82f6", desc: "All operations in a transaction succeed or all are rolled back. There is no partial commit. If a bank transfer deducts money but then crashes before crediting the recipient, the deduction is undone." },
          { letter: "C", word: "Consistency", color: "#06b6d4", desc: "A transaction brings the database from one valid state to another valid state. All integrity constraints (foreign keys, unique constraints) must hold before and after." },
          { letter: "I", word: "Isolation", color: "#8b5cf6", desc: "Concurrent transactions execute as if they were serial. Isolation levels (Read Committed, Repeatable Read, Serializable) trade performance for stricter guarantees." },
          { letter: "D", word: "Durability", color: "#10b981", desc: "Once a transaction is committed, it persists even through crashes. Achieved via the write-ahead log (WAL)  changes are logged to disk before being applied to data files." },
        ].map((a) => (
          <div key={a.letter} className="p-4 rounded-xl border border-border-ui" style={{ backgroundColor: `${a.color}10` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-black font-heading" style={{ color: a.color }}>{a.letter}</span>
              <span className="font-bold text-sm font-heading text-txt">{a.word}</span>
            </div>
            <p className="text-xs text-txt-2">{a.desc}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="warning">
        Schema enforcement is a double-edged sword. It prevents bad data from entering the database  great for correctness. But schema migrations on large tables can be painful: adding a column to a 500M-row table in MySQL can lock the table for minutes. Use online DDL tools (pt-online-schema-change, gh-ost) in production.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">The N+1 Query Problem</h2>
      <p className="text-sm leading-relaxed">
        The N+1 problem is one of the most common performance pitfalls when using an ORM. It happens when you fetch a list of records and then, inside a loop, query for related data on each one individually.
      </p>
      <div className="p-4 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 mt-2">
        <div className="font-bold text-[#ef4444] text-sm font-heading mb-2">Bad Pattern (N+1)</div>
        <pre className="text-xs text-txt-2 whitespace-pre-wrap font-mono">
          {`const posts = await Post.findAll();          // 1 query
for (const post of posts) {
  post.author = await User.findById(post.userId); // N queries
}`}
        </pre>
      </div>
      <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 mt-2">
        <div className="font-bold text-c-success text-sm font-heading mb-2">Good Pattern (JOIN / Eager Load)</div>
        <pre className="text-xs text-txt-2 whitespace-pre-wrap font-mono">
          {`const posts = await Post.findAll({
  include: [{ model: User, as: "author" }]  // 1 JOIN query
});`}
        </pre>
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Materialized Views</h2>
      <p className="text-sm leading-relaxed">
        A <strong className="text-txt">materialized view</strong> is a computed view whose results are stored as a real table on disk. Instead of re-running an expensive aggregation query on every request, you pre-compute it and read from the cached result.
      </p>
      <div className="space-y-3 mt-3">
        {[
          { label: "Regular View", desc: "Runs the underlying SQL every time you query it. Always fresh but can be slow for heavy aggregations.", color: "#f59e0b" },
          { label: "Materialized View", desc: "Result rows stored on disk. Reads are instant. Must be refreshed (manually or on schedule) to stay current.", color: "#06b6d4" },
          { label: "Use Case", desc: "Dashboards, analytics, leaderboards  anything where slightly stale data is acceptable and query speed matters.", color: "#8b5cf6" },
        ].map((m) => (
          <div key={m.label} className="p-3 rounded-lg border border-border-ui bg-surface flex gap-3">
            <div className="w-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
            <div>
              <div className="font-semibold text-sm text-txt font-heading">{m.label}</div>
              <p className="text-xs text-txt-2 mt-0.5">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Query Optimization Tips</h2>
      <ul className="space-y-2 text-sm">
        {[
          "Use EXPLAIN ANALYZE to see the actual execution plan and identify full table scans.",
          "Index columns used in WHERE, JOIN, and ORDER BY clauses. Composite indexes should match query column order.",
          "Avoid SELECT *  fetch only the columns you need to reduce I/O and network transfer.",
          "Use pagination (LIMIT + OFFSET or keyset pagination) to avoid loading thousands of rows at once.",
          "Batch inserts: INSERT INTO … VALUES (1), (2), (3) is far faster than three individual INSERT statements.",
        ].map((tip, i) => (
          <li key={i} className="flex items-start gap-2 list-none">
            <span className="text-accent-2 shrink-0 mt-1">→</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
