export interface Topic {
  slug: string;
  title: string;
  description: string;
  readingTime: number;
  chapter: number;
  order: number;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "Networking & Infrastructure",
    description: "Build a solid foundation in networking protocols, infrastructure patterns, and core distributed systems concepts.",
    icon: "Network",
    color: "#3b82f6",
    topics: [
      { slug: "ip-addresses", title: "IP Addresses", description: "IPv4 vs IPv6, public/private, static/dynamic addressing", readingTime: 5, chapter: 1, order: 1 },
      { slug: "osi-model", title: "OSI Model", description: "The 7-layer model of network communication", readingTime: 7, chapter: 1, order: 2 },
      { slug: "tcp-and-udp", title: "TCP and UDP", description: "Transport layer protocols, comparison and use cases", readingTime: 6, chapter: 1, order: 3 },
      { slug: "dns", title: "Domain Name System", description: "DNS resolution flow, server types, record types, caching", readingTime: 8, chapter: 1, order: 4 },
      { slug: "load-balancing", title: "Load Balancing", description: "Algorithms, L4 vs L7, types, redundancy patterns", readingTime: 8, chapter: 1, order: 5 },
      { slug: "clustering", title: "Clustering", description: "Active-active vs active-passive, cluster types", readingTime: 5, chapter: 1, order: 6 },
      { slug: "caching", title: "Caching", description: "Hit/miss, invalidation strategies, eviction policies", readingTime: 9, chapter: 1, order: 7 },
      { slug: "cdn", title: "Content Delivery Network", description: "CDN push vs pull, how CDNs work and their benefits", readingTime: 6, chapter: 1, order: 8 },
      { slug: "proxy", title: "Proxy Servers", description: "Forward vs reverse proxy, comparison with load balancers", readingTime: 5, chapter: 1, order: 9 },
      { slug: "availability", title: "Availability", description: "Nines of availability, fault tolerance, redundancy patterns", readingTime: 6, chapter: 1, order: 10 },
      { slug: "scalability", title: "Scalability", description: "Vertical vs horizontal scaling, tradeoffs and strategies", readingTime: 5, chapter: 1, order: 11 },
      { slug: "storage", title: "Storage", description: "RAID levels, file/block/object storage, NAS, HDFS", readingTime: 7, chapter: 1, order: 12 },
    ],
  },
  {
    id: 2,
    title: "Databases & Data Management",
    description: "Deep dive into SQL, NoSQL, replication, sharding, consistency models, and advanced data management patterns.",
    icon: "Database",
    color: "#06b6d4",
    topics: [
      { slug: "databases-and-dbms", title: "Databases & DBMS", description: "Components, schema, tables, and database fundamentals", readingTime: 5, chapter: 2, order: 1 },
      { slug: "sql-databases", title: "SQL Databases", description: "Relational databases, materialized views, N+1 problem", readingTime: 7, chapter: 2, order: 2 },
      { slug: "nosql-databases", title: "NoSQL Databases", description: "Document, key-value, graph, time-series, wide column databases", readingTime: 8, chapter: 2, order: 3 },
      { slug: "sql-vs-nosql", title: "SQL vs NoSQL", description: "Comparison table, when to use which", readingTime: 5, chapter: 2, order: 4 },
      { slug: "database-replication", title: "Database Replication", description: "Master-slave, master-master, sync vs async replication", readingTime: 7, chapter: 2, order: 5 },
      { slug: "indexes", title: "Database Indexes", description: "Dense vs sparse indexes, B-trees, tradeoffs", readingTime: 6, chapter: 2, order: 6 },
      { slug: "normalization-and-denormalization", title: "Normalization & Denormalization", description: "Normal forms 1NF-BCNF, keys, anomalies", readingTime: 8, chapter: 2, order: 7 },
      { slug: "acid-and-base", title: "ACID and BASE", description: "Consistency models for distributed and traditional databases", readingTime: 6, chapter: 2, order: 8 },
      { slug: "cap-theorem", title: "CAP Theorem", description: "Consistency, availability, partition tolerance tradeoffs", readingTime: 7, chapter: 2, order: 9 },
      { slug: "pacelc-theorem", title: "PACELC Theorem", description: "Extension of CAP with latency considerations", readingTime: 5, chapter: 2, order: 10 },
      { slug: "transactions", title: "Transactions", description: "Transaction states, ACID properties, isolation levels", readingTime: 6, chapter: 2, order: 11 },
      { slug: "distributed-transactions", title: "Distributed Transactions", description: "2PC, 3PC, Sagas with choreography/orchestration", readingTime: 8, chapter: 2, order: 12 },
      { slug: "sharding", title: "Sharding", description: "Hash, list, range, composite partitioning strategies", readingTime: 7, chapter: 2, order: 13 },
      { slug: "consistent-hashing", title: "Consistent Hashing", description: "Hash ring, virtual nodes, minimal redistribution", readingTime: 8, chapter: 2, order: 14 },
      { slug: "database-federation", title: "Database Federation", description: "Functional partitioning across multiple databases", readingTime: 5, chapter: 2, order: 15 },
    ],
  },
  {
    id: 3,
    title: "System Architecture & Communication",
    description: "Master architectural patterns from monoliths to microservices, messaging systems, APIs, and real-time communication.",
    icon: "Layers",
    color: "#8b5cf6",
    topics: [
      { slug: "n-tier-architecture", title: "N-Tier Architecture", description: "Multi-layer application architecture patterns", readingTime: 5, chapter: 3, order: 1 },
      { slug: "message-brokers", title: "Message Brokers", description: "Intermediaries for async communication between services", readingTime: 6, chapter: 3, order: 2 },
      { slug: "message-queues", title: "Message Queues", description: "FIFO messaging, persistence, delivery guarantees", readingTime: 6, chapter: 3, order: 3 },
      { slug: "publish-subscribe", title: "Publish-Subscribe", description: "Pub/Sub pattern, topics, subscribers, fan-out", readingTime: 6, chapter: 3, order: 4 },
      { slug: "enterprise-service-bus", title: "Enterprise Service Bus", description: "ESB architecture for enterprise integration", readingTime: 5, chapter: 3, order: 5 },
      { slug: "monoliths-and-microservices", title: "Monoliths and Microservices", description: "Architecture comparison, when to use each", readingTime: 8, chapter: 3, order: 6 },
      { slug: "event-driven-architecture", title: "Event-Driven Architecture", description: "EDA patterns, event producers and consumers", readingTime: 6, chapter: 3, order: 7 },
      { slug: "event-sourcing", title: "Event Sourcing", description: "Storing events as the source of truth", readingTime: 6, chapter: 3, order: 8 },
      { slug: "cqrs", title: "CQRS", description: "Command and Query Responsibility Segregation", readingTime: 6, chapter: 3, order: 9 },
      { slug: "api-gateway", title: "API Gateway", description: "Single entry point, routing, auth, rate limiting", readingTime: 6, chapter: 3, order: 10 },
      { slug: "rest-graphql-grpc", title: "REST, GraphQL, gRPC", description: "API paradigm comparison, use cases", readingTime: 8, chapter: 3, order: 11 },
      { slug: "long-polling-websockets-sse", title: "Long Polling, WebSockets, SSE", description: "Real-time communication patterns", readingTime: 7, chapter: 3, order: 12 },
    ],
  },
  {
    id: 4,
    title: "Advanced Concepts & Security",
    description: "Explore advanced distributed systems patterns, security protocols, and reliability engineering.",
    icon: "Shield",
    color: "#f59e0b",
    topics: [
      { slug: "geohashing-and-quadtrees", title: "Geohashing & Quadtrees", description: "Spatial indexing for location-based systems", readingTime: 6, chapter: 4, order: 1 },
      { slug: "circuit-breaker", title: "Circuit Breaker", description: "Fault tolerance pattern for distributed systems", readingTime: 6, chapter: 4, order: 2 },
      { slug: "rate-limiting", title: "Rate Limiting", description: "Token bucket, leaky bucket, fixed/sliding window algorithms", readingTime: 7, chapter: 4, order: 3 },
      { slug: "service-discovery", title: "Service Discovery", description: "Client-side and server-side discovery patterns", readingTime: 5, chapter: 4, order: 4 },
      { slug: "sla-slo-sli", title: "SLA, SLO, SLI", description: "Service reliability metrics and agreements", readingTime: 5, chapter: 4, order: 5 },
      { slug: "disaster-recovery", title: "Disaster Recovery", description: "Cold, warm, hot site strategies, RTO and RPO", readingTime: 6, chapter: 4, order: 6 },
      { slug: "virtual-machines-vs-containers", title: "VMs vs Containers", description: "Virtualization comparison, Docker, orchestration", readingTime: 6, chapter: 4, order: 7 },
      { slug: "oauth-and-openid", title: "OAuth 2.0 & OpenID Connect", description: "Authorization and identity protocols", readingTime: 7, chapter: 4, order: 8 },
      { slug: "single-sign-on", title: "Single Sign-On (SSO)", description: "SSO patterns, SAML, federated identity", readingTime: 5, chapter: 4, order: 9 },
      { slug: "ssl-tls-mtls", title: "SSL, TLS, mTLS", description: "Encryption protocols, certificates, mutual authentication", readingTime: 6, chapter: 4, order: 10 },
    ],
  },
  {
    id: 5,
    title: "Real-World Case Studies",
    description: "Apply everything you've learned by designing complete systems from scratch using real-world examples.",
    icon: "Rocket",
    color: "#10b981",
    topics: [
      { slug: "system-design-interview-tips", title: "Interview Tips & Framework", description: "Structured approach to system design interviews", readingTime: 8, chapter: 5, order: 1 },
      { slug: "url-shortener", title: "URL Shortener", description: "Design a scalable URL shortening service like bit.ly", readingTime: 12, chapter: 5, order: 2 },
      { slug: "whatsapp", title: "WhatsApp", description: "Design a global messaging platform for billions", readingTime: 15, chapter: 5, order: 3 },
      { slug: "twitter", title: "Twitter", description: "Design a social media feed and timeline system", readingTime: 15, chapter: 5, order: 4 },
      { slug: "netflix", title: "Netflix", description: "Design a global video streaming platform", readingTime: 15, chapter: 5, order: 5 },
      { slug: "uber", title: "Uber", description: "Design a real-time ride-sharing platform", readingTime: 15, chapter: 5, order: 6 },
    ],
  },
];

