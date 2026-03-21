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
