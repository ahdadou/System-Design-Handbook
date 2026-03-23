"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { LoadBalancerDiagram } from "@/components/diagrams/load-balancer/LoadBalancerDiagram";

const questions = [
  {
    question: "What is the main difference between L4 and L7 load balancers?",
    options: [
      "L4 is faster, L7 can route based on HTTP content",
      "L4 handles HTTPS, L7 handles HTTP",
      "L4 is cloud-based, L7 is on-premise",
      "L4 uses round-robin, L7 uses least connections",
    ],
    correct: 0,
    explanation: "L4 load balancers route based on TCP/IP headers (fast, no content inspection). L7 load balancers inspect HTTP headers, URLs, and cookies to make smarter routing decisions.",
  },
  {
    question: "Which load balancing algorithm sends each new request to the server with the fewest active connections?",
    options: ["Round Robin", "Weighted Round Robin", "Least Connections", "IP Hash"],
    correct: 2,
    explanation: "Least Connections (aka Least Outstanding Requests) routes new requests to the server currently handling the fewest active connections, ideal when requests have variable processing times.",
  },
  {
    question: "What is 'sticky sessions' (session persistence) in load balancing?",
    options: [
      "Keeping all connections open permanently",
      "Routing a user's requests always to the same server",
      "Caching session data in the load balancer",
      "Encrypting session cookies",
    ],
    correct: 1,
    explanation: "Sticky sessions ensure a user's requests always go to the same server (usually via cookie or IP hash). Useful for stateful apps but reduces the balancing benefits.",
  },
  {
    question: "What is SSL termination in the context of a load balancer?",
    options: [
      "Blocking SSL connections at the firewall",
      "The load balancer decrypts HTTPS traffic, then forwards plain HTTP to backend servers",
      "Renewing SSL certificates automatically",
      "Encrypting traffic between backend servers",
    ],
    correct: 1,
    explanation: "SSL termination means the load balancer handles the SSL/TLS decryption, forwarding decrypted HTTP requests to backend servers. This offloads CPU-intensive cryptography from application servers.",
  },
  {
    question: "Which load balancing algorithm is best suited for ensuring a specific user always reaches their shopping cart data stored on one server?",
    options: ["Round Robin", "Least Connections", "Random", "IP Hash"],
    correct: 3,
    explanation: "IP Hash uses the client's IP address to deterministically select a server. The same client IP always maps to the same server, providing session affinity without explicit sticky session cookies.",
  },
  {
    question: "What is the purpose of health checks in a load balancer?",
    options: [
      "To monitor the load balancer's own CPU usage",
      "To periodically verify backend servers are responsive and stop sending traffic to failed ones",
      "To encrypt traffic between the load balancer and backend servers",
      "To log all incoming requests for auditing",
    ],
    correct: 1,
    explanation: "Load balancers perform periodic health checks (HTTP, TCP, or custom) against backend servers. If a server fails checks, the load balancer removes it from the pool until it recovers, providing automatic fault tolerance.",
  },
  {
    question: "In active-active load balancer redundancy, what happens when one load balancer fails?",
    options: [
      "All traffic drops until the failed LB is replaced",
      "The passive load balancer takes over after a short failover delay",
      "The remaining active load balancers continue serving traffic without interruption",
      "Traffic is rerouted through DNS to a different datacenter",
    ],
    correct: 2,
    explanation: "In active-active mode, multiple load balancers all serve traffic simultaneously. If one fails, the others already handle traffic, so there is no failover delay. This contrasts with active-passive where there is a brief failover period.",
  },
  {
    question: "A microservices architecture routes /api/users to one service and /api/products to another. Which load balancer type enables this?",
    options: ["L4 (TCP) load balancer", "L7 (HTTP) load balancer", "DNS round-robin", "Hardware load balancer"],
    correct: 1,
    explanation: "Path-based routing requires inspecting the HTTP URL, which is only possible with an L7 load balancer. AWS ALB, Nginx, and Envoy support this, allowing you to route to different backend services based on the request path.",
  },
  {
    question: "What is a major drawback of using sticky sessions in a horizontally-scaled system?",
    options: [
      "Sticky sessions increase SSL handshake overhead",
      "They make rolling deployments harder and reduce effective load distribution",
      "Sticky sessions prevent health checks from working",
      "They require more memory on the load balancer",
    ],
    correct: 1,
    explanation: "Sticky sessions tie users to specific servers, meaning one server may be overloaded while others are idle. Deploying updates is also harder because you can't gracefully drain a server without disrupting its 'stuck' users.",
  },
  {
    question: "Which AWS service acts as an L7 (Application) load balancer?",
    options: ["AWS NLB (Network Load Balancer)", "AWS ALB (Application Load Balancer)", "AWS ELB Classic", "AWS Route 53"],
    correct: 1,
    explanation: "AWS ALB (Application Load Balancer) operates at Layer 7 and supports HTTP/HTTPS, path-based routing, host-based routing, WebSockets, and HTTP/2. AWS NLB operates at Layer 4 for ultra-high performance TCP/UDP traffic.",
  },
];