export function getChapter(id: number): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getTopic(chapterId: number, slug: string): Topic | undefined {
  const chapter = getChapter(chapterId);
  return chapter?.topics.find((t) => t.slug === slug);
}

export function getNextTopic(chapterId: number, slug: string): { chapter: number; topic: Topic } | undefined {
  const chapter = getChapter(chapterId);
  if (!chapter) return undefined;

  const topicIndex = chapter.topics.findIndex((t) => t.slug === slug);

  if (topicIndex < chapter.topics.length - 1) {
    return { chapter: chapterId, topic: chapter.topics[topicIndex + 1] };
  }

  // Go to next chapter
  const nextChapter = getChapter(chapterId + 1);
  if (nextChapter && nextChapter.topics.length > 0) {
    return { chapter: nextChapter.id, topic: nextChapter.topics[0] };
  }

  return undefined;
}

export function getPrevTopic(chapterId: number, slug: string): { chapter: number; topic: Topic } | undefined {
  const chapter = getChapter(chapterId);
  if (!chapter) return undefined;

  const topicIndex = chapter.topics.findIndex((t) => t.slug === slug);

  if (topicIndex > 0) {
    return { chapter: chapterId, topic: chapter.topics[topicIndex - 1] };
  }

  // Go to prev chapter
  const prevChapter = getChapter(chapterId - 1);
  if (prevChapter && prevChapter.topics.length > 0) {
    return { chapter: prevChapter.id, topic: prevChapter.topics[prevChapter.topics.length - 1] };
  }

  return undefined;
}

export function getAllTopics(): Array<Topic & { chapterId: number }> {
  return CHAPTERS.flatMap((c) => c.topics.map((t) => ({ ...t, chapterId: c.id })));
}
