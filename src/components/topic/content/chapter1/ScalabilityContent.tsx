"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode };

const verticalNodes: Node[] = [
  { id: "s1", type: "system", position: { x: 50, y: 80 }, data: { label: "Server (4 CPU)", sublabel: "Before", icon: "🖥️", color: "#94a3b8" } },
  { id: "s2", type: "system", position: { x: 280, y: 80 }, data: { label: "Server (16 CPU)", sublabel: "After (vertical)", icon: "🖥️", color: "#3b82f6", description: "Same single machine, more RAM and CPU. Faster but has a hard limit." } },
  { id: "s3", type: "system", position: { x: 50, y: 230 }, data: { label: "Server 1", sublabel: "Horizontal", icon: "🖥️", color: "#10b981" } },
  { id: "s4", type: "system", position: { x: 200, y: 230 }, data: { label: "Server 2", sublabel: "Horizontal", icon: "🖥️", color: "#10b981" } },
  { id: "s5", type: "system", position: { x: 350, y: 230 }, data: { label: "Server 3", sublabel: "Horizontal", icon: "🖥️", color: "#10b981" } },
  { id: "lb", type: "system", position: { x: 200, y: 130 }, data: { label: "Load Balancer", icon: "⚖️", color: "#8b5cf6" } },
];

const verticalEdges: Edge[] = [
  { id: "e1", source: "s1", target: "s2", label: "Upgrade →", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, strokeDasharray: "6,4" }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e2", source: "lb", target: "s3", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e3", source: "lb", target: "s4", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e4", source: "lb", target: "s5", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
];

const comparison = {
  columns: [
    { key: "vertical", label: "Vertical (Scale Up)", color: "#3b82f6" },
    { key: "horizontal", label: "Horizontal (Scale Out)", color: "#10b981" },
  ],
  rows: [
    { feature: "Implementation", vertical: "Add more CPU/RAM", horizontal: "Add more servers" },
    { feature: "Complexity", vertical: "Simple (no code changes)", horizontal: "Higher (needs stateless design)" },
    { feature: "Limit", vertical: "Hardware ceiling", horizontal: "Nearly unlimited" },
    { feature: "Cost", vertical: "Expensive at high scale", horizontal: "Commodity hardware" },
    { feature: "Downtime", vertical: "Required for upgrade", horizontal: "None (rolling updates)" },
    { feature: "Failure Risk", vertical: "Single point of failure", horizontal: "Fault tolerant" },
    { feature: "Best For", vertical: "Databases, quick fixes", horizontal: "Web servers, microservices" },
  ],
};

