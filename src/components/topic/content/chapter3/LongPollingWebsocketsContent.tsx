"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, StepNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, step: StepNode };

const nodes: Node[] = [
  { id: "client1", type: "system", position: { x: 20, y: 20 }, data: { label: "Client", sublabel: "Long Polling", icon: "💻", color: "#3b82f6" } },
  { id: "server1", type: "system", position: { x: 200, y: 20 }, data: { label: "Server", sublabel: "Holds connection open", icon: "🖥️", color: "#3b82f6", description: "Server holds the request open until data is available, then responds and client immediately reconnects" } },
  { id: "client2", type: "system", position: { x: 20, y: 160 }, data: { label: "Client", sublabel: "WebSocket", icon: "💻", color: "#10b981" } },
  { id: "server2", type: "system", position: { x: 200, y: 160 }, data: { label: "Server", sublabel: "Full duplex", icon: "🖥️", color: "#10b981", description: "Single persistent TCP connection enables simultaneous bidirectional communication" } },
  { id: "client3", type: "system", position: { x: 20, y: 300 }, data: { label: "Client", sublabel: "SSE", icon: "💻", color: "#f59e0b" } },
  { id: "server3", type: "system", position: { x: 200, y: 300 }, data: { label: "Server", sublabel: "Server → Client only", icon: "🖥️", color: "#f59e0b", description: "Server streams events to client over a single long-lived HTTP connection. Client cannot send data back on this channel." } },
];

const edges: Edge[] = [
  { id: "e1", source: "client1", target: "server1", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "server1", target: "client1", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, strokeDasharray: "5 5" } },
  { id: "e3", source: "client2", target: "server2", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e4", source: "server2", target: "client2", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e5", source: "server3", target: "client3", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
];

