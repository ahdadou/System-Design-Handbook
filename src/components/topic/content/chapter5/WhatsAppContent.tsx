"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "client", type: "system", position: { x: 0, y: 200 }, data: { label: "WhatsApp Client", icon: "📱", color: "#10b981" } },
  { id: "lb", type: "system", position: { x: 160, y: 200 }, data: { label: "Load Balancer", icon: "⚖️", color: "#3b82f6" } },
  { id: "gateway", type: "system", position: { x: 320, y: 200 }, data: { label: "WebSocket Gateway", sublabel: "Persistent connections", icon: "🔌", color: "#06b6d4", description: "Each user maintains a persistent WebSocket connection to a gateway server. 10M+ concurrent connections." } },
  { id: "chat", type: "system", position: { x: 480, y: 120 }, data: { label: "Chat Service", icon: "💬", color: "#8b5cf6", description: "Routes messages to recipients. Stores in queue if recipient offline." } },
  { id: "presence", type: "system", position: { x: 480, y: 280 }, data: { label: "Presence Service", sublabel: "Online status", icon: "🟢", color: "#10b981" } },
  { id: "media", type: "system", position: { x: 480, y: 380 }, data: { label: "Media Service", icon: "🖼️", color: "#f59e0b" } },
  { id: "kafka", type: "system", position: { x: 640, y: 120 }, data: { label: "Kafka", sublabel: "Message queue", icon: "📨", color: "#f59e0b" } },
  { id: "msgdb", type: "database", position: { x: 640, y: 240 }, data: { label: "Cassandra", type: "Messages (by conversation)", color: "#10b981" } },
  { id: "s3", type: "system", position: { x: 640, y: 380 }, data: { label: "S3 / CDN", sublabel: "Media files", icon: "🪣", color: "#3b82f6" } },
];

const edges: Edge[] = [
  { id: "e1", source: "client", target: "lb", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e2", source: "lb", target: "gateway", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e3", source: "gateway", target: "chat", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e4", source: "gateway", target: "presence", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e5", source: "chat", target: "kafka", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e6", source: "kafka", target: "msgdb", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e7", source: "media", target: "s3", animated: true, style: { stroke: "#3b82f6", strokeWidth: 1.5 } },
];

const questions = [
  {
    question: "Why does WhatsApp use WebSockets instead of HTTP polling for messaging?",
    options: [
      "WebSockets are more secure",
      "WebSockets provide bidirectional persistent connections  push messages instantly without polling overhead",
      "HTTP polling is not supported on mobile",
      "WebSockets use less data",
    ],
    correct: 1,
    explanation: "HTTP polling would require clients to check for new messages every N seconds  wasteful and slow. WebSockets maintain a persistent connection; server pushes messages instantly when they arrive. Essential for real-time chat.",
  },
  {
    question: "Why does WhatsApp use Cassandra for message storage?",
    options: [
      "Cassandra has better SQL support",
      "Cassandra is optimized for high write throughput and time-series access patterns (read by conversation ID, time)",
      "Cassandra is cheaper than PostgreSQL",
      "Cassandra supports full-text search",
    ],
    correct: 1,
    explanation: "WhatsApp processes billions of messages/day. Cassandra handles extreme write throughput. Message access pattern is always 'get messages for conversation X, sorted by time'  a perfect fit for Cassandra's partition key + clustering key design.",
  },
];

export default function WhatsAppContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        Designing <strong className="text-txt">WhatsApp</strong> is a real-world exercise in building a highly available, low-latency messaging system at extreme scale: 2 billion users, 100 billion messages per day, end-to-end encrypted.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">Scale Estimates</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { metric: "2B", label: "Monthly Active Users" },
          { metric: "100B", label: "Messages/day" },
          { metric: "500M", label: "Groups" },
          { metric: "1M", label: "Concurrent connections per server" },
        ].map((m) => (
          <div key={m.metric} className="p-3 rounded-xl bg-elevated border border-border-ui text-center">
            <div className="text-xl font-bold font-heading text-c-success">{m.metric}</div>
            <div className="text-xs text-txt-3 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <InteractiveDiagram nodes={nodes} edges={edges} nodeTypes={nodeTypes} title="WhatsApp  System Architecture" description="Real-time messaging at global scale" height={440} />

      <h2 className="text-2xl font-bold font-heading text-txt">Key Design Decisions</h2>
      <div className="space-y-3">
        {[
          { title: "WebSocket Connections", desc: "Each active user maintains a persistent WebSocket connection to a gateway server. With 500M concurrent users, this requires careful connection management (Erlang/Elixir excels here  handles millions of concurrent processes cheaply).", color: "#3b82f6" },
          { title: "Message Delivery", desc: "1. Store message in Cassandra. 2. If recipient online: push via WebSocket. 3. If offline: store in a delivery queue, push when they reconnect. 4. Send delivery receipts (✓ = sent, ✓✓ = delivered, blue = read).", color: "#10b981" },
          { title: "End-to-End Encryption", desc: "WhatsApp uses the Signal Protocol. Messages are encrypted on sender's device; only recipient can decrypt. WhatsApp's servers only store encrypted blobs  they can't read your messages.", color: "#8b5cf6" },
          { title: "Media Storage", desc: "Media files stored in distributed object storage (similar to S3). Client uploads media, gets a URL. Message contains URL reference. CDN serves media files globally with low latency.", color: "#f59e0b" },
        ].map((d) => (
          <div key={d.title} className="p-4 rounded-xl border border-border-ui bg-surface border-l-4" style={{ borderLeftColor: d.color }}>
            <div className="font-bold text-sm font-heading mb-1.5" style={{ color: d.color }}>{d.title}</div>
            <p className="text-xs text-txt-2">{d.desc}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        WhatsApp was famously lean: 50 engineers supporting 900M users in 2015. Key: Erlang/OTP for concurrent connections (millions per server), Mnesia + RDBMS for metadata, aggressive client-side caching, and simple features done extremely well.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
