"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";

const NINES = [
  { nines: "99%", label: "Two 9s", downtime: "3.65 days/year", status: "Unacceptable for most" },
  { nines: "99.9%", label: "Three 9s", downtime: "8.7 hours/year", status: "Minimum for production" },
  { nines: "99.99%", label: "Four 9s", downtime: "52 minutes/year", status: "Good for most services" },
  { nines: "99.999%", label: "Five 9s", downtime: "5.2 minutes/year", status: "Telecom / financial grade" },
  { nines: "99.9999%", label: "Six 9s", downtime: "31 seconds/year", status: "Extremely expensive" },
];

const questions = [
  {
    question: "A service with 99.9% availability can be down for at most how long per year?",
    options: ["52 minutes", "8.7 hours", "3.65 days", "31 seconds"],
    correct: 1,
    explanation: "99.9% uptime = 0.1% downtime = 0.001 × 8760 hours = 8.76 hours per year (Three 9s).",
  },
  {
    question: "If two services each have 99.9% availability and run in series (sequential), what is the combined availability?",
    options: ["99.9%", "99.8%", "99.0%", "100%"],
    correct: 1,
    explanation: "Series availability = A₁ × A₂ = 0.999 × 0.999 = 0.998001 ≈ 99.8%. Services in series MULTIPLY availabilities (each can fail the whole system).",
  },
  {
    question: "What does 'five nines' (99.999%) availability translate to in downtime per year?",
    options: ["52 minutes", "8.7 hours", "5.2 minutes", "31 seconds"],
    correct: 2,
    explanation: "Five nines (99.999%) allows only 0.001% downtime = 0.00001 × 525,600 minutes = 5.26 minutes of downtime per year. This level is required for telecom and financial systems.",
  },
  {
    question: "What is a Single Point of Failure (SPOF)?",
    options: [
      "A server that handles more than 50% of all traffic",
      "Any component whose failure would bring down the entire system",
      "A database without read replicas",
      "A service with less than 99.9% uptime",
    ],
    correct: 1,
    explanation: "A SPOF is any component that, if it fails, causes the entire system to fail. Eliminating SPOFs through redundancy (multiple instances, replicas, backup power) is the primary strategy for achieving high availability.",
  },
  {
    question: "What is the formula for availability of two components running in parallel (redundant)?",
    options: [
      "A = A₁ × A₂",
      "A = A₁ + A₂",
      "A = 1 - (1 - A₁) × (1 - A₂)",
      "A = (A₁ + A₂) / 2",
    ],
    correct: 2,
    explanation: "Parallel availability = 1 - (probability both fail) = 1 - (1-A₁)(1-A₂). Two components at 99.9% in parallel = 1 - (0.001 × 0.001) = 99.9999%. The system fails only when BOTH components fail simultaneously.",
  },
  {
    question: "What is the difference between RTO and RPO in disaster recovery?",
    options: [
      "RTO = maximum data loss allowed; RPO = maximum downtime allowed",
      "RTO = maximum downtime allowed (time to recover); RPO = maximum data loss allowed (data age)",
      "They are different terms for the same concept",
      "RTO applies to databases; RPO applies to web servers",
    ],
    correct: 1,
    explanation: "RTO (Recovery Time Objective) is how long the system can be down after a failure. RPO (Recovery Point Objective) is how much data can be lost (expressed as time since last backup). Lower RTO/RPO = higher cost and complexity.",
  },
  {
    question: "What is the purpose of a 'chaos engineering' practice like Netflix's Chaos Monkey?",
    options: [
      "Automatically scaling infrastructure based on traffic patterns",
      "Randomly terminating production instances to ensure the system handles failures gracefully",
      "Monitoring application performance metrics in production",
      "Load testing services to find capacity limits",
    ],
    correct: 1,
    explanation: "Chaos Monkey randomly kills production instances to force engineers to build resilient systems. If services can't survive random instance termination, they can't handle real failures. This proactively discovers weaknesses before they cause outages.",
  },
  {
    question: "What is a 'hot standby' vs a 'warm standby' in high availability design?",
    options: [
      "Hot standby: server is fully running and ready to take over instantly; warm standby: server is partially started and takes minutes to become active",
      "Hot standby: server handles some traffic; warm standby: server handles no traffic",
      "They are the same concept",
      "Hot standby is in the same datacenter; warm standby is in a different region",
    ],
    correct: 0,
    explanation: "Hot standby: a fully active replica ready to take over instantly with near-zero downtime (milliseconds). Warm standby: a pre-launched but idle instance that takes minutes to fully initialize and take over. Cold standby: a powered-off instance taking hours to start.",
  },
  {
    question: "Which availability pattern best describes deploying services across multiple AWS Availability Zones?",
    options: [
      "Vertical redundancy",
      "Geographic redundancy within a region (multi-AZ)",
      "Multi-region active-active deployment",
      "Single point of failure elimination",
    ],
    correct: 1,
    explanation: "Multi-AZ deployment spreads instances across physically separate data centers within the same AWS region. This protects against data center failures (power, cooling, networking) while maintaining low latency between components.",
  },
  {
    question: "What is 'graceful degradation' in terms of system availability?",
    options: [
      "Gradually shutting down a system during planned maintenance",
      "The system continues serving reduced functionality when some components fail, rather than failing completely",
      "Automatically scaling down during low-traffic periods",
      "Displaying a maintenance page during planned downtime",
    ],
    correct: 1,
    explanation: "Graceful degradation means the system continues operating with reduced features when components fail. For example, if the recommendation engine fails, show generic recommendations instead of returning an error. The core functionality remains available.",
  },
];

export default function AvailabilityContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Availability</strong> is the percentage of time a system is operational and accessible. High availability is one of the core requirements in system design  no one wants their service to be down.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">The Nines of Availability</h2>
      <div className="space-y-2">
        {NINES.map((n, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-border-ui bg-surface">
            <div className="w-16 font-bold font-mono text-accent text-sm">{n.nines}</div>
            <div className="w-20 text-xs text-txt font-semibold font-heading">{n.label}</div>
            <div className="flex-1 text-xs text-txt-2">Downtime: <span className="text-[#f59e0b]">{n.downtime}</span></div>
            <div className="text-xs text-txt-3 text-right">{n.status}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Series vs Parallel Availability</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl">
          <div className="font-bold text-[#ef4444] text-sm font-heading mb-2">Series (Chain)</div>
          <p className="text-xs text-txt-2 mb-2">Each service can fail the whole system. Availabilities multiply:</p>
          <code className="text-xs text-txt font-mono">A = A₁ × A₂ × ... × Aₙ</code>
          <p className="text-xs text-txt-3 mt-2">3 services at 99.9% = 99.7% total</p>
        </div>
        <div className="p-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl">
          <div className="font-bold text-c-success text-sm font-heading mb-2">Parallel (Redundant)</div>
          <p className="text-xs text-txt-2 mb-2">System fails only when ALL redundant components fail:</p>
          <code className="text-xs text-txt font-mono">A = 1-(1-A₁)×(1-A₂)</code>
          <p className="text-xs text-txt-3 mt-2">2 services at 99.9% = 99.9999% total!</p>
        </div>
      </div>

      <KeyTakeaway variant="important">
        Redundancy is the primary tool for high availability. Always have at least 2 instances of critical components (N+1 redundancy). For financial systems, use N+2. Eliminate every single point of failure.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
