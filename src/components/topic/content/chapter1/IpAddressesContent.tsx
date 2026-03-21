"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode };

const nodes: Node[] = [
  { id: "internet", type: "system", position: { x: 240, y: 20 }, data: { label: "Internet", icon: "🌐", color: "#3b82f6", description: "The global public network using IPv4/IPv6 addressing" } },
  { id: "isp", type: "system", position: { x: 240, y: 130 }, data: { label: "ISP Router", sublabel: "NAT Gateway", icon: "📡", color: "#06b6d4", description: "Internet Service Provider assigns a public IP to your router via DHCP. NAT translates private to public IPs." } },
  { id: "router", type: "system", position: { x: 240, y: 240 }, data: { label: "Home Router", sublabel: "192.168.1.1", icon: "📶", color: "#8b5cf6", description: "Assigns private IPs (192.168.x.x, 10.x.x.x, 172.16.x.x) to local devices via DHCP" } },
  { id: "laptop", type: "system", position: { x: 80, y: 350 }, data: { label: "Laptop", sublabel: "192.168.1.10", icon: "💻", color: "#10b981" } },
  { id: "phone", type: "system", position: { x: 240, y: 350 }, data: { label: "Phone", sublabel: "192.168.1.11", icon: "📱", color: "#10b981" } },
  { id: "server", type: "system", position: { x: 400, y: 350 }, data: { label: "IoT Device", sublabel: "192.168.1.12", icon: "🔌", color: "#10b981" } },
];

const edges: Edge[] = [
  { id: "e1", source: "internet", target: "isp", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "isp", target: "router", label: "Public IP → Private", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e3", source: "router", target: "laptop", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e4", source: "router", target: "phone", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e5", source: "router", target: "server", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
];

const ipv4vsv6 = {
  columns: [
    { key: "ipv4", label: "IPv4", color: "#3b82f6" },
    { key: "ipv6", label: "IPv6", color: "#8b5cf6" },
  ],
  rows: [
    { feature: "Address Length", ipv4: "32 bits", ipv6: "128 bits" },
    { feature: "Address Space", ipv4: "4.3 billion", ipv6: "340 undecillion" },
    { feature: "Format", ipv4: "192.168.1.1", ipv6: "2001:db8::1" },
    { feature: "NAT Required", ipv4: "Yes (exhaustion)", ipv6: "No" },
    { feature: "Header Size", ipv4: "20-60 bytes", ipv6: "40 bytes fixed" },
    { feature: "Security", ipv4: "Optional (IPSec)", ipv6: "Built-in IPSec" },
    { feature: "Adoption", ipv4: "~99% of traffic", ipv6: "Growing (40%+)" },
  ],
};

const questions = [
  {
    question: "Which IP address range is NOT a private IP range?",
    options: ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "203.0.113.0/24"],
    correct: 3,
    explanation: "203.0.113.0/24 is a public IP range (TEST-NET-3). Private ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.",
  },
  {
    question: "What problem does IPv6 primarily solve?",
    options: ["Slow internet speeds", "IPv4 address exhaustion", "DNS resolution delays", "Router configuration complexity"],
    correct: 1,
    explanation: "IPv4 only has ~4.3 billion addresses, which is insufficient for the modern internet. IPv6 provides 340 undecillion addresses, solving exhaustion.",
  },
  {
    question: "What is NAT (Network Address Translation) used for?",
    options: [
      "Encrypting network traffic",
      "Mapping multiple private IPs to a single public IP",
      "Converting IPv4 to IPv6",
      "Assigning DNS names to IP addresses",
    ],
    correct: 1,
    explanation: "NAT allows multiple devices on a private network to share a single public IP address, conserving IPv4 addresses.",
  },
];

export default function IpAddressesContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <div className="text-base leading-relaxed space-y-4">
        <p>
          An <strong className="text-txt">IP address</strong> (Internet Protocol address) is a numerical label assigned to every device connected to a computer network. Think of it as the postal address of the internet without it, data packets wouldn't know where to go.
        </p>
        <p>
          Every packet of data traveling across the internet includes a source IP (where it came from) and a destination IP (where it's going). Routers along the way read these addresses and forward packets hop-by-hop until they reach their destination.
        </p>
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">IPv4 vs IPv6</h2>
      <p>
        The internet was built on <strong className="text-txt">IPv4</strong>, which uses 32-bit addresses written as four octets (e.g., <code className="text-accent-2 bg-[#06b6d4]/10 px-1 rounded">192.168.1.1</code>). With only ~4.3 billion possible addresses and over 15 billion internet-connected devices, we ran out. <strong className="text-txt">IPv6</strong> solves this with 128-bit addresses providing virtually unlimited space.
      </p>

      <ComparisonTable title="IPv4 vs IPv6 Comparison" columns={ipv4vsv6.columns} rows={ipv4vsv6.rows} />

      <h2 className="text-2xl font-bold font-heading text-txt">Public vs Private IPs</h2>
      <p>
        Not all IP addresses are reachable from the internet. <strong className="text-txt">Public IPs</strong> are globally unique and routable on the internet. <strong className="text-txt">Private IPs</strong> are reserved for use within local networks and are not routable on the internet.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
        {[
          { range: "10.0.0.0/8", desc: "Class A private  large organizations", count: "16M addresses" },
          { range: "172.16.0.0/12", desc: "Class B private  medium networks", count: "1M addresses" },
          { range: "192.168.0.0/16", desc: "Class C private  home networks", count: "65K addresses" },
        ].map((r) => (
          <div key={r.range} className="p-3 bg-surface rounded-xl border border-border-ui">
            <code className="text-accent-2 text-sm font-mono">{r.range}</code>
            <p className="text-xs text-txt-2 mt-1">{r.desc}</p>
            <p className="text-xs text-txt-3 mt-1">{r.count}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        NAT (Network Address Translation) is why you can have hundreds of devices on a home network all sharing one public IP. Your router translates outgoing private IPs to the public IP, and maps responses back to the correct internal device.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">Static vs Dynamic IPs</h2>
      <p>
        A <strong className="text-txt">static IP</strong> is permanently assigned and doesn't change  critical for servers and databases where other services need a reliable, fixed address. A <strong className="text-txt">dynamic IP</strong> is temporarily assigned via DHCP (Dynamic Host Configuration Protocol) and may change on reconnection  typical for home users and most client devices.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="IP Address Architecture  Home Network"
        description="Click nodes to see details about each component"
        height={400}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">System Design Implications</h2>
      <ul className="space-y-2 list-none">
        {[
          "Use private IPs for internal services (databases, caches) to prevent direct public access",
          "Assign static IPs to servers and load balancers for DNS reliability",
          "Design for IPv6 from the start  major cloud providers fully support it",
          "Use security groups / firewalls at the IP layer to control traffic",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="text-accent mt-1">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <KeyTakeaway variant="tip">
        In AWS/GCP/Azure, instances in private subnets use NAT Gateways to reach the internet. Databases should NEVER have public IPs  they should only be accessible within the VPC via private IPs.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
