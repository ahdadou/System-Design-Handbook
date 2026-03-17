"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "app", type: "system", position: { x: 220, y: 20 }, data: { label: "Application", icon: "🔧", color: "#3b82f6" } },
  { id: "router", type: "system", position: { x: 220, y: 130 }, data: { label: "Shard Router", sublabel: "Hash / Range routing", icon: "🗺️", color: "#06b6d4", description: "Routes queries to the correct shard based on the shard key value" } },
  { id: "s1", type: "database", position: { x: 60, y: 260 }, data: { label: "Shard 1", type: "Users A-F", color: "#10b981" } },
  { id: "s2", type: "database", position: { x: 200, y: 260 }, data: { label: "Shard 2", type: "Users G-N", color: "#8b5cf6" } },
  { id: "s3", type: "database", position: { x: 340, y: 260 }, data: { label: "Shard 3", type: "Users O-Z", color: "#f59e0b" } },
];

const edges: Edge[] = [
  { id: "e1", source: "app", target: "router", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "router", target: "s1", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e3", source: "router", target: "s2", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e4", source: "router", target: "s3", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
];

const questions = [
  {
    question: "What is the biggest challenge with database sharding?",
    options: [
      "Sharding requires expensive hardware",
      "Cross-shard queries and joins become extremely difficult",
      "Data cannot be replicated across shards",
      "Only NoSQL databases can be sharded",
    ],
    correct: 1,
    explanation: "Cross-shard operations (JOINs, transactions, aggregations) are the main challenge. Data lives on different machines, so you need to query multiple shards and merge results in application code.",
  },
  {
    question: "What is 'hot spot' problem in hash-based sharding?",
    options: [
      "Servers overheating due to high load",
      "One shard receives disproportionately more traffic due to uneven key distribution",
      "Hash collisions causing data loss",
      "Slow hash function performance",
    ],
    correct: 1,
    explanation: "If some shard keys are much more popular (e.g., shard based on user country, but 80% of users are in the US), one shard gets overloaded. Good shard key selection prevents this.",
  },
];

export default function ShardingContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Database sharding</strong> (also called horizontal partitioning) splits a large database into smaller, faster pieces called shards. Each shard holds a subset of the data and runs on its own server. Together they form one logical database.
      </p>
      <p>
        When a single database can't handle the write load, sharding is the solution. Twitter shards their database by tweet ID. Uber shards by geographic region. Instagram shards user data by user ID to serve 500M+ active users.
      </p>

      <InteractiveDiagram nodes={nodes} edges={edges} nodeTypes={nodeTypes} title="Range-Based Sharding" description="Data split across shards by user name range" height={350} />

      <h2 className="text-2xl font-bold font-heading text-txt">Sharding Strategies</h2>
      <div className="space-y-3">
        {[
          { name: "Hash-Based", desc: "Apply a hash function to the shard key to determine the shard. Distributes data evenly but makes range queries hard.", color: "#3b82f6" },
          { name: "Range-Based", desc: "Split data by value ranges (A-F on shard 1, G-N on shard 2...). Great for range queries but can create hot spots.", color: "#06b6d4" },
          { name: "List-Based", desc: "Assign specific values to specific shards (US+CA on shard 1, EU on shard 2). Explicit control but inflexible.", color: "#8b5cf6" },
          { name: "Composite", desc: "Combine multiple strategies (hash by user_id, then range by timestamp). Maximum flexibility but complex routing logic.", color: "#10b981" },
        ].map((s) => (
          <div key={s.name} className="p-3 rounded-lg border border-border-ui bg-surface flex gap-3">
            <div className="w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <div>
              <div className="font-semibold text-sm text-txt font-heading">{s.name}</div>
              <p className="text-xs text-txt-2 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="warning">
        Resharding (changing the number of shards) is painful and requires downtime or complex data migrations. Choose your initial shard count and key carefully. Consistent hashing reduces this pain by minimizing data movement during resharding.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
