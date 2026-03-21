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
