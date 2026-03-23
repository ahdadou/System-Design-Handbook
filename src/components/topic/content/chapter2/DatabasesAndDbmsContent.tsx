"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "client", type: "system", position: { x: 200, y: 20 }, data: { label: "Client Application", icon: "💻", color: "#3b82f6" } },
  { id: "qp", type: "system", position: { x: 200, y: 120 }, data: { label: "Query Processor", sublabel: "Parse, Optimize, Execute", icon: "⚙️", color: "#06b6d4", description: "Parses SQL, builds an execution plan, and optimizes the query before handing it to the storage engine." } },
  { id: "tm", type: "system", position: { x: 60, y: 230 }, data: { label: "Transaction Manager", sublabel: "ACID guarantees", icon: "🔒", color: "#8b5cf6", description: "Manages locks, concurrency control, and ensures atomicity and isolation for concurrent transactions." } },
  { id: "se", type: "system", position: { x: 340, y: 230 }, data: { label: "Storage Engine", sublabel: "InnoDB / RocksDB", icon: "🗄️", color: "#10b981", description: "Handles the physical layout of data on disk, manages pages, and coordinates with the buffer pool." } },
  { id: "bp", type: "system", position: { x: 200, y: 230 }, data: { label: "Buffer Pool", sublabel: "In-memory cache", icon: "⚡", color: "#f59e0b", description: "Keeps hot pages in RAM so frequent reads skip expensive disk I/O." } },
  { id: "disk", type: "database", position: { x: 200, y: 340 }, data: { label: "Disk Storage", type: "Data + Indexes + Logs", color: "#ef4444" } },
];

const edges: Edge[] = [
  { id: "e1", source: "client", target: "qp", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "qp", target: "tm", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 1.5 } },
  { id: "e3", source: "qp", target: "bp", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
  { id: "e4", source: "bp", target: "se", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e5", source: "se", target: "disk", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e6", source: "tm", target: "se", style: { stroke: "#8b5cf6", strokeWidth: 1.5, strokeDasharray: "4,4" } },
];

