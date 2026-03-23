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
    explanation: "The 'database per service' pattern ensures loose coupling. Service A cannot directly query Service B's database  it must call Service B's API. This enforces clear boundaries and independent deployability.",
  },
  {
    question: "When is a monolithic architecture more appropriate than microservices?",
    options: [
      "When the system serves more than 1 million users",
      "For early-stage startups and small teams where deployment simplicity matters",
      "When using NoSQL databases",
      "Always  monoliths are always better",
    ],
    correct: 1,
    explanation: "Microservices add operational complexity (service discovery, distributed tracing, network calls). For small teams or early-stage products, a well-structured monolith is simpler to develop and debug.",
  },
  {
    question: "What is service discovery in a microservices architecture, and why is it necessary?",
    options: [
      "A process for documenting what each service does",
      "A mechanism by which services find each other's network locations dynamically, since services have dynamic IPs in containerized environments",
      "A tool for automatically generating service APIs",
      "A monitoring system that detects when services crash",
    ],
    correct: 1,
    explanation: "In containerized microservices (Kubernetes, ECS), service instances have dynamic IP addresses that change on restarts or scaling events. Service discovery (Consul, Kubernetes DNS, AWS Service Discovery) maintains a registry of service locations so services can find each other without hardcoded addresses.",
  },
  {
    question: "What is the 'strangler fig' pattern used for in microservices adoption?",
    options: [
      "Killing underperforming microservices automatically",
      "Incrementally migrating a monolith to microservices by routing specific functionalities to new services while the monolith still handles the rest",
      "A pattern for preventing microservices from calling each other in cycles",
      "A deployment strategy for rolling back failed microservice updates",
    ],
    correct: 1,
    explanation: "Named after a fig tree that grows around a host tree, the strangler fig pattern migrates a monolith gradually. New microservices handle specific bounded contexts (user auth, payments), and a router (API Gateway) directs those paths to the new service. Over time, more functionality moves out until the monolith is 'strangled' and can be removed.",
  },
  {
    question: "Why is distributed tracing important in a microservices architecture?",
    options: [
      "It allows services to share data without APIs",
      "It provides end-to-end visibility into a request's path across multiple services, enabling latency analysis and debugging",
      "It eliminates the need for logging in individual services",
      "It automatically fixes failures in downstream services",
    ],
    correct: 1,
    explanation: "A single user request can touch 10+ services in a microservices system. When latency spikes or errors occur, you need to trace the entire request path. Tools like Jaeger, Zipkin, and AWS X-Ray use a correlation ID propagated through all service calls to reconstruct the full trace and identify bottlenecks.",
  },
  {
    question: "What is the 'circuit breaker' pattern in microservices?",
    options: [
      "A security pattern that blocks unauthorized service-to-service calls",
      "A resilience pattern that stops sending requests to a failing downstream service, allowing it time to recover and preventing cascading failures",
      "A load balancing algorithm that routes to the fastest service instance",
      "A deployment strategy that tests new versions with a small percentage of traffic",
    ],
    correct: 1,
    explanation: "A circuit breaker monitors calls to a downstream service. If failures exceed a threshold, the circuit 'opens' and subsequent calls fail fast (return an error or fallback immediately) instead of waiting for timeouts. This prevents a slow or failing service from cascading failures throughout the system. After a timeout, the circuit 'half-opens' to test recovery.",
  },
  {
    question: "What is a key challenge of maintaining data consistency across microservices with separate databases?",
    options: [
      "Services cannot use different database technologies",
      "Traditional ACID transactions cannot span service boundaries, requiring eventual consistency patterns like the Saga pattern",
      "Services must synchronize their database schemas",
      "All reads must go through a single service to ensure consistency",
    ],
    correct: 1,
    explanation: "ACID transactions rely on a single database managing atomicity and isolation. When an order spans the Order Service (writes to Orders DB) and Inventory Service (writes to Inventory DB), no single transaction can span both. The Saga pattern handles this through a sequence of local transactions with compensating transactions for rollback.",
  },
  {
    question: "Which of the following best describes the 'polyglot persistence' benefit of microservices?",
    options: [
      "All services must use the same database to ensure data consistency",
      "Each service can choose the database technology best suited to its data access patterns — relational, document, graph, or key-value",
      "Services can access each other's databases using different query languages",
      "A single database must support multiple query languages simultaneously",
    ],
    correct: 1,
    explanation: "Polyglot persistence means different services use different databases. The User Service might use PostgreSQL for relational data, the Product Catalog uses Elasticsearch for full-text search, and the Session Service uses Redis for fast key-value access. Each service picks the right tool for its access patterns rather than compromising on a single shared database.",
  },
  {
    question: "Amazon, Netflix, and Uber all started as monoliths before migrating to microservices. What does this migration path suggest about microservices adoption?",
    options: [
      "Microservices should always be the starting architecture for any new project",
      "Microservices are best adopted when you have demonstrated scale requirements AND the engineering maturity to manage distributed systems complexity",
      "Monoliths are never appropriate for consumer-facing applications",
      "Microservices migration should happen as early as possible regardless of team size",
    ],
    correct: 1,
    explanation: "These companies migrated to microservices only after their monoliths proved inadequate at scale AND they had the engineering maturity to manage the complexity. For a startup, microservices overhead (service discovery, distributed tracing, network latency, ops tooling) slows development without providing real benefits at low scale.",
  },
  {
    question: "What is 'bounded context' in the context of microservices design?",
    options: [
      "A limit on how many requests a service can handle per second",
      "A domain-driven design concept defining the explicit boundary within which a domain model applies, used to define service boundaries in microservices",
      "The maximum number of microservices that can run in a single container",
      "A security boundary preventing cross-service data access",
    ],
    correct: 1,
    explanation: "Bounded context, from Domain-Driven Design, defines the scope within which a particular domain model is valid and consistent. In microservices, bounded contexts guide service boundaries — each service owns one bounded context. The 'User' concept in the Order context (just an ID) differs from the 'User' in the Identity context (credentials, profile), and each service models it independently.",
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
