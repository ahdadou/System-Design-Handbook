"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";

const questions = [
  {
    question: "Which rate limiting algorithm smooths out bursts and processes requests at a constant rate?",
    options: ["Token Bucket", "Leaky Bucket", "Fixed Window", "Sliding Window"],
    correct: 1,
    explanation: "The Leaky Bucket algorithm processes requests at a constant rate regardless of burst input. Requests queue up; if the queue is full, they're dropped. Think of a bucket with a fixed-size hole.",
  },
  {
    question: "What is the main problem with fixed window rate limiting?",
    options: [
      "It's too slow to calculate",
      "Boundary attacks: users can double their rate by sending requests at end+start of a window",
      "It uses too much memory",
      "It doesn't work with HTTP",
    ],
    correct: 1,
    explanation: "With a 100 req/min fixed window, a user can send 100 requests in the last second of one window and 100 in the first second of the next  effectively 200 req/2s. Sliding window solves this.",
  },
  {
    question: "Which rate limiting algorithm allows short bursts above the average rate while still enforcing a long-term average?",
    options: [
      "Fixed Window Counter",
      "Leaky Bucket",
      "Token Bucket",
      "Sliding Window Log",
    ],
    correct: 2,
    explanation: "The Token Bucket algorithm refills tokens at a fixed rate but allows them to accumulate up to a maximum (the bucket size). A user who hasn't made requests recently can burst up to the full bucket capacity. This makes it ideal for APIs where clients need burst allowances.",
  },
  {
    question: "Where is the best architectural layer to implement rate limiting for a microservices system?",
    options: [
      "In each individual microservice's business logic",
      "At the database layer using query quotas",
      "At the API Gateway level, using a shared distributed store like Redis",
      "At the DNS level to block excessive lookups",
    ],
    correct: 2,
    explanation: "Implementing rate limiting at the API Gateway centralizes enforcement across all services. A distributed store like Redis enables consistent rate limit state across multiple gateway instances. Per-service implementation leads to inconsistent enforcement and duplication of logic.",
  },
  {
    question: "How does a sliding window log algorithm track request counts?",
    options: [
      "It stores a single counter and a window start timestamp",
      "It stores the exact timestamp of each request and counts those within the last N seconds",
      "It divides time into fixed buckets and rotates them",
      "It uses exponential moving averages of request rates",
    ],
    correct: 1,
    explanation: "The sliding window log stores the timestamp of every request (e.g., in a Redis sorted set). To check the rate, it counts timestamps within the last N seconds and removes older ones. This is perfectly accurate but uses more memory than counter-based approaches.",
  },
  {
    question: "What HTTP status code should a rate limiter return when a client exceeds their quota?",
    options: [
      "400 Bad Request",
      "401 Unauthorized",
      "429 Too Many Requests",
      "503 Service Unavailable",
    ],
    correct: 2,
    explanation: "RFC 6585 defines HTTP 429 Too Many Requests specifically for rate limiting. The response should include a Retry-After header indicating when the client can try again. Using 429 allows clients to implement proper backoff logic.",
  },
  {
    question: "What is the difference between rate limiting by IP address versus by API key?",
    options: [
      "IP-based is more accurate; API key-based is simpler to implement",
      "IP-based limits can penalize legitimate users behind a shared NAT; API key-based ties limits to an authenticated identity",
      "API key-based limiting only works for paid plans",
      "IP-based limiting requires a database; API key limiting does not",
    ],
    correct: 1,
    explanation: "IP-based limiting can unfairly block legitimate users who share an IP via corporate NAT or mobile carrier NAT. API key-based limits are more precise since they target an authenticated identity. Most production APIs use API keys for authenticated requests and IP-based limits as a fallback for unauthenticated traffic.",
  },
  {
    question: "Which Redis data structure is commonly used to implement a sliding window rate limiter?",
    options: [
      "String with INCR command",
      "Hash map keyed by user ID",
      "Sorted set (ZSET) with request timestamps as scores",
      "List with LPUSH and LTRIM commands",
    ],
    correct: 2,
    explanation: "A Redis sorted set stores request timestamps as scores. To check the rate: ZADD to add current timestamp, ZREMRANGEBYSCORE to remove expired entries, ZCARD to count remaining entries. ZADD and ZREMRANGEBYSCORE are atomic, making this thread-safe across distributed gateway instances.",
  },
  {
    question: "What is a 'soft limit' versus a 'hard limit' in rate limiting?",
    options: [
      "Soft limits apply to GET requests; hard limits apply to POST requests",
      "A soft limit sends a warning header when approaching the quota; a hard limit rejects requests that exceed the quota",
      "Soft limits are per-second; hard limits are per-day",
      "Hard limits are enforced client-side; soft limits are enforced server-side",
    ],
    correct: 1,
    explanation: "A soft limit warns clients they are approaching their quota (e.g., X-RateLimit-Remaining: 5) so they can slow down. A hard limit rejects requests with 429 once the quota is exceeded. Providing both gives well-behaved clients the opportunity to back off before hitting the hard limit.",
  },
  {
    question: "What is the sliding window counter algorithm and how does it improve on fixed window?",
    options: [
      "It uses multiple simultaneous windows to achieve higher throughput",
      "It approximates a sliding window by combining the current window count and a weighted portion of the previous window count",
      "It replaces counters with timestamps for exact tracking",
      "It uses a circular buffer of fixed-size time slots",
    ],
    correct: 1,
    explanation: "The sliding window counter algorithm approximates a true sliding window: count = current_window_count + (previous_window_count × overlap_ratio). For example, if 40% of the previous window still falls within the current 60-second window, it weights the previous count by 0.4. This is memory-efficient (two counters) and eliminates the boundary attack of fixed windows.",
  },
];