const questions = [
  {
    question: "Which DBMS component is responsible for parsing SQL queries and creating an optimal execution plan?",
    options: [
      "The Storage Engine",
      "The Buffer Pool",
      "The Query Processor",
      "The Transaction Manager",
    ],
    correct: 2,
    explanation: "The Query Processor parses the SQL text into an abstract syntax tree, uses statistics about the data to evaluate multiple execution plans, and picks the cheapest one before delegating to the storage engine.",
  },
  {
    question: "What is the primary purpose of an index in a relational database?",
    options: [
      "To enforce uniqueness constraints across rows",
      "To allow queries to locate rows without scanning every row in the table",
      "To compress data and reduce disk usage",
      "To replicate data to standby servers",
    ],
    correct: 1,
    explanation: "An index (typically a B-Tree) stores a sorted copy of one or more columns plus pointers back to the full row. This lets the database jump directly to matching rows in O(log n) time rather than doing a full O(n) table scan.",
  },
  {
    question: "What is the purpose of the Write-Ahead Log (WAL) in a DBMS?",
    options: [
      "To cache frequently read data pages in memory",
      "To compress data before writing it to disk",
      "To record changes before applying them, enabling crash recovery",
      "To replicate data to secondary servers",
    ],
    correct: 2,
    explanation: "The WAL is an append-only log where every change is recorded before it modifies the actual data files. If the database crashes mid-write, it replays the WAL on restart to restore the database to a consistent state.",
  },
  {
    question: "What does MVCC (Multi-Version Concurrency Control) allow a database to do?",
    options: [
      "Store multiple copies of each table for redundancy",
      "Allow readers and writers to proceed concurrently without blocking each other",
      "Automatically partition large tables across multiple servers",
      "Encrypt multiple versions of a row for security",
    ],
    correct: 1,
    explanation: "MVCC maintains multiple versions of each row. Readers see a consistent snapshot from the time their transaction started, while writers create new versions. This eliminates read-write lock contention, greatly improving concurrency.",
  },
  {
    question: "What is the Buffer Pool in a DBMS primarily used for?",
    options: [
      "Storing transaction logs before flushing to disk",
      "Caching frequently accessed data pages in RAM to reduce disk I/O",
      "Buffering network packets between client and server",
      "Holding prepared SQL statements for reuse",
    ],
    correct: 1,
    explanation: "The Buffer Pool is an in-memory cache of data pages. Since RAM access is thousands of times faster than disk, keeping the hot working set in the Buffer Pool dramatically reduces I/O. Most databases aim to keep 70–90% of queries served from RAM.",
  },
  {
    question: "Which storage engine data structure is most commonly used for general-purpose database indexes?",
    options: [
      "Hash table",
      "B-Tree (Balanced Tree)",
      "Linked list",
      "Bloom filter",
    ],
    correct: 1,
    explanation: "B-Trees maintain sorted data and support O(log n) lookups, range queries, and ordered scans. They are the default index structure in most relational databases (InnoDB, PostgreSQL) because they balance read and write performance for general workloads.",
  },
  {
    question: "What is the difference between a database view and a stored procedure?",
    options: [
      "A view stores query results on disk; a stored procedure runs in the application",
      "A view is a saved query acting as a virtual table; a stored procedure is precompiled executable logic",
      "A view can modify data; a stored procedure is read-only",
      "There is no difference — they serve the same purpose",
    ],
    correct: 1,
    explanation: "A view is a named SQL query that behaves like a virtual table and is used for reading data. A stored procedure is a precompiled program stored in the database that can execute multiple statements, accept parameters, and modify data.",
  },
  {
    question: "What storage engine does MySQL's InnoDB use for its primary key index structure?",
    options: [
      "Hash index",
      "LSM-Tree",
      "Clustered B-Tree index",
      "Inverted index",
    ],
    correct: 2,
    explanation: "InnoDB uses a clustered B-Tree index for the primary key, meaning the actual row data is stored within the B-Tree leaf nodes. This makes primary key lookups very fast but means secondary indexes must store the primary key value to do a second lookup.",
  },
  {
    question: "What is a 'schema' in the context of a relational database?",
    options: [
      "A backup copy of the database",
      "The physical storage layout on disk",
      "The structural definition of tables, columns, data types, and constraints",
      "The query execution plan chosen by the optimizer",
    ],
    correct: 2,
    explanation: "A schema defines the blueprint of the database: which tables exist, what columns they have, their data types, and the constraints (NOT NULL, UNIQUE, FOREIGN KEY) that must be satisfied. In relational databases, the schema is enforced on every write.",
  },
  {
    question: "Which of the following best describes a NoSQL database?",
    options: [
      "A database that cannot store structured data",
      "A database that never uses SQL even internally",
      "A non-relational database that uses alternative data models for horizontal scalability or specialized access patterns",
      "A database that does not support transactions of any kind",
    ],
    correct: 2,
    explanation: "NoSQL ('Not Only SQL') refers to non-relational databases that use data models like documents, key-value pairs, wide columns, or graphs. They trade strict relational constraints for horizontal scalability, schema flexibility, or specialized query patterns. Many modern NoSQL systems do support some form of SQL or ACID transactions.",
  },
];

