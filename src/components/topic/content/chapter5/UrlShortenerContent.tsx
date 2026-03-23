"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "user", type: "system", position: { x: 0, y: 200 }, data: { label: "User", icon: "👤", color: "#3b82f6" } },
  { id: "dns", type: "system", position: { x: 160, y: 200 }, data: { label: "DNS / CDN", sublabel: "short.ly", icon: "🌐", color: "#06b6d4" } },
  { id: "lb", type: "system", position: { x: 320, y: 200 }, data: { label: "Load Balancer", icon: "⚖️", color: "#8b5cf6" } },
  { id: "api1", type: "system", position: { x: 480, y: 120 }, data: { label: "API Server 1", icon: "⚙️", color: "#f59e0b" } },
  { id: "api2", type: "system", position: { x: 480, y: 280 }, data: { label: "API Server 2", icon: "⚙️", color: "#f59e0b" } },
  { id: "cache", type: "system", position: { x: 640, y: 80 }, data: { label: "Redis Cache", sublabel: "shortcode → URL", icon: "⚡", color: "#ef4444", description: "Cache the most popular shortcodes. 99% of reads hit cache." } },
  { id: "db", type: "database", position: { x: 640, y: 240 }, data: { label: "PostgreSQL", type: "shortcode | long_url | clicks", color: "#10b981" } },
  { id: "analytics", type: "system", position: { x: 640, y: 380 }, data: { label: "Analytics", sublabel: "Kafka + Spark", icon: "📊", color: "#8b5cf6" } },
];

