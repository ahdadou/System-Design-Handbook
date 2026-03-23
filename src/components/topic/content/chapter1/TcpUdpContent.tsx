"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { TcpUdpAnimatedDiagram } from "@/components/diagrams/tcp-udp/TcpUdpAnimatedDiagram";

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
    options: ["TCP  because we need reliability", "UDP  because low latency matters more than perfect delivery", "Both, depending on network conditions", "Neither, use WebSockets instead"],
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
  {
    question: "What is the header size of a UDP packet compared to TCP?",
    options: ["UDP: 20 bytes, TCP: 8 bytes", "UDP: 8 bytes, TCP: 20 bytes", "Both are 20 bytes", "Both are 8 bytes"],
    correct: 1,
    explanation: "UDP headers are only 8 bytes (source port, destination port, length, checksum). TCP headers are at least 20 bytes due to sequence numbers, acknowledgments, flags, window size, and other fields.",
  },
  {
    question: "HTTP/3 uses which underlying transport protocol?",
    options: ["TCP", "UDP via QUIC", "Raw IP", "WebSockets"],
    correct: 1,
    explanation: "HTTP/3 runs over QUIC, which is built on top of UDP. QUIC implements its own reliability, multiplexing, and congestion control while avoiding TCP's head-of-line blocking problem.",
  },
  {
    question: "What is 'head-of-line blocking' in the context of TCP?",
    options: [
      "The first packet in a connection always takes longer to send",
      "A lost packet causes all subsequent packets to be held up waiting for retransmission",
      "TCP connections block new connections from forming",
      "Large packets block small packets in the same stream",
    ],
    correct: 1,
    explanation: "TCP delivers packets in order. If one packet is lost, all subsequent packets must wait for its retransmission even if they've already arrived. This is a key disadvantage of TCP that QUIC (HTTP/3) solves.",
  },
  {
    question: "Which application would benefit most from using TCP?",
    options: [
      "Online multiplayer game with real-time position updates",
      "Live audio streaming",
      "Financial transaction API",
      "Video conferencing",
    ],
    correct: 2,
    explanation: "Financial transactions require guaranteed, ordered delivery with no data loss. TCP's reliability guarantees make it the correct choice when every byte must arrive correctly.",
  },
  {
    question: "What does TCP flow control prevent?",
    options: [
      "Packets from arriving out of order",
      "The sender from overwhelming the receiver's buffer",
      "Network congestion between routers",
      "Duplicate packet delivery",
    ],
    correct: 1,
    explanation: "TCP flow control uses a sliding window mechanism where the receiver advertises how much buffer space it has. This prevents a fast sender from overwhelming a slow receiver's buffer.",
  },
  {
    question: "How does TCP close a connection?",
    options: [
      "Two-way handshake: FIN → ACK",
      "Three-way handshake: FIN → FIN-ACK → ACK",
      "Four-way handshake: FIN → ACK → FIN → ACK",
      "One-way: sender sends RST to terminate",
    ],
    correct: 2,
    explanation: "TCP connection termination uses a four-way handshake: the initiating side sends FIN, the other side sends ACK, then FIN, and the initiating side sends the final ACK. This allows both sides to independently close their half of the connection.",
  },
  {
    question: "Which protocol is most appropriate for a multiplayer game sending 60 position updates per second?",
    options: [
      "TCP, because packet loss would cause desync",
      "UDP, because a slightly stale position is better than waiting for retransmission",
      "HTTP/1.1 over TCP, because it has good browser support",
      "FTP, because it has low overhead",
    ],
    correct: 1,
    explanation: "Real-time games use UDP because position data becomes stale immediately. If a packet is lost, waiting for TCP retransmission would freeze the game. The next update (sent milliseconds later) is more useful than a delayed retransmission.",
  },
];

export default function TcpUdpContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">TCP (Transmission Control Protocol)</strong> and <strong className="text-txt">UDP (User Datagram Protocol)</strong> are the two core transport-layer protocols. Every internet application you've ever used chooses between them. Understanding this choice is fundamental to system design.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">TCP  The Reliable Workhorse</h2>
      <p>
        TCP guarantees that data arrives in order, without errors, and without duplication. It achieves this through a connection establishment handshake, acknowledgment numbers, retransmission on loss, and flow/congestion control. The price is latency overhead.
      </p>

      <TcpUdpAnimatedDiagram />

      <h2 className="text-2xl font-bold font-heading text-txt">UDP  The Speed Demon</h2>
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
