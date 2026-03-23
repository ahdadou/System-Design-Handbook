"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode };

const nodes: Node[] = [
  { id: "client", type: "system", position: { x: 0, y: 150 }, data: { label: "Client", sublabel: "Mobile / Web", icon: "📱", color: "#3b82f6" } },
  { id: "gw", type: "system", position: { x: 220, y: 150 }, data: { label: "API Gateway", sublabel: "Auth • Rate Limit • Route", icon: "🚪", color: "#06b6d4", description: "Single entry point. Handles: Auth, Rate Limiting, SSL termination, Request routing, Response aggregation, Logging" } },
  { id: "s1", type: "system", position: { x: 440, y: 50 }, data: { label: "User Service", icon: "👤", color: "#8b5cf6" } },
  { id: "s2", type: "system", position: { x: 440, y: 150 }, data: { label: "Order Service", icon: "📦", color: "#10b981" } },
  { id: "s3", type: "system", position: { x: 440, y: 250 }, data: { label: "Product Service", icon: "🛍️", color: "#f59e0b" } },
];

const edges: Edge[] = [
  { id: "e1", source: "client", target: "gw", animated: true, label: "HTTPS", style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e2", source: "gw", target: "s1", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 1.5 } },
  { id: "e3", source: "gw", target: "s2", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e4", source: "gw", target: "s3", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
];

const questions = [
  {
    question: "What is the primary purpose of an API Gateway?",
    options: [
      "To store API responses",
      "A single entry point that handles cross-cutting concerns (auth, rate limiting, routing) for multiple backend services",
      "To convert REST APIs to GraphQL",
      "To replace load balancers",
    ],
    correct: 1,
    explanation: "An API Gateway acts as the front door for all API requests. It handles authentication, rate limiting, SSL termination, and routes requests to the appropriate microservice  so each service doesn't implement these concerns itself.",
  },
  {
    question: "How does an API Gateway reduce duplication in a microservices architecture?",
    options: [
      "By sharing a single codebase across all services",
      "By centralizing cross-cutting concerns (authentication, rate limiting, logging) so each microservice does not need to implement them independently",
      "By storing shared data in a central database accessible to all services",
      "By deploying all microservices in the same container",
    ],
    correct: 1,
    explanation: "Without an API Gateway, every microservice must implement authentication, rate limiting, SSL termination, and logging independently — a significant duplication of effort. The gateway handles all these cross-cutting concerns once, centrally, letting each service focus exclusively on its business logic.",
  },
  {
    question: "What is 'request aggregation' (also called API composition) in an API Gateway?",
    options: [
      "Combining multiple API gateways into a single deployment",
      "The gateway making multiple downstream service calls and combining their responses into a single response for the client",
      "Batching multiple client requests to send to the backend at once",
      "Caching responses from multiple services in a shared cache",
    ],
    correct: 1,
    explanation: "A mobile app might need data from the User Service, Order Service, and Product Service for a single screen. Without aggregation, the client makes 3 requests. With an API Gateway performing aggregation, the client makes 1 request, and the gateway fans out to the 3 services and assembles a combined response — reducing client-side complexity and network round trips.",
  },
  {
    question: "What is 'rate limiting' at the API Gateway level, and why is it important?",
    options: [
      "Limiting the number of services that can be registered with the gateway",
      "Restricting the number of requests a client can make in a time window to prevent abuse, DDoS attacks, and ensure fair usage",
      "Limiting the size of request payloads to prevent large uploads",
      "Throttling the gateway's own processing speed to reduce CPU usage",
    ],
    correct: 1,
    explanation: "Rate limiting protects backend services from being overwhelmed by a single client's excessive requests (intentional abuse or runaway clients). By enforcing limits at the gateway (e.g., 1000 requests/minute per API key), backend services are shielded from traffic spikes without each service implementing its own rate limiting logic.",
  },
  {
    question: "What is the 'Backend for Frontend' (BFF) pattern in API Gateway design?",
    options: [
      "A single API Gateway that serves all client types with the same API",
      "Separate API Gateways (or gateway layers) tailored for different client types — one optimized for mobile, one for web, one for third-party partners",
      "A backend service that generates frontend code automatically",
      "A pattern where the frontend directly calls all backend services without a gateway",
    ],
    correct: 1,
    explanation: "Mobile apps, web browsers, and partner APIs have different data needs (mobile needs compact payloads; web needs rich data; partners need stable versioned APIs). The BFF pattern creates a separate gateway or gateway layer per client type, each optimized for its consumer's specific needs. This avoids generic APIs that compromise for all clients.",
  },
  {
    question: "An API Gateway terminates SSL (HTTPS). What does this mean for internal service communication?",
    options: [
      "All internal service communication must also use HTTPS",
      "SSL is decrypted at the gateway, and internal service calls use HTTP — reducing the overhead of encryption/decryption on every internal hop",
      "The gateway stores SSL certificates for all internal services",
      "Internal services can no longer use HTTPS after SSL termination",
    ],
    correct: 1,
    explanation: "SSL termination means the gateway decrypts HTTPS traffic from clients and forwards plain HTTP to internal services within the trusted private network. This offloads the CPU-intensive encryption/decryption from every service. Internal communication typically remains on HTTP within a VPC or private network where encryption overhead isn't justified.",
  },
  {
    question: "How does an API Gateway handle authentication for microservices?",
    options: [
      "Each microservice validates JWT tokens independently with no gateway involvement",
      "The gateway validates JWT tokens, API keys, or OAuth tokens on every request and forwards only authenticated requests to backend services, optionally adding user identity headers",
      "The gateway stores user passwords and validates them before forwarding requests",
      "Authentication is handled by a database that the gateway queries on each request",
    ],
    correct: 1,
    explanation: "Centralized authentication at the gateway means backend services can trust that requests arriving from the gateway are already authenticated. The gateway validates JWTs against a public key, or OAuth tokens with an identity provider, then forwards requests with user identity metadata (user ID, roles) as headers — so each service doesn't implement token validation logic.",
  },
  {
    question: "What distinguishes an API Gateway from a traditional load balancer?",
    options: [
      "Load balancers are more expensive than API Gateways",
      "A load balancer distributes traffic across instances of the same service; an API Gateway routes different requests to different services and handles application-level concerns like auth and request transformation",
      "API Gateways only work with microservices; load balancers work with monoliths",
      "Load balancers operate at Layer 7; API Gateways operate at Layer 4",
    ],
    correct: 1,
    explanation: "A load balancer (Layer 4/7) routes traffic across identical instances of the same backend for horizontal scaling. An API Gateway (Layer 7) routes different paths to different services (/users → User Service, /orders → Order Service), performs authentication, rate limiting, protocol translation, and request/response transformation. They serve complementary but different purposes.",
  },
  {
    question: "What is a risk of making the API Gateway too 'smart' (adding business logic to it)?",
    options: [
      "The gateway becomes faster as it handles more logic",
      "The gateway becomes a central dependency and bottleneck — changes to business logic require gateway deployments, creating the same problems as the ESB anti-pattern",
      "Smart gateways consume more bandwidth",
      "Adding logic to the gateway makes it incompatible with cloud providers",
    ],
    correct: 1,
    explanation: "An API Gateway should handle infrastructure concerns (routing, auth, rate limiting) — not business logic. If teams start adding business rules to the gateway, it becomes an integration monolith similar to an ESB: all teams depend on the gateway team, deployments become risky, and the gateway becomes a single point of failure for business functionality.",
  },
  {
    question: "Which popular open-source API Gateway is commonly used with Kubernetes for service mesh ingress?",
    options: [
      "Apache Kafka",
      "Envoy Proxy (used by Istio) and Kong",
      "Redis Sentinel",
      "RabbitMQ",
    ],
    correct: 1,
    explanation: "Envoy is a high-performance proxy used as the data plane in Istio service mesh and as the basis for Kubernetes Ingress controllers. Kong is a popular API gateway built on Nginx with a rich plugin ecosystem. AWS API Gateway is the managed serverless option, while Nginx is used as a DIY high-performance gateway. Each suits different infrastructure contexts.",
  },
];

export default function ApiGatewayContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        An <strong className="text-txt">API Gateway</strong> is a server that acts as the single entry point for all client requests to backend services. Instead of clients calling dozens of microservices directly, they call the gateway, which handles routing, authentication, rate limiting, and other cross-cutting concerns.
      </p>

      <InteractiveDiagram nodes={nodes} edges={edges} nodeTypes={nodeTypes} title="API Gateway Pattern" description="All traffic enters through the gateway" height={320} />

      <h2 className="text-2xl font-bold font-heading text-txt">What an API Gateway Does</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { fn: "Authentication", icon: "🔑", desc: "Verify JWT tokens, API keys, OAuth" },
          { fn: "Rate Limiting", icon: "⏱️", desc: "Prevent abuse, fair usage enforcement" },
          { fn: "SSL Termination", icon: "🔒", desc: "Handle HTTPS, forward HTTP internally" },
          { fn: "Request Routing", icon: "🗺️", desc: "Route to correct microservice" },
          { fn: "Response Aggregation", icon: "🔗", desc: "Combine responses from multiple services" },
          { fn: "Logging & Metrics", icon: "📊", desc: "Centralized request logging, latency tracking" },
        ].map((f) => (
          <div key={f.fn} className="p-3 rounded-lg bg-surface border border-border-ui">
            <span className="text-xl">{f.icon}</span>
            <div className="font-semibold text-xs text-txt mt-1 font-heading">{f.fn}</div>
            <p className="text-[10px] text-txt-3 mt-0.5">{f.desc}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        Popular API Gateways: AWS API Gateway (serverless, managed), Kong (open-source, powerful), Nginx (DIY, high performance), Envoy (service mesh, used by Kubernetes Ingress). Choose based on your infrastructure and team expertise.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
