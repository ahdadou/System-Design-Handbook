"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { CircuitBreakerDiagram } from "@/components/diagrams/circuit-breaker/CircuitBreakerDiagram";

const questions = [
  {
    question: "What problem does the Circuit Breaker pattern solve?",
    options: [
      "Database connection management",
      "Preventing cascading failures when a downstream service is unavailable",
      "Load balancing across multiple servers",
      "Caching frequently accessed data",
    ],
    correct: 1,
    explanation: "Circuit breakers prevent your service from continuously calling a failing downstream service. Instead of waiting for timeouts repeatedly, the circuit opens and returns immediately, protecting your service and giving the downstream time to recover.",
  },
  {
    question: "What happens when a circuit breaker is in the HALF-OPEN state?",
    options: [
      "It blocks all requests",
      "It allows all requests through",
      "It allows limited requests to test if the downstream service has recovered",
      "It retries failed requests automatically",
    ],
    correct: 2,
    explanation: "HALF-OPEN is the recovery test phase. After a timeout, the circuit allows one request through. If it succeeds, the circuit CLOSES (normal operation). If it fails, the circuit OPENS again.",
  },
];

export default function CircuitBreakerContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        The <strong className="text-txt">Circuit Breaker</strong> is a fault-tolerance design pattern inspired by electrical circuit breakers. When calls to a service start failing repeatedly, the circuit "opens" and subsequent calls fail fast without trying, preventing cascading failures across your system.
      </p>
      <p>
        Netflix's Hystrix library popularized this pattern. Imagine a payment service goes down. Without a circuit breaker, your order service keeps retrying, threads pile up, connection pools exhaust, and your entire app goes down. With a circuit breaker, failed calls return immediately, and you can serve a degraded experience (cached prices, fallback data) instead.
      </p>

      <CircuitBreakerDiagram />

      <h2 className="text-2xl font-bold font-heading text-txt">The Three States</h2>
      <div className="space-y-3">
        {[
          { state: "CLOSED", icon: "✅", color: "#10b981", desc: "Normal operation. Requests flow through. Failure counter tracks errors. When failures exceed threshold, circuit OPENS." },
          { state: "OPEN", icon: "🚨", color: "#ef4444", desc: "Circuit is tripped. All requests fail immediately (fast fail). Timer starts. After timeout, transitions to HALF-OPEN." },
          { state: "HALF-OPEN", icon: "⚠️", color: "#f59e0b", desc: "Testing recovery. One request allowed through. SUCCESS → CLOSED. FAILURE → back to OPEN." },
        ].map((s) => (
          <div key={s.state} className="p-4 rounded-xl border flex gap-3" style={{ borderColor: `${s.color}40`, backgroundColor: `${s.color}08` }}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <div className="font-bold text-sm font-heading mb-1" style={{ color: s.color }}>{s.state}</div>
              <p className="text-xs text-txt-2">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        Use Circuit Breakers for all external service calls: payment providers, external APIs, downstream microservices. Popular libraries: Resilience4j (Java), Polly (.NET), pybreaker (Python). AWS App Mesh and Istio provide circuit breaking at the infrastructure level.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
