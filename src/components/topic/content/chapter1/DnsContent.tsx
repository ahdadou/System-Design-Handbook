"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { DnsFlowDiagram } from "@/components/diagrams/dns/DnsFlowDiagram";

const questions = [
  {
    question: "What is the purpose of DNS TTL (Time To Live)?",
    options: [
      "Limits the number of DNS servers queried",
      "Specifies how long a DNS record can be cached",
      "Encrypts DNS responses",
      "Routes traffic to the nearest server",
    ],
    correct: 1,
    explanation: "TTL specifies how long (in seconds) a DNS resolver can cache the response before querying again. Lower TTL = more up-to-date but more DNS queries; higher TTL = faster but stale data risk.",
  },
  {
    question: "Which DNS record type maps a domain to an IPv4 address?",
    options: ["CNAME", "MX", "A", "NS"],
    correct: 2,
    explanation: "An A record maps a hostname to an IPv4 address (e.g., example.com → 93.184.216.34). AAAA records map to IPv6 addresses.",
  },
  {
    question: "In DNS resolution, which server has the final authoritative answer?",
    options: ["DNS Resolver", "Root Nameserver", "TLD Nameserver", "Authoritative Nameserver"],
    correct: 3,
    explanation: "The Authoritative Nameserver holds the actual DNS records for a domain. It's operated by the domain owner or their DNS provider (e.g., Route 53, Cloudflare).",
  },
];

export default function DnsContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-[#94a3b8]">
      <p className="text-base leading-relaxed">
        The <strong className="text-[#f1f5f9]">Domain Name System (DNS)</strong> is the internet's phonebook. It translates human-readable domain names (like <code className="text-[#06b6d4] bg-[#06b6d4]/10 px-1 rounded">google.com</code>) into machine-readable IP addresses (<code className="text-[#06b6d4] bg-[#06b6d4]/10 px-1 rounded">142.250.80.46</code>). Without DNS, you'd need to memorize IP addresses for every website.
      </p>
      <p>
        DNS is distributed, hierarchical, and designed to be fault-tolerant. The entire system resolves roughly 1 trillion queries per day, making it one of the most critical pieces of internet infrastructure.
      </p>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">The DNS Resolution Flow</h2>
      <p>
        When you type a URL in your browser, DNS performs an 8-step resolution process. It's designed to be fast through caching at every level — your browser, OS, router, and ISP all cache DNS results.
      </p>
      <DnsFlowDiagram />

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Common DNS Record Types</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { type: "A", desc: "Maps hostname → IPv4 address", example: "example.com → 93.184.216.34", color: "#3b82f6" },
          { type: "AAAA", desc: "Maps hostname → IPv6 address", example: "example.com → 2606:2800::1", color: "#8b5cf6" },
          { type: "CNAME", desc: "Alias — points to another hostname", example: "www → example.com", color: "#06b6d4" },
          { type: "MX", desc: "Mail exchange servers for a domain", example: "example.com → mail.example.com", color: "#f59e0b" },
          { type: "TXT", desc: "Arbitrary text (SPF, DKIM, verification)", example: "v=spf1 include:... -all", color: "#10b981" },
          { type: "NS", desc: "Authoritative nameservers for domain", example: "ns1.example.com", color: "#ef4444" },
        ].map((r) => (
          <div key={r.type} className="p-3 rounded-xl border border-[#1e293b] bg-[#111827]">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-xs px-2 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: `${r.color}20`, color: r.color }}>{r.type}</code>
              <span className="text-xs text-[#94a3b8]">{r.desc}</span>
            </div>
            <code className="text-[10px] text-[#475569]">{r.example}</code>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        DNS is a critical failure point. During the 2016 Dyn DNS attack, much of the internet went down because major websites relied on a single DNS provider. Best practice: use multiple DNS providers (Route 53 + Cloudflare) for redundancy.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">DNS for System Design</h2>
      <ul className="space-y-2 list-none text-sm">
        {[
          "Use DNS-based load balancing by returning multiple A records (round-robin DNS) — simple but no health checking",
          "Set low TTLs (60-300s) before major migrations so changes propagate quickly",
          "Use ALIAS/ANAME records (not CNAME) for apex domains to avoid CNAME restrictions",
          "Latency-based routing (Route 53): DNS returns different IPs based on user's geographic location",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-[#3b82f6] mt-1 shrink-0">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
