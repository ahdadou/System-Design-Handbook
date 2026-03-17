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
    explanation: "An API Gateway acts as the front door for all API requests. It handles authentication, rate limiting, SSL termination, and routes requests to the appropriate microservice — so each service doesn't implement these concerns itself.",
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