const questions = [
  {
    question: "Which real-time technique uses a persistent bidirectional TCP connection?",
    options: [
      "Long Polling",
      "Server-Sent Events (SSE)",
      "WebSockets",
      "Regular HTTP polling",
    ],
    correct: 2,
    explanation: "WebSockets upgrade an HTTP connection to a persistent, full-duplex TCP connection. Both client and server can send messages at any time without the overhead of new HTTP requests.",
  },
  {
    question: "When is Server-Sent Events (SSE) preferable over WebSockets?",
    options: [
      "When you need the client to send frequent messages to the server",
      "When you only need server-to-client updates and want simplicity (live feeds, notifications)",
      "When you need lower latency than WebSockets",
      "When the server cannot maintain persistent connections",
    ],
    correct: 1,
    explanation: "SSE is perfect for one-way server push: live dashboards, news feeds, stock tickers, notifications. It works over regular HTTP/2, supports automatic reconnection, and is simpler than WebSockets when bidirectional communication isn't needed.",
  },
  {
    question: "How does long polling work differently from regular HTTP polling?",
    options: [
      "Long polling sends requests every 1 second; regular polling sends them every 10 seconds",
      "In long polling, the server holds the request open until data is available, then responds; the client immediately sends another request — simulating push with pull",
      "Long polling uses WebSocket connections under the hood",
      "Long polling caches responses to reduce server load",
    ],
    correct: 1,
    explanation: "Regular polling sends repeated requests at fixed intervals, wasting resources when no new data exists. Long polling sends a request; the server suspends it (holds it open, up to ~30s) until data is ready, then responds. The client reconnects immediately after each response. This reduces unnecessary requests while still working with standard HTTP infrastructure.",
  },
  {
    question: "What is the HTTP upgrade handshake that initiates a WebSocket connection?",
    options: [
      "The client sends a CONNECT request and the server responds with 200 OK",
      "The client sends an HTTP request with 'Upgrade: websocket' and 'Connection: Upgrade' headers; the server responds with 101 Switching Protocols",
      "The client and server negotiate a new TCP connection outside of HTTP",
      "The client sends a POST request with the WebSocket protocol version",
    ],
    correct: 1,
    explanation: "WebSocket connections start as HTTP requests with special headers: 'Upgrade: websocket' and 'Connection: Upgrade'. If the server accepts, it responds with '101 Switching Protocols'. From that point, the TCP connection is repurposed for the WebSocket protocol — no more HTTP overhead. This is why WebSockets can traverse HTTP proxies and firewalls.",
  },
  {
    question: "What is a major operational challenge when scaling WebSocket connections across multiple servers?",
    options: [
      "WebSockets require more CPU than regular HTTP connections",
      "WebSocket connections are stateful and tied to a specific server — messages sent to one server cannot be received by clients connected to another server without a shared pub/sub layer",
      "WebSockets cannot be terminated by load balancers",
      "WebSocket connections have a maximum lifetime of 60 seconds",
    ],
    correct: 1,
    explanation: "Unlike stateless HTTP, WebSocket connections are persistent and server-specific. If a client is connected to Server A and a message needs to reach them from Server B, Server B must route it to Server A. Solutions include sticky sessions (pinning clients to servers) or a shared pub/sub layer (Redis Pub/Sub, Kafka) where all servers subscribe to the same channel.",
  },
  {
    question: "Which of the following applications is best suited for WebSockets?",
    options: [
      "A news website displaying updated headlines every 5 minutes",
      "A stock price dashboard showing price changes in real time",
      "A multiplayer game where players send and receive position updates dozens of times per second",
      "A notification system that alerts users about new emails",
    ],
    correct: 2,
    explanation: "Multiplayer games require genuinely bidirectional, low-latency, high-frequency communication — every player's input must reach the server and every server update must reach all players as fast as possible. WebSockets' persistent full-duplex connection with no per-message HTTP overhead is the correct choice. The other options are better served by SSE (one-way push) or polling.",
  },
  {
    question: "SSE uses the 'text/event-stream' content type. What built-in browser API handles SSE connections?",
    options: [
      "XMLHttpRequest with streaming mode",
      "The EventSource API — a native browser interface that opens an SSE connection, receives events, and automatically reconnects on disconnect",
      "WebSocket API with server-only mode",
      "The Fetch API with ReadableStream",
    ],
    correct: 1,
    explanation: "The browser's EventSource API (new EventSource(url)) establishes an SSE connection. It automatically reconnects if the connection drops (using the Last-Event-ID header to resume from the last received event), dispatches events via addEventListener, and works over standard HTTP/2 with multiplexing. This built-in support makes SSE dramatically simpler to implement than WebSockets for server-push scenarios.",
  },
  {
    question: "Why does long polling have high server resource usage compared to WebSockets or SSE?",
    options: [
      "Long polling sends more data per request than WebSockets",
      "Long polling requires a server thread or connection to be held open for each waiting client, consuming resources even when no data is being sent",
      "Long polling uses more bandwidth than other techniques",
      "Long polling requires database queries for every held request",
    ],
    correct: 1,
    explanation: "Each long-polling request ties up a server thread (in thread-per-request models) or an active connection handle for the duration of the wait. For 100,000 concurrent users, this means 100,000 threads or connections sitting idle — a significant resource burden. WebSockets and SSE use event-driven (non-blocking) I/O models where a single thread can multiplex thousands of connections.",
  },
  {
    question: "A chat application needs users to both send and receive messages in real time with low latency. Which technology is most appropriate?",
    options: [
      "Server-Sent Events (SSE), since messages need to be pushed to clients",
      "Long polling, since it simulates real-time with standard HTTP",
      "WebSockets, because bidirectional low-latency communication is required",
      "Regular HTTP polling every 100ms",
    ],
    correct: 2,
    explanation: "Chat requires both directions: clients send messages and receive messages from others. SSE is server-to-client only. Long polling simulates push but with high overhead and latency from the request-response cycle. WebSockets provide a persistent, full-duplex channel where both sides send messages at any time with minimal overhead — the standard choice for chat (Slack, Discord).",
  },
  {
    question: "What advantage does SSE have over WebSockets when operating behind standard HTTP/2 infrastructure?",
    options: [
      "SSE supports bidirectional communication natively over HTTP/2",
      "SSE connections over HTTP/2 are multiplexed — thousands of SSE streams share a single TCP connection to the server, dramatically reducing connection overhead",
      "SSE automatically compresses messages while WebSockets do not",
      "SSE requires less server memory per connection than HTTP/2 WebSockets",
    ],
    correct: 1,
    explanation: "HTTP/2 multiplexing allows multiple SSE streams over a single TCP connection between browser and server. This means 1000 users each with an open SSE connection may only require a handful of underlying TCP connections. WebSocket connections each require their own TCP connection. This makes SSE at HTTP/2 scale significantly more connection-efficient for server-push scenarios.",
  },
];

