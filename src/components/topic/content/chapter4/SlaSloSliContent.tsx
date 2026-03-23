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
  {
    question: "Which of the following is the best example of an SLI for a user-facing API?",
    options: [
      "The number of engineers on the on-call rotation",
      "CPU utilization of the API server fleet",
      "The percentage of requests that return a successful response (2xx) within 200ms",
      "The number of lines of code deployed per week",
    ],
    correct: 2,
    explanation: "An SLI must directly measure what users experience. Request success rate and latency are the canonical user-facing SLIs. CPU utilization and team metrics are internal operational signals that don't directly reflect user experience and should not be used as SLIs.",
  },
  {
    question: "What should an engineering team do when they have consumed 80% of their monthly error budget?",
    options: [
      "Immediately roll back the last deployment",
      "Slow down risky feature deployments and prioritize reliability work to preserve the remaining budget",
      "Increase the SLO to create more error budget",
      "Alert customers that the SLA may be breached",
    ],
    correct: 1,
    explanation: "Burning 80% of the error budget is a signal to slow down velocity on risky changes. The team should focus on reliability improvements, reduce deployment frequency, and investigate ongoing issues before the budget is fully exhausted and the SLA is at risk of breach.",
  },
  {
    question: "What is the error budget for a service with a 99.99% SLO over a 30-day month?",
    options: [
      "43.8 minutes",
      "21.9 minutes",
      "4.4 minutes",
      "8.7 hours",
    ],
    correct: 2,
    explanation: "99.99% SLO means 0.01% downtime allowed. 43,200 minutes/month × 0.0001 = 4.32 minutes. This is the 'four nines' tier, common for financial systems and critical infrastructure. Achieving this requires automated failover, extensive redundancy, and zero-downtime deployments.",
  },
  {
    question: "Which SLI metric is most appropriate for a data processing pipeline?",
    options: [
      "Request success rate (2xx responses)",
      "Data freshness: the time elapsed since the last successful pipeline run completed",
      "p99 latency of API responses",
      "Number of microservices in the pipeline",
    ],
    correct: 1,
    explanation: "Data pipelines don't have user requests, so latency and request success rates are not applicable. Data freshness (how recent the output data is) and completeness (what fraction of expected records were processed) are the canonical SLIs for batch and streaming data pipelines.",
  },
  {
    question: "Google's SRE book recommends limiting SLIs to how many per service?",
    options: [
      "1-2 SLIs to keep alerting focused",
      "3-5 SLIs covering what users actually experience",
      "10-20 SLIs for comprehensive coverage",
      "As many as needed to cover every metric in Prometheus",
    ],
    correct: 1,
    explanation: "Google recommends 3-5 SLIs per service. Too few misses important user experiences; too many creates alert fatigue and competing priorities. Focus on what users directly perceive: availability, latency, and quality of responses. Internal metrics like CPU and memory should be monitored separately but not used as SLIs.",
  },
  {
    question: "What is the consequence for a cloud provider when they breach their published SLA?",
    options: [
      "Their service is automatically shut down by regulators",
      "They typically owe customers service credits as compensation, specified in the SLA terms",
      "All customer contracts are immediately terminated",
      "They must publish a public post-mortem within 24 hours",
    ],
    correct: 1,
    explanation: "SLAs are legal contracts that define consequences for breach. Typically this means service credits (a percentage of the monthly bill) proportional to the downtime duration. For example, AWS EC2's SLA provides 10% credit for availability between 99.0-99.99% and 30% for below 99.0%.",
  },
  {
    question: "How does an error budget policy govern the relationship between product and engineering teams?",
    options: [
      "Engineering sets the SLOs; product has no input",
      "When the error budget is healthy, teams can move fast; when it is exhausted, reliability work takes priority over new features",
      "Product teams decide when to deploy; engineering decides when to roll back",
      "Error budgets only apply to infrastructure teams, not product engineering",
    ],
    correct: 1,
    explanation: "The error budget creates an objective, data-driven agreement between product (wants fast feature delivery) and SRE/engineering (wants stability). While budget remains, the team can ship. When budget is exhausted, the policy mandates a shift to reliability work. This removes the subjective disagreements about 'is the system stable enough to ship?'",
  },
  {
    question: "What distinguishes a p99 latency SLI from an average latency SLI?",
    options: [
      "p99 measures the median response time; average includes outliers",
      "p99 captures the worst 1% of requests, revealing tail latency issues that averages hide",
      "Average latency is always higher than p99 latency",
      "p99 and average latency measure the same thing but in different units",
    ],
    correct: 1,
    explanation: "p99 latency means 99% of requests are faster than this value; only 1% are slower. Averages are dominated by fast requests and can look healthy even when 1% of users experience severe slowdowns. At scale (1M requests/day), p99 = 10,000 users with a bad experience. Percentile-based SLIs reveal tail latency that averages completely obscure.",
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
