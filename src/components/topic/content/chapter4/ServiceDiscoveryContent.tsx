"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "client", type: "system", position: { x: 180, y: 0 }, data: { label: "Client", sublabel: "Makes service calls", icon: "💻", color: "#3b82f6", description: "In client-side discovery, the client queries the registry directly and load-balances itself. In server-side, it just calls a load balancer." } },
  { id: "registry", type: "database", position: { x: 180, y: 140 }, data: { label: "Service Registry", sublabel: "Consul / etcd / Eureka", icon: "📋", color: "#f59e0b", description: "Central source of truth for service locations. Services register on startup, deregister on shutdown. Supports health checks to auto-remove dead instances." } },
  { id: "lb", type: "system", position: { x: 380, y: 140 }, data: { label: "Load Balancer", sublabel: "Server-side discovery", icon: "⚖️", color: "#06b6d4", description: "In server-side discovery, the LB queries the registry internally. Client only knows the LB address — simpler clients, more infra." } },
  { id: "svcA", type: "system", position: { x: 0, y: 300 }, data: { label: "Service A", sublabel: "Instance :8001", icon: "⚙️", color: "#10b981", description: "Registers: { name: 'payment', host: '10.0.1.5', port: 8001 }. Sends heartbeat every 10s. Registry marks dead after 3 missed beats." } },
  { id: "svcB", type: "system", position: { x: 180, y: 300 }, data: { label: "Service B", sublabel: "Instance :8002", icon: "⚙️", color: "#10b981", description: "Same service, different instance. Registry returns both. Client or LB picks using round-robin, least-connections, or random." } },
  { id: "svcC", type: "system", position: { x: 360, y: 300 }, data: { label: "Service C", sublabel: "Instance :8003", icon: "⚙️", color: "#10b981", description: "Auto-scaling adds new instances. They self-register. Registry immediately reflects new capacity — no manual config." } },
];

const edges: Edge[] = [
  { id: "e1", source: "client", target: "registry", label: "1. Query registry", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e2", source: "registry", target: "client", label: "2. Return instances", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e3", source: "client", target: "lb", label: "Alt: server-side", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2, strokeDasharray: "5,5" }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e4", source: "registry", target: "svcA", label: "health check", animated: true, style: { stroke: "#10b981", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e5", source: "registry", target: "svcB", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e6", source: "registry", target: "svcC", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e7", source: "svcA", target: "registry", label: "heartbeat", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5, strokeDasharray: "3,3" }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
];

const questions = [
  {
    question: "What is the key difference between client-side and server-side service discovery?",
    options: [
      "Client-side uses HTTP; server-side uses TCP",
      "In client-side discovery, the client queries the registry and picks an instance. In server-side, the client calls a load balancer which queries the registry internally.",
      "Client-side discovery requires Kubernetes; server-side does not",
      "Server-side discovery is always faster than client-side",
    ],
    correct: 1,
    explanation: "Client-side discovery (e.g., Netflix Ribbon) gives the client full control and visibility but requires each client to implement load-balancing logic. Server-side discovery (e.g., AWS ALB + ECS) keeps clients simple — they just call a stable LB endpoint — but adds infrastructure complexity.",
  },
  {
    question: "What happens in a service registry if an instance crashes without deregistering?",
    options: [
      "The registry keeps the stale entry forever",
      "Health checks detect the dead instance and the registry removes it after missed heartbeat thresholds",
      "All traffic to that service stops immediately",
      "The client retries indefinitely",
    ],
    correct: 1,
    explanation: "Service registries like Consul use health checks (HTTP ping or TCP check) and heartbeat TTLs. If an instance stops sending heartbeats (default: 3 missed intervals), the registry marks it critical and removes it from the available pool. This prevents clients from routing to dead instances.",
  },
];

