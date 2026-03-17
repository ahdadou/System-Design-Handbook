"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { StepNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { step: StepNode };

const nodes: Node[] = [
  { id: "req", type: "step", position: { x: 0, y: 0 }, data: { label: "Requirements", sublabel: "Functional & non-functional", step: 1, color: "#3b82f6" } },
  { id: "est", type: "step", position: { x: 200, y: 0 }, data: { label: "Estimation", sublabel: "QPS, storage, bandwidth", step: 2, color: "#06b6d4" } },
  { id: "api", type: "step", position: { x: 400, y: 0 }, data: { label: "API Design", sublabel: "Endpoints & contracts", step: 3, color: "#8b5cf6" } },
  { id: "data", type: "step", position: { x: 600, y: 0 }, data: { label: "Data Model", sublabel: "Schema & DB choice", step: 4, color: "#10b981" } },
  { id: "hld", type: "step", position: { x: 0, y: 120 }, data: { label: "High-Level Design", sublabel: "Core components", step: 5, color: "#f59e0b" } },
  { id: "deep", type: "step", position: { x: 200, y: 120 }, data: { label: "Deep Dive", sublabel: "Interviewer-driven details", step: 6, color: "#3b82f6" } },
  { id: "scale", type: "step", position: { x: 400, y: 120 }, data: { label: "Bottlenecks", sublabel: "SPOFs & scale limits", step: 7, color: "#ef4444" } },
  { id: "wrap", type: "step", position: { x: 600, y: 120 }, data: { label: "Wrap Up", sublabel: "Trade-offs & improvements", step: 8, color: "#8b5cf6" } },
];

