"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode };

const nodes: Node[] = [
  { id: "sli", type: "system", position: { x: 0, y: 160 }, data: { label: "SLI", sublabel: "Service Level Indicator", icon: "📊", color: "#3b82f6", description: "What you actually measure. Examples: request success rate, p99 latency, error rate. Raw data from your metrics system (Prometheus, Datadog)." } },
  { id: "slo", type: "system", position: { x: 200, y: 160 }, data: { label: "SLO", sublabel: "Service Level Objective", icon: "🎯", color: "#8b5cf6", description: "Your internal target: SLI must stay within this range. Example: 99.9% of requests succeed. Defines your error budget. Internal to your team." } },
  { id: "sla", type: "system", position: { x: 400, y: 160 }, data: { label: "SLA", sublabel: "Service Level Agreement", icon: "📝", color: "#10b981", description: "Legal contract with customers. SLA ≥ SLO always. If SLO = 99.9%, SLA = 99.5%. Buffer prevents SLA breach while you have warning. Breach → refunds/penalties." } },
  { id: "budget", type: "system", position: { x: 200, y: 320 }, data: { label: "Error Budget", sublabel: "100% − SLO", icon: "💰", color: "#f59e0b", description: "Error budget = 100% - SLO. At 99.9% SLO: 43.8 min/month of downtime allowed. Budget remaining drives whether team can ship risky changes." } },
];