export default function ServiceDiscoveryContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-[#94a3b8]">
      <p className="text-base leading-relaxed">
        In a microservices architecture, services need to find each other to communicate. Unlike monoliths where function calls are direct, microservices run as separate processes with dynamic IPs — especially in containerized environments where Kubernetes reschedules pods constantly. <strong className="text-[#f1f5f9]">Service Discovery</strong> solves this by maintaining a live registry of where every service instance is running.
      </p>
      <p>
        Before service discovery, ops teams hand-edited config files with IP addresses. When an instance died or scaled, configs went stale. Service discovery automates this entirely — services register themselves, the registry tracks health, and clients always get fresh, healthy endpoints.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Service Discovery Architecture"
        description="Client-side discovery (client → registry → pick instance) and server-side discovery (client → LB → registry). Click nodes for details."
        height={380}
      />

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Discovery Patterns</h2>
      <div className="grid grid-cols-1 gap-4">
        {[
          {
            title: "Client-Side Discovery",
            color: "#3b82f6",
            icon: "💻",
            how: "Client queries the service registry, gets a list of healthy instances, and applies its own load-balancing logic (round-robin, random, least-connections).",
            pros: "Client has full control; can implement sophisticated routing (canary, A/B); no extra hop.",
            cons: "Every client SDK must implement registry integration and LB logic. Language coupling.",
            example: "Netflix Ribbon + Eureka. Spring Cloud LoadBalancer.",
          },
          {
            title: "Server-Side Discovery",
            color: "#06b6d4",
            icon: "⚖️",
            how: "Client calls a stable load balancer endpoint. The LB queries the registry internally and routes to a healthy instance. Client is registry-unaware.",
            pros: "Clients are simple. Works with any language. Central routing control.",
            cons: "LB is a potential single point of failure. Extra network hop. LB must be highly available.",
            example: "AWS ALB + ECS Service Discovery. Kubernetes Services with kube-proxy.",
          },
        ].map((p) => (
          <div key={p.title} className="p-4 rounded-xl border border-[#1e293b] bg-[#111827]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{p.icon}</span>
              <div className="font-bold text-sm font-heading" style={{ color: p.color }}>{p.title}</div>
            </div>
            <p className="text-xs text-[#94a3b8] mb-2 leading-relaxed">{p.how}</p>
            <div className="grid grid-cols-2 gap-2 text-[10px] mb-2">
              <div><span className="text-[#10b981]">✓ </span><span className="text-[#94a3b8]">{p.pros}</span></div>
              <div><span className="text-[#ef4444]">✗ </span><span className="text-[#94a3b8]">{p.cons}</span></div>
            </div>
            <div className="text-[10px] text-[#475569]">Used by: {p.example}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Registration Strategies</h2>
      <div className="space-y-3">
        {[
          { strategy: "Self-Registration", color: "#10b981", desc: "Services register and deregister themselves on startup/shutdown. Simple, but couples service code to the registry client library. If the service crashes without graceful shutdown, the registry relies on health checks to clean up." },
          { strategy: "Third-Party Registration", color: "#8b5cf6", desc: "An external system (Kubernetes controller, Registrator sidecar, or AWS ECS) monitors the platform and registers/deregisters services. Services stay registry-agnostic. Preferred in Kubernetes environments." },
        ].map((s) => (
          <div key={s.strategy} className="flex gap-3 p-4 rounded-xl bg-[#111827] border border-[#1e293b]">
            <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <div>
              <div className="font-semibold text-sm text-[#f1f5f9] font-heading mb-1">{s.strategy}</div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Popular Service Registries</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "Consul", icon: "🏛️", color: "#f59e0b", detail: "HashiCorp's all-in-one: service registry, health checks, KV store, service mesh. Supports multi-datacenter. Uses Raft consensus for consistency." },
          { name: "etcd", icon: "📦", color: "#3b82f6", detail: "The backbone of Kubernetes. Distributed KV store with strong consistency (Raft). Used for cluster state, not just service discovery." },
          { name: "Eureka", icon: "☁️", color: "#ef4444", detail: "Netflix's battle-tested registry. AP system (favors availability). Clients cache the registry locally — still work if registry goes down briefly." },
          { name: "Kubernetes DNS", icon: "⎈", color: "#06b6d4", detail: "In K8s, Services get a DNS name (my-svc.namespace.svc.cluster.local). kube-dns or CoreDNS resolves to ClusterIP. No SDK needed — just use the hostname." },
        ].map((item) => (
          <div key={item.name} className="p-3 rounded-xl border bg-[#111827]" style={{ borderColor: `${item.color}40` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">{item.icon}</span>
              <div className="font-bold text-xs text-[#f1f5f9] font-heading">{item.name}</div>
            </div>
            <p className="text-[10px] text-[#94a3b8] leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="info">
        In Kubernetes, you rarely implement service discovery yourself — Services + CoreDNS handle it automatically. Focus on understanding the concepts for system design interviews and for environments outside K8s (multi-cloud, bare metal, hybrid). Consul remains the most popular choice for non-Kubernetes environments.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
