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
    explanation: "With modular hashing (key % N), adding a server changes N, invalidating ~all cache entries. Consistent hashing only remaps the keys that fall between the old and new server positions  ~1/N of keys.",
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
  {
    question: "In consistent hashing, how is a key mapped to a server?",
    options: [
      "The key is divided by the number of servers and the remainder determines the server",
      "The key is hashed to a position on the ring, then assigned to the first server clockwise from that position",
      "The key is alphabetically sorted and assigned to the server with the matching alphabetical range",
      "The key is randomly assigned to a server, and the mapping is stored in a central lookup table",
    ],
    correct: 1,
    explanation: "In consistent hashing, both keys and servers are mapped to positions on a circular ring (hash space). A key is assigned to the first server encountered by moving clockwise from the key's position. This means adding or removing a server only affects the keys that would have been assigned to that server's clockwise predecessor range.",
  },
  {
    question: "When a server is removed from a consistent hashing ring, which keys need to be remapped?",
    options: [
      "All keys in the entire hash ring",
      "Only the keys that were assigned to the removed server — approximately 1/N of all keys",
      "Keys on adjacent servers must be rebalanced across all remaining servers",
      "No keys need to move — the ring automatically redistributes them",
    ],
    correct: 1,
    explanation: "When a server is removed, only the keys assigned to that server need to move — they are reassigned to the next server clockwise. All other server-to-key assignments remain unchanged. This is the core advantage: O(K/N) key movements (K = total keys, N = servers) instead of O(K) movements with modular hashing.",
  },
  {
    question: "How do virtual nodes allow proportional load distribution for servers with different capacities?",
    options: [
      "Higher-capacity servers get fewer virtual nodes to prevent overload",
      "Higher-capacity servers get more virtual nodes, giving them more ring positions and thus a larger share of keys",
      "Virtual nodes are reassigned dynamically based on real-time CPU metrics",
      "Virtual nodes do not affect load distribution — they only improve fault tolerance",
    ],
    correct: 1,
    explanation: "By assigning more virtual nodes to higher-capacity servers, they occupy more positions on the ring and receive a proportionally larger share of keys. A server with twice the RAM can have twice the virtual nodes, naturally receiving twice the keys and workload without any manual key migration.",
  },
  {
    question: "Which distributed systems use consistent hashing as a core component?",
    options: [
      "Traditional relational databases like PostgreSQL and MySQL",
      "Amazon DynamoDB, Apache Cassandra, and distributed caches like Memcached",
      "Message queues like RabbitMQ and Apache Kafka",
      "Content delivery networks use only round-robin DNS, not consistent hashing",
    ],
    correct: 1,
    explanation: "Consistent hashing is fundamental to distributed key-value stores and caches. Amazon DynamoDB uses it to distribute data across partitions. Cassandra uses it with virtual nodes for token-based ring partitioning. Memcached client libraries use consistent hashing to route cache keys to the correct server with minimal cache invalidation when servers are added or removed.",
  },
  {
    question: "What is the 'cache stampede' problem that consistent hashing helps prevent?",
    options: [
      "A stampede of network packets flooding a cache server",
      "When adding a server with modular hashing invalidates most cache entries, causing a massive surge of cache misses that overwhelm the origin database",
      "When too many users simultaneously read the same cached item",
      "When a cache server fails and all its cached items must be rebuilt at once",
    ],
    correct: 1,
    explanation: "With key % N hashing, adding the Nth server changes the modulus, remapping nearly all keys to different servers. Every remapped key is now a cache miss, generating a sudden flood of requests to the origin database. Consistent hashing limits remapping to ~1/N of keys, keeping cache miss rates manageable during scaling events.",
  },
  {
    question: "What data structure is typically used to implement the consistent hashing ring lookup efficiently?",
    options: [
      "A hash table mapping each key to its server directly",
      "A sorted array or balanced BST of server positions, using binary search to find the next server clockwise",
      "A linked list of servers in ring order",
      "A bloom filter that probabilistically determines which server a key belongs to",
    ],
    correct: 1,
    explanation: "The ring is typically implemented as a sorted array or tree of server positions. When looking up which server owns a key, binary search finds the first server position >= the key's hash in O(log N) time. With virtual nodes, this sorted structure contains all virtual node positions, still offering O(log V) lookup where V is the total number of virtual nodes.",
  },
  {
    question: "If a consistent hashing ring has 3 servers and you add a 4th, approximately what percentage of keys must be remapped?",
    options: [
      "0% — consistent hashing never moves keys",
      "100% — all keys must be remapped when a server is added",
      "25% — approximately 1/N of keys where N is the new server count",
      "75% — all keys not on the new server",
    ],
    correct: 2,
    explanation: "With N servers, adding one new server requires remapping approximately 1/N of the total keys — specifically the keys that fall between the new server's ring position and its predecessor. With 4 servers, ~25% of keys move. This scales as 1/N, so adding a server to a 100-server ring moves only ~1% of keys.",
  },
  {
    question: "What is the primary advantage of consistent hashing in a distributed cache versus a fixed key-to-server mapping stored in a config file?",
    options: [
      "Consistent hashing is easier to configure and requires less operational expertise",
      "Consistent hashing does not require a central coordination point — any node can compute the correct server for a key using only the algorithm and current server list",
      "Consistent hashing provides encryption for cached data",
      "Consistent hashing allows keys to be duplicated across multiple servers automatically",
    ],
    correct: 1,
    explanation: "With a fixed config-file mapping, any server change requires updating and distributing the config to all nodes — a coordination problem. Consistent hashing is a deterministic algorithm: given the same set of server IDs and a key, any node independently computes the same answer. No central lookup table or coordination is required, making the system resilient and easy to scale.",
  },
];

export default function ConsistentHashingContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Consistent hashing</strong> is a technique used by distributed caches and databases to distribute data across nodes while minimizing redistribution when nodes are added or removed. It's the backbone of systems like DynamoDB, Cassandra, and distributed caches.
      </p>
      <p>
        The problem it solves: imagine you have a Redis cluster with 3 nodes. You use <code className="text-accent-2 bg-[#06b6d4]/10 px-1 rounded">key % 3</code> to determine which node holds each key. Now you add a 4th node  suddenly <code className="text-accent-2 bg-[#06b6d4]/10 px-1 rounded">key % 4</code> gives different results, and almost all your cache entries are invalidated. With 10M users, that's a stampede on your database.
      </p>

      <h2 className="text-2xl font-bold font-heading text-txt">The Hash Ring</h2>
      <p className="text-sm">
        Consistent hashing arranges all possible hash values on a circular "ring." Each server is placed at a position on the ring (via hashing the server's ID). A key maps to the first server clockwise from its hash position.
      </p>

      <ConsistentHashingDiagram />

      <h2 className="text-2xl font-bold font-heading text-txt">Virtual Nodes</h2>
      <p className="text-sm">
        Without virtual nodes, key distribution can be uneven  if servers happen to cluster on the ring, some handle more keys than others. Virtual nodes solve this by giving each server multiple positions on the ring.
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
