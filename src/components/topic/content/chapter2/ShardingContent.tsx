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
  {
    question: "What makes a good shard key?",
    options: [
      "A column that is frequently updated, ensuring data is evenly distributed over time",
      "A column with high cardinality and even distribution that aligns with the most frequent query pattern",
      "A column with few distinct values so data can be grouped efficiently",
      "A column that is rarely queried to minimize load on the shard router",
    ],
    correct: 1,
    explanation: "A good shard key has high cardinality (many unique values) to distribute data evenly, matches the dominant query pattern (queries that include the shard key hit one shard), and rarely changes (re-sharding a row requires moving it). User ID, order ID, and tenant ID are common good shard keys.",
  },
  {
    question: "What is 'resharding' and why is it painful?",
    options: [
      "Replacing old shard servers with newer hardware; painful because it requires downtime",
      "Increasing the number of shards when data outgrows existing shards; painful because it requires migrating large amounts of data to new shards",
      "Rebalancing index statistics across shards; painful because it locks all tables",
      "Changing the database engine of each shard; painful because schemas must be recreated",
    ],
    correct: 1,
    explanation: "Resharding means changing the sharding scheme (e.g., from 4 to 8 shards). With hash-based sharding, almost all data must move to a new shard. This requires a large data migration while the system is live, often causing degraded performance. Consistent hashing significantly reduces the amount of data that needs to move during resharding.",
  },
  {
    question: "How does range-based sharding differ from hash-based sharding in terms of query patterns?",
    options: [
      "Range-based is better for point lookups; hash-based is better for range queries",
      "Range-based supports efficient range queries by keeping adjacent values on the same shard; hash-based distributes evenly but scatters range query results across shards",
      "Hash-based sharding is only supported by NoSQL databases; range-based works with any database",
      "There is no practical difference — both strategies support all query patterns equally well",
    ],
    correct: 1,
    explanation: "Range-based sharding keeps consecutive key values on the same shard (e.g., dates Jan–Mar on shard 1), making range queries hit one or few shards efficiently. Hash-based sharding distributes data evenly but scatters adjacent key values across different shards, making range queries require querying all shards (scatter-gather).",
  },
  {
    question: "What is the difference between horizontal sharding and vertical partitioning?",
    options: [
      "Horizontal sharding splits rows across servers; vertical partitioning splits columns across servers or tables",
      "Horizontal sharding splits columns; vertical partitioning splits rows",
      "Horizontal sharding applies to relational databases; vertical partitioning applies to NoSQL",
      "There is no difference — they are two names for the same concept",
    ],
    correct: 0,
    explanation: "Horizontal sharding (horizontal partitioning) distributes rows of a single table across multiple servers by shard key. Vertical partitioning splits columns — putting frequently accessed columns in one table and rarely accessed or large columns in another. Both reduce the size of individual data units, but they address different bottlenecks.",
  },
  {
    question: "An application shards its users table by user_id. A query needs to find all users from a specific country. What is the performance implication?",
    options: [
      "The query routes to a single shard based on the country name",
      "The query must be sent to all shards (scatter-gather), and results merged in the application",
      "The shard router automatically creates a secondary index on country across all shards",
      "The query fails because cross-shard queries are not supported",
    ],
    correct: 1,
    explanation: "When the shard key is user_id but the query filters on country (a non-shard-key column), the router cannot determine which shard(s) contain matching rows. It must broadcast the query to all shards (scatter), collect results from each (gather), and merge them. This is called a scatter-gather query and can be expensive at high shard counts.",
  },
  {
    question: "Which real-world company/system uses geographic-based sharding?",
    options: [
      "Twitter — shards by tweet text content",
      "Uber — shards trip and location data by geographic region",
      "Netflix — shards by movie genre",
      "Amazon — shards product catalog by product weight",
    ],
    correct: 1,
    explanation: "Uber shards location and trip data by geographic region because queries are almost always geographically bounded (a driver in New York doesn't query data from London). Geographic sharding co-locates related data, reduces cross-shard queries, and can place shards physically closer to the users they serve for lower latency.",
  },
  {
    question: "What is the 'celebrity problem' (also called the 'whale problem') in social media sharding?",
    options: [
      "A bug that occurs when a celebrity's account data exceeds a single shard's capacity",
      "A hot spot where a shard receives excessive load because a celebrity user generates far more activity than typical users",
      "A data privacy issue where celebrity data is stored on insecure shards",
      "A performance problem caused by celebrity profiles having too many columns",
    ],
    correct: 1,
    explanation: "If you shard by user_id, the shard containing a celebrity with 100M followers receives dramatically more read traffic than average user shards (timeline reads, follower updates). This hot spot can overload a single shard. Solutions include special handling for high-traffic accounts (storing their data differently) or using consistent hashing with virtual nodes to distribute the load.",
  },
  {
    question: "What is a 'shard router' (also called a shard proxy or coordinator)?",
    options: [
      "A load balancer that distributes requests evenly across all shards regardless of content",
      "A component that inspects the shard key in each query and routes it to the correct shard",
      "A backup shard that activates when the primary shard fails",
      "A monitoring tool that tracks query distribution across shards",
    ],
    correct: 1,
    explanation: "A shard router (e.g., MongoDB's mongos, Vitess's VTGate) sits between the application and the shards. It reads the shard key from each query, consults the shard map (which key ranges live on which shard), and routes the query to the appropriate shard(s). For scatter-gather queries, it broadcasts to all shards and merges results.",
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