export default function DatabasesAndDbmsContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        A <strong className="text-txt">database</strong> is an organized collection of structured data. A <strong className="text-txt">Database Management System (DBMS)</strong> is the software layer that sits between your application and that raw data  it handles storage, retrieval, concurrency, and durability so you don't have to.
      </p>
      <p className="text-sm leading-relaxed">
        Without a DBMS you'd need to manage file formats, handle concurrent writes, implement crash recovery, and write your own query language. A DBMS abstracts all of that. PostgreSQL, MySQL, Oracle, and SQL Server are RDBMS examples; MongoDB, Cassandra, and Redis are non-relational DBMS examples.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="DBMS Internal Architecture"
        description="A query flows from the client through the query processor and buffer pool down to disk storage"
        height={400}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Core DBMS Components</h2>
      <div className="space-y-3">
        {[
          {
            name: "Query Processor",
            desc: "Parses SQL into a parse tree, applies semantic checks, then uses the query optimizer to generate the cheapest execution plan. The optimizer considers indexes, join ordering, and table statistics.",
            color: "#06b6d4",
          },
          {
            name: "Storage Engine",
            desc: "Manages how data is physically written to and read from disk. InnoDB (MySQL) uses B-Tree indexes and clustered primary keys. RocksDB uses LSM-Trees optimized for write-heavy workloads.",
            color: "#10b981",
          },
          {
            name: "Transaction Manager",
            desc: "Enforces ACID properties using locking or MVCC (Multi-Version Concurrency Control). Ensures that concurrent transactions do not leave the database in an inconsistent state.",
            color: "#8b5cf6",
          },
          {
            name: "Buffer Pool / Cache",
            desc: "An in-memory area that caches frequently accessed data pages. Most databases keep 70–90% of their working set in RAM, making disk I/O a rare, not a routine, event.",
            color: "#f59e0b",
          },
        ].map((c) => (
          <div key={c.name} className="p-3 rounded-lg border border-border-ui bg-surface flex gap-3">
            <div className="w-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
            <div>
              <div className="font-semibold text-sm text-txt font-heading">{c.name}</div>
              <p className="text-xs text-txt-2 mt-0.5">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Key Database Concepts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">Schema</div>
          <p className="text-xs text-txt-2">
            A schema defines the structure of the database: which tables exist, what columns they have, data types, constraints (NOT NULL, UNIQUE, FOREIGN KEY), and relationships. In relational databases the schema is enforced at write time  you cannot insert a row that violates it.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30">
          <div className="font-bold text-accent-2 text-sm font-heading mb-2">Indexes</div>
          <p className="text-xs text-txt-2">
            Indexes speed up reads at the cost of write overhead and extra storage. A B-Tree index on <code className="bg-highlight px-1 rounded">users.email</code> turns a full table scan (O(n)) into a tree traversal (O(log n)). Over-indexing slows inserts/updates; under-indexing slows queries.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">Views</div>
          <p className="text-xs text-txt-2">
            A view is a named, saved SQL query that acts like a virtual table. It simplifies complex joins, enforces security by exposing only certain columns, and can be updated to change the underlying query without changing application code.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30">
          <div className="font-bold text-c-success text-sm font-heading mb-2">Stored Procedures</div>
          <p className="text-xs text-txt-2">
            Stored procedures are precompiled SQL programs stored inside the database. They reduce network round-trips (multi-step logic runs server-side), can enforce business rules at the data layer, and are useful for batch processing or complex transactions.
          </p>
        </div>
      </div>

      <KeyTakeaway variant="info">
        The write-ahead log (WAL) is the foundation of crash recovery. Every change is first written to an append-only log before it touches the actual data files. If the server crashes mid-write, the DBMS replays the WAL on restart to bring data back to a consistent state.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">RDBMS vs Non-Relational DBMS</h2>
      <p className="text-sm leading-relaxed">
        Relational databases model data as tables with rows and columns and use SQL as a query language. Non-relational (NoSQL) databases use alternative data models (documents, key-value pairs, graphs, wide columns) and sacrifice some query flexibility for higher write throughput or schema flexibility.
      </p>
      <ul className="space-y-2 text-sm mt-2">
        {[
          "Use RDBMS when your data is structured, relationships matter, and you need strong ACID guarantees.",
          "Use NoSQL when you need horizontal write scalability, flexible schemas, or a specialized data model (graph, time-series).",
          "Most large systems use both: PostgreSQL for transactional data, Redis for caching, Elasticsearch for search.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-accent shrink-0 mt-1">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
