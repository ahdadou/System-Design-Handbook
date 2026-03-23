"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "primary", type: "system", position: { x: 180, y: 0 }, data: { label: "Primary Site", sublabel: "Active production", icon: "🏢", color: "#3b82f6", description: "Running primary system. Disaster event occurs  data center fire, region outage, ransomware attack. RTO/RPO define acceptable recovery bounds." } },
  { id: "disaster", type: "system", position: { x: 180, y: 120 }, data: { label: "Disaster Event", sublabel: "Region outage / failure", icon: "💥", color: "#ef4444", description: "The moment of failure. RPO is measured backward from this moment  how much data is lost. RTO is measured forward  how long until recovery." } },
  { id: "cold", type: "system", position: { x: 0, y: 280 }, data: { label: "Cold Standby", sublabel: "RTO: hours", icon: "❄️", color: "#94a3b8", description: "Hardware exists but is powered off. Must provision infra, restore from backup, and reconfigure. Cheapest option. Used for non-critical workloads." } },
  { id: "warm", type: "system", position: { x: 180, y: 280 }, data: { label: "Warm Standby", sublabel: "RTO: minutes", icon: "🌤️", color: "#f59e0b", description: "Scaled-down running replica. Catches up from backups/replication. Scaled up during failover. Moderate cost. Most common production DR." } },
  { id: "hot", type: "system", position: { x: 360, y: 280 }, data: { label: "Hot Standby", sublabel: "RTO: seconds", icon: "🔥", color: "#10b981", description: "Full-capacity replica running and in sync. DNS/LB failover only. Highest cost. Required for financial systems, healthcare, critical infrastructure." } },
  { id: "db", type: "database", position: { x: 180, y: 420 }, data: { label: "Replicated DB", sublabel: "Cross-region backup", icon: "🗄️", color: "#8b5cf6", description: "Synchronous replication = RPO near 0 (no data loss). Async replication = RPO depends on lag. Backup-based = RPO = time since last backup." } },
];