export default function LongPollingWebsocketsContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        Traditional HTTP is request-response  the client asks, the server answers, connection closes. For real-time apps (chat, live scores, notifications), you need the server to push updates. Three patterns solve this: <strong className="text-txt">Long Polling</strong>, <strong className="text-txt">WebSockets</strong>, and <strong className="text-c-success">Server-Sent Events</strong>.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Real-Time Communication Patterns"
        description="Click nodes to see details. Arrows show data flow direction."
        height={420}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Pattern Comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-ui">
              <th className="text-left py-2 px-3 text-txt font-heading">Feature</th>
              <th className="py-2 px-3 text-accent font-heading">Long Polling</th>
              <th className="py-2 px-3 text-c-success font-heading">WebSockets</th>
              <th className="py-2 px-3 text-[#f59e0b] font-heading">SSE</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Direction", "Bi (new request each time)", "Full duplex", "Server → Client only"],
              ["Protocol", "HTTP", "WS / WSS (TCP)", "HTTP"],
              ["Overhead", "High (new connection per poll)", "Low (one connection)", "Low (one connection)"],
              ["Browser Support", "Universal", "Universal", "Universal (no IE)"],
              ["Auto-reconnect", "Manual", "Manual", "Built-in"],
              ["Use Case", "Simple notifications, legacy", "Chat, gaming, live collab", "Live feeds, dashboards"],
            ].map(([feature, lp, ws, sse]) => (
              <tr key={feature} className="border-b border-border-ui/50 hover:bg-elevated/30">
                <td className="py-2 px-3 text-txt font-medium">{feature}</td>
                <td className="py-2 px-3 text-center text-txt-2">{lp}</td>
                <td className="py-2 px-3 text-center text-txt-2">{ws}</td>
                <td className="py-2 px-3 text-center text-txt-2">{sse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">How Each Works</h2>
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-[#3b82f6]/30 bg-[#3b82f6]/5">
          <h3 className="font-bold text-sm text-accent font-heading mb-2">Long Polling</h3>
          <p className="text-xs">Client sends request → Server holds it open (up to 30s) → When data is ready, server responds → Client immediately sends another request. Simulates push using pull. Works everywhere but high server resource usage (thread per open connection).</p>
        </div>
        <div className="p-4 rounded-xl border border-[#10b981]/30 bg-[#10b981]/5">
          <h3 className="font-bold text-sm text-c-success font-heading mb-2">WebSockets</h3>
          <p className="text-xs">Client sends HTTP Upgrade request → Server accepts → Connection upgrades to WebSocket protocol. Both sides can now send frames at any time. Used by Slack, Discord, Figma, multiplayer games. Requires WebSocket-aware load balancer (sticky sessions or pub/sub layer).</p>
        </div>
        <div className="p-4 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/5">
          <h3 className="font-bold text-sm text-[#f59e0b] font-heading mb-2">Server-Sent Events (SSE)</h3>
          <p className="text-xs">Client opens a GET request with Accept: text/event-stream → Server keeps the connection open and pushes <code>data: ...</code> lines. Browser has built-in EventSource API. Auto-reconnects on disconnect. Works over HTTP/2 with multiplexing. Perfect for notifications, live dashboards, progress updates.</p>
        </div>
      </div>

      <KeyTakeaway variant="tip">
        For most real-time features (notifications, live feeds), SSE is the simplest choice  built-in reconnection, works over HTTP/2, and no extra infrastructure. Use WebSockets only when you need genuine bidirectional communication like chat or collaborative editing.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
