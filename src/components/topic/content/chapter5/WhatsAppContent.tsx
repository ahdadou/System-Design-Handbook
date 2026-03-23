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
  {
    question: "How does WhatsApp implement end-to-end encryption (E2EE)?",
    options: [
      "WhatsApp encrypts all messages on its servers before storing them",
      "Messages are encrypted on the sender's device using the Signal Protocol; only the recipient's device holds the decryption key",
      "WhatsApp uses HTTPS, which provides end-to-end encryption by default",
      "Messages are encrypted with a shared password that users exchange manually",
    ],
    correct: 1,
    explanation: "WhatsApp uses the Signal Protocol (Double Ratchet + X3DH key exchange). Encryption/decryption happens exclusively on the client device. WhatsApp servers only ever see ciphertext and cannot read message contents. Each message uses a unique encryption key derived from the ratchet, so compromising one key does not expose past messages (forward secrecy).",
  },
  {
    question: "How does WhatsApp deliver messages to offline users?",
    options: [
      "Messages are dropped if the recipient is offline; they must request resend",
      "Messages are stored in a delivery queue on the server; when the recipient reconnects, the server pushes queued messages and sends delivery receipts",
      "The sender's device retries every second until the recipient comes online",
      "Messages are sent via SMS as a fallback when the recipient is offline",
    ],
    correct: 1,
    explanation: "When a recipient is offline, WhatsApp stores the message server-side in a queue. When the recipient reconnects via WebSocket, the server drains the queue and pushes all pending messages. The sender then receives the double-checkmark delivery receipt. Messages are deleted from the server once delivered (WhatsApp does not store message history long-term on its servers).",
  },
  {
    question: "What is the 'presence' service in a messaging system like WhatsApp?",
    options: [
      "A service that manages user account creation and authentication",
      "A service that tracks and broadcasts whether users are online, offline, or typing, using heartbeat signals",
      "A service that stores user location data for finding nearby contacts",
      "A service that manages push notification delivery",
    ],
    correct: 1,
    explanation: "The presence service tracks real-time user status. Clients send heartbeat signals (e.g., every 30 seconds) over their WebSocket connection. If the heartbeat stops, the user is marked offline after a timeout. 'Last seen' timestamps are stored in a fast key-value store like Redis. For scale, presence updates use a pub/sub model so subscribers (other users' clients) are notified when a contact's status changes.",
  },
  {
    question: "How would you design group messaging for WhatsApp groups with up to 1,024 members?",
    options: [
      "Send individual point-to-point messages to each member simultaneously from the sender's device",
      "The sender's client sends one message to the server; the server fans out to all group members' connected WebSocket sessions or queues",
      "Group messages use broadcast UDP packets to all member IP addresses",
      "All group members maintain a peer-to-peer mesh network for message distribution",
    ],
    correct: 1,
    explanation: "For group messages, the sender sends a single message to the server. The Group Service looks up all group members, then fans out: for each online member, it pushes via their WebSocket connection; for offline members, it queues the message for later delivery. At 1,024 members, a single message can generate 1,024 delivery operations, so the fanout must be handled asynchronously to avoid blocking.",
  },
  {
    question: "How does WhatsApp handle media files (photos, videos) efficiently?",
    options: [
      "Media is embedded directly in the message payload and stored in Cassandra alongside text",
      "The client uploads media to object storage (S3-equivalent), gets a URL, and sends only the URL reference in the message; recipients download directly from the CDN",
      "All media is transcoded to a single format and stored in the chat database",
      "Media files are transmitted peer-to-peer between sender and recipient, bypassing WhatsApp servers",
    ],
    correct: 1,
    explanation: "Media files are uploaded separately to blob/object storage (similar to S3). The message payload contains only a reference URL and a client-side encryption key for the media file. Recipients download media directly from the CDN/object storage, which scales independently of the messaging infrastructure. This keeps message payloads tiny and avoids storing large binary data in Cassandra.",
  },
  {
    question: "WhatsApp famously supported 900M users with only ~50 engineers. What architectural choice was most responsible for this operational efficiency?",
    options: [
      "Using a microservices architecture with hundreds of independent services",
      "Using Erlang/OTP, which is designed for massive concurrency and fault tolerance, handling millions of lightweight processes per server",
      "Running entirely on serverless functions, eliminating server management",
      "Using a monolithic architecture that was easier to deploy and maintain",
    ],
    correct: 1,
    explanation: "WhatsApp used Erlang/OTP, a language and runtime built for telecommunications-grade concurrency. Erlang's lightweight processes (not OS threads) can handle millions of concurrent WebSocket connections per server with predictable latency. OTP provides built-in supervision trees for fault tolerance and hot code reloading for zero-downtime deployments. This dramatically reduced the number of servers and engineers needed to manage the infrastructure.",
  },
  {
    question: "What Cassandra data modeling approach is best suited for storing chat messages?",
    options: [
      "Partition by user_id so all of a user's messages are co-located",
      "Partition by conversation_id with message timestamp as the clustering key, enabling efficient retrieval of messages in a conversation ordered by time",
      "Store all messages in a single partition for simplicity",
      "Partition by message_id for even data distribution across the cluster",
    ],
    correct: 1,
    explanation: "The primary read pattern for chat is: 'Give me messages in conversation X, sorted by time.' Cassandra's partition key determines co-location; the clustering key determines sort order within the partition. Partition key: conversation_id groups all messages for a chat. Clustering key: created_at (or a TimeUUID) sorts them chronologically. Pagination is done using WHERE created_at < cursor LIMIT N on the same partition, which is extremely efficient.",
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
