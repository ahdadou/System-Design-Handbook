"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "app", type: "system", position: { x: 195, y: 20 }, data: { label: "Application", icon: "🖥️", color: "#3b82f6" } },
  { id: "doc", type: "database", position: { x: 20, y: 160 }, data: { label: "MongoDB", type: "Document Store", color: "#10b981", description: "Stores JSON-like BSON documents. Flexible schema, great for hierarchical data." } },
  { id: "kv", type: "database", position: { x: 180, y: 160 }, data: { label: "Redis", type: "Key-Value Store", color: "#ef4444", description: "Ultra-fast in-memory store. Used for caching, sessions, pub/sub, rate limiting." } },
  { id: "wc", type: "database", position: { x: 340, y: 160 }, data: { label: "Cassandra", type: "Wide-Column Store", color: "#8b5cf6", description: "Stores data in rows with dynamic columns. Excellent for time-series and write-heavy workloads." } },
  { id: "graph", type: "database", position: { x: 90, y: 300 }, data: { label: "Neo4j", type: "Graph Database", color: "#f59e0b", description: "Stores data as nodes and edges. Perfect for social networks, recommendation engines, fraud detection." } },
  { id: "ts", type: "database", position: { x: 275, y: 300 }, data: { label: "InfluxDB", type: "Time-Series DB", color: "#06b6d4", description: "Optimized for timestamped data. Used for metrics, IoT data, monitoring dashboards." } },
];

