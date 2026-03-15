"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { QuizBlock } from "@/components/ui/QuizBlock";

const questions = [
  {
    question: "When should you choose a document database (MongoDB) over a relational database?",
    options: [
      "When you need complex multi-table JOINs",
      "When data is naturally document-shaped with varying schemas, and reads are document-centric",
      "When you need strong ACID transactions across multiple collections",
      "When storing highly normalized data",
    ],
    correct: 1,
    explanation: "Document databases excel when data varies per record (flexible schema) and you primarily read/write whole documents. E.g., user profiles with different fields per user.",
  },
  {
    question: "Which NoSQL database type would you use for storing a social graph (user→follows→user)?",
    options: ["Document store (MongoDB)", "Key-value store (Redis)", "Graph database (Neo4j)", "Wide-column store (Cassandra)"],
    correct: 2,
    explanation: "Graph databases (Neo4j, Amazon Neptune) excel at relationship traversal. Finding 'friends of friends' requires expensive recursive JOINs in SQL but is natural in graph DBs.",
  },
];

export default function SqlVsNoSqlContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-[#94a3b8]">
      <p className="text-base leading-relaxed">
        The SQL vs NoSQL debate is often framed as a competition, but experienced engineers treat them as complementary tools. The question isn't "which is better" but "which fits my use case."
      </p>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">NoSQL Database Types</h2>
      <div className="space-y-3">
        {[
          { type: "Document Store", examples: "MongoDB, CouchDB", icon: "📄", color: "#3b82f6", desc: "JSON-like documents with flexible schemas. Good for: content management, user profiles, catalogs. Query by any field." },
          { type: "Key-Value Store", examples: "Redis, DynamoDB, Riak", icon: "🔑", color: "#06b6d4", desc: "Simple key→value lookups. Blazing fast. Good for: caching, sessions, leaderboards, counters." },
          { type: "Wide-Column Store", examples: "Cassandra, HBase, BigTable", icon: "📊", color: "#8b5cf6", desc: "Rows with dynamic columns. Excellent write throughput. Good for: time-series data, IoT, recommendation systems." },
          { type: "Graph Database", examples: "Neo4j, Amazon Neptune", icon: "🕸️", color: "#10b981", desc: "Data as nodes and edges. Good for: social networks, fraud detection, recommendation engines, knowledge graphs." },
          { type: "Time-Series DB", examples: "InfluxDB, TimescaleDB", icon: "📈", color: "#f59e0b", desc: "Optimized for sequential time-based data. Good for: metrics, IoT sensors, financial data, monitoring." },
        ].map((db) => (
          <div key={db.type} className="p-3 rounded-xl border border-[#1e293b] bg-[#111827] flex gap-3">
            <span className="text-xl shrink-0">{db.icon}</span>
            <div>
              <div className="font-semibold text-sm text-[#f1f5f9] font-heading">{db.type}</div>
              <div className="text-xs text-[#475569] mb-1">{db.examples}</div>
              <p className="text-xs text-[#94a3b8]">{db.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <ComparisonTable
        title="SQL vs NoSQL"
        columns={[{ key: "sql", label: "SQL", color: "#3b82f6" }, { key: "nosql", label: "NoSQL", color: "#10b981" }]}
        rows={[
          { feature: "Schema", sql: "Fixed (migrations required)", nosql: "Flexible / Schema-less" },
          { feature: "ACID", sql: "Full support", nosql: "Varies (some support)" },
          { feature: "Relationships", sql: "JOINs & foreign keys", nosql: "Denormalized / embedded" },
          { feature: "Scale", sql: "Primarily vertical", nosql: "Horizontal scaling" },
          { feature: "Query Language", sql: "Standardized SQL", nosql: "Database-specific API" },
          { feature: "Best For", sql: "Structured, relational data", nosql: "Large scale, flexible data" },
        ]}
        verdict={{ sql: "Financial, ERP, CRM", nosql: "Social, IoT, Real-time" }}
      />

      <KeyTakeaway variant="tip">
        Most production systems use multiple databases: PostgreSQL for transactional data, Redis for caching/sessions, Elasticsearch for full-text search, and maybe Cassandra for time-series. This is called "polyglot persistence."
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