const edges: Edge[] = [
  { id: "e1", source: "user", target: "dns", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "dns", target: "lb", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e3", source: "lb", target: "api1", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
  { id: "e4", source: "lb", target: "api2", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
  { id: "e5", source: "api1", target: "cache", label: "Check cache", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e6", source: "api1", target: "db", label: "Cache miss", style: { stroke: "#10b981", strokeWidth: 1.5, strokeDasharray: "4,4" }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e7", source: "api2", target: "cache", animated: true, style: { stroke: "#ef4444", strokeWidth: 1.5 } },
  { id: "e8", source: "api1", target: "analytics", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 1 } },
];

const questions = [
  {
    question: "How would you generate short codes for a URL shortener?",
    options: [
      "Use auto-increment IDs directly as the code",
      "Hash the long URL with MD5 and take the first 7 characters",
      "Use a base62 encoding of a unique ID (counter or UUID), or a random 7-char alphanumeric string",
      "Use the URL's domain name",
    ],
    correct: 2,
    explanation: "Best approach: Convert auto-increment IDs to base62 (a-z, A-Z, 0-9) for short, unique codes. 7 base62 characters = 62^7 ≈ 3.5 trillion unique URLs. Alternatively, generate random codes and check for collisions.",
  },
  {
    question: "The URL shortener will have far more reads (redirects) than writes (new URLs). How do you optimize for this?",
    options: [
      "Use a write-optimized database",
      "Cache the most popular shortcodes in Redis and use read replicas for the database",
      "Store URLs in a CSV file",
      "Implement write-back caching for URL storage",
    ],
    correct: 1,
    explanation: "With Pareto's law, 20% of URLs get 80% of clicks. Cache hot codes in Redis. A 95%+ cache hit rate means the database handles <5% of traffic. Use DB read replicas for remaining reads.",
  },
  {
    question: "What HTTP status code should a URL shortener return when redirecting a user to the long URL?",
    options: [
      "200 OK with the long URL in the response body",
      "301 Moved Permanently or 302 Found, with the long URL in the Location header",
      "404 Not Found if the short code is not in cache",
      "500 Internal Server Error to indicate a server-side redirect",
    ],
    correct: 1,
    explanation: "Redirect responses use 3xx status codes. 301 (Moved Permanently) tells browsers to cache the redirect permanently, reducing future requests to your server (good for bandwidth, bad for analytics tracking). 302 (Found / Temporary Redirect) causes the browser to always re-request your server, enabling click counting. For analytics, 302 is preferred.",
  },
  {
    question: "You store 100M short URLs. Each record is ~500 bytes. What is the approximate total storage needed?",
    options: [
      "~500 MB",
      "~5 GB",
      "~50 GB",
      "~500 GB",
    ],
    correct: 2,
    explanation: "100M records × 500 bytes = 50,000,000,000 bytes = 50 GB. This comfortably fits on a single modern SSD, though at 100M new URLs/day the total grows by 50 GB/day. After 1 year: 365 × 50 GB ≈ 18 TB, requiring either a database cluster or URL expiration policies.",
  },
  {
    question: "How would you handle custom aliases (e.g., short.ly/my-brand) in a URL shortener?",
    options: [
      "Reject custom aliases to keep the system simple",
      "Store custom aliases in the same table with a flag, checking uniqueness before insertion with a UNIQUE constraint",
      "Use a separate database exclusively for custom aliases",
      "Generate a new random code and map it to the custom alias separately",
    ],
    correct: 1,
    explanation: "Custom aliases share the same shortcode→URL mapping table. The shortcode column has a UNIQUE constraint so both auto-generated and custom codes coexist without collision. Before inserting, check if the alias already exists. Rate-limit custom alias creation to prevent abuse (e.g., squatting on popular brand names).",
  },
  {
    question: "How would you implement URL expiration in the shortener?",
    options: [
      "Delete expired URLs synchronously on every redirect request",
      "Store an expires_at timestamp in the DB, check it on redirect, and run a background job to clean up expired records",
      "Use a different database table for expired URLs",
      "URLs cannot expire once created; this is not a feasible feature",
    ],
    correct: 1,
    explanation: "Store an optional expires_at timestamp. On redirect: if expires_at is set and now > expires_at, return 410 Gone. A background cleanup job (e.g., a cron running nightly) deletes expired records from the DB and removes them from the cache. This keeps the DB lean without adding overhead to the hot redirect path.",
  },
  {
    question: "To scale write throughput for URL creation, you use a distributed counter instead of a single auto-increment. What problem does this solve?",
    options: [
      "Distributed counters ensure shorter URLs than auto-increment",
      "A single auto-increment counter is a bottleneck; distributed counters (e.g., using Redis INCR per server range) pre-allocate ID ranges to each server, eliminating coordination overhead",
      "Distributed counters prevent hash collisions",
      "Auto-increment IDs are not monotonically increasing in distributed systems",
    ],
    correct: 1,
    explanation: "A global auto-increment counter requires a central authority that every write must contact, creating a single bottleneck. The solution: pre-allocate ranges of IDs to each API server (e.g., server 1 gets IDs 1–1000, server 2 gets 1001–2000). Each server independently increments within its range and fetches the next range when exhausted, eliminating cross-server coordination.",
  },
  {
    question: "What database would you choose as the primary store for a URL shortener, and why?",
    options: [
      "MongoDB, because it supports flexible schemas for different URL types",
      "A relational database like PostgreSQL or MySQL, because the data model is simple and relational features (UNIQUE constraints, transactions) are useful",
      "Cassandra, because URL shorteners need extreme write throughput",
      "Elasticsearch, because URLs need to be full-text searchable",
    ],
    correct: 1,
    explanation: "The URL shortener data model is simple: shortcode → long_url with optional metadata. A relational database handles this well: UNIQUE constraints prevent duplicate codes, indexes on shortcode enable O(log N) lookups, and transactions handle the check-then-insert pattern for custom aliases. Cassandra would be overkill unless you are handling tens of millions of writes per second.",
  },
  {
    question: "How would you track analytics (click counts, geographic data) without slowing down the redirect path?",
    options: [
      "Synchronously update a counter in the database on every redirect",
      "Publish a click event to a message queue (e.g., Kafka) asynchronously during redirect, and process analytics in a separate consumer",
      "Store click data in cookies on the user's browser",
      "Use database triggers to update analytics on every read",
    ],
    correct: 1,
    explanation: "The redirect must be sub-10ms. Synchronous DB writes for analytics would add unacceptable latency. Instead, publish a lightweight event (shortcode, timestamp, IP, user-agent) to Kafka asynchronously. The redirect returns immediately. An analytics consumer processes events in batch, updating click counts, geographic breakdowns, and time-series data without ever blocking the redirect path.",
  },
];

export default function UrlShortenerContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        Designing a <strong className="text-txt">URL shortener</strong> (like bit.ly) is a classic system design interview question. It tests your knowledge of hashing, caching, databases, and scalability. The scale: 100M URLs created/day, 10B redirects/day.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">Requirements</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-xs mb-2">Functional</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Given a long URL, return a short URL</li>
            <li>• Visiting the short URL redirects to long URL</li>
            <li>• Custom aliases (optional)</li>
            <li>• URL expiration (optional)</li>
          </ul>
        </div>
        <div className="p-3 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30">
          <div className="font-bold text-accent text-xs mb-2">Non-Functional</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• 100M new URLs/day</li>
            <li>• 10B redirects/day (100:1 read:write)</li>
            <li>• &lt;10ms redirect latency (p99)</li>
            <li>• 99.99% availability</li>
          </ul>
        </div>
      </div>

      <InteractiveDiagram nodes={nodes} edges={edges} nodeTypes={nodeTypes} title="URL Shortener System Design" description="Full architecture with caching, load balancing, and analytics" height={460} />

      <h2 className="text-2xl font-bold font-heading text-txt">Short Code Generation</h2>
      <div className="space-y-2 text-sm">
        <p><strong className="text-txt">Approach 1: Hash + truncate</strong>  MD5(longURL) → take first 7 chars. Problem: collisions for different URLs that hash to the same prefix.</p>
        <p><strong className="text-txt">Approach 2: Base62(counter)</strong>  Use distributed counter (Redis INCR), encode as base62. Predictable, no collisions, but reveals usage volume.</p>
        <p><strong className="text-txt">Approach 3: Random + check</strong>  Generate random 7-char base62 string, check DB for uniqueness. Probabilistically collision-free at this scale.</p>
      </div>

      <KeyTakeaway variant="important">
        With 10B redirects/day, the redirect path MUST be sub-millisecond. Cache shortcode→URL mappings in Redis with a TTL. Set Redis maxmemory policy to LRU. 7-char shortcodes fit in ~56 bytes  100M codes = ~6GB of Redis memory. Easily fits in RAM.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