const questions = [
  {
    question: "A startup is experiencing database slowness. They upgrade from 4 vCPUs to 32 vCPUs. This is an example of:",
    options: ["Horizontal scaling", "Vertical scaling", "Database sharding", "Load balancing"],
    correct: 1,
    explanation: "Increasing resources (CPU, RAM, storage) on a single machine is vertical scaling (scaling up). It's often the first approach because it requires no application changes.",
  },
  {
    question: "Which scaling approach best handles a stateless web application layer?",
    options: ["Vertical scaling", "Horizontal scaling", "Database replication", "CDN caching"],
    correct: 1,
    explanation: "Stateless web servers are ideal for horizontal scaling  just add more instances behind a load balancer. No shared state means any server can handle any request.",
  },
  {
    question: "What is the primary challenge that prevents databases from being horizontally scaled as easily as web servers?",
    options: [
      "Databases are always slower than web servers",
      "Databases maintain state (data), requiring coordination to keep data consistent across nodes",
      "Database software does not support multiple instances",
      "Databases require more CPU than web servers",
    ],
    correct: 1,
    explanation: "Stateful systems like databases are hard to horizontally scale because data must be consistent across nodes. You need strategies like read replicas, sharding, or distributed databases (Cassandra, DynamoDB) to scale horizontally.",
  },
  {
    question: "What is database sharding?",
    options: [
      "Creating read-only copies of a database for read traffic",
      "Partitioning data horizontally across multiple databases, each holding a subset of rows",
      "Compressing database records to save storage space",
      "Encrypting database tables for security",
    ],
    correct: 1,
    explanation: "Sharding splits data across multiple database instances based on a shard key (e.g., user ID). Each shard holds a subset of the data. This allows databases to scale beyond the limits of a single server.",
  },
  {
    question: "What is auto-scaling in cloud environments?",
    options: [
      "Automatically upgrading server hardware when CPU limits are reached",
      "Automatically adding or removing instances based on traffic metrics to match demand",
      "A load balancing algorithm that adjusts weights dynamically",
      "Automatically migrating data between storage tiers",
    ],
    correct: 1,
    explanation: "Auto-scaling monitors metrics (CPU, request rate, queue depth) and automatically launches new instances when load increases and terminates instances when load decreases. This provides cost efficiency and handles traffic spikes without manual intervention.",
  },
  {
    question: "What is a key requirement for a web service to scale horizontally effectively?",
    options: [
      "Each server must have a unique database connection",
      "The service must be stateless — no session data stored in server memory",
      "All servers must run on identical hardware",
      "The service must use only UDP connections",
    ],
    correct: 1,
    explanation: "Stateless services store no session data in memory. Any server can handle any request. Session state is stored externally (Redis, database). This allows the load balancer to route requests to any available server without affinity requirements.",
  },
  {
    question: "What is the 'thundering herd' problem in the context of scaling?",
    options: [
      "Too many servers trying to connect to a database simultaneously after a restart",
      "A single server handling too many concurrent requests",
      "Database replication lag causing stale reads",
      "Auto-scaling launching too many instances at once",
    ],
    correct: 0,
    explanation: "When a server or cache restarts, all its clients may reconnect or make requests simultaneously, overwhelming the recovering system. Solutions include exponential backoff with jitter, circuit breakers, and staggered reconnection delays.",
  },
  {
    question: "What is the difference between 'scale out' and 'scale up'?",
    options: [
      "Scale out = increasing storage; scale up = increasing CPU/RAM",
      "Scale out = adding more machines horizontally; scale up = increasing resources on existing machines vertically",
      "Scale out = geographic distribution; scale up = more instances in one region",
      "They are equivalent terms for the same operation",
    ],
    correct: 1,
    explanation: "Scale out (horizontal scaling) adds more servers/nodes to distribute the load. Scale up (vertical scaling) increases the resources (CPU, RAM, storage) of existing servers. Scale out is generally preferred for long-term growth as it has no hard ceiling.",
  },
  {
    question: "Why is connection pooling important in a horizontally-scaled system?",
    options: [
      "It speeds up TCP handshakes between services",
      "It limits the total number of database connections, preventing the database from being overwhelmed",
      "It allows services to share CPU resources across servers",
      "It encrypts connections between application servers and databases",
    ],
    correct: 1,
    explanation: "With N application servers each opening M connections to the database, you get N×M total connections. Connection poolers (PgBouncer, ProxySQL) maintain a small pool of connections and multiplex many application requests through them, preventing database connection exhaustion.",
  },
  {
    question: "What does it mean for a system to be 'elastically scalable'?",
    options: [
      "The system can handle any amount of load without degradation",
      "The system can automatically scale capacity up and down in response to demand",
      "The system uses flexible hardware that can be reconfigured",
      "The system scales only during pre-defined maintenance windows",
    ],
    correct: 1,
    explanation: "Elastic scalability means the system automatically provisions resources when demand increases and releases them when demand decreases. Cloud platforms (AWS, GCP, Azure) enable this with auto-scaling groups, managed Kubernetes, and serverless compute.",
  },
];

export default function ScalabilityContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Scalability</strong> is the ability of a system to handle growing amounts of work by adding resources. A scalable system can handle 10x or 100x more load without requiring a complete redesign. It's one of the most common system design interview topics.
      </p>

      <InteractiveDiagram nodes={verticalNodes} edges={verticalEdges} nodeTypes={nodeTypes} title="Vertical vs Horizontal Scaling" description="Top: Scale up one machine. Bottom: Scale out to multiple machines with a load balancer." height={340} />

      <ComparisonTable title="Vertical vs Horizontal Scaling" columns={comparison.columns} rows={comparison.rows} />

      <KeyTakeaway variant="important">
        The most scalable architectures combine both: vertical scaling for stateful components (databases), horizontal scaling for stateless components (API servers). Start vertical (simpler), then evolve to horizontal as you hit limits.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">Making Your Service Horizontally Scalable</h2>
      <ul className="space-y-2 list-none text-sm">
        {[
          "Store sessions in Redis (not in-memory)  any server can handle any request",
          "Avoid local filesystem  use S3/blob storage for uploads",
          "Use connection pooling  each of N servers shouldn't have N database connections",
          "Design stateless services  easier to scale, test, and deploy",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-accent mt-1 shrink-0">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
