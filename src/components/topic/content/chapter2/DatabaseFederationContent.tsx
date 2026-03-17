"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "app", type: "system", position: { x: 220, y: 20 }, data: { label: "Application", icon: "🔧", color: "#3b82f6" } },
  { id: "router", type: "system", position: { x: 220, y: 120 }, data: { label: "Federation Layer", sublabel: "Routes by domain", icon: "🗺️", color: "#06b6d4", description: "Routes queries to the appropriate specialized database based on data domain" } },
  { id: "users", type: "database", position: { x: 30, y: 260 }, data: { label: "Users DB", sublabel: "PostgreSQL", color: "#3b82f6" } },
  { id: "products", type: "database", position: { x: 150, y: 260 }, data: { label: "Products DB", sublabel: "PostgreSQL", color: "#8b5cf6" } },
  { id: "orders", type: "database", position: { x: 270, y: 260 }, data: { label: "Orders DB", sublabel: "PostgreSQL", color: "#10b981" } },
  { id: "analytics", type: "database", position: { x: 390, y: 260 }, data: { label: "Analytics DB", sublabel: "ClickHouse", color: "#f59e0b" } },
];

const edges: Edge[] = [
  { id: "e1", source: "app", target: "router", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "router", target: "users", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e3", source: "router", target: "products", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e4", source: "router", target: "orders", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e5", source: "router", target: "analytics", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
];

const questions = [
  {
    question: "What is the main difference between database federation and sharding?",
    options: [
      "Federation splits data by rows; sharding splits by columns",
      "Federation splits by function/domain; sharding splits one table's rows across servers",
      "Federation only works with NoSQL; sharding only works with SQL",
      "There is no difference — they are the same concept",
    ],
    correct: 1,
    explanation: "Federation (functional partitioning) separates different data domains into dedicated databases (e.g., Users DB, Products DB). Sharding splits a single large table's rows across multiple servers using a shard key.",
  },
  {
    question: "What is the biggest drawback of database federation?",
    options: [
      "It requires expensive hardware",
      "It cannot handle write operations",
      "Joins and transactions across federated databases are complex or impossible",
      "It can only store structured data",
    ],
    correct: 2,
    explanation: "Cross-database JOIN operations require application-level data merging and are very expensive. Distributed transactions spanning multiple federated databases add significant complexity and overhead.",
  },
];

export default function DatabaseFederationContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Database federation</strong> (also called functional partitioning) splits a monolithic database into multiple smaller, specialized databases — each responsible for a specific domain or function. Instead of one giant database handling users, products, orders, and analytics, you have four separate databases, each optimized for its purpose.
      </p>
      <p>
        Unlike sharding which splits one large table across servers, federation splits entirely different <em>types</em> of data. An e-commerce platform might federate into: User DB, Product catalog DB, Order DB, and an Analytics DB. Each can use a different engine — relational for orders, Redis for sessions, ClickHouse for analytics.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Database Federation"
        description="One application, four specialized databases by domain"
        height={360}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Why Federate?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { icon: "⚡", title: "Better Cache Utilization", desc: "Smaller databases fit better in memory. A 10GB Users DB has a higher cache hit ratio than a 100GB monolithic DB.", color: "#3b82f6" },
          { icon: "🔧", title: "Independent Scaling", desc: "Scale only the databases under load. If orders spike, scale only the Orders DB — don't touch Users or Products.", color: "#06b6d4" },
          { icon: "🛡️", title: "Fault Isolation", desc: "A crash in the Analytics DB doesn't take down Orders or Users. Failures are contained to one domain.", color: "#10b981" },
          { icon: "🎯", title: "Technology Flexibility", desc: "Use the right DB for each job. Time-series data → InfluxDB. Graph data → Neo4j. Transactional data → PostgreSQL.", color: "#8b5cf6" },
        ].map((item) => (
          <div key={item.title} className="p-4 rounded-xl border border-border-ui bg-surface">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold text-sm font-heading" style={{ color: item.color }}>{item.title}</span>
            </div>
            <p className="text-xs text-txt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Drawbacks</h2>
      <div className="space-y-3">
        {[
          { issue: "Cross-database JOINs", detail: "You can't JOIN across databases. A query like 'get all orders with user name' requires two separate queries and in-application merging.", color: "#ef4444" },
          { issue: "Distributed transactions", detail: "An order that updates both Orders DB and inventory in Products DB requires a distributed transaction (2PC or Saga) — complex and slow.", color: "#f59e0b" },
          { issue: "Application complexity", detail: "The application must know which database to query for each type of data. The routing logic must be maintained as schemas evolve.", color: "#f59e0b" },
        ].map((item) => (
          <div key={item.issue} className="p-3 rounded-lg border border-border-ui bg-surface flex gap-3">
            <div className="w-1.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: item.color }} />
            <div>
              <div className="font-semibold text-sm text-txt">{item.issue}</div>
              <p className="text-xs text-txt-2 mt-0.5">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="info">
        Federation shines when your monolithic database has clear domain boundaries and cross-domain queries are rare. If your app frequently needs to join Users with Orders with Products, federation will create more pain than it solves.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
