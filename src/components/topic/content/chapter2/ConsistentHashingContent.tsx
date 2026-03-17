"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { ConsistentHashingDiagram } from "@/components/diagrams/hashing/ConsistentHashingDiagram";

const questions = [
  {
    question: "What problem does consistent hashing solve compared to simple modular hashing (key % N)?",
    options: [
      "Consistent hashing is faster",
      "When adding/removing servers, consistent hashing only remaps ~1/N keys instead of almost all keys",
      "Consistent hashing provides better data encryption",
      "Consistent hashing eliminates hot spots",
    ],
    correct: 1,
    explanation: "With modular hashing (key % N), adding a server changes N, invalidating ~all cache entries. Consistent hashing only remaps the keys that fall between the old and new server positions — ~1/N of keys.",
  },
  {
    question: "What are virtual nodes in consistent hashing?",
    options: [
      "Virtual machines running the hash function",
      "Multiple positions on the ring assigned to each physical server",
      "Backup nodes that activate on failure",
      "Nodes that only handle cache misses",
    ],
    correct: 1,
    explanation: "Virtual nodes give each physical server multiple positions on the ring. This distributes load more evenly (a server with 3x the capacity gets 3x the virtual nodes) and handles uneven key distribution.",
  },
];

export default function ConsistentHashingContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Consistent hashing</strong> is a technique used by distributed caches and databases to distribute data across nodes while minimizing redistribution when nodes are added or removed. It's the backbone of systems like DynamoDB, Cassandra, and distributed caches.
      </p>
      <p>
        The problem it solves: imagine you have a Redis cluster with 3 nodes. You use <code className="text-accent-2 bg-[#06b6d4]/10 px-1 rounded">key % 3</code> to determine which node holds each key. Now you add a 4th node — suddenly <code className="text-accent-2 bg-[#06b6d4]/10 px-1 rounded">key % 4</code> gives different results, and almost all your cache entries are invalidated. With 10M users, that's a stampede on your database.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">The Hash Ring</h2>
      <p className="text-sm">
        Consistent hashing arranges all possible hash values on a circular "ring." Each server is placed at a position on the ring (via hashing the server's ID). A key maps to the first server clockwise from its hash position.
      </p>

      <ConsistentHashingDiagram />

      <h2 className="text-2xl font-bold font-heading text-txt">Virtual Nodes</h2>
      <p className="text-sm">
        Without virtual nodes, key distribution can be uneven — if servers happen to cluster on the ring, some handle more keys than others. Virtual nodes solve this by giving each server multiple positions on the ring.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30">
          <div className="font-bold text-[#ef4444] text-sm font-heading mb-2">Without Virtual Nodes</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Uneven key distribution</li>
            <li>• Some servers overloaded</li>
            <li>• Large key migration when adding servers</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30">
          <div className="font-bold text-c-success text-sm font-heading mb-2">With Virtual Nodes</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Even load distribution</li>
            <li>• Proportional capacity assignment</li>
            <li>• Smaller, more evenly spread migrations</li>
          </ul>
        </div>
      </div>

      <KeyTakeaway variant="important">
        Amazon DynamoDB uses consistent hashing internally. When you add a new DynamoDB partition, only ~1/N items need to move. This is what allows DynamoDB to scale seamlessly without downtime.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
