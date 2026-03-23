"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { CachingDiagram } from "@/components/diagrams/caching/CachingDiagram";

const questions = [
  {
    question: "Which cache write strategy writes to cache AND database simultaneously?",
    options: ["Write-Around", "Write-Back", "Write-Through", "Write-Aside"],
    correct: 2,
    explanation: "Write-Through writes to both cache and database synchronously. It ensures consistency but has higher write latency. Write-Back writes to cache only and lazily syncs to DB.",
  },
  {
    question: "What cache eviction policy removes the item that was accessed least recently?",
    options: ["LFU (Least Frequently Used)", "FIFO (First In, First Out)", "LRU (Least Recently Used)", "Random"],
    correct: 2,
    explanation: "LRU (Least Recently Used) evicts items that haven't been accessed for the longest time. It assumes recently accessed items are more likely to be needed again.",
  },
  {
    question: "What is a 'cache stampede' (thundering herd problem)?",
    options: [
      "Cache running out of memory",
      "Multiple requests simultaneously hitting the database when a cached item expires",
      "Cache data becoming inconsistent with the database",
      "Cache taking too long to respond",
    ],
    correct: 1,
    explanation: "A cache stampede happens when a popular cached item expires and many concurrent requests all miss the cache simultaneously, overwhelming the database.",
  },
  {
    question: "In the cache-aside (lazy loading) pattern, how is data loaded into the cache?",
    options: [
      "Data is pre-loaded into the cache when the application starts",
      "Data is written to cache on every database write",
      "On a cache miss, the application fetches from the database and stores in cache",
      "The cache automatically syncs from the database every minute",
    ],
    correct: 2,
    explanation: "Cache-aside (lazy loading) works as follows: check cache first; on a miss, fetch from the database, store the result in cache, then return it. This is the most common caching pattern — only frequently accessed data ends up cached.",
  },
  {
    question: "What is the main risk of the Write-Back (write-behind) caching strategy?",
    options: [
      "High write latency because every write hits both cache and database",
      "Data loss if the cache fails before dirty data is flushed to the database",
      "Cache and database always being out of sync with no reconciliation",
      "Increased database load compared to write-through",
    ],
    correct: 1,
    explanation: "Write-Back writes to cache immediately and asynchronously syncs to the database. If the cache crashes before flushing, data is permanently lost. This makes it unsuitable for critical data but great for high-write-throughput scenarios.",
  },
  {
    question: "What eviction policy is best for a cache where some items are requested millions of times and others rarely?",
    options: [
      "LRU (Least Recently Used)",
      "FIFO (First In, First Out)",
      "LFU (Least Frequently Used)",
      "Random Replacement",
    ],
    correct: 2,
    explanation: "LFU (Least Frequently Used) evicts items with the lowest access count. It's ideal when access frequency is a good predictor of future use, such as popular content in social media or e-commerce.",
  },
  {
    question: "What technique prevents cache stampedes when a popular cached item expires?",
    options: [
      "Increasing cache TTL to prevent expiration",
      "Using a mutex lock or probabilistic early expiration to let only one request rebuild the cache",
      "Disabling caching for popular items",
      "Sending all requests directly to the database",
    ],
    correct: 1,
    explanation: "To prevent stampedes: use a mutex lock (only one request rebuilds the cache; others wait), or probabilistic early expiration (proactively refresh before TTL expires). Redis has a built-in 'lock' pattern for this.",
  },
  {
    question: "Redis and Memcached are both in-memory caches. What is a key advantage Redis has over Memcached?",
    options: [
      "Redis is always faster than Memcached",
      "Redis supports complex data structures (lists, sets, hashes) and persistence",
      "Memcached does not support expiration (TTL) for cached items",
      "Redis uses less memory than Memcached",
    ],
    correct: 1,
    explanation: "Redis supports rich data structures (strings, lists, sets, sorted sets, hashes, streams) and optional persistence to disk. Memcached only supports simple string key-value pairs. Redis also supports pub/sub and Lua scripting.",
  },
  {
    question: "What is a cache 'hot key' problem?",
    options: [
      "A cache key that has expired and needs renewal",
      "A single cache key being accessed so frequently it saturates the cache server handling it",
      "A cache key that is too long and causes performance issues",
      "Multiple keys mapping to the same cache value",
    ],
    correct: 1,
    explanation: "Hot key problems occur when one key (e.g., a viral post or product launch) receives millions of requests per second, overwhelming the single cache node holding it. Solutions include key replication, local in-process caching, or consistent hash with virtual nodes.",
  },
  {
    question: "What cache hit ratio should you target for frequently-read data in a production system?",
    options: ["Above 50%", "Above 70%", "Above 90%", "Exactly 100%"],
    correct: 2,
    explanation: "A cache hit ratio above 90% is the target for high-traffic read-heavy systems. At 99% hit ratio, your database handles only 1% of reads. Below 80% often indicates poor cache key design or too-short TTLs.",
  },
];

