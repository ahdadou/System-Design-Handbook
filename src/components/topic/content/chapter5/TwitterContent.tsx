"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "user", type: "system", position: { x: 0, y: 200 }, data: { label: "User / Client", icon: "👤", color: "#3b82f6" } },
  { id: "cdn", type: "system", position: { x: 160, y: 200 }, data: { label: "CDN", sublabel: "Static assets & media", icon: "🌐", color: "#06b6d4", description: "Serves static assets, images, and videos globally. Reduces latency for media-heavy timelines." } },
  { id: "gateway", type: "system", position: { x: 320, y: 200 }, data: { label: "API Gateway", sublabel: "Auth, rate limiting", icon: "🔀", color: "#8b5cf6", description: "Rate limiting: 300 writes/15min per user. Auth via OAuth 2.0 tokens. Routes to downstream services." } },
  { id: "tweet", type: "system", position: { x: 500, y: 60 }, data: { label: "Tweet Service", sublabel: "Write path", icon: "✍️", color: "#f59e0b", description: "Handles tweet creation, deletion, retweets, likes. Writes to Cassandra and enqueues fanout jobs." } },
  { id: "timeline", type: "system", position: { x: 500, y: 180 }, data: { label: "Timeline Service", sublabel: "Feed generation", icon: "📰", color: "#3b82f6", description: "Assembles the home timeline. Merges pre-computed timelines from Redis with live tweets from celebrities." } },
  { id: "search", type: "system", position: { x: 500, y: 300 }, data: { label: "Search Service", sublabel: "Elasticsearch", icon: "🔍", color: "#06b6d4", description: "Full-text search over tweets. Near real-time indexing via Kafka consumer." } },
  { id: "notif", type: "system", position: { x: 500, y: 400 }, data: { label: "Notification Service", sublabel: "Push & email", icon: "🔔", color: "#10b981", description: "Sends push notifications for mentions, retweets, likes. Consumes events from Kafka." } },
  { id: "kafka", type: "system", position: { x: 680, y: 120 }, data: { label: "Kafka", sublabel: "Event streaming", icon: "📨", color: "#f59e0b", description: "Decouples tweet creation from fanout. Producers: Tweet Service. Consumers: Fanout workers, Search indexer, Notification service." } },
  { id: "fanout", type: "system", position: { x: 680, y: 260 }, data: { label: "Fanout Workers", sublabel: "Async timeline push", icon: "⚡", color: "#ef4444", description: "Consume Kafka events. For each tweet, push tweet_id to the Redis sorted-set timeline of all followers. Skip celebrities (>1M followers)." } },
  { id: "tweetdb", type: "database", position: { x: 860, y: 60 }, data: { label: "Cassandra", sublabel: "Tweet storage", color: "#f59e0b", description: "Partition key: tweet_id (TimeUUID). Extremely high write throughput. Stores tweet content, media URLs, like counts." } },
  { id: "userdb", type: "database", position: { x: 860, y: 200 }, data: { label: "User DB", sublabel: "MySQL + replicas", color: "#3b82f6", description: "User profiles, follower/following relationships. Sharded by user_id. Heavy read load served by read replicas." } },
  { id: "redis", type: "database", position: { x: 860, y: 340 }, data: { label: "Redis Cluster", sublabel: "Timeline cache", color: "#ef4444", description: "Each user's home timeline stored as a Redis sorted set (score = tweet timestamp). Max 800 tweet_ids per user. O(log N) inserts." } },
  { id: "ml", type: "system", position: { x: 680, y: 420 }, data: { label: "ML Ranking", sublabel: "Relevance scoring", icon: "🤖", color: "#8b5cf6", description: "Reranks timeline tweets using engagement signals. Applied at read time when user requests timeline." } },
];

