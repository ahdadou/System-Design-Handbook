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
  {
    question: "Which library popularized the Circuit Breaker pattern in the Java ecosystem?",
    options: [
      "Spring Security",
      "Netflix Hystrix",
      "Apache Kafka",
      "Guava",
    ],
    correct: 1,
    explanation: "Netflix Hystrix, developed by Netflix engineering, popularized the Circuit Breaker pattern for microservices. Although Hystrix is now in maintenance mode, it established the patterns now implemented by Resilience4j, the modern successor.",
  },
  {
    question: "What is the primary difference between a Circuit Breaker and a Retry pattern?",
    options: [
      "Retry is faster; Circuit Breaker is more reliable",
      "Retry attempts the operation again immediately; Circuit Breaker stops calling the failing service entirely for a period to allow recovery",
      "Circuit Breaker works only with HTTP; Retry works with any protocol",
      "They are functionally identical patterns",
    ],
    correct: 1,
    explanation: "Retry blindly re-attempts a failed operation, which can worsen a struggling downstream service by adding more load. Circuit Breaker detects repeated failures and stops sending requests for a cooldown period, giving the downstream service space to recover. Both patterns are often used together with Circuit Breaker wrapping the Retry logic.",
  },
  {
    question: "What is a 'fallback' in the context of circuit breakers?",
    options: [
      "A secondary circuit breaker that activates when the primary fails",
      "An alternative response or behavior returned when the circuit is open, such as cached data or a default value",
      "A log entry written when a failure occurs",
      "A replica service that handles requests during an outage",
    ],
    correct: 1,
    explanation: "A fallback is the degraded-but-functional response provided when the circuit is open. For example, returning cached product prices when the pricing service is down, or showing 'temporarily unavailable' instead of a full error. Fallbacks enable graceful degradation.",
  },
  {
    question: "In Resilience4j, which metric is typically used to decide when to open a circuit?",
    options: [
      "CPU usage of the downstream service",
      "The failure rate percentage over a sliding window of calls",
      "The total number of requests made since startup",
      "Network latency in milliseconds",
    ],
    correct: 1,
    explanation: "Resilience4j opens the circuit when the failure rate exceeds a configured threshold (e.g., 50%) over a count-based or time-based sliding window. You configure the minimum number of calls required before the failure rate is evaluated, preventing premature tripping on small samples.",
  },
  {
    question: "Which infrastructure-level tools can implement circuit breaking without modifying application code?",
    options: [
      "Redis and Memcached",
      "Istio and AWS App Mesh (service meshes)",
      "Nginx and HAProxy (load balancers only)",
      "Prometheus and Grafana (observability tools)",
    ],
    correct: 1,
    explanation: "Service meshes like Istio and AWS App Mesh implement circuit breaking at the proxy/sidecar level (Envoy proxy), so application code needs no changes. This is useful for polyglot microservice environments where you cannot add library dependencies to every service.",
  },
  {
    question: "What is the risk of setting a circuit breaker failure threshold too low (e.g., opens after 1 failure)?",
    options: [
      "The circuit will never open, defeating its purpose",
      "The circuit will open on transient errors or single timeouts, causing unnecessary downtime for healthy services",
      "The downstream service will receive too many retries",
      "It will consume excessive memory storing failure counts",
    ],
    correct: 1,
    explanation: "A threshold too low causes the circuit to trip on transient failures (momentary network hiccups, single slow responses) that would have recovered on their own. This leads to false positives where the circuit is open even though the downstream service is actually healthy, degrading availability unnecessarily.",
  },
  {
    question: "How should a circuit breaker interact with timeouts in a system design?",
    options: [
      "Circuit breakers replace the need for timeouts entirely",
      "Timeouts should be set very high to let the circuit breaker decide when to fail",
      "Timeouts and circuit breakers complement each other: timeouts bound individual call duration while circuit breakers detect patterns of failure across multiple calls",
      "Timeouts only apply to database calls; circuit breakers only apply to HTTP calls",
    ],
    correct: 2,
    explanation: "They work together as layers of defense. Timeouts prevent any single call from hanging indefinitely (e.g., fail after 2s). Circuit breakers watch the aggregate failure pattern across many calls and open the circuit when failures exceed a threshold. Without timeouts, slow calls count as pending rather than failed and the circuit breaker won't trip correctly.",
  },
  {
    question: "When a circuit breaker transitions from OPEN to HALF-OPEN, what determines if it fully closes again?",
    options: [
      "A manual operator action to reset the circuit",
      "A configurable timeout period expiring",
      "A probe request succeeding, indicating the downstream service has recovered",
      "The failure count resetting to zero automatically",
    ],
    correct: 2,
    explanation: "After the OPEN timeout, the circuit moves to HALF-OPEN and allows a limited number of probe requests through. If those succeed (indicating recovery), the circuit transitions to CLOSED and normal traffic resumes. If they fail, the circuit returns to OPEN and the timeout resets.",
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
