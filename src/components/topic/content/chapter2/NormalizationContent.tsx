"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "denorm", type: "database", position: { x: 160, y: 20 }, data: { label: "Orders (Denormalized)", type: "orderId, custName, custEmail, prodName, prodPrice, qty", color: "#ef4444", description: "One fat table: customer and product info repeated on every order row. Update anomalies are common." } },
  { id: "orders", type: "database", position: { x: 60, y: 220 }, data: { label: "Orders", type: "orderId, custId, prodId, qty", color: "#3b82f6", description: "Normalized orders table  only stores foreign keys to customers and products." } },
  { id: "customers", type: "database", position: { x: 220, y: 220 }, data: { label: "Customers", type: "custId, name, email", color: "#10b981", description: "Customer data stored once. Updating an email only requires one row change." } },
  { id: "products", type: "database", position: { x: 360, y: 220 }, data: { label: "Products", type: "prodId, name, price", color: "#8b5cf6", description: "Product data stored once. Price changes propagate automatically to all orders." } },
];

const edges: Edge[] = [
  { id: "e1", source: "denorm", target: "orders", label: "Split into", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e2", source: "denorm", target: "customers", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e3", source: "denorm", target: "products", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e4", source: "orders", target: "customers", label: "FK: custId", style: { stroke: "#10b981", strokeWidth: 1.5, strokeDasharray: "4,4" }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e5", source: "orders", target: "products", label: "FK: prodId", style: { stroke: "#8b5cf6", strokeWidth: 1.5, strokeDasharray: "4,4" }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
];

const questions = [
  {
    question: "A table stores (StudentID, CourseID, CourseName, InstructorID). CourseName depends only on CourseID, not the full primary key (StudentID, CourseID). Which normal form is violated?",
    options: [
      "First Normal Form (1NF)",
      "Second Normal Form (2NF)",
      "Third Normal Form (3NF)",
      "Boyce-Codd Normal Form (BCNF)",
    ],
    correct: 1,
    explanation: "2NF requires that every non-key column depends on the entire primary key. Here CourseName depends only on CourseID (part of the key), which is a partial dependency  a 2NF violation. Fix it by moving CourseName to a separate Courses table.",
  },
  {
    question: "Which anomaly occurs when you cannot insert a new customer into a Customer-Orders table because the customer hasn't placed any orders yet?",
    options: [
      "Update anomaly",
      "Deletion anomaly",
      "Insertion anomaly",
      "Referential anomaly",
    ],
    correct: 2,
    explanation: "An insertion anomaly occurs when you cannot add data about one entity without also adding data about another. If CustomerID is part of a composite primary key with OrderID, a customer without orders can't exist in the table. Normalization solves this by separating the Customers and Orders tables.",
  },
  {
    question: "A table has columns (ZipCode, City, State). City and State both depend on ZipCode, but ZipCode is not the primary key. Which normal form violation is this?",
    options: [
      "First Normal Form (1NF) — repeated groups",
      "Second Normal Form (2NF) — partial dependency",
      "Third Normal Form (3NF) — transitive dependency",
      "Boyce-Codd Normal Form (BCNF) — non-superkey determinant",
    ],
    correct: 2,
    explanation: "This is a transitive dependency: City → State, and both depend on ZipCode, which is not the primary key. 3NF requires that non-key columns depend only on the primary key, not on other non-key columns. Fix it by moving ZipCode, City, and State to a separate ZipCodes table.",
  },
  {
    question: "What is the main goal of database normalization?",
    options: [
      "To maximize query performance by pre-joining frequently accessed tables",
      "To reduce data redundancy and prevent update anomalies by ensuring each fact is stored once",
      "To encrypt sensitive data across multiple tables for security",
      "To distribute data across multiple servers for horizontal scaling",
    ],
    correct: 1,
    explanation: "Normalization reduces redundancy by ensuring each piece of data is stored in only one place. This prevents update anomalies: if a customer's email appears on 1,000 order rows, updating it risks inconsistency. In a normalized schema, the email is stored once in the Customers table.",
  },
  {
    question: "Which statement best describes denormalization and when it is appropriate?",
    options: [
      "Denormalization is the process of removing all redundancy, which should always be done before production",
      "Denormalization deliberately introduces redundancy to improve read performance, typically after profiling shows expensive JOIN operations",
      "Denormalization means removing all indexes from a table to reduce write overhead",
      "Denormalization is a database migration strategy for moving data between tables",
    ],
    correct: 1,
    explanation: "Denormalization intentionally duplicates data (e.g., storing a user's username alongside their posts) to eliminate JOINs at read time. It is appropriate when read performance is critical, profiling confirms JOIN overhead, and the duplicated data updates infrequently. Write overhead increases, so it is a deliberate trade-off, not a default strategy.",
  },
  {
    question: "A column 'phone_numbers' in a Users table stores multiple phone numbers as a comma-separated string: '555-1234,555-5678'. Which normal form is violated?",
    options: [
      "First Normal Form (1NF) — non-atomic values in a column",
      "Second Normal Form (2NF) — partial dependency",
      "Third Normal Form (3NF) — transitive dependency",
      "Boyce-Codd Normal Form (BCNF) — non-superkey determinant",
    ],
    correct: 0,
    explanation: "1NF requires that every column holds atomic (indivisible) values. Storing multiple phone numbers as a comma-separated string violates atomicity. Fix it by creating a separate PhoneNumbers table with a foreign key back to Users.",
  },
  {
    question: "What is a deletion anomaly?",
    options: [
      "An error that occurs when deleting rows from an indexed column",
      "Losing data about one entity when deleting a row that contains data about a different entity",
      "A cascade delete that removes too many rows unintentionally",
      "An anomaly caused by deleting indexes from a heavily queried table",
    ],
    correct: 1,
    explanation: "A deletion anomaly occurs in a denormalized table when deleting a row also removes data about a separate entity. For example, if the only record for a supplier is embedded in an order row, deleting that order erases all information about the supplier. Normalization prevents this by separating entities into their own tables.",
  },
  {
    question: "In which scenario would you deliberately denormalize a database?",
    options: [
      "Early-stage development when the schema changes frequently",
      "When the application has a very high write-to-read ratio",
      "When read performance is critical and profiling shows expensive multi-table JOINs that cannot be solved with indexes",
      "When enforcing referential integrity across multiple tables is important",
    ],
    correct: 2,
    explanation: "Denormalization is appropriate when read performance is the bottleneck and expensive JOINs cannot be eliminated through indexing or query optimization. By pre-joining data (accepting redundancy), reads become faster at the cost of higher write overhead and potential update anomalies. Always profile before denormalizing.",
  },
  {
    question: "What is BCNF (Boyce-Codd Normal Form) and how does it differ from 3NF?",
    options: [
      "BCNF requires all columns to be atomic; 3NF allows composite values",
      "BCNF is a stricter version of 3NF that handles edge cases with multiple overlapping candidate keys",
      "BCNF eliminates the need for primary keys; 3NF still requires them",
      "BCNF only applies to tables with more than 10 columns; 3NF applies to any table",
    ],
    correct: 1,
    explanation: "BCNF (also called 3.5NF) is a stricter form of 3NF: for every functional dependency X → Y, X must be a superkey. 3NF allows cases where Y is part of a candidate key. BCNF eliminates certain anomalies that 3NF misses when tables have multiple overlapping candidate keys. Most tables in 3NF are also in BCNF.",
  },
  {
    question: "What is a functional dependency in the context of database normalization?",
    options: [
      "A dependency between two stored procedures that call each other",
      "A relationship where the value of one attribute uniquely determines the value of another attribute",
      "A dependency of a table on an external API or function",
      "A link between primary keys in two different tables",
    ],
    correct: 1,
    explanation: "A functional dependency A → B means that knowing the value of A uniquely determines the value of B. For example, StudentID → StudentName (each student ID maps to exactly one name). Understanding functional dependencies is the foundation for applying normal forms to eliminate redundancy.",
  },
];

export default function NormalizationContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Normalization</strong> is the process of organizing a relational database to reduce data redundancy and improve data integrity. It works by decomposing large, flat tables into smaller, well-structured ones connected by foreign keys. The process is guided by a series of progressively stricter rules called <strong className="text-txt">normal forms</strong>.
      </p>
      <p className="text-sm leading-relaxed">
        <strong className="text-txt">Denormalization</strong> is the deliberate reversal of some normalization to improve read performance. In practice, most production systems normalize for correctness during design, then selectively denormalize for performance when profiling reveals bottlenecks.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Normalizing an Orders Table"
        description="A denormalized flat table split into three normalized tables connected by foreign keys"
        height={320}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Normal Forms</h2>
      <div className="space-y-3">
        {[
          {
            form: "1NF  First Normal Form",
            color: "#3b82f6",
            rule: "Each column holds atomic (indivisible) values. No repeating groups or arrays.",
            example: "Bad: phone column = '555-1234, 555-5678'. Good: separate rows or a PhoneNumbers table.",
          },
          {
            form: "2NF  Second Normal Form",
            color: "#06b6d4",
            rule: "Must be in 1NF. Every non-key column must depend on the entire primary key (no partial dependencies).",
            example: "If (StudentID, CourseID) is the key but CourseName only depends on CourseID, move CourseName to a Courses table.",
          },
          {
            form: "3NF  Third Normal Form",
            color: "#8b5cf6",
            rule: "Must be in 2NF. No non-key column should depend on another non-key column (no transitive dependencies).",
            example: "If a table has ZipCode → City → State, State depends on City which depends on ZipCode. Move City/State to a separate table.",
          },
          {
            form: "BCNF  Boyce-Codd Normal Form",
            color: "#10b981",
            rule: "A stricter version of 3NF. For every functional dependency X → Y, X must be a superkey.",
            example: "Handles edge cases involving multiple overlapping candidate keys that 3NF misses. Most tables in 3NF are also in BCNF.",
          },
        ].map((nf) => (
          <div key={nf.form} className="p-4 rounded-xl border border-border-ui" style={{ backgroundColor: `${nf.color}10` }}>
            <div className="font-bold text-sm font-heading mb-1" style={{ color: nf.color }}>{nf.form}</div>
            <p className="text-xs text-txt mb-1"><strong>Rule:</strong> {nf.rule}</p>
            <p className="text-xs text-txt-2"><strong>Example:</strong> {nf.example}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Update Anomalies</h2>
      <p className="text-sm leading-relaxed">
        Anomalies are data integrity problems that arise from redundancy in denormalized tables. There are three types:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
        {[
          { type: "Insertion Anomaly", color: "#ef4444", desc: "You can't add data about one entity without adding data about another. E.g., can't add a new product without it being part of an order." },
          { type: "Update Anomaly", color: "#f59e0b", desc: "A fact is stored in multiple rows. Changing it in one place but missing another causes inconsistency. E.g., customer email stored on every order row." },
          { type: "Deletion Anomaly", color: "#8b5cf6", desc: "Deleting one entity accidentally removes data about another. E.g., deleting the last order for a customer also deletes all customer information." },
        ].map((a) => (
          <div key={a.type} className="p-4 rounded-xl border border-border-ui" style={{ backgroundColor: `${a.color}10` }}>
            <div className="font-bold text-sm font-heading mb-2" style={{ color: a.color }}>{a.type}</div>
            <p className="text-xs text-txt-2">{a.desc}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        In system design interviews, knowing when to denormalize is as important as knowing how to normalize. If your read:write ratio is 10:1 or higher and queries require expensive multi-table JOINs, pre-joining (denormalization) or using a read-optimized copy of data (CQRS, materialized views) is often the right call.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">When to Denormalize</h2>
      <ul className="space-y-2 text-sm">
        {[
          "Read performance is the bottleneck and profiling shows expensive JOIN operations.",
          "The data is mostly read-only or append-only (analytics, event logs) where update anomalies are not a concern.",
          "You're building a read model in a CQRS architecture where the write model stays normalized.",
          "Caching the joined result as a materialized view is too stale for your use case.",
          "The join columns are stable and rarely update (e.g., country name, category name).",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2 list-none">
            <span className="text-accent shrink-0 mt-1">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