const edges: Edge[] = [
  { id: "e1", source: "user", target: "cdn", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "cdn", target: "gateway", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e3", source: "gateway", target: "tweet", animated: true, style: { stroke: "#f59e0b", strokeWidth: 1.5 } },
  { id: "e4", source: "gateway", target: "timeline", animated: true, style: { stroke: "#3b82f6", strokeWidth: 1.5 } },
  { id: "e5", source: "gateway", target: "search", animated: true, style: { stroke: "#06b6d4", strokeWidth: 1.5 } },
  { id: "e6", source: "gateway", target: "notif", animated: true, style: { stroke: "#10b981", strokeWidth: 1 } },
  { id: "e7", source: "tweet", target: "kafka", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e8", source: "tweet", target: "tweetdb", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e9", source: "kafka", target: "fanout", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e10", source: "fanout", target: "redis", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e11", source: "timeline", target: "redis", animated: true, style: { stroke: "#3b82f6", strokeWidth: 1.5 } },
  { id: "e12", source: "timeline", target: "tweetdb", style: { stroke: "#3b82f6", strokeWidth: 1, strokeDasharray: "4,4" } },
  { id: "e13", source: "timeline", target: "ml", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 1.5 } },
  { id: "e14", source: "kafka", target: "search", animated: true, style: { stroke: "#06b6d4", strokeWidth: 1.5 } },
  { id: "e15", source: "kafka", target: "notif", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e16", source: "gateway", target: "userdb", style: { stroke: "#3b82f6", strokeWidth: 1, strokeDasharray: "4,4" } },
];

const questions = [
  {
    question: "Twitter uses a 'hybrid fanout' model for timelines. What does this mean?",
    options: [
      "Tweets are stored in both SQL and NoSQL databases simultaneously",
      "Regular users get push fanout (pre-computed timelines), celebrities get pull fanout (computed at read time)",
      "Half the users are on push model, half are on pull model, chosen randomly",
      "Push model for writes, pull model for reads",
    ],
    correct: 1,
    explanation: "The core problem: if Katy Perry (100M followers) tweets, the push model would require 100M Redis writes immediately — a fanout storm. The hybrid solution: push to followers of regular users (<~1M followers), but skip celebrities. When a user requests their timeline, the Timeline Service merges their pre-computed Redis feed with a real-time pull of tweets from the celebrities they follow.",
  },
  {
    question: "Why does Twitter store tweets in Cassandra rather than MySQL?",
    options: [
      "Cassandra supports SQL, which makes it easier to query",
      "Cassandra provides ACID transactions needed for tweet likes",
      "Cassandra handles Twitter's extreme write throughput (~6K tweets/sec) and scales horizontally without a single write master",
      "Cassandra is cheaper to operate than MySQL",
    ],
    correct: 2,
    explanation: "At 500M tweets/day (~6K QPS writes), a single MySQL master would struggle. Cassandra is masterless — all nodes accept writes. It uses a distributed hash ring for data distribution. The tweet access pattern (write once, read many, fetch by tweet_id or user_id + time range) is a perfect fit for Cassandra's partition key + clustering key model.",
  },
  {
    question: "When a user opens Twitter, how is their home timeline assembled?",
    options: [
      "A real-time SQL JOIN across all users they follow",
      "Timeline Service reads tweet_ids from their Redis sorted set, hydrates full tweets from Cassandra, and optionally reranks with ML",
      "The full timeline is recomputed from scratch on every request",
      "Tweets are stored in order on the user's device and synced periodically",
    ],
    correct: 1,
    explanation: "At read time: (1) Timeline Service reads up to 800 tweet_ids from the user's Redis sorted set (these are pre-fanned-out by Fanout Workers). (2) For users following celebrities, it pulls recent celebrity tweets via a direct Cassandra query. (3) Merge and deduplicate tweet_ids. (4) Batch-fetch full tweet objects from Cassandra. (5) ML ranking re-orders for relevance. This is the 'fan-out on write, fan-in on read for celebrities' hybrid.",
  },
];

export default function TwitterContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-[#94a3b8]">
      <p className="text-base leading-relaxed">
        Designing <strong className="text-[#f1f5f9]">Twitter</strong> is one of the most instructive system design problems because it forces you to confront the <strong className="text-[#f1f5f9]">fanout problem</strong> — how do you efficiently deliver a tweet to millions of followers in real time? Twitter operates at massive scale: 500M registered users, 250M daily active users, 500M tweets per day, 300K QPS read traffic.
      </p>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Scale Estimates</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { metric: "500M", label: "Registered Users", color: "#3b82f6" },
          { metric: "250M", label: "Daily Active Users", color: "#06b6d4" },
          { metric: "500M", label: "Tweets/day (~6K QPS)", color: "#f59e0b" },
          { metric: "300K", label: "Peak Read QPS", color: "#10b981" },
        ].map((m) => (
          <div key={m.label} className="p-3 rounded-xl bg-[#1a2332] border border-[#1e293b] text-center">
            <div className="text-xl font-bold font-heading" style={{ color: m.color }}>{m.metric}</div>
            <div className="text-xs text-[#475569] mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <InteractiveDiagram nodes={nodes} edges={edges} nodeTypes={nodeTypes} title="Twitter — System Architecture" description="Full architecture including fanout workers, timeline cache, and ML ranking. Click nodes to expand details." height={500} />

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">The Fanout Problem</h2>
      <p className="text-sm leading-relaxed">The central challenge of Twitter: when a user tweets, how do you update the home timeline of all their followers efficiently? There are two fundamental approaches:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: "Push Model (Fan-out on Write)",
            color: "#3b82f6",
            pros: ["O(1) read — timeline is pre-computed", "Very fast timeline reads from Redis", "Consistent timeline across refreshes"],
            cons: ["Celebrity problem: 100M follower tweet → 100M Redis writes", "Wasted work for inactive users", "Write amplification is extreme"],
            verdict: "Good for: users with normal follower counts (<~1M)",
          },
          {
            title: "Pull Model (Fan-in on Read)",
            color: "#8b5cf6",
            pros: ["No fanout storm — celebrities don't cause write spikes", "No wasted computation for inactive users", "Write path is simple"],
            cons: ["O(N) read — must query N followee's tweets and merge", "Slow: fetching from 1000 followees requires 1000 DB reads", "High read latency at scale"],
            verdict: "Good for: celebrities / users with massive follower counts",
          },
        ].map((model) => (
          <div key={model.title} className="p-4 rounded-xl border border-[#1e293b] bg-[#111827] border-l-4" style={{ borderLeftColor: model.color }}>
            <div className="font-bold text-sm font-heading mb-3" style={{ color: model.color }}>{model.title}</div>
            <div className="space-y-2">
              <div>
                <div className="text-[10px] font-bold text-[#10b981] mb-1">PROS</div>
                {model.pros.map((p, i) => <div key={i} className="text-xs text-[#94a3b8] flex gap-1.5"><span className="text-[#10b981]">+</span>{p}</div>)}
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#ef4444] mb-1">CONS</div>
                {model.cons.map((c, i) => <div key={i} className="text-xs text-[#94a3b8] flex gap-1.5"><span className="text-[#ef4444]">-</span>{c}</div>)}
              </div>
              <div className="text-[10px] font-mono text-[#475569] pt-1 border-t border-[#1e293b]">{model.verdict}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
        <div className="font-bold text-sm font-heading text-[#3b82f6] mb-2">Twitter's Hybrid Solution</div>
        <p className="text-xs text-[#94a3b8] leading-relaxed">Twitter uses a <strong className="text-[#f1f5f9]">hybrid approach</strong>: push model for regular users (follower count &lt; ~1M), pull model for celebrities at read time. When a user views their timeline, the Timeline Service merges: (1) their pre-computed Redis sorted-set timeline (push-fanned-out tweets from normal users) + (2) recent tweets from any celebrities they follow (pulled live from Cassandra). This caps fanout writes while keeping reads fast.</p>
      </div>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Data Model</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: "Tweet (Cassandra)", color: "#f59e0b", fields: ["tweet_id: TimeUUID (partition key)", "user_id: UUID", "content: text (max 280 chars)", "media_ids: list<UUID>", "reply_to_tweet_id: UUID", "created_at: timestamp", "like_count: counter", "retweet_count: counter"] },
          { title: "User (MySQL)", color: "#3b82f6", fields: ["user_id: BIGINT (auto-increment)", "username: VARCHAR(15) UNIQUE", "display_name: VARCHAR(50)", "bio: TEXT", "follower_count: INT", "following_count: INT", "is_verified: BOOLEAN", "created_at: TIMESTAMP"] },
          { title: "Follower (MySQL)", color: "#06b6d4", fields: ["follower_id: BIGINT (FK users)", "followee_id: BIGINT (FK users)", "created_at: TIMESTAMP", "INDEX (followee_id) — for fanout queries", "INDEX (follower_id) — for 'who I follow'"] },
          { title: "Timeline (Redis)", color: "#ef4444", fields: ["Key: timeline:{user_id}", "Type: Sorted Set", "Member: tweet_id", "Score: unix timestamp", "Max size: 800 tweet_ids", "TTL: none (LRU eviction)", "O(log N) insert, O(log N + K) range read"] },
        ].map((table) => (
          <div key={table.title} className="p-3 rounded-xl bg-[#1a2332] border border-[#1e293b]">
            <div className="font-bold text-xs mb-2 font-mono" style={{ color: table.color }}>{table.title}</div>
            {table.fields.map((f, i) => (
              <div key={i} className="text-[11px] font-mono text-[#475569] py-0.5 border-b border-[#1e293b] last:border-0">{f}</div>
            ))}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Key Challenges & Solutions</h2>
      <div className="space-y-3">
        {[
          { title: "Hot Partition Problem", color: "#ef4444", desc: "A celebrity tweet causes millions of simultaneous reads for their tweet from Cassandra. Solution: Cache hot tweet objects in Redis with a very short TTL (5-10 seconds). A temporary cache for viral content eliminates thundering herd." },
          { title: "Timeline Storage at Scale", color: "#3b82f6", desc: "250M users × 800 tweet_ids × 8 bytes = 1.6TB of Redis data. This is manageable across a Redis cluster. Each tweet_id is a 64-bit integer (Twitter Snowflake ID), not a UUID, to keep storage minimal." },
          { title: "Twitter Snowflake IDs", color: "#8b5cf6", desc: "Tweet IDs are 64-bit integers composed of: 41 bits timestamp (ms since epoch) + 10 bits machine ID + 12 bits sequence number. This gives: globally unique, time-ordered IDs that can be generated without coordination, at up to 4096 IDs/ms per machine." },
          { title: "Search Indexing", color: "#06b6d4", desc: "Tweets are indexed in Elasticsearch for full-text search. Kafka consumers subscribe to tweet creation events and index in near real-time (~5 second lag). Trending topics are computed via approximate top-K algorithms (Count-Min Sketch, Heavy Hitters) on the Kafka stream." },
        ].map((item) => (
          <div key={item.title} className="p-4 rounded-xl border border-[#1e293b] bg-[#111827] border-l-4" style={{ borderLeftColor: item.color }}>
            <div className="font-bold text-sm font-heading mb-1.5" style={{ color: item.color }}>{item.title}</div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Scale Considerations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: "Read Scaling", color: "#10b981", items: ["Redis cluster for timeline caches", "Cassandra scales horizontally — add nodes to increase throughput", "MySQL read replicas for user profile queries", "CDN for media (images, videos)"] },
          { title: "Write Scaling", color: "#f59e0b", items: ["Kafka buffers write spikes (tweet storms during events)", "Fanout workers scale horizontally as Kafka consumer group", "Cassandra write throughput scales with cluster size", "Rate limiting at API Gateway prevents abuse"] },
          { title: "Availability", color: "#3b82f6", items: ["Multi-datacenter replication for Cassandra", "Redis Sentinel or Redis Cluster for HA", "Circuit breakers between services", "Graceful degradation: show cached timeline if live feed fails"] },
          { title: "Consistency", color: "#8b5cf6", items: ["Eventual consistency for timelines is acceptable", "Like/retweet counts are eventually consistent (counter CRDTs)", "Follower relationships use strong consistency (MySQL)", "New tweets visible in ~5 seconds (fanout lag)"] },
        ].map((section) => (
          <div key={section.title} className="p-3 rounded-xl bg-[#1a2332] border border-[#1e293b]">
            <div className="font-bold text-xs mb-2" style={{ color: section.color }}>{section.title}</div>
            {section.items.map((item, i) => (
              <div key={i} className="text-xs text-[#94a3b8] flex gap-2 py-0.5">
                <span style={{ color: section.color }}>•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        The Twitter fanout problem is a perfect example of the read/write trade-off in system design. Push model optimizes reads at the cost of write amplification; pull model optimizes writes at the cost of read latency. Twitter's hybrid model — push for regular users, pull for celebrities — is the real-world answer: optimize for the common case, handle edge cases specially.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