const edges: Edge[] = [
  { id: "e1", source: "req", target: "est", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "est", target: "api", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e3", source: "api", target: "data", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e4", source: "data", target: "hld", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e5", source: "hld", target: "deep", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e6", source: "deep", target: "scale", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e7", source: "scale", target: "wrap", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 } },
];

const questions = [
  {
    question: "What is the FIRST thing you should do when given a system design problem?",
    options: [
      "Start drawing the architecture immediately to show confidence",
      "Ask clarifying questions to nail down functional and non-functional requirements",
      "Jump to database selection — it's the most important decision",
      "Estimate the scale right away before anything else",
    ],
    correct: 1,
    explanation: "Requirements define everything. Ask: What features are in scope? What scale? Latency targets? Consistency vs availability trade-off? A system for 1K users looks completely different from one for 1B users. Spending 5 minutes here saves you from designing the wrong system.",
  },
  {
    question: "A system has 500M DAU who each make 10 requests/day. What is the approximate read QPS?",
    options: [
      "~500 QPS",
      "~58,000 QPS",
      "~5,800 QPS",
      "~580,000 QPS",
    ],
    correct: 1,
    explanation: "500M × 10 = 5B requests/day. Divide by 86,400 seconds/day ≈ 58,000 QPS. In interviews always use 86,400 ≈ 10^5 seconds/day for mental math. For peak traffic, multiply by 2-3x to get ~120K-175K peak QPS.",
  },
  {
    question: "In CAP theorem, when a network partition occurs, what trade-off must a distributed system make?",
    options: [
      "Choose between Consistency and Availability — you cannot have both during a partition",
      "Choose between Latency and Throughput",
      "Choose between SQL and NoSQL databases",
      "Choose between horizontal and vertical scaling",
    ],
    correct: 0,
    explanation: "CAP theorem states: during a network Partition, a system must choose between Consistency (every read gets the most recent write) and Availability (every request gets a response, possibly stale). CP systems (Zookeeper, HBase) return errors during partitions. AP systems (Cassandra, DynamoDB) return potentially stale data but stay available.",
  },
];

export default function InterviewTipsContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        The <strong className="text-txt">system design interview</strong> is a 45-60 minute open-ended exercise where you design a large-scale distributed system from scratch. Unlike coding interviews with a single correct answer, system design rewards structured thinking, trade-off awareness, and the ability to drive a technical conversation. The RESHADED framework gives you a repeatable playbook.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">The RESHADED Framework</h2>
      <p className="text-sm">A structured 8-step approach that maps directly to what interviewers evaluate. Work through each step in order, spending roughly the indicated time.</p>

      <InteractiveDiagram nodes={nodes} edges={edges} nodeTypes={nodeTypes} title="System Design Interview Framework" description="Follow these 8 steps in sequence — step through them with your interviewer" height={260} />

      <div className="space-y-3">
        {[
          {
            step: 1,
            title: "Requirements (5 min)",
            color: "#3b82f6",
            items: [
              "Functional: What features must the system support? (e.g., post a tweet, follow users, see timeline)",
              "Non-functional: Scale (DAU, QPS), latency targets (p99 < 100ms?), availability (99.9% vs 99.99%?), consistency (strong vs eventual?)",
              "Out of scope: Explicitly state what you are NOT building (e.g., no ads system, no DMs in v1)",
              "Ask, don't assume. One good question: 'Are we designing for global scale or a single region?'",
            ],
          },
          {
            step: 2,
            title: "Estimation (5 min)",
            color: "#06b6d4",
            items: [
              "QPS: DAU × actions/day ÷ 86,400. Peak = 2-3× average.",
              "Storage: bytes per record × records/day × retention period. 1 tweet ≈ 140 bytes text + metadata ≈ 1KB. 500M tweets/day = 500GB/day.",
              "Bandwidth: QPS × response size. 300K QPS × 1KB = 300MB/s read bandwidth.",
              "Memory for cache: 20% of daily data × record size. Use the 80/20 rule — 20% of content gets 80% of traffic.",
            ],
          },
          {
            step: 3,
            title: "API Design (5 min)",
            color: "#8b5cf6",
            items: [
              "Define the most important 2-3 endpoints as REST or GraphQL signatures.",
              "Example: POST /tweets {user_id, content, media_ids} → {tweet_id, created_at}",
              "Example: GET /timeline/{user_id}?cursor={cursor}&limit=20 → {tweets[], next_cursor}",
              "Think about: pagination strategy (cursor vs offset), rate limiting headers, authentication (JWT in header).",
            ],
          },
          {
            step: 4,
            title: "Data Model (5 min)",
            color: "#10b981",
            items: [
              "Define your core entities (User, Tweet, Follower, Like) and their key fields.",
              "Choose database type: SQL for relational/transactional data, NoSQL for high write throughput / flexible schema.",
              "Identify your primary access patterns — this determines your data model in NoSQL.",
              "Consider: sharding strategy (by user_id? by tweet_id?), replication, indexing.",
            ],
          },
          {
            step: 5,
            title: "High-Level Design (10 min)",
            color: "#f59e0b",
            items: [
              "Draw the core components: clients, CDN, API gateway, services, databases, message queues.",
              "Show data flow for 1-2 key user journeys (e.g., 'user posts a tweet', 'user views timeline').",
              "Keep it simple — avoid over-engineering at this stage.",
              "Each component should have a clear single responsibility.",
            ],
          },
          {
            step: 6,
            title: "Deep Dive (15 min)",
            color: "#3b82f6",
            items: [
              "Let the interviewer guide: they will ask you to elaborate on the hardest parts.",
              "Common deep dives: how does the fanout work? how is the cache invalidated? how do you handle hot partitions?",
              "Have 2-3 'interesting problems' ready to volunteer if the interviewer doesn't ask.",
              "Always explain WHY you chose a solution, not just WHAT the solution is.",
            ],
          },
          {
            step: 7,
            title: "Bottlenecks & SPOFs (5 min)",
            color: "#ef4444",
            items: [
              "Single Points of Failure: what happens if the database goes down? Add replicas.",
              "Hot spots: a celebrity user's data on a single shard — use consistent hashing or virtual nodes.",
              "Slow queries: identify N+1 query problems, missing indexes, large table scans.",
              "Cascading failures: use circuit breakers, bulkheads, and timeouts to prevent failure propagation.",
            ],
          },
          {
            step: 8,
            title: "Wrap Up (5 min)",
            color: "#8b5cf6",
            items: [
              "Summarize your design decisions and the key trade-offs you made.",
              "Mention what you would do differently with more time.",
              "Suggest monitoring: what metrics to track (error rate, latency p99, cache hit rate).",
              "Show awareness of future scale: 'If we 10x the load, we would need to add...'",
            ],
          },
        ].map((s) => (
          <div key={s.step} className="p-4 rounded-xl border border-border-ui bg-surface border-l-4" style={{ borderLeftColor: s.color }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ backgroundColor: s.color, color: "white" }}>{s.step}</div>
              <div className="font-bold text-sm font-heading" style={{ color: s.color }}>{s.title}</div>
            </div>
            <ul className="space-y-1">
              {s.items.map((item, i) => (
                <li key={i} className="text-xs text-txt-2 flex gap-2">
                  <span className="shrink-0" style={{ color: s.color }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Back-of-the-Envelope Estimation Cheat Sheet</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: "Time Constants", color: "#3b82f6", items: ["1 day = 86,400 sec ≈ 10^5", "1 month = 2.5M sec ≈ 3×10^6", "1 year = 31.5M sec ≈ 3×10^7"] },
          { title: "Data Sizes", color: "#06b6d4", items: ["1 char = 1 byte", "1 UUID = 16 bytes", "1 tweet ≈ 1 KB", "1 HD photo ≈ 500 KB", "1 min video (HD) ≈ 50 MB"] },
          { title: "Common QPS", color: "#10b981", items: ["1M DAU × 10 req/day = ~115 QPS", "100M DAU × 10 req/day = ~11,500 QPS", "1B DAU × 10 req/day = ~115,000 QPS"] },
          { title: "Latency Numbers", color: "#f59e0b", items: ["L1 cache = 1 ns", "RAM read = 100 ns", "SSD read = 100 µs", "Network RTT (same DC) = 500 µs", "Network RTT (cross-continent) = 150 ms"] },
        ].map((card) => (
          <div key={card.title} className="p-3 rounded-xl bg-elevated border border-border-ui">
            <div className="font-bold text-xs mb-2" style={{ color: card.color }}>{card.title}</div>
            {card.items.map((item, i) => (
              <div key={i} className="text-xs text-txt-2 font-mono py-0.5">{item}</div>
            ))}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Common CAP Theorem Choices</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { type: "CP Systems", color: "#3b82f6", examples: "Zookeeper, etcd, HBase, MongoDB (strong consistency mode)", desc: "Return an error during a network partition rather than serve stale data. Correct choice for: financial transactions, distributed locks, leader election." },
          { type: "AP Systems", color: "#10b981", examples: "Cassandra, DynamoDB, CouchDB, DNS", desc: "Stay available during partitions, serving potentially stale data. Correct choice for: social media feeds, shopping carts, DNS, anything where eventual consistency is acceptable." },
          { type: "CA Systems", color: "#f59e0b", examples: "Traditional RDBMS (single node)", desc: "Consistent and available but cannot tolerate partitions. Only feasible for single-node or tightly coupled systems. Not suitable for distributed systems." },
        ].map((c) => (
          <div key={c.type} className="p-3 rounded-xl border border-border-ui bg-surface" style={{ borderTopColor: c.color, borderTopWidth: 2 }}>
            <div className="font-bold text-sm font-heading mb-1" style={{ color: c.color }}>{c.type}</div>
            <div className="text-[10px] font-mono text-txt-3 mb-2">{c.examples}</div>
            <p className="text-xs text-txt-2">{c.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Common Mistakes to Avoid</h2>
      <div className="space-y-2">
        {[
          { mistake: "Jumping to solutions without clarifying requirements", fix: "Always spend 5 min on requirements. Ask about scale, latency, consistency needs." },
          { mistake: "Designing for the wrong scale", fix: "A system for 1K users is a monolith. A system for 1B users needs sharding, CDN, caching. Let your estimates drive architecture." },
          { mistake: "Ignoring the interviewer", fix: "The system design interview is a CONVERSATION. Check in, adjust based on hints, and let them guide the deep dive." },
          { mistake: "No trade-off analysis", fix: "Every decision has pros and cons. 'I chose Cassandra because it handles high write throughput, but we lose strong consistency' shows senior thinking." },
          { mistake: "Forgetting failure modes", fix: "Always ask 'what if X fails?' Add replicas, retry logic, circuit breakers. Discuss graceful degradation." },
          { mistake: "Over-engineering from the start", fix: "Start simple. 'First, let's design a single-region system. Then we can discuss global replication.' Show you can scale incrementally." },
        ].map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-elevated border border-border-ui flex gap-3">
            <div className="text-[#ef4444] text-xs font-bold shrink-0 pt-0.5">✗</div>
            <div>
              <div className="text-xs font-semibold text-[#ef4444] mb-0.5">{item.mistake}</div>
              <div className="text-xs text-txt-2"><span className="text-c-success font-semibold">Fix: </span>{item.fix}</div>
            </div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        The best candidates treat the system design interview as a collaborative design session, not a test. Drive the conversation, state your assumptions explicitly, justify every decision with a trade-off, and proactively identify limitations in your design. Interviewers want to see how you think, not just what you know.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
