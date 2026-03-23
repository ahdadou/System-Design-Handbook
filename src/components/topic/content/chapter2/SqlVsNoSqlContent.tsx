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
  {
    question: "A startup is building a real-time analytics dashboard that ingests 500,000 sensor readings per second. Which database choice is most appropriate?",
    options: [
      "PostgreSQL with a single primary instance",
      "MySQL with read replicas",
      "A time-series database like InfluxDB or TimescaleDB",
      "MongoDB with full-text search indexes",
    ],
    correct: 2,
    explanation: "Time-series databases are purpose-built for high-ingest sequential writes of timestamped data. They include native support for downsampling, retention policies, and time-window queries — all at write throughputs that general-purpose SQL databases cannot match.",
  },
  {
    question: "What does 'horizontal scaling' mean, and which database category typically supports it more naturally?",
    options: [
      "Adding more CPU/RAM to a single server; SQL databases support this naturally",
      "Adding more servers to distribute the load; NoSQL databases typically support this more naturally",
      "Scaling the number of tables in a single database; both SQL and NoSQL scale the same way",
      "Distributing queries across multiple application servers; neither SQL nor NoSQL databases are involved",
    ],
    correct: 1,
    explanation: "Horizontal scaling (scale-out) adds more machines to handle increased load. NoSQL databases like Cassandra and DynamoDB were designed from the ground up to distribute data across many nodes. Traditional SQL databases scale vertically (bigger machines) more naturally, though modern distributed SQL databases (CockroachDB, Spanner) bridge this gap.",
  },
  {
    question: "Which scenario best justifies choosing PostgreSQL over MongoDB?",
    options: [
      "Your application handles 1 million writes per second across many geographically distributed nodes",
      "Your data structure changes frequently during early-stage development",
      "You need to enforce complex relationships between entities with strong referential integrity and multi-table transactions",
      "You are building a caching layer that requires sub-millisecond response times",
    ],
    correct: 2,
    explanation: "PostgreSQL excels when data has strong relationships enforced by foreign keys, when ACID transactions spanning multiple tables are required, and when a well-defined, consistent schema matters. These properties are exactly what relational databases were designed to provide.",
  },
  {
    question: "What is the key schema trade-off between SQL and most NoSQL databases?",
    options: [
      "SQL has no schema; NoSQL enforces a strict schema at write time",
      "SQL enforces a fixed schema at write time; most NoSQL databases have flexible or schema-less designs",
      "Both SQL and NoSQL enforce the same schema rules",
      "SQL schemas are optional; NoSQL schemas are always required",
    ],
    correct: 1,
    explanation: "SQL databases enforce a predefined schema on every write — the database rejects data that doesn't match. Most NoSQL databases shift schema enforcement to the application layer, allowing documents with different shapes in the same collection. This flexibility accelerates development but can lead to inconsistent data if not managed carefully.",
  },
  {
    question: "You are designing a global e-commerce platform. You decide to use PostgreSQL for orders and Redis for shopping carts. What pattern does this represent?",
    options: [
      "Database sharding",
      "Database federation",
      "Polyglot persistence",
      "Read replica pattern",
    ],
    correct: 2,
    explanation: "Polyglot persistence is the practice of using multiple database technologies in one system, each chosen for the workload it fits best. PostgreSQL handles transactional order data (strong ACID), while Redis provides ultra-low latency for ephemeral cart data.",
  },
  {
    question: "When would you use a wide-column store (Cassandra) over a relational database for user activity logs?",
    options: [
      "When you need to run complex analytical JOINs across users and their activities",
      "When activity data must satisfy foreign key constraints to user records",
      "When you need to ingest billions of append-only activity events with high write throughput and query by user ID and time range",
      "When you need to enforce unique constraints on activity event IDs",
    ],
    correct: 2,
    explanation: "Wide-column stores like Cassandra are optimized for append-heavy write workloads and queries by partition key (user ID) and clustering column (timestamp). Billions of event rows with high write rates would overwhelm a single relational database, while Cassandra scales linearly by adding nodes.",
  },
  {
    question: "What is a major operational advantage of NoSQL databases over traditional relational databases when handling rapidly growing data volumes?",
    options: [
      "NoSQL databases never require data migrations",
      "NoSQL databases can be scaled horizontally by adding commodity servers without schema changes",
      "NoSQL databases have stronger data consistency guarantees",
      "NoSQL databases do not require any indexing strategy",
    ],
    correct: 1,
    explanation: "Most NoSQL databases are designed to scale out by adding nodes to a cluster. This is often transparent to the application and does not require schema migrations. In contrast, scaling a relational database typically requires vertical scaling (bigger hardware) or complex sharding setups.",
  },
  {
    question: "Which SQL feature does NOT have a direct equivalent in most document databases?",
    options: [
      "Filtering records by field value",
      "Sorting results by a field",
      "Multi-collection JOIN with referential integrity enforcement",
      "Limiting the number of returned results",
    ],
    correct: 2,
    explanation: "SQL JOINs combine data across tables based on matching key values, with foreign keys enforcing that references are valid. Document databases like MongoDB can perform lookups across collections, but they do not natively enforce referential integrity. The application must manage relationship consistency.",
  },
];

export default function SqlVsNoSqlContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        The SQL vs NoSQL debate is often framed as a competition, but experienced engineers treat them as complementary tools. The question isn't "which is better" but "which fits my use case."
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">NoSQL Database Types</h2>
      <div className="space-y-3">
        {[
          { type: "Document Store", examples: "MongoDB, CouchDB", icon: "📄", color: "#3b82f6", desc: "JSON-like documents with flexible schemas. Good for: content management, user profiles, catalogs. Query by any field." },
          { type: "Key-Value Store", examples: "Redis, DynamoDB, Riak", icon: "🔑", color: "#06b6d4", desc: "Simple key→value lookups. Blazing fast. Good for: caching, sessions, leaderboards, counters." },
          { type: "Wide-Column Store", examples: "Cassandra, HBase, BigTable", icon: "📊", color: "#8b5cf6", desc: "Rows with dynamic columns. Excellent write throughput. Good for: time-series data, IoT, recommendation systems." },
          { type: "Graph Database", examples: "Neo4j, Amazon Neptune", icon: "🕸️", color: "#10b981", desc: "Data as nodes and edges. Good for: social networks, fraud detection, recommendation engines, knowledge graphs." },
          { type: "Time-Series DB", examples: "InfluxDB, TimescaleDB", icon: "📈", color: "#f59e0b", desc: "Optimized for sequential time-based data. Good for: metrics, IoT sensors, financial data, monitoring." },
        ].map((db) => (
          <div key={db.type} className="p-3 rounded-xl border border-border-ui bg-surface flex gap-3">
            <span className="text-xl shrink-0">{db.icon}</span>
            <div>
              <div className="font-semibold text-sm text-txt font-heading">{db.type}</div>
              <div className="text-xs text-txt-3 mb-1">{db.examples}</div>
              <p className="text-xs text-txt-2">{db.desc}</p>
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