const edges: Edge[] = [
  { id: "e1", source: "app", target: "doc", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e2", source: "app", target: "kv", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e3", source: "app", target: "wc", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e4", source: "app", target: "graph", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e5", source: "app", target: "ts", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
];

const questions = [
  {
    question: "Which NoSQL database type is best suited for a social network's friend-of-friend queries?",
    options: [
      "Key-Value Store (Redis)",
      "Document Store (MongoDB)",
      "Graph Database (Neo4j)",
      "Wide-Column Store (Cassandra)",
    ],
    correct: 2,
    explanation: "Graph databases model relationships as first-class citizens (nodes and edges). Traversing multi-hop relationships like 'friends of friends who also like X' is efficient with graph traversal algorithms, whereas in SQL this requires expensive multi-level JOINs.",
  },
  {
    question: "What does BASE consistency mean in NoSQL systems?",
    options: [
      "Basically Available, Soft-state, Eventual consistency",
      "Batch Atomic Serializable Execution",
      "Basic Availability, Strong Eventual consistency",
      "Basically ACID with Soft constraints and Enforced durability",
    ],
    correct: 0,
    explanation: "BASE is the opposite of ACID: the system is Basically Available (stays up during partial failures), has Soft state (data may change over time without explicit input), and achieves Eventual consistency (all nodes will eventually agree on the same value, but not immediately).",
  },
  {
    question: "Which NoSQL database type uses an LSM-Tree (Log-Structured Merge-Tree) storage engine and excels at write-heavy workloads?",
    options: [
      "Document Store (MongoDB)",
      "Key-Value Store (Redis)",
      "Wide-Column Store (Cassandra)",
      "Graph Database (Neo4j)",
    ],
    correct: 2,
    explanation: "Cassandra uses an LSM-Tree storage engine. Writes go to an in-memory memtable and an append-only commit log, then are periodically flushed and merged into SSTables on disk. This sequential write pattern is extremely fast, making Cassandra ideal for write-heavy workloads like time-series data.",
  },
  {
    question: "What is the main limitation of a key-value store like Redis compared to a document database like MongoDB?",
    options: [
      "Key-value stores have higher latency",
      "Key-value stores cannot persist data to disk",
      "Key-value stores can only retrieve data by key, not by querying field values",
      "Key-value stores require a fixed schema",
    ],
    correct: 2,
    explanation: "Key-value stores only support O(1) lookups by a known key. You cannot efficiently query 'find all users where age > 30' — that would require scanning all keys. Document databases like MongoDB support rich secondary indexes on document fields.",
  },
  {
    question: "When is a time-series database (InfluxDB, TimescaleDB) a better choice than a general-purpose relational database?",
    options: [
      "When you need to store user profiles with complex relationships",
      "When ingesting millions of timestamped data points per second and querying by time ranges with downsampling",
      "When your data requires strong ACID transactions",
      "When you need to perform complex multi-table JOIN operations",
    ],
    correct: 1,
    explanation: "Time-series databases are optimized for sequential timestamp-based writes, automatic data retention/downsampling, and time-window queries (e.g., average CPU usage per minute over the past hour). These operations are extremely slow in general-purpose relational databases at high ingest rates.",
  },
  {
    question: "What does 'schema flexibility' in a document database (MongoDB) actually mean in practice?",
    options: [
      "The database automatically generates schema from your data with no developer input needed",
      "Documents in the same collection can have different fields; schema enforcement shifts to application code",
      "The database uses AI to adapt the schema based on query patterns",
      "There is no schema whatsoever — any data structure can be stored with zero planning",
    ],
    correct: 1,
    explanation: "Schema flexibility means the database does not enforce a schema at write time. Two documents in the same collection can have completely different fields. This speeds up iteration in early development but shifts the responsibility of schema validation and migration to the application layer.",
  },
  {
    question: "Which of the following use cases is best suited for a Redis key-value store?",
    options: [
      "Storing and querying a product catalog with full-text search",
      "Managing complex relational data with multi-table transactions",
      "Caching session tokens, rate limiting counters, and leaderboards",
      "Running ad-hoc analytical queries across billions of records",
    ],
    correct: 2,
    explanation: "Redis excels at use cases requiring ultra-low latency (sub-millisecond), fixed-key access patterns, and data structures like sorted sets (leaderboards), counters (rate limiting), and hashes (session data). Its in-memory architecture makes it the fastest option for these patterns.",
  },
  {
    question: "What does 'eventual consistency' mean in practice for a user of a NoSQL system?",
    options: [
      "The system will eventually be consistent after a major software upgrade",
      "A write to node A may not immediately be visible when reading from node B, but all nodes will converge to the same value given enough time",
      "Data is consistent only at eventual (scheduled) time intervals",
      "The system requires manual consistency checks by the developer",
    ],
    correct: 1,
    explanation: "Eventual consistency means that after a write is accepted, replicas may temporarily serve stale data. Given no further writes and enough time for replication to complete, all nodes converge to the same value. Users may briefly read old data — acceptable for social feeds, problematic for bank balances.",
  },
  {
    question: "Amazon DynamoDB is classified as which type of NoSQL database?",
    options: [
      "Graph database",
      "Wide-column store",
      "Document and key-value store",
      "Time-series database",
    ],
    correct: 2,
    explanation: "DynamoDB is a managed key-value and document database. Items are accessed by a primary key (key-value pattern) and can store structured JSON-like documents. It also supports secondary indexes for additional access patterns.",
  },
  {
    question: "What is 'polyglot persistence' in modern system design?",
    options: [
      "A single database that supports multiple query languages",
      "Using multiple different database types in one system, each chosen for the data model it fits best",
      "Storing the same data in multiple redundant databases for fault tolerance",
      "Translating data between SQL and NoSQL formats automatically",
    ],
    correct: 1,
    explanation: "Polyglot persistence is the practice of using multiple database technologies in a single system, each selected for its strengths. For example: PostgreSQL for transactional data, Redis for caching and sessions, Elasticsearch for full-text search, and Cassandra for time-series metrics — all in one application.",
  },
];

export default function NoSqlDatabasesContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">NoSQL databases</strong> ("Not Only SQL") are non-relational databases designed to handle scale, flexibility, and specialized data models that relational databases struggle with. They trade the strict schema and ACID transactions of SQL for horizontal scalability, schema flexibility, and purpose-built query patterns.
      </p>
      <p className="text-sm leading-relaxed">
        The term "NoSQL" is an umbrella covering at least five distinct database families, each optimized for a different problem. Choosing the right type is a critical architecture decision.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="NoSQL Database Landscape"
        description="Five NoSQL families, each serving a different data model and access pattern"
        height={390}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">The Five NoSQL Families</h2>
      <div className="space-y-3">
        {[
          {
            name: "Document Store  MongoDB, CouchDB",
            color: "#10b981",
            desc: "Stores self-contained JSON/BSON documents. Each document can have a different structure (schema-flexible). Great for catalogs, user profiles, and content management. Supports rich queries but struggles with complex multi-collection joins.",
          },
          {
            name: "Key-Value Store  Redis, DynamoDB",
            color: "#ef4444",
            desc: "The simplest model: a giant hash map. O(1) lookups by key. Used for caching, session storage, rate limiting, and feature flags. Cannot query by value  only by key. Redis extends this with lists, sorted sets, pub/sub, and more.",
          },
          {
            name: "Wide-Column Store  Cassandra, HBase",
            color: "#8b5cf6",
            desc: "Rows have a fixed row key but a dynamic, sparse set of columns. Optimized for time-series and append-heavy workloads. Cassandra's ring topology gives linear write scalability with no single point of failure. Queries must be designed around partition keys.",
          },
          {
            name: "Graph Database  Neo4j, Amazon Neptune",
            color: "#f59e0b",
            desc: "Models data as nodes (entities) and edges (relationships). Traversal queries ('find all users within 3 hops of this user who bought product X') are fast because relationships are stored explicitly, not computed via joins. Used for fraud detection, recommendation engines, and knowledge graphs.",
          },
          {
            name: "Time-Series  InfluxDB, TimescaleDB, Prometheus",
            color: "#06b6d4",
            desc: "Optimized for ingesting, storing, and querying timestamped measurements. Automatic data retention policies, downsampling (roll up minute data into hourly), and specialized query functions (rate of change, moving averages). Used for metrics, IoT sensor data, and financial tick data.",
          },
        ].map((t) => (
          <div key={t.name} className="p-3 rounded-lg border border-border-ui bg-surface flex gap-3">
            <div className="w-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
            <div>
              <div className="font-semibold text-sm text-txt font-heading">{t.name}</div>
              <p className="text-xs text-txt-2 mt-0.5">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">BASE vs ACID</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">ACID (SQL)</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Strict consistency after every transaction</li>
            <li>• All-or-nothing commits</li>
            <li>• Serializable isolation available</li>
            <li>• Harder to scale horizontally</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30">
          <div className="font-bold text-c-success text-sm font-heading mb-2">BASE (NoSQL)</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Basically Available  system stays up</li>
            <li>• Soft state  data may change without input</li>
            <li>• Eventual consistency  nodes converge over time</li>
            <li>• Designed for horizontal scale-out</li>
          </ul>
        </div>
      </div>

      <KeyTakeaway variant="info">
        Schema flexibility is NoSQL's most misunderstood feature. It doesn't mean no schema  it means the schema is enforced by your application code, not the database. This gives you faster iteration in early development but requires disciplined migration strategies as your data evolves.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">When to Choose NoSQL</h2>
      <ul className="space-y-2 text-sm">
        {[
          "Write throughput exceeds what a single RDBMS can handle and sharding SQL becomes too complex.",
          "Your data model is hierarchical (user with nested addresses, products with nested variants) and JOINs are expensive.",
          "You need to store and query hundreds of millions of time-series data points per day.",
          "Your data relationships are the core query pattern (social graphs, dependency trees).",
          "You need ultra-low latency (sub-millisecond) for caching, sessions, or leaderboards.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2 list-none">
            <span className="text-accent-2 shrink-0 mt-1">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
