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
];

export default function AvailabilityContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-[#94a3b8]">
      <p className="text-base leading-relaxed">
        <strong className="text-[#f1f5f9]">Availability</strong> is the percentage of time a system is operational and accessible. High availability is one of the core requirements in system design — no one wants their service to be down.
      </p>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">The Nines of Availability</h2>
      <div className="space-y-2">
        {NINES.map((n, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-[#1e293b] bg-[#111827]">
            <div className="w-16 font-bold font-mono text-[#3b82f6] text-sm">{n.nines}</div>
            <div className="w-20 text-xs text-[#f1f5f9] font-semibold font-heading">{n.label}</div>
            <div className="flex-1 text-xs text-[#94a3b8]">Downtime: <span className="text-[#f59e0b]">{n.downtime}</span></div>
            <div className="text-xs text-[#475569] text-right">{n.status}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Series vs Parallel Availability</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl">
          <div className="font-bold text-[#ef4444] text-sm font-heading mb-2">Series (Chain)</div>
          <p className="text-xs text-[#94a3b8] mb-2">Each service can fail the whole system. Availabilities multiply:</p>
          <code className="text-xs text-[#f1f5f9] font-mono">A = A₁ × A₂ × ... × Aₙ</code>
          <p className="text-xs text-[#475569] mt-2">3 services at 99.9% = 99.7% total</p>
        </div>
        <div className="p-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl">
          <div className="font-bold text-[#10b981] text-sm font-heading mb-2">Parallel (Redundant)</div>
          <p className="text-xs text-[#94a3b8] mb-2">System fails only when ALL redundant components fail:</p>
          <code className="text-xs text-[#f1f5f9] font-mono">A = 1-(1-A₁)×(1-A₂)</code>
          <p className="text-xs text-[#475569] mt-2">2 services at 99.9% = 99.9999% total!</p>
        </div>
      </div>

      <KeyTakeaway variant="important">
        Redundancy is the primary tool for high availability. Always have at least 2 instances of critical components (N+1 redundancy). For financial systems, use N+2. Eliminate every single point of failure.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
