"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { ProxyFlowDiagram } from "@/components/diagrams/proxy/ProxyFlowDiagram";

const questions = [
  {
    question: "What is the main difference between a forward proxy and a reverse proxy?",
    options: [
      "Forward proxies are faster than reverse proxies",
      "Forward proxy sits between clients and internet (used by clients); reverse proxy sits in front of servers (used by servers)",
      "Forward proxies handle HTTPS, reverse proxies handle HTTP",
      "They are the same thing",
    ],
    correct: 1,
    explanation: "Forward proxy: client-side (hides client from internet). Reverse proxy: server-side (hides servers from internet). VPNs are forward proxies; Nginx as API gateway is a reverse proxy.",
  },
  {
    question: "Which of these is a common use case for a reverse proxy?",
    options: [
      "Hiding a user's IP from websites",
      "Bypassing geographic content restrictions",
      "SSL termination, load balancing, and serving cached content",
      "Anonymizing internet traffic",
    ],
    correct: 2,
    explanation: "Reverse proxies (Nginx, HAProxy) handle SSL termination (decrypt HTTPS before forwarding to backend), load balance across servers, cache responses, and compress data.",
  },
  {
    question: "In a microservices architecture, what role does a reverse proxy (API Gateway) play?",
    options: [
      "It stores microservice data to reduce database queries",
      "It acts as a single entry point, routing requests to the correct microservice",
      "It replaces the need for individual microservice authentication",
      "It directly accesses databases on behalf of microservices",
    ],
    correct: 1,
    explanation: "An API Gateway (reverse proxy) provides a unified entry point for all client requests. It handles routing to different microservices, authentication, rate limiting, logging, and SSL termination — keeping these cross-cutting concerns out of individual services.",
  },
  {
    question: "What is a transparent proxy?",
    options: [
      "A proxy that encrypts all traffic passing through it",
      "A proxy that intercepts traffic without clients knowing it exists",
      "A proxy with no caching capabilities",
      "A proxy used only for monitoring, without modifying requests",
    ],
    correct: 1,
    explanation: "A transparent proxy intercepts network traffic without requiring any client-side configuration. Clients are unaware of the proxy's existence. ISPs use them for caching and content filtering.",
  },
  {
    question: "Which of the following best describes a SOCKS proxy?",
    options: [
      "An application-level proxy that only handles HTTP/HTTPS traffic",
      "A general-purpose proxy that works at the transport layer and handles any TCP/UDP traffic",
      "A reverse proxy for microservices",
      "A proxy that caches DNS responses",
    ],
    correct: 1,
    explanation: "SOCKS (Socket Secure) is a protocol that operates at Layer 5 (Session) and can proxy any type of TCP/UDP traffic, not just HTTP. SOCKS5 supports authentication and UDP, making it useful for general-purpose proxying.",
  },
  {
    question: "What security benefit does a reverse proxy provide to backend servers?",
    options: [
      "It encrypts data stored on backend servers",
      "It hides the backend servers' IP addresses and provides a centralized point to apply security policies",
      "It automatically patches security vulnerabilities in backend services",
      "It isolates backend servers by running them in separate containers",
    ],
    correct: 1,
    explanation: "A reverse proxy shields backend servers from direct internet exposure. Clients only see and interact with the proxy's IP. The proxy can apply WAF rules, rate limiting, and DDoS protection before requests reach your application servers.",
  },
  {
    question: "What is a corporate forward proxy primarily used for?",
    options: [
      "Load balancing employee traffic across multiple office servers",
      "Providing employees with faster internet access via caching",
      "Filtering and monitoring employee internet traffic, and enforcing content policies",
      "Assigning public IP addresses to internal company devices",
    ],
    correct: 2,
    explanation: "Corporate forward proxies intercept all outbound HTTP/HTTPS traffic from employees. They enforce content filtering (block social media, adult content), log activity for compliance, and can decrypt TLS traffic for inspection.",
  },
  {
    question: "What is 'SSL passthrough' in a proxy configuration?",
    options: [
      "The proxy decrypts and re-encrypts SSL traffic",
      "The proxy forwards encrypted SSL traffic directly to backend servers without decrypting it",
      "The proxy generates new SSL certificates for each connection",
      "The proxy caches SSL session keys to speed up handshakes",
    ],
    correct: 1,
    explanation: "SSL passthrough means the proxy forwards encrypted traffic as-is to the backend server, which handles the decryption. The proxy cannot inspect the content. This contrasts with SSL termination where the proxy decrypts traffic.",
  },
  {
    question: "Why is Nginx commonly used as a reverse proxy in production systems?",
    options: [
      "Nginx is only used for serving static files, not as a proxy",
      "Nginx handles thousands of concurrent connections efficiently using an event-driven, non-blocking architecture",
      "Nginx replaces the need for application servers like Node.js or Django",
      "Nginx provides automatic database scaling",
    ],
    correct: 1,
    explanation: "Nginx uses an asynchronous, event-driven architecture that can handle tens of thousands of concurrent connections with very low memory usage. It excels at reverse proxying, SSL termination, static file serving, and load balancing.",
  },
  {
    question: "What is a 'service mesh' and how does it relate to proxies?",
    options: [
      "A hardware network appliance that replaces software proxies",
      "An infrastructure layer where each service has a sidecar proxy handling all inter-service communication",
      "A DNS-based service discovery mechanism",
      "A monitoring tool that aggregates proxy logs",
    ],
    correct: 1,
    explanation: "A service mesh (e.g., Istio, Linkerd) deploys a lightweight sidecar proxy (e.g., Envoy) alongside each service. These proxies handle mutual TLS, load balancing, circuit breaking, retries, and observability for all inter-service traffic automatically.",
  },
];

export default function ProxyContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        A <strong className="text-txt">proxy server</strong> acts as an intermediary between two parties in a network connection. The client talks to the proxy, and the proxy forwards requests to the destination. Proxies can be used for anonymity, security, caching, and traffic management.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">Forward Proxy (Client-Side)</h2>
      <p className="text-sm">
        A <strong className="text-txt">forward proxy</strong> sits between the client and the internet. The internet sees the proxy's IP, not the client's. Use cases: corporate content filtering, VPNs, anonymization, caching for a group of users.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">Reverse Proxy (Server-Side)</h2>
      <p className="text-sm">
        A <strong className="text-txt">reverse proxy</strong> sits in front of your servers. Clients see the proxy's address, not your actual servers. This enables SSL termination, load balancing, rate limiting, caching, and hiding backend architecture.
      </p>

      <ProxyFlowDiagram />

      <ComparisonTable
        title="Forward vs Reverse Proxy"
        columns={[
          { key: "forward", label: "Forward Proxy", color: "#3b82f6" },
          { key: "reverse", label: "Reverse Proxy", color: "#10b981" },
        ]}
        rows={[
          { feature: "Protects", forward: "Clients from internet", reverse: "Servers from clients" },
          { feature: "Used By", forward: "Client-side (users)", reverse: "Server-side (operations)" },
          { feature: "Examples", forward: "VPN, Squid, corporate proxy", reverse: "Nginx, HAProxy, Cloudflare" },
          { feature: "SSL", forward: "Encrypts outbound", reverse: "Terminates inbound SSL" },
          { feature: "Load Balancing", forward: false, reverse: true },
          { feature: "Caching", forward: "Shared cache for users", reverse: "Cache for origin servers" },
        ]}
      />

      <KeyTakeaway variant="important">
        In modern architectures, the reverse proxy layer is where you implement cross-cutting concerns: authentication, rate limiting, logging, compression, and SSL. It keeps these concerns out of individual services (separation of concerns).
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