export default function CachingContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Caching</strong> is storing copies of frequently accessed data in a faster storage layer. Instead of computing or fetching data every time, you return the cached copy. This is one of the most impactful performance optimizations in system design  caching frequently turns an O(n) DB query into an O(1) memory lookup.
      </p>
      <p>
        Instagram serves 500M+ stories per day. Without aggressive caching, their databases would be annihilated. Redis, Memcached, and CDNs cache data at different layers of the stack. The key insight: <strong className="text-txt">most data isn't read uniformly</strong>  1% of content drives 99% of reads (Pareto principle).
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">Write Strategies</h2>
      <CachingDiagram />

      <h2 className="text-2xl font-bold font-heading text-txt">Cache Hit Ratio</h2>
      <p className="text-sm">
        The <strong className="text-txt">cache hit ratio</strong> = cache hits / (hits + misses). Aim for &gt;90% for frequently-read data. A 99% hit ratio means your DB handles only 1% of reads.
      </p>
      <div className="grid grid-cols-3 gap-3 my-4">
        {[
          { pct: "95%+", desc: "Excellent  DB barely touched", color: "#10b981" },
          { pct: "80-95%", desc: "Good  minimal DB pressure", color: "#f59e0b" },
          { pct: "<80%", desc: "Poor  optimize access patterns", color: "#ef4444" },
        ].map((r) => (
          <div key={r.pct} className="p-3 rounded-xl text-center border border-border-ui" style={{ backgroundColor: `${r.color}10` }}>
            <div className="text-xl font-bold font-heading" style={{ color: r.color }}>{r.pct}</div>
            <div className="text-xs text-txt-2 mt-1">{r.desc}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Cache Invalidation  The Hard Problem</h2>
      <p className="text-sm">
        Phil Karlton famously said: <em>"There are only two hard things in Computer Science: cache invalidation and naming things."</em>
      </p>
      <ul className="space-y-2 text-sm list-none">
        {[
          { strategy: "TTL (Time-To-Live)", desc: "Items expire after N seconds. Simple but data can be stale. Use short TTLs for rapidly-changing data." },
          { strategy: "Event-based invalidation", desc: "When data changes, explicitly delete/update cache entries. Precise but complex. Used by Facebook's Memcache." },
          { strategy: "Write-through", desc: "Cache updated on every write. Strong consistency but every write hits both cache and DB." },
        ].map((s) => (
          <li key={s.strategy} className="p-3 bg-surface rounded-lg border border-border-ui">
            <div className="font-semibold text-txt text-sm mb-0.5">{s.strategy}</div>
            <div className="text-xs text-txt-2">{s.desc}</div>
          </li>
        ))}
      </ul>

      <KeyTakeaway variant="warning">
        Never cache user-specific private data in a shared cache without proper key namespacing (e.g., <code>cache:user:123:profile</code>). A bug could expose one user's data to another.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
