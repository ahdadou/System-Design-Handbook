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
