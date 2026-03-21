"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { QuizBlock } from "@/components/ui/QuizBlock";

const questions = [
  {
    question: "Which RAID level provides the best read performance with no redundancy?",
    options: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"],
    correct: 0,
    explanation: "RAID 0 (striping) splits data across all disks, giving maximum read/write performance. But there's zero redundancy  if any disk fails, all data is lost.",
  },
  {
    question: "What type of storage would you use to store user-uploaded images for a web app?",
    options: ["Block storage", "File storage (NAS)", "Object storage (S3)", "HDFS"],
    correct: 2,
    explanation: "Object storage (S3, GCS) is perfect for unstructured data like images, videos, and documents. It scales infinitely, is cheap, and provides a simple HTTP API.",
  },
];

export default function StorageContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        Storage is fundamental to every system. The type of storage you choose affects performance, cost, scalability, and consistency. Understanding storage options is critical for system design interviews and real-world architectures.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">Storage Types</h2>
      <div className="space-y-3">
        {[
          { type: "Block Storage", icon: "💽", desc: "Raw storage volumes. No built-in file system. Used by VMs and databases (EBS, SAN). Fastest and most flexible, but requires OS to manage.", examples: "AWS EBS, Google Persistent Disk", color: "#3b82f6" },
          { type: "File Storage (NAS)", icon: "📁", desc: "Shared filesystem accessible over the network (NFS/SMB). Multiple servers can mount the same filesystem.", examples: "AWS EFS, Azure Files, NAS appliances", color: "#06b6d4" },
          { type: "Object Storage", icon: "🪣", desc: "Store any file as an object with metadata and unique key. No directory structure. Infinitely scalable. Access via HTTP API.", examples: "AWS S3, Google GCS, Cloudflare R2", color: "#8b5cf6" },
          { type: "HDFS", icon: "🗂️", desc: "Hadoop Distributed File System for massive datasets. Splits large files into 128MB blocks across many servers. Fault-tolerant via replication.", examples: "Hadoop clusters, data lakes", color: "#f59e0b" },
        ].map((s) => (
          <div key={s.type} className="p-4 rounded-xl border border-border-ui bg-surface">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{s.icon}</span>
              <div className="font-semibold text-sm font-heading" style={{ color: s.color }}>{s.type}</div>
            </div>
            <p className="text-xs text-txt-2">{s.desc}</p>
            <p className="text-xs text-txt-3 mt-1.5">Examples: {s.examples}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">RAID Levels</h2>
      <ComparisonTable
        title="Common RAID Configurations"
        columns={[
          { key: "raid0", label: "RAID 0", color: "#ef4444" },
          { key: "raid1", label: "RAID 1", color: "#3b82f6" },
          { key: "raid5", label: "RAID 5", color: "#10b981" },
          { key: "raid10", label: "RAID 10", color: "#8b5cf6" },
        ]}
        rows={[
          { feature: "Min Disks", raid0: "2", raid1: "2", raid5: "3", raid10: "4" },
          { feature: "Redundancy", raid0: false, raid1: true, raid5: true, raid10: true },
          { feature: "Usable Space", raid0: "100%", raid1: "50%", raid5: "~67%", raid10: "50%" },
          { feature: "Read Speed", raid0: "Best", raid1: "Good", raid5: "Good", raid10: "Best" },
          { feature: "Write Speed", raid0: "Best", raid1: "Good", raid5: "Slower (parity)", raid10: "Good" },
          { feature: "Fault Tolerance", raid0: "None", raid1: "1 disk", raid5: "1 disk", raid10: "1 per pair" },
        ]}
      />

      <KeyTakeaway variant="important">
        For most cloud-native applications, skip RAID entirely  cloud providers handle redundancy transparently (S3 stores 3 copies across different availability zones). Use RAID only for on-premise or high-performance databases.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
