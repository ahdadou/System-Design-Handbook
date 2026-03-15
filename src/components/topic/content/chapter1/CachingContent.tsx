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
];

export default function CachingContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-[#94a3b8]">
      <p className="text-base leading-relaxed">
        <strong className="text-[#f1f5f9]">Caching</strong> is storing copies of frequently accessed data in a faster storage layer. Instead of computing or fetching data every time, you return the cached copy. This is one of the most impactful performance optimizations in system design — caching frequently turns an O(n) DB query into an O(1) memory lookup.
      </p>
      <p>
        Instagram serves 500M+ stories per day. Without aggressive caching, their databases would be annihilated. Redis, Memcached, and CDNs cache data at different layers of the stack. The key insight: <strong className="text-[#f1f5f9]">most data isn't read uniformly</strong> — 1% of content drives 99% of reads (Pareto principle).
      </p>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Write Strategies</h2>
      <CachingDiagram />

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Cache Hit Ratio</h2>
      <p className="text-sm">
        The <strong className="text-[#f1f5f9]">cache hit ratio</strong> = cache hits / (hits + misses). Aim for &gt;90% for frequently-read data. A 99% hit ratio means your DB handles only 1% of reads.
      </p>
      <div className="grid grid-cols-3 gap-3 my-4">
        {[
          { pct: "95%+", desc: "Excellent — DB barely touched", color: "#10b981" },
          { pct: "80-95%", desc: "Good — minimal DB pressure", color: "#f59e0b" },
          { pct: "<80%", desc: "Poor — optimize access patterns", color: "#ef4444" },
        ].map((r) => (
          <div key={r.pct} className="p-3 rounded-xl text-center border border-[#1e293b]" style={{ backgroundColor: `${r.color}10` }}>
            <div className="text-xl font-bold font-heading" style={{ color: r.color }}>{r.pct}</div>
            <div className="text-xs text-[#94a3b8] mt-1">{r.desc}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Cache Invalidation — The Hard Problem</h2>
      <p className="text-sm">
        Phil Karlton famously said: <em>"There are only two hard things in Computer Science: cache invalidation and naming things."</em>
      </p>
      <ul className="space-y-2 text-sm list-none">
        {[
          { strategy: "TTL (Time-To-Live)", desc: "Items expire after N seconds. Simple but data can be stale. Use short TTLs for rapidly-changing data." },
          { strategy: "Event-based invalidation", desc: "When data changes, explicitly delete/update cache entries. Precise but complex. Used by Facebook's Memcache." },
          { strategy: "Write-through", desc: "Cache updated on every write. Strong consistency but every write hits both cache and DB." },
        ].map((s) => (
          <li key={s.strategy} className="p-3 bg-[#111827] rounded-lg border border-[#1e293b]">
            <div className="font-semibold text-[#f1f5f9] text-sm mb-0.5">{s.strategy}</div>
            <div className="text-xs text-[#94a3b8]">{s.desc}</div>
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