export default function LoadBalancingContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        A <strong className="text-txt">load balancer</strong> sits between clients and a pool of servers, distributing incoming requests across multiple instances. It's the foundation of horizontal scalability  without it, scaling out means nothing because all traffic would hit one server.
      </p>
      <p>
        Load balancers also provide fault tolerance: if a server dies, the load balancer stops sending traffic to it. They can perform health checks, SSL termination, and rate limiting  making them a critical piece of production infrastructure.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">Interactive Load Balancer</h2>
      <LoadBalancerDiagram />

      <h2 className="text-2xl font-bold font-heading text-txt">L4 vs L7 Load Balancers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">L4 (Transport Layer)</div>
          <ul className="text-xs space-y-1">
            {["Routes based on IP + TCP port", "Cannot inspect HTTP content", "Extremely fast (no parsing overhead)", "Good for TCP/UDP traffic", "Example: AWS NLB, HAProxy"].map((i) => (
              <li key={i} className="flex gap-1.5"><span>•</span>{i}</li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">L7 (Application Layer)</div>
          <ul className="text-xs space-y-1">
            {["Routes based on URL, headers, cookies", "Can implement A/B testing, canary deploys", "SSL termination", "More CPU overhead", "Example: AWS ALB, Nginx, Envoy"].map((i) => (
              <li key={i} className="flex gap-1.5"><span>•</span>{i}</li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Load Balancing Algorithms</h2>
      <div className="space-y-3">
        {[
          { name: "Round Robin", desc: "Requests distributed in order: Server 1, 2, 3, 1, 2, 3... Simple but ignores server load.", best: "Servers with equal capacity" },
          { name: "Weighted Round Robin", desc: "Like round-robin but servers with higher weight get more requests. Server A:3, B:2, C:1 → A gets 50% of traffic.", best: "Servers with different specs" },
          { name: "Least Connections", desc: "Each request goes to the server with fewest active connections. Adapts to variable request durations.", best: "Long-lived connections (WebSockets)" },
          { name: "IP Hash", desc: "Client IP determines which server handles the request. Same client always hits same server (sticky sessions).", best: "Stateful apps without shared session storage" },
          { name: "Random", desc: "Server selected randomly. Simple, no state needed. Similar to round-robin in aggregate.", best: "Quick prototyping, simple setups" },
        ].map((alg) => (
          <div key={alg.name} className="p-4 bg-surface rounded-xl border border-border-ui">
            <div className="font-semibold text-txt text-sm font-heading mb-1">{alg.name}</div>
            <p className="text-xs text-txt-2">{alg.desc}</p>
            <div className="mt-1.5 text-xs text-txt-3">Best for: <span className="text-accent">{alg.best}</span></div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        Active-Passive vs Active-Active redundancy: In active-passive, a standby LB takes over if the primary fails. In active-active, both load balancers handle traffic simultaneously. Active-active doubles throughput but requires both to stay in sync.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