const edges: Edge[] = [
  { id: "e1", source: "sli", target: "slo", label: "defines target for", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e2", source: "slo", target: "sla", label: "backs (with buffer)", animated: true, style: { stroke: "#10b981", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e3", source: "slo", target: "budget", label: "determines", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
];

const questions = [
  {
    question: "A company has an SLO of 99.9% availability. How many minutes of downtime per month does their error budget allow?",
    options: [
      "8.7 minutes",
      "43.8 minutes",
      "4.38 hours",
      "9 hours",
    ],
    correct: 1,
    explanation: "99.9% SLO means 0.1% downtime allowed. 30 days × 24h × 60min = 43,200 minutes/month. 0.001 × 43,200 = 43.2 minutes. This is the error budget  exceed it and you must freeze deployments to protect reliability.",
  },
  {
    question: "Why should your SLA always be set lower than your SLO?",
    options: [
      "Because SLAs are measured in different units than SLOs",
      "To create a safety buffer  if your service dips below SLO you have time to recover before breaching the contractual SLA",
      "SLAs and SLOs must always be equal for legal reasons",
      "To give customers a more optimistic view of your service",
    ],
    correct: 1,
    explanation: "SLO is your internal target (e.g., 99.95%). SLA is the customer contract (e.g., 99.9%). The gap is a safety buffer. If you breach SLO, you get an internal alert to fix things before you breach the SLA and owe customers compensation. Setting SLA = SLO leaves no room for error.",
  },
];

export default function SlaSloSliContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">SLI, SLO, and SLA</strong> are the reliability vocabulary of production systems, codified by Google's Site Reliability Engineering (SRE) practice. They give engineering teams a precise, data-driven way to define, measure, and commit to service reliability  moving from vague promises ("we'll be up") to concrete, measurable targets.
      </p>
      <p>
        The relationship is hierarchical: SLIs are your raw measurements, SLOs are your targets built on those measurements, and SLAs are the contractual promises you make to customers backed by your SLOs  with a safety buffer in between.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="SLI → SLO → SLA Progression"
        description="Click each node to understand how measurements become objectives become agreements."
        height={420}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">The Three Definitions</h2>
      <div className="space-y-3">
        {[
          {
            term: "SLI  Service Level Indicator",
            color: "#3b82f6",
            icon: "📊",
            def: "A quantitative measurement of some aspect of the service. Must be something you can actually instrument and measure continuously.",
            examples: ["Request success rate: (successful requests / total requests) × 100", "p99 latency: 99th percentile response time in ms", "Error rate: 5xx responses / total responses", "Throughput: requests per second served"],
          },
          {
            term: "SLO  Service Level Objective",
            color: "#8b5cf6",
            icon: "🎯",
            def: "An internal target range for an SLI. 'X% of requests should complete in under Y ms over a rolling 30-day window.' SLOs drive engineering priorities  if you're burning through your error budget, you stop shipping features and fix reliability.",
            examples: ["99.9% of requests return 2xx over 30 days", "p99 latency < 200ms over 7 days", "Error rate < 0.1% per hour", "Availability > 99.95% per calendar month"],
          },
          {
            term: "SLA  Service Level Agreement",
            color: "#10b981",
            icon: "📝",
            def: "A legal contract between the service provider and the customer. Must be achievable (backed by your SLO minus a buffer) and includes consequences for breach: financial credits, refunds, or contract termination rights.",
            examples: ["AWS EC2: 99.99% monthly uptime  10-30% service credit if breached", "GCP: 99.9% for Compute Engine  financial credits per downtime tier", "Stripe: No formal uptime SLA  status page only", "Enterprise SaaS: Custom SLAs negotiated per contract"],
          },
        ].map((item) => (
          <div key={item.term} className="p-4 rounded-xl border bg-surface" style={{ borderColor: `${item.color}40` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{item.icon}</span>
              <div className="font-bold text-sm font-heading" style={{ color: item.color }}>{item.term}</div>
            </div>
            <p className="text-xs text-txt-2 mb-2 leading-relaxed">{item.def}</p>
            <div className="space-y-1">
              {item.examples.map((ex, i) => (
                <div key={i} className="text-[10px] text-txt-3 flex items-start gap-1.5">
                  <span style={{ color: item.color }}>→</span>
                  <span>{ex}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Error Budgets: Reliability as a Resource</h2>
      <p>
        The error budget is the most powerful concept from Google SRE. It's the allowed amount of unreliability per SLO window. <strong className="text-txt">Error budget = 100% − SLO.</strong>
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { slo: "99%", window: "30 days", budget: "7.2 hours", color: "#ef4444" },
          { slo: "99.9%", window: "30 days", budget: "43.8 minutes", color: "#f59e0b" },
          { slo: "99.95%", window: "30 days", budget: "21.9 minutes", color: "#3b82f6" },
          { slo: "99.99%", window: "30 days", budget: "4.4 minutes", color: "#10b981" },
        ].map((row) => (
          <div key={row.slo} className="p-3 rounded-lg bg-surface border border-border-ui text-center">
            <div className="text-lg font-bold font-heading" style={{ color: row.color }}>{row.slo} SLO</div>
            <div className="text-[10px] text-txt-3">{row.window} window</div>
            <div className="text-xs text-txt mt-1 font-semibold">{row.budget} budget</div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="warning">
        When your error budget is exhausted, halt all non-critical deployments. The only permitted work is reliability improvements. This creates a healthy tension: product teams want to ship fast, SRE teams want stability  the error budget is the objective arbiter between them.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">Common SLIs by System Type</h2>
      <div className="space-y-2">
        {[
          { type: "User-facing APIs", slis: "Availability (% successful), Latency (p50, p95, p99), Error rate (4xx/5xx per total)", color: "#3b82f6" },
          { type: "Data pipelines", slis: "Freshness (time since last successful run), Completeness (records processed / expected), Throughput (events/sec)", color: "#06b6d4" },
          { type: "Storage systems", slis: "Durability (data not lost), Read/write latency, Throughput, Consistency lag (replication delay)", color: "#8b5cf6" },
          { type: "Batch jobs", slis: "Completion rate, Run duration vs SLO, Data quality (records failing validation)", color: "#10b981" },
        ].map((item) => (
          <div key={item.type} className="flex gap-3 p-3 rounded-lg bg-surface border border-border-ui">
            <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div>
              <div className="font-semibold text-xs text-txt font-heading">{item.type}</div>
              <p className="text-[10px] text-txt-2 mt-0.5 leading-relaxed">{item.slis}</p>
            </div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="success">
        Google's SRE book recommends starting with just 3-5 SLIs per service. Too many SLIs create alert fatigue and competing priorities. Focus on what users actually experience  not internal metrics like CPU or memory. If users can't tell, it probably shouldn't be an SLI.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