const edges: Edge[] = [
  { id: "e1", source: "primary", target: "disaster", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e2", source: "disaster", target: "cold", label: "restore backup", animated: true, style: { stroke: "#94a3b8", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e3", source: "disaster", target: "warm", label: "scale up", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e4", source: "disaster", target: "hot", label: "DNS switch", animated: true, style: { stroke: "#10b981", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e5", source: "primary", target: "db", label: "continuous replication", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2, strokeDasharray: "4,4" }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
];

const questions = [
  {
    question: "A company's RPO is 1 hour. What does this mean?",
    options: [
      "The system must be recovered within 1 hour of a disaster",
      "The company can afford to lose at most 1 hour of data",
      "Backups must complete within 1 hour",
      "The system must have 1 hour of downtime tolerance",
    ],
    correct: 1,
    explanation: "RPO (Recovery Point Objective) defines the maximum acceptable data loss measured in time. An RPO of 1 hour means backups or replication must capture data at least every hour  if disaster strikes, you may lose up to 1 hour of transactions. Lower RPO requires more frequent backups or synchronous replication.",
  },
  {
    question: "What is the main trade-off between cold standby and hot standby DR strategies?",
    options: [
      "Cold standby is more reliable but slower to recover; hot standby is faster but less reliable",
      "Cold standby is cheaper but has a much longer RTO (hours); hot standby is expensive but recovers in seconds",
      "Hot standby requires more manual intervention during failover",
      "Cold standby supports synchronous replication; hot standby only supports async",
    ],
    correct: 1,
    explanation: "The core trade-off is cost vs recovery speed. Cold standby: infrastructure is off/minimal, cheapest, but RTO is hours (provision infra + restore from backup). Hot standby: full-capacity replica running at all times, most expensive, but RTO is seconds (just switch DNS/LB). Most businesses use warm standby as a balance.",
  },
  {
    question: "What does RTO measure in a disaster recovery plan?",
    options: [
      "The maximum amount of data that can be lost, measured in time",
      "The maximum acceptable time from disaster occurrence to full service restoration",
      "The time required to complete a full backup",
      "The replication lag between primary and standby databases",
    ],
    correct: 1,
    explanation: "RTO (Recovery Time Objective) measures how long the business can tolerate the system being down. An RTO of 4 hours means the system must be fully operational within 4 hours of a disaster. Lower RTOs require more expensive strategies like hot standby or active-active deployments.",
  },
  {
    question: "An active-active DR strategy means:",
    options: [
      "One active region and one passive replica that activates during failure",
      "Traffic is served from multiple regions simultaneously; if one fails, others absorb traffic with no failover needed",
      "Active backup jobs running continuously on both primary and secondary sites",
      "Two load balancers where the secondary activates when the primary fails",
    ],
    correct: 1,
    explanation: "In active-active, all regions serve live production traffic simultaneously. There is no 'failover' event because no single region is the exclusive primary. When one region fails, traffic automatically routes to remaining healthy regions. This achieves RTO and RPO of near zero but requires conflict-free data replication and significantly higher cost.",
  },
  {
    question: "What is the '3-2-1 backup rule'?",
    options: [
      "3 daily backups, 2 weekly backups, 1 monthly backup",
      "3 copies of data, on 2 different storage media types, with 1 copy stored offsite",
      "Run 3 backup jobs, verify 2, and restore 1 per month",
      "3 geographic regions, 2 cloud providers, 1 on-premise backup",
    ],
    correct: 1,
    explanation: "The 3-2-1 rule is a backup best practice: keep 3 copies of data (production + 2 backups), on 2 different media types (e.g., SSD and object storage), with 1 copy stored offsite or in a separate region. This protects against hardware failure, media failure, and site-level disasters.",
  },
  {
    question: "Which type of backup has the fastest restore time but the slowest creation time?",
    options: [
      "Incremental backup",
      "Differential backup",
      "Full backup",
      "Continuous replication",
    ],
    correct: 2,
    explanation: "A full backup copies all data every time, making it the slowest to create (high storage cost and time). However, restoration requires only a single backup file, making it the fastest to restore. Incremental backups are fastest to create but slowest to restore because you must apply the full backup plus every incremental in sequence.",
  },
  {
    question: "What is the AWS 'Pilot Light' DR strategy?",
    options: [
      "A cold standby where all infrastructure is powered off until needed",
      "A minimal always-running configuration (like a pilot light on a furnace) with just core systems active, scaled up during failover",
      "An active-active strategy across two AWS regions",
      "Automated daily snapshots of EC2 instances stored in S3",
    ],
    correct: 1,
    explanation: "Pilot Light keeps only the most critical core systems running in the DR region (e.g., a replicated database but no application servers). During a disaster, you scale up the application layer from pre-existing AMIs or infrastructure-as-code. It's between cold standby (everything off) and warm standby (minimal running replica) in cost and RTO.",
  },
  {
    question: "What is Chaos Engineering, and why is it important for disaster recovery?",
    options: [
      "A testing methodology where engineers randomly delete production databases to practice recovery",
      "Deliberately injecting failures into production systems to verify that DR mechanisms, alerting, and runbooks actually work as expected",
      "A deployment strategy where changes are released randomly to different regions",
      "An observability practice of monitoring for unexpected traffic patterns",
    ],
    correct: 1,
    explanation: "Chaos Engineering (popularized by Netflix's Chaos Monkey) deliberately kills production services, terminates instances, and simulates network partitions to verify that systems degrade gracefully and recover correctly. A DR plan never tested in production is often found to have critical gaps when a real disaster occurs.",
  },
  {
    question: "For a financial trading system that cannot lose any transactions, what replication strategy is required?",
    options: [
      "Asynchronous replication with daily full backups",
      "Synchronous replication, ensuring every transaction is committed to the replica before acknowledging success to the client",
      "Incremental backups every 15 minutes",
      "Differential backups with a 1-hour RPO",
    ],
    correct: 1,
    explanation: "Synchronous replication means a transaction is only acknowledged as successful after it is written to both the primary and all replicas. This guarantees RPO = 0 (zero data loss). The trade-off is added latency on every write (waiting for replica confirmation), which is acceptable for financial systems where data integrity is paramount.",
  },
  {
    question: "What is the primary risk of failing over to a DR environment that has never been tested in production?",
    options: [
      "The DR site will have higher performance than production due to newer hardware",
      "Configuration drift, stale dependencies, or untested failover scripts may cause the DR environment to fail when it is needed most",
      "Customers will notice the difference in IP addresses during failover",
      "Compliance auditors will flag the failover as an unauthorized change",
    ],
    correct: 1,
    explanation: "Untested DR environments suffer from configuration drift (production evolved but DR wasn't updated), missing secrets or certificates, incorrect DNS TTLs, and runbooks that no longer match the current architecture. The worst time to discover DR gaps is during an actual disaster when pressure is highest.",
  },
];

export default function DisasterRecoveryContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Disaster Recovery (DR)</strong> is the set of policies, tools, and procedures to recover IT systems after a catastrophic event  data center fire, region-wide cloud outage, ransomware attack, or accidental mass deletion. Two metrics define every DR strategy: <strong className="text-txt">RTO</strong> (how quickly you recover) and <strong className="text-txt">RPO</strong> (how much data you can afford to lose).
      </p>
      <p>
        In 2017, AWS S3 had a major us-east-1 outage. Companies that replicated to other regions stayed up; those that didn't went dark for hours. DR is not theoretical  it's the difference between a bad day and a business-ending event.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Disaster Recovery Strategies"
        description="Primary site fails → three recovery options with different cost/speed trade-offs. Click nodes for details."
        height={500}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">RTO and RPO Explained</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { metric: "RTO", full: "Recovery Time Objective", color: "#3b82f6", icon: "⏱️", desc: "Maximum acceptable time from disaster to full service restoration. RTO = 0 means your system must never go down (active-active). RTO = 24h means you can be dark for a day. Lower RTO = higher cost." },
          { metric: "RPO", full: "Recovery Point Objective", color: "#8b5cf6", icon: "💾", desc: "Maximum acceptable data loss measured in time. RPO = 0 means zero data loss (synchronous replication required). RPO = 1h means you can lose 1 hour of transactions. Lower RPO = more frequent backups or sync replication." },
        ].map((m) => (
          <div key={m.metric} className="p-4 rounded-xl border bg-surface" style={{ borderColor: `${m.color}40` }}>
            <div className="text-3xl mb-2">{m.icon}</div>
            <div className="font-bold text-base font-heading mb-0.5" style={{ color: m.color }}>{m.metric}</div>
            <div className="text-[10px] text-txt-3 mb-2">{m.full}</div>
            <p className="text-xs text-txt-2 leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Standby Strategies</h2>
      <div className="space-y-3">
        {[
          { type: "Cold Standby", rto: "Hours", rpo: "Hours to days", cost: "$", color: "#94a3b8", desc: "Infrastructure exists but is powered off or minimal. Recovery requires: provision servers, restore from backup (S3/tape), reconfigure networking, run smoke tests. Cheapest option  90%+ less than hot standby. Good for development, test environments, or non-critical systems with tolerant business stakeholders." },
          { type: "Warm Standby", rto: "Minutes", rpo: "Minutes", cost: "$$", color: "#f59e0b", desc: "A scaled-down but running replica in another region. Database replication is active but infra is minimal (e.g., 1 instance instead of 10). During failover: scale up auto-scaling groups, redirect DNS. AWS Pilot Light is a variant  just core systems run, others rebuilt. Most common production strategy." },
          { type: "Hot Standby (Active-Passive)", rto: "Seconds", rpo: "Near zero", cost: "$$$", color: "#ef4444", desc: "Full-capacity replica running in sync in another region. Only DNS/load balancer change needed to failover. Synchronous database replication ensures near-zero RPO. Required for financial transactions, healthcare records, mission-critical e-commerce." },
          { type: "Active-Active", rto: "Zero", rpo: "Zero", cost: "$$$$", color: "#10b981", desc: "Traffic runs through multiple regions simultaneously. No 'failover'  other regions absorb traffic instantly when one region dies. Requires conflict-free data replication or strong consistency across regions. Most complex and expensive. Used by Netflix, Amazon, Google for global services." },
        ].map((s) => (
          <div key={s.type} className="p-4 rounded-xl border border-border-ui bg-surface">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-sm font-heading" style={{ color: s.color }}>{s.type}</div>
              <div className="flex gap-3 text-[10px]">
                <span className="text-txt-2">RTO: <span className="text-txt font-semibold">{s.rto}</span></span>
                <span className="text-txt-2">RPO: <span className="text-txt font-semibold">{s.rpo}</span></span>
                <span className="text-txt-2">Cost: <span style={{ color: s.color }}>{s.cost}</span></span>
              </div>
            </div>
            <p className="text-xs text-txt-2 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="warning">
        A DR plan that's never been tested is not a DR plan  it's a wish. Chaos Engineering (popularized by Netflix's Chaos Monkey) deliberately kills production services to verify that DR mechanisms actually work. At minimum, run a DR drill quarterly: actually execute your failover runbook and measure actual RTO vs target.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">Backup Strategies</h2>
      <div className="space-y-2">
        {[
          { strategy: "Full Backup", color: "#3b82f6", desc: "Complete copy of all data. Slowest to create, fastest to restore. High storage cost. Typically weekly." },
          { strategy: "Incremental Backup", color: "#06b6d4", desc: "Only changes since last backup (full or incremental). Fast to create, cheap storage. Slow restore (must apply chain of incrementals). Daily or hourly." },
          { strategy: "Differential Backup", color: "#8b5cf6", desc: "Changes since last full backup. Grows over time. Faster restore than incremental (just full + latest differential). Middle ground." },
          { strategy: "Continuous Replication", color: "#10b981", desc: "Real-time streaming of data changes to replica. Near-zero RPO. Database log shipping, AWS DMS, Google Spanner multi-region. Most expensive but lowest data loss." },
        ].map((b) => (
          <div key={b.strategy} className="flex gap-3 p-3 rounded-lg bg-surface border border-border-ui">
            <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
            <div>
              <div className="font-semibold text-xs text-txt font-heading">{b.strategy}</div>
              <p className="text-[10px] text-txt-2 mt-0.5">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        The 3-2-1 backup rule: 3 copies of data, on 2 different media types, with 1 copy offsite. For cloud: 3 copies = primary + replica + cold archive (S3 Glacier), 2 media = SSD + object store, 1 offsite = different AWS region or a separate cloud provider.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
