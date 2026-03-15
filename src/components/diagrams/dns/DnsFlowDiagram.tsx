"use client";
import { useMemo } from "react";
import { Node, Edge } from "@xyflow/react";
import { InteractiveDiagram } from "../InteractiveDiagram";
import { SystemNode, StepNode } from "../CustomNodes";

const nodeTypes = { system: SystemNode, step: StepNode };

export function DnsFlowDiagram() {
  const nodes: Node[] = useMemo(() => [
    { id: "browser", type: "system", position: { x: 0, y: 160 }, data: { label: "Browser", sublabel: "User's Device", icon: "🌐", color: "#3b82f6", description: "The browser first checks its own DNS cache. If not found, it queries the OS resolver." } },
    { id: "resolver", type: "system", position: { x: 220, y: 160 }, data: { label: "DNS Resolver", sublabel: "ISP / Recursive", icon: "🔄", color: "#06b6d4", description: "The recursive resolver is operated by your ISP or a public DNS (8.8.8.8). It does the heavy lifting." } },
    { id: "root", type: "system", position: { x: 440, y: 40 }, data: { label: "Root Server", sublabel: "13 clusters worldwide", icon: "🌍", color: "#8b5cf6", description: "Root servers know about all TLD servers. They respond with the address of the TLD nameserver." } },
    { id: "tld", type: "system", position: { x: 440, y: 160 }, data: { label: "TLD Server", sublabel: ".com / .org / .net", icon: "📡", color: "#f59e0b", description: "The TLD server knows which authoritative nameserver handles this domain." } },
    { id: "auth", type: "system", position: { x: 440, y: 280 }, data: { label: "Authoritative NS", sublabel: "Domain's Nameserver", icon: "🏛️", color: "#10b981", description: "The authoritative nameserver holds the actual DNS records (A, AAAA, CNAME, MX, etc.)." } },
    { id: "cache", type: "system", position: { x: 220, y: 40 }, data: { label: "Cache", sublabel: "TTL-based", icon: "⚡", color: "#ef4444", description: "DNS responses are cached at the resolver with a TTL. Subsequent lookups for the same domain are instant." } },
    { id: "server", type: "system", position: { x: 660, y: 160 }, data: { label: "Web Server", sublabel: "IP: 93.184.x.x", icon: "🖥️", color: "#10b981", description: "The final destination — the web server at the resolved IP address." } },
  ], []);

  const edges: Edge[] = useMemo(() => [
    { id: "e1", source: "browser", target: "resolver", label: "1. DNS query", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
    { id: "e2", source: "resolver", target: "cache", label: "Check cache", animated: false, style: { stroke: "#ef4444", strokeWidth: 1.5, strokeDasharray: "5,5" }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
    { id: "e3", source: "resolver", target: "root", label: "2. Root query", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
    { id: "e4", source: "root", target: "resolver", label: "3. TLD address", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 1.5, strokeDasharray: "4,4" }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
    { id: "e5", source: "resolver", target: "tld", label: "4. TLD query", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
    { id: "e6", source: "tld", target: "resolver", label: "5. Auth NS address", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5, strokeDasharray: "4,4" }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
    { id: "e7", source: "resolver", target: "auth", label: "6. Auth query", animated: true, style: { stroke: "#10b981", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
    { id: "e8", source: "auth", target: "resolver", label: "7. IP address", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5, strokeDasharray: "4,4" }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
    { id: "e9", source: "resolver", target: "browser", label: "8. IP returned", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
    { id: "e10", source: "browser", target: "server", label: "HTTP Request", animated: true, style: { stroke: "#10b981", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  ], []);

  return (
    <InteractiveDiagram
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      title="DNS Resolution Flow"
      description="Click nodes to expand details • Hover to highlight • Drag to rearrange"
      height={420}
    />
  );
}