export default function RateLimitingContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Rate limiting</strong> controls the rate of requests a client can make to an API. Without it, a single bad actor (or runaway script) can bring down your service, starving legitimate users of resources.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">Rate Limiting Algorithms</h2>
      <div className="space-y-4">
        {[
          {
            name: "Token Bucket",
            color: "#3b82f6",
            desc: "Tokens added at constant rate. Each request consumes one token. Bucket holds max N tokens. Allows bursts up to bucket capacity.",
            pros: "Handles bursts gracefully. Common choice.",
            cons: "Requires tracking token count per user.",
            example: "Twitter API: 15 requests/15min window",
          },
          {
            name: "Leaky Bucket",
            color: "#06b6d4",
            desc: "Requests queue in a fixed-size bucket. Processed at constant rate. If bucket full, request dropped.",
            pros: "Smooth, constant output rate. Good for downstream protection.",
            cons: "Bursts are queued/dropped  no burst allowance.",
            example: "Network traffic shaping, streaming pipelines",
          },
          {
            name: "Fixed Window",
            color: "#8b5cf6",
            desc: "Count requests in fixed time windows (0-60s, 60-120s...). Reset counter at window boundary.",
            pros: "Simplest to implement and understand.",
            cons: "Vulnerable to boundary attacks (double rate at window edges).",
            example: "Basic API limits, per-hour quotas",
          },
          {
            name: "Sliding Window",
            color: "#10b981",
            desc: "Rolling time window: count requests in the last N seconds continuously. No boundary artifacts.",
            pros: "Accurate, no boundary exploitation.",
            cons: "More memory (must store request timestamps).",
            example: "GitHub API, most production rate limiters",
          },
        ].map((alg) => (
          <div key={alg.name} className="p-4 rounded-xl border border-border-ui bg-surface">
            <div className="font-bold text-sm font-heading mb-1.5" style={{ color: alg.color }}>{alg.name}</div>
            <p className="text-xs text-txt-2 mb-2">{alg.desc}</p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div><span className="text-c-success">✓ </span>{alg.pros}</div>
              <div><span className="text-[#ef4444]">✗ </span>{alg.cons}</div>
            </div>
            <div className="mt-1.5 text-[10px] text-txt-3">Example: {alg.example}</div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        Implement rate limiting at the API Gateway level using Redis for distributed state. Store counts in Redis with atomic INCR + EXPIRE commands. For sliding window, use Redis sorted sets with request timestamps. Cloudflare, Kong, and AWS API Gateway all have built-in rate limiting.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
