"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode };

const microNodes: Node[] = [
  { id: "gw", type: "system", position: { x: 220, y: 20 }, data: { label: "API Gateway", icon: "🚪", color: "#3b82f6", description: "Single entry point. Routes to services, handles auth, rate limiting." } },
  { id: "users", type: "system", position: { x: 50, y: 150 }, data: { label: "User Service", icon: "👤", color: "#06b6d4" } },
  { id: "orders", type: "system", position: { x: 220, y: 150 }, data: { label: "Order Service", icon: "📦", color: "#8b5cf6" } },
  { id: "payments", type: "system", position: { x: 390, y: 150 }, data: { label: "Payment Service", icon: "💳", color: "#10b981" } },
  { id: "db1", type: "system", position: { x: 50, y: 280 }, data: { label: "Users DB", icon: "🗄️", color: "#06b6d4" } },
  { id: "db2", type: "system", position: { x: 220, y: 280 }, data: { label: "Orders DB", icon: "🗄️", color: "#8b5cf6" } },
  { id: "db3", type: "system", position: { x: 390, y: 280 }, data: { label: "Payments DB", icon: "🗄️", color: "#10b981" } },
  { id: "bus", type: "system", position: { x: 220, y: 380 }, data: { label: "Message Bus", sublabel: "Kafka", icon: "📨", color: "#f59e0b" } },
];

const microEdges: Edge[] = [
  { id: "e1", source: "gw", target: "users", animated: true, style: { stroke: "#06b6d4", strokeWidth: 1.5 } },
  { id: "e2", source: "gw", target: "orders", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 1.5 } },
  { id: "e3", source: "gw", target: "payments", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e4", source: "users", target: "db1", animated: true, style: { stroke: "#06b6d4", strokeWidth: 1.5 } },
  { id: "e5", source: "orders", target: "db2", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 1.5 } },
  { id: "e6", source: "payments", target: "db3", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e7", source: "orders", target: "bus", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
  { id: "e8", source: "payments", target: "bus", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
];

const questions = [
  {
    question: "What is the 'database per service' pattern in microservices?",
    options: [
      "All microservices share a single database for simplicity",
      "Each service owns its data and the only way to access it is through the service's API",
      "Databases are replicated across all services",
      "Each service has read-only access to all databases",
    ],
    correct: 1,
    explanation: "The 'database per service' pattern ensures loose coupling. Service A cannot directly query Service B's database — it must call Service B's API. This enforces clear boundaries and independent deployability.",
  },
  {
    question: "When is a monolithic architecture more appropriate than microservices?",
    options: [
      "When the system serves more than 1 million users",
      "For early-stage startups and small teams where deployment simplicity matters",
      "When using NoSQL databases",
      "Always — monoliths are always better",
    ],
    correct: 1,
    explanation: "Microservices add operational complexity (service discovery, distributed tracing, network calls). For small teams or early-stage products, a well-structured monolith is simpler to develop and debug.",
  },
];

export default function MicroservicesContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        The <strong className="text-txt">monolith vs microservices</strong> decision is one of the most consequential architectural choices. Monoliths are simpler to start with; microservices scale better but add enormous operational complexity. Understanding the tradeoffs is critical.
      </p>

      <InteractiveDiagram nodes={microNodes} edges={microEdges} nodeTypes={nodeTypes} title="Microservices Architecture" description="Each service owns its data, communicates via APIs and events" height={440} />

      <ComparisonTable
        title="Monolith vs Microservices"
        columns={[{ key: "mono", label: "Monolith", color: "#3b82f6" }, { key: "micro", label: "Microservices", color: "#10b981" }]}
        rows={[
          { feature: "Development Speed", mono: "Fast (single codebase)", micro: "Slower (cross-service coordination)" },
          { feature: "Deployment", mono: "Simple (one artifact)", micro: "Complex (many services)" },
          { feature: "Scaling", mono: "Scale entire app", micro: "Scale individual services" },
          { feature: "Fault Isolation", mono: "One crash = all down", micro: "Failures isolated to service" },
          { feature: "Technology", mono: "Single tech stack", micro: "Polyglot freedom" },
          { feature: "Debugging", mono: "Simple (local traces)", micro: "Complex (distributed tracing)" },
          { feature: "Team Size", mono: "Small teams", micro: "Large distributed teams" },
        ]}
        verdict={{ mono: "Startups, MVPs", micro: "Scale-ups, large orgs" }}
      />

      <KeyTakeaway variant="tip">
        Amazon, Netflix, and Uber all started as monoliths and later migrated to microservices when they had both the scale that justified it AND the engineering maturity to manage the complexity. Don't start with microservices unless you already have separate teams.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
