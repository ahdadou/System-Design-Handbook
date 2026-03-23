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
  {
    question: "What is the key difference between block storage and object storage?",
    options: [
      "Block storage is faster; object storage is slower",
      "Block storage provides raw volumes formatted with a filesystem; object storage stores files as flat objects accessed via HTTP API",
      "Block storage is for databases; object storage is only for backups",
      "Block storage is cloud-only; object storage can be on-premises",
    ],
    correct: 1,
    explanation: "Block storage (EBS) provides raw disk volumes that you format with a filesystem — ideal for databases and VMs needing low-latency random I/O. Object storage (S3) stores files as immutable objects with metadata, accessed via HTTP — infinitely scalable, cheap, but higher latency.",
  },
  {
    question: "Which storage type is best suited for a distributed computing framework analyzing petabytes of log data?",
    options: ["Block storage (SAN)", "NAS file storage", "Object storage (S3)", "HDFS"],
    correct: 3,
    explanation: "HDFS (Hadoop Distributed File System) is designed for batch processing of massive datasets. It splits files into 128MB blocks distributed across many nodes, enabling parallel processing with data locality (compute runs where data lives).",
  },
  {
    question: "What is the 'durability' guarantee of Amazon S3?",
    options: [
      "99.9% (three nines)",
      "99.99% (four nines)",
      "99.999999999% (eleven nines)",
      "100% (no data loss ever)",
    ],
    correct: 2,
    explanation: "Amazon S3 guarantees 99.999999999% (eleven nines) durability by automatically storing multiple copies of each object across at least 3 Availability Zones. This means you'd expect to lose one object per 10 billion objects stored over 10,000 years.",
  },
  {
    question: "When would you choose SSD (NVMe) over HDD storage?",
    options: [
      "When storing large video files that are accessed infrequently",
      "When archiving old data to reduce costs",
      "When running databases or applications requiring low-latency random read/write access",
      "When maximizing storage density per dollar",
    ],
    correct: 2,
    explanation: "SSDs have no moving parts and provide microsecond-level random I/O, making them ideal for databases, caches, and high-performance workloads. HDDs are 10-100x cheaper per GB but have millisecond seek times, making them better for bulk storage and sequential access.",
  },
  {
    question: "What is RAID 10 (RAID 1+0)?",
    options: [
      "Striping with double parity across 10 disks",
      "A combination of mirroring and striping: data is mirrored and then striped across pairs",
      "The fastest RAID level with no redundancy",
      "A software RAID that only works with 10 or more disks",
    ],
    correct: 1,
    explanation: "RAID 10 mirrors data across pairs of disks (RAID 1) and then stripes the mirrored pairs (RAID 0). It provides both redundancy and high performance. It requires at least 4 disks and uses 50% of capacity, but can survive multiple disk failures as long as not both disks in a mirror pair fail.",
  },
  {
    question: "What is the purpose of a write-ahead log (WAL) in database storage?",
    options: [
      "Caching frequently written data in memory before flushing to disk",
      "Recording all changes before applying them, enabling crash recovery and replication",
      "Compressing write operations to reduce I/O",
      "Batching multiple writes into a single disk operation",
    ],
    correct: 1,
    explanation: "WAL writes changes to a sequential log file before applying them to the actual data files. On crash recovery, the database replays the WAL to restore a consistent state. WAL also enables streaming replication by shipping log entries to replica servers.",
  },
  {
    question: "In a cloud-native architecture, why is local (ephemeral) disk storage on compute instances generally avoided for application data?",
    options: [
      "Local disks are too slow for production workloads",
      "Data on local disks is lost when the instance terminates or is replaced",
      "Cloud providers charge extra for local disk storage",
      "Local disks cannot be accessed by containerized applications",
    ],
    correct: 1,
    explanation: "Ephemeral instance storage is lost when the instance stops or is terminated. In cloud-native architectures with auto-scaling and instance replacement, application data must be stored in durable, external storage (S3, EBS, managed databases) that persists independently of compute instances.",
  },
  {
    question: "What is 'tiered storage' in system design?",
    options: [
      "Using RAID levels (0, 1, 5) in combination",
      "Automatically migrating data between fast expensive storage and slow cheap storage based on access frequency",
      "Separating read replicas from write primaries",
      "Encrypting data at different security levels based on sensitivity",
    ],
    correct: 1,
    explanation: "Tiered storage moves frequently accessed ('hot') data to fast, expensive storage (SSD, in-memory) and infrequently accessed ('cold') data to slow, cheap storage (HDD, S3 Glacier). AWS S3 Intelligent-Tiering automates this based on access patterns.",
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
