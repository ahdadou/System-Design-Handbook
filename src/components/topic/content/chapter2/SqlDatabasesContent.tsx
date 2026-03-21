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
