"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, StepNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, step: StepNode };

const tcpNodes: Node[] = [
  { id: "client", type: "system", position: { x: 50, y: 160 }, data: { label: "Client", icon: "💻", color: "#3b82f6" } },
  { id: "syn", type: "step", position: { x: 220, y: 60 }, data: { label: "SYN", sublabel: "seq=0", step: 1, color: "#3b82f6" } },
  { id: "synack", type: "step", position: { x: 220, y: 160 }, data: { label: "SYN-ACK", sublabel: "seq=0,ack=1", step: 2, color: "#06b6d4" } },
  { id: "ack", type: "step", position: { x: 220, y: 260 }, data: { label: "ACK", sublabel: "ack=1", step: 3, color: "#10b981" } },
  { id: "server", type: "system", position: { x: 390, y: 160 }, data: { label: "Server", icon: "🖥️", color: "#10b981" } },
];

const tcpEdges: Edge[] = [
  { id: "e1", source: "client", target: "syn", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "syn", target: "server", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e3", source: "server", target: "synack", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e4", source: "synack", target: "client", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e5", source: "client", target: "ack", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e6", source: "ack", target: "server", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
];

const comparison = {
  columns: [
    { key: "tcp", label: "TCP", color: "#3b82f6" },
    { key: "udp", label: "UDP", color: "#f59e0b" },
  ],
  rows: [
    { feature: "Connection", tcp: "Connection-oriented (3-way handshake)", udp: "Connectionless" },
    { feature: "Reliability", tcp: "Guaranteed delivery", udp: "Best effort" },
    { feature: "Order", tcp: "Ordered packets", udp: "No ordering" },
    { feature: "Error Checking", tcp: "Error correction", udp: "Checksum only" },
    { feature: "Speed", tcp: "Slower (overhead)", udp: "Faster (no overhead)" },
    { feature: "Header Size", tcp: "20 bytes", udp: "8 bytes" },
    { feature: "Flow Control", tcp: true, udp: false },
    { feature: "Congestion Control", tcp: true, udp: false },
    { feature: "Use Cases", tcp: "HTTP, FTP, Email", udp: "DNS, Video, Gaming" },
  ],
};

const questions = [
  {
    question: "Which protocol would you choose for a live video streaming application?",
    options: ["TCP — because we need reliability", "UDP — because low latency matters more than perfect delivery", "Both, depending on network conditions", "Neither, use WebSockets instead"],
    correct: 1,
    explanation: "UDP is preferred for live video/audio because a dropped frame is better than freezing the stream waiting for retransmission. Slight data loss is acceptable in real-time media.",
  },
  {
    question: "What is the TCP 3-way handshake?",
    options: [
      "SYN → ACK → FIN",
      "SYN → SYN-ACK → ACK",
      "GET → POST → DELETE",
      "CONNECT → SEND → CLOSE",
    ],
    correct: 1,
    explanation: "The TCP 3-way handshake establishes a connection: Client sends SYN, server responds with SYN-ACK, client confirms with ACK. Only then can data be exchanged.",
  },
  {
    question: "Why does DNS use UDP instead of TCP?",
    options: [
      "UDP is more secure",
      "DNS doesn't need reliable delivery",
      "DNS queries are small and speed matters; UDP has less overhead",
      "TCP doesn't support port 53",
    ],
    correct: 2,
    explanation: "DNS queries are typically tiny (under 512 bytes) and the 3-way TCP handshake overhead would be larger than the query itself. UDP is faster for small request/response exchanges.",
  },
];

export default function TcpUdpContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">TCP (Transmission Control Protocol)</strong> and <strong className="text-txt">UDP (User Datagram Protocol)</strong> are the two core transport-layer protocols. Every internet application you've ever used chooses between them. Understanding this choice is fundamental to system design.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">TCP — The Reliable Workhorse</h2>
      <p>
        TCP guarantees that data arrives in order, without errors, and without duplication. It achieves this through a connection establishment handshake, acknowledgment numbers, retransmission on loss, and flow/congestion control. The price is latency overhead.
      </p>

      <InteractiveDiagram
        nodes={tcpNodes}
        edges={tcpEdges}
        nodeTypes={nodeTypes}
        title="TCP 3-Way Handshake"
        description="The connection establishment dance before any data is exchanged"
        height={360}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">UDP — The Speed Demon</h2>
      <p>
        UDP just sends packets and doesn't care if they arrive. No connection setup, no acknowledgments, no retransmission. What you lose in reliability, you gain in raw speed and simplicity. Applications that need real-time performance often implement their own lightweight reliability on top of UDP (QUIC does this for HTTP/3).
      </p>

      <ComparisonTable title="TCP vs UDP" columns={comparison.columns} rows={comparison.rows} verdict={{ tcp: "Web, APIs, Files", udp: "Gaming, Video, DNS" }} />

      <h2 className="text-2xl font-bold font-heading text-txt">When to Use Each</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">Use TCP When:</div>
          <ul className="text-xs space-y-1 list-none">
            {["Every byte must arrive (files, emails, APIs)", "Data order matters (financial transactions)", "You can tolerate extra latency", "Reliability > performance"].map((i) => (
              <li key={i} className="flex gap-1.5"><span>•</span>{i}</li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30">
          <div className="font-bold text-[#f59e0b] text-sm font-heading mb-2">Use UDP When:</div>
          <ul className="text-xs space-y-1 list-none">
            {["Speed is critical (live video, gaming)", "Small packet loss is tolerable", "Broadcasting to multiple recipients", "Building custom reliability (QUIC)"].map((i) => (
              <li key={i} className="flex gap-1.5"><span>•</span>{i}</li>
            ))}
          </ul>
        </div>
      </div>

      <KeyTakeaway variant="important">
        HTTP/3 runs over QUIC, which is built on UDP. Google found that the TCP handshake overhead was a significant bottleneck, so they built custom reliability into QUIC. This shows that UDP + custom protocol can outperform TCP for web traffic.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
