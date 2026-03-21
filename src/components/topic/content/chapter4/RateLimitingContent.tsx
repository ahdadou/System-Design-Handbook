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
