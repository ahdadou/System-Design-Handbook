export interface Topic {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  seoDescription: string;
  keywords: string[];
  readingTime: number;
  chapter: number;
  order: number;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  seoDescription: string;
  keywords: string[];
  icon: string;
  color: string;
  topics: Topic[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "Networking & Infrastructure",
    description: "Build a solid foundation in networking protocols, infrastructure patterns, and core distributed systems concepts.",
    seoDescription: "Learn networking fundamentals for system design: IP addresses, OSI model, TCP/UDP, DNS, load balancing, caching, CDN, and scalability. Interactive diagrams included.",
    keywords: ["networking system design", "infrastructure system design", "distributed systems fundamentals", "system design networking basics"],
    icon: "Network",
    color: "#3b82f6",
    topics: [
      {
        slug: "ip-addresses",
        title: "IP Addresses",
        seoTitle: "IP Addresses in System Design  IPv4, IPv6, Public vs Private",
        description: "IPv4 vs IPv6, public/private, static/dynamic addressing",
        seoDescription: "Learn how IP addresses work in system design: IPv4 vs IPv6, public vs private IPs, static vs dynamic addressing, subnetting, and CIDR notation explained with diagrams.",
        keywords: ["IP addresses system design", "IPv4 vs IPv6", "public private IP address", "static dynamic IP", "IP addressing subnetting", "CIDR notation", "network addressing"],
        readingTime: 5, chapter: 1, order: 1
      },
      {
        slug: "osi-model",
        title: "OSI Model",
        seoTitle: "OSI Model Explained  All 7 Layers with System Design Examples",
        description: "The 7-layer model of network communication",
        seoDescription: "Master the OSI model for system design interviews: understand all 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application) with real-world examples.",
        keywords: ["OSI model system design", "OSI 7 layers explained", "network layers", "OSI vs TCP/IP model", "application layer transport layer", "network protocol stack", "OSI model interview"],
        readingTime: 7, chapter: 1, order: 2
      },
      {
        slug: "tcp-and-udp",
        title: "TCP and UDP",
        seoTitle: "TCP vs UDP in System Design  When to Use Each Protocol",
        description: "Transport layer protocols, comparison and use cases",
        seoDescription: "Understand TCP vs UDP for system design: TCP's reliable 3-way handshake vs UDP's low-latency delivery. Learn when to choose each protocol with practical use cases.",
        keywords: ["TCP vs UDP system design", "TCP handshake", "UDP protocol", "reliable vs unreliable transport", "transport layer protocol", "TCP connection", "when to use UDP"],
        readingTime: 6, chapter: 1, order: 3
      },
      {
        slug: "dns",
        title: "Domain Name System",
        seoTitle: "DNS in System Design  How Domain Name Resolution Works",
        description: "DNS resolution flow, server types, record types, caching",
        seoDescription: "Learn how DNS works in system design: recursive vs iterative resolution, authoritative name servers, A/CNAME/MX records, TTL, DNS caching, and load balancing with DNS.",
        keywords: ["DNS system design", "domain name system explained", "DNS resolution flow", "DNS records types", "authoritative name server", "DNS caching", "DNS load balancing", "how DNS works"],
        readingTime: 8, chapter: 1, order: 4
      },
      {
        slug: "load-balancing",
        title: "Load Balancing",
        seoTitle: "Load Balancing in System Design  Algorithms, L4 vs L7, Types",
        description: "Algorithms, L4 vs L7, types, redundancy patterns",
        seoDescription: "Master load balancing for system design: round robin, least connections, IP hash algorithms. L4 vs L7 load balancers, horizontal scaling, health checks, and sticky sessions.",
        keywords: ["load balancing system design", "load balancer algorithms", "round robin load balancing", "L4 vs L7 load balancer", "horizontal scaling", "load balancer types", "sticky sessions", "load balancing interview"],
        readingTime: 8, chapter: 1, order: 5
      },
      {
        slug: "clustering",
        title: "Clustering",
        seoTitle: "Clustering in System Design  Active-Active vs Active-Passive",
        description: "Active-active vs active-passive, cluster types",
        seoDescription: "Learn server clustering for system design: active-active vs active-passive clusters, high availability clusters, failover strategies, and cluster coordination patterns.",
        keywords: ["clustering system design", "active-active vs active-passive", "high availability cluster", "server cluster", "failover cluster", "cluster types", "distributed clustering"],
        readingTime: 5, chapter: 1, order: 6
      },
      {
        slug: "caching",
        title: "Caching",
        seoTitle: "Caching in System Design  Strategies, Eviction, and Patterns",
        description: "Hit/miss, invalidation strategies, eviction policies",
        seoDescription: "Master caching for system design interviews: cache-aside, write-through, write-behind, read-through strategies. LRU/LFU eviction, cache invalidation, Redis vs Memcached.",
        keywords: ["caching system design", "cache invalidation strategies", "LRU cache eviction", "cache-aside pattern", "write-through cache", "Redis caching", "distributed cache", "cache hit miss", "caching interview question"],
        readingTime: 9, chapter: 1, order: 7
      },
      {
        slug: "cdn",
        title: "Content Delivery Network",
        seoTitle: "CDN in System Design  How Content Delivery Networks Work",
        description: "CDN push vs pull, how CDNs work and their benefits",
        seoDescription: "Learn CDN in system design: how content delivery networks reduce latency, CDN push vs pull models, edge servers, origin servers, cache invalidation, and when to use a CDN.",
        keywords: ["CDN system design", "content delivery network explained", "CDN push vs pull", "edge servers CDN", "how CDN works", "CloudFront CDN", "CDN caching", "CDN latency reduction"],
        readingTime: 6, chapter: 1, order: 8
      },
      {
        slug: "proxy",
        title: "Proxy Servers",
        seoTitle: "Forward vs Reverse Proxy in System Design  Key Differences",
        description: "Forward vs reverse proxy, comparison with load balancers",
        seoDescription: "Understand forward vs reverse proxy servers in system design: anonymity, caching, SSL termination, and how reverse proxies differ from load balancers. Nginx and HAProxy examples.",
        keywords: ["proxy server system design", "forward vs reverse proxy", "reverse proxy", "nginx reverse proxy", "proxy vs load balancer", "SSL termination proxy", "api gateway proxy"],
        readingTime: 5, chapter: 1, order: 9
      },
      {
        slug: "availability",
        title: "Availability",
        seoTitle: "High Availability in System Design  Nines, Fault Tolerance, Redundancy",
        description: "Nines of availability, fault tolerance, redundancy patterns",
        seoDescription: "Master availability for system design: five nines (99.999%), fault tolerance, redundancy patterns, MTTF/MTTR, active-passive failover, and designing for high availability.",
        keywords: ["high availability system design", "five nines availability", "99.999% uptime", "fault tolerance", "redundancy system design", "MTTF MTTR", "availability vs reliability", "HA system design"],
        readingTime: 6, chapter: 1, order: 10
      },
      {
        slug: "scalability",
        title: "Scalability",
        seoTitle: "Scalability in System Design  Horizontal vs Vertical Scaling",
        description: "Vertical vs horizontal scaling, tradeoffs and strategies",
        seoDescription: "Learn scalability in system design: horizontal vs vertical scaling, scale-up vs scale-out, auto-scaling, stateless services, database scaling, and designing scalable systems.",
        keywords: ["scalability system design", "horizontal vs vertical scaling", "scale out vs scale up", "auto scaling", "stateless services", "database scalability", "how to scale a system", "scalability interview"],
        readingTime: 5, chapter: 1, order: 11
      },
      {
        slug: "storage",
        title: "Storage",
        seoTitle: "Storage in System Design  Block, Object, File Storage and RAID",
        description: "RAID levels, file/block/object storage, NAS, HDFS",
        seoDescription: "Learn storage systems for system design: block vs file vs object storage, RAID levels (0,1,5,10), NAS, SAN, HDFS, S3 object storage, and choosing the right storage type.",
        keywords: ["storage system design", "block vs object vs file storage", "RAID levels explained", "object storage S3", "HDFS distributed storage", "NAS SAN storage", "storage types comparison"],
        readingTime: 7, chapter: 1, order: 12
      },
    ],
  },
  {
    id: 2,
    title: "Databases & Data Management",
    description: "Deep dive into SQL, NoSQL, replication, sharding, consistency models, and advanced data management patterns.",
    seoDescription: "Master databases for system design: SQL vs NoSQL, replication, sharding, indexing, ACID/BASE, CAP theorem, consistent hashing, and distributed transactions.",
    keywords: ["database system design", "SQL NoSQL system design", "distributed database", "data management system design"],
    icon: "Database",
    color: "#06b6d4",
    topics: [
      {
        slug: "databases-and-dbms",
        title: "Databases & DBMS",
        seoTitle: "Databases and DBMS in System Design  Fundamentals Explained",
        description: "Components, schema, tables, and database fundamentals",
        seoDescription: "Learn database fundamentals for system design: DBMS components, schemas, tables, views, stored procedures, ACID properties, and how databases are organized internally.",
        keywords: ["database system design", "DBMS components", "database fundamentals", "relational database basics", "database schema", "what is a database", "DBMS system design interview"],
        readingTime: 5, chapter: 2, order: 1
      },
      {
        slug: "sql-databases",
        title: "SQL Databases",
        seoTitle: "SQL Databases in System Design  Relational DB, N+1, Materialized Views",
        description: "Relational databases, materialized views, N+1 problem",
        seoDescription: "Master SQL databases for system design: relational models, joins, the N+1 query problem, materialized views, stored procedures, OLTP vs OLAP, and when to use SQL.",
        keywords: ["SQL database system design", "relational database system design", "N+1 query problem", "materialized views", "SQL OLTP OLAP", "PostgreSQL MySQL system design", "SQL interview questions"],
        readingTime: 7, chapter: 2, order: 2
      },
      {
        slug: "nosql-databases",
        title: "NoSQL Databases",
        seoTitle: "NoSQL Databases in System Design  Types, Use Cases, Examples",
        description: "Document, key-value, graph, time-series, wide column databases",
        seoDescription: "Learn all NoSQL database types for system design: document (MongoDB), key-value (Redis, DynamoDB), wide-column (Cassandra), graph (Neo4j), and time-series databases with use cases.",
        keywords: ["NoSQL database system design", "MongoDB system design", "Redis system design", "Cassandra system design", "document database", "key-value store", "graph database", "wide column database", "DynamoDB system design"],
        readingTime: 8, chapter: 2, order: 3
      },
      {
        slug: "sql-vs-nosql",
        title: "SQL vs NoSQL",
        seoTitle: "SQL vs NoSQL in System Design  When to Choose Which Database",
        description: "Comparison table, when to use which",
        seoDescription: "SQL vs NoSQL for system design: detailed comparison of consistency, scalability, schema flexibility, query patterns. Learn when to choose relational vs non-relational databases.",
        keywords: ["SQL vs NoSQL system design", "when to use NoSQL", "relational vs non-relational database", "SQL NoSQL comparison", "choosing a database system design", "SQL NoSQL tradeoffs"],
        readingTime: 5, chapter: 2, order: 4
      },
      {
        slug: "database-replication",
        title: "Database Replication",
        seoTitle: "Database Replication in System Design  Master-Slave, Sync vs Async",
        description: "Master-slave, master-master, sync vs async replication",
        seoDescription: "Master database replication for system design: master-slave (primary-replica), master-master replication, synchronous vs asynchronous replication, read replicas, and replication lag.",
        keywords: ["database replication system design", "master slave replication", "primary replica replication", "master master replication", "synchronous asynchronous replication", "read replica", "replication lag", "database HA"],
        readingTime: 7, chapter: 2, order: 5
      },
      {
        slug: "indexes",
        title: "Database Indexes",
        seoTitle: "Database Indexes in System Design  B-Tree, Dense vs Sparse Indexes",
        description: "Dense vs sparse indexes, B-trees, tradeoffs",
        seoDescription: "Learn database indexing for system design: B-tree indexes, dense vs sparse indexes, composite indexes, covering indexes, index tradeoffs, and how indexing speeds up queries.",
        keywords: ["database index system design", "B-tree index", "dense vs sparse index", "composite index", "database indexing explained", "how indexes work", "index tradeoffs", "covering index"],
        readingTime: 6, chapter: 2, order: 6
      },
      {
        slug: "normalization-and-denormalization",
        title: "Normalization & Denormalization",
        seoTitle: "Database Normalization in System Design  1NF, 2NF, 3NF, BCNF",
        description: "Normal forms 1NF-BCNF, keys, anomalies",
        seoDescription: "Learn database normalization and denormalization for system design: 1NF, 2NF, 3NF, BCNF normal forms, data anomalies, when to denormalize for performance, and practical tradeoffs.",
        keywords: ["database normalization system design", "1NF 2NF 3NF BCNF", "normalization vs denormalization", "database anomalies", "normal forms explained", "when to denormalize", "database design normalization"],
        readingTime: 8, chapter: 2, order: 7
      },
      {
        slug: "acid-and-base",
        title: "ACID and BASE",
        seoTitle: "ACID vs BASE in System Design  Consistency Models Explained",
        description: "Consistency models for distributed and traditional databases",
        seoDescription: "Understand ACID vs BASE consistency models for system design: Atomicity, Consistency, Isolation, Durability vs Basically Available, Soft state, Eventually consistent databases.",
        keywords: ["ACID properties system design", "BASE consistency model", "ACID vs BASE", "eventual consistency", "database consistency models", "atomicity consistency isolation durability", "distributed consistency"],
        readingTime: 6, chapter: 2, order: 8
      },
      {
        slug: "cap-theorem",
        title: "CAP Theorem",
        seoTitle: "CAP Theorem in System Design  Consistency, Availability, Partition Tolerance",
        description: "Consistency, availability, partition tolerance tradeoffs",
        seoDescription: "Master the CAP theorem for system design: why you can only choose 2 of 3 (Consistency, Availability, Partition Tolerance), CP vs AP systems, and real-world database examples.",
        keywords: ["CAP theorem system design", "consistency availability partition tolerance", "CAP theorem explained", "CP vs AP systems", "distributed systems CAP", "CAP theorem databases", "CAP theorem interview"],
        readingTime: 7, chapter: 2, order: 9
      },
      {
        slug: "pacelc-theorem",
        title: "PACELC Theorem",
        seoTitle: "PACELC Theorem in System Design  Beyond CAP with Latency",
        description: "Extension of CAP with latency considerations",
        seoDescription: "Learn the PACELC theorem for system design: an extension of CAP that considers latency vs consistency tradeoffs even when no partition occurs. Compare distributed database choices.",
        keywords: ["PACELC theorem system design", "PACELC vs CAP theorem", "latency consistency tradeoff", "distributed database tradeoffs", "PACELC explained", "partition latency consistency availability"],
        readingTime: 5, chapter: 2, order: 10
      },
      {
        slug: "transactions",
        title: "Transactions",
        seoTitle: "Database Transactions in System Design  ACID, Isolation Levels",
        description: "Transaction states, ACID properties, isolation levels",
        seoDescription: "Learn database transactions for system design: transaction states, ACID guarantees, isolation levels (read uncommitted, read committed, repeatable read, serializable), and concurrency control.",
        keywords: ["database transactions system design", "transaction isolation levels", "ACID transactions", "serializable isolation", "read committed", "repeatable read", "concurrency control database", "transaction management"],
        readingTime: 6, chapter: 2, order: 11
      },
      {
        slug: "distributed-transactions",
        title: "Distributed Transactions",
        seoTitle: "Distributed Transactions in System Design  2PC, Saga Pattern",
        description: "2PC, 3PC, Sagas with choreography/orchestration",
        seoDescription: "Master distributed transactions for system design: Two-Phase Commit (2PC), Three-Phase Commit (3PC), Saga pattern with choreography and orchestration. Handle failures across microservices.",
        keywords: ["distributed transactions system design", "two phase commit 2PC", "saga pattern system design", "choreography orchestration saga", "distributed ACID", "microservices transactions", "3PC commit protocol"],
        readingTime: 8, chapter: 2, order: 12
      },
      {
        slug: "sharding",
        title: "Sharding",
        seoTitle: "Database Sharding in System Design  Hash, Range, List Partitioning",
        description: "Hash, list, range, composite partitioning strategies",
        seoDescription: "Learn database sharding for system design: horizontal partitioning strategies (hash, range, list, composite), choosing a shard key, cross-shard queries, and hotspot problems.",
        keywords: ["database sharding system design", "horizontal partitioning", "shard key selection", "hash sharding", "range sharding", "database partitioning strategies", "sharding hotspot", "sharding interview"],
        readingTime: 7, chapter: 2, order: 13
      },
      {
        slug: "consistent-hashing",
        title: "Consistent Hashing",
        seoTitle: "Consistent Hashing in System Design  Hash Ring and Virtual Nodes",
        description: "Hash ring, virtual nodes, minimal redistribution",
        seoDescription: "Master consistent hashing for system design: how the hash ring works, virtual nodes for load distribution, minimal key redistribution when nodes join/leave, and real-world use cases.",
        keywords: ["consistent hashing system design", "hash ring system design", "virtual nodes consistent hashing", "consistent hashing algorithm", "DHT distributed hash table", "consistent hashing interview", "load distribution hashing"],
        readingTime: 8, chapter: 2, order: 14
      },
      {
        slug: "database-federation",
        title: "Database Federation",
        seoTitle: "Database Federation in System Design  Functional Partitioning",
        description: "Functional partitioning across multiple databases",
        seoDescription: "Learn database federation for system design: splitting databases by function (user DB, product DB, orders DB), reducing read/write traffic, and polyglot persistence patterns.",
        keywords: ["database federation system design", "functional partitioning database", "polyglot persistence", "database splitting", "federated database", "database decomposition microservices"],
        readingTime: 5, chapter: 2, order: 15
      },
    ],
  },
  {
    id: 3,
    title: "System Architecture & Communication",
    description: "Master architectural patterns from monoliths to microservices, messaging systems, APIs, and real-time communication.",
    seoDescription: "Learn system architecture for interviews: microservices, message queues, pub/sub, event-driven architecture, API gateway, REST/GraphQL/gRPC, WebSockets, and CQRS.",
    keywords: ["system architecture design", "microservices architecture", "messaging system design", "API design system design"],
    icon: "Layers",
    color: "#8b5cf6",
    topics: [
      {
        slug: "n-tier-architecture",
        title: "N-Tier Architecture",
        seoTitle: "N-Tier Architecture in System Design  2-Tier, 3-Tier Patterns",
        description: "Multi-layer application architecture patterns",
        seoDescription: "Learn N-Tier architecture for system design: 2-tier, 3-tier, and multi-tier patterns. Presentation, business logic, and data layers  separation of concerns and scalability tradeoffs.",
        keywords: ["N-tier architecture system design", "3-tier architecture", "multi-tier architecture", "presentation layer business logic", "layered architecture pattern", "MVC architecture"],
        readingTime: 5, chapter: 3, order: 1
      },
      {
        slug: "message-brokers",
        title: "Message Brokers",
        seoTitle: "Message Brokers in System Design  Kafka, RabbitMQ Explained",
        description: "Intermediaries for async communication between services",
        seoDescription: "Learn message brokers for system design: how brokers decouple services, Apache Kafka vs RabbitMQ, message routing, delivery guarantees, and async communication patterns.",
        keywords: ["message broker system design", "Apache Kafka system design", "RabbitMQ system design", "async messaging system design", "message broker vs queue", "event streaming platform", "Kafka vs RabbitMQ"],
        readingTime: 6, chapter: 3, order: 2
      },
      {
        slug: "message-queues",
        title: "Message Queues",
        seoTitle: "Message Queues in System Design  FIFO, Delivery Guarantees, SQS",
        description: "FIFO messaging, persistence, delivery guarantees",
        seoDescription: "Master message queues for system design: FIFO ordering, at-least-once vs exactly-once delivery, dead letter queues, Amazon SQS, backpressure handling, and queue-based load leveling.",
        keywords: ["message queue system design", "FIFO message queue", "Amazon SQS system design", "dead letter queue", "at-least-once delivery", "message queue vs pub sub", "queue-based load leveling"],
        readingTime: 6, chapter: 3, order: 3
      },
      {
        slug: "publish-subscribe",
        title: "Publish-Subscribe",
        seoTitle: "Pub/Sub Pattern in System Design  Topics, Subscribers, Fan-out",
        description: "Pub/Sub pattern, topics, subscribers, fan-out",
        seoDescription: "Learn the publish-subscribe pattern for system design: topics vs queues, fan-out messaging, event-driven decoupling, Kafka topics, Google Pub/Sub, and push vs pull subscriptions.",
        keywords: ["publish subscribe system design", "pub sub pattern", "pub sub vs message queue", "fan-out messaging", "event driven pub sub", "Kafka pub sub", "Google Pub Sub system design"],
        readingTime: 6, chapter: 3, order: 4
      },
      {
        slug: "enterprise-service-bus",
        title: "Enterprise Service Bus",
        seoTitle: "Enterprise Service Bus (ESB) in System Design  SOA Integration",
        description: "ESB architecture for enterprise integration",
        seoDescription: "Understand Enterprise Service Bus (ESB) for system design: SOA integration patterns, message routing, transformation, orchestration, and when to use ESB vs microservices.",
        keywords: ["enterprise service bus ESB", "ESB system design", "SOA architecture", "service oriented architecture", "ESB vs microservices", "message routing ESB", "enterprise integration patterns"],
        readingTime: 5, chapter: 3, order: 5
      },
      {
        slug: "monoliths-and-microservices",
        title: "Monoliths and Microservices",
        seoTitle: "Microservices vs Monolith in System Design  When to Use Each",
        description: "Architecture comparison, when to use each",
        seoDescription: "Compare microservices vs monolithic architecture for system design: deployment, scalability, team autonomy, data management, service mesh, and when to migrate from monolith to microservices.",
        keywords: ["microservices vs monolith system design", "microservices architecture", "monolithic architecture", "when to use microservices", "service decomposition", "microservices interview", "monolith to microservices migration"],
        readingTime: 8, chapter: 3, order: 6
      },
      {
        slug: "event-driven-architecture",
        title: "Event-Driven Architecture",
        seoTitle: "Event-Driven Architecture in System Design  EDA Patterns",
        description: "EDA patterns, event producers and consumers",
        seoDescription: "Master event-driven architecture (EDA) for system design: event producers, consumers, event brokers, choreography vs orchestration, event streams, and building reactive systems.",
        keywords: ["event driven architecture system design", "EDA system design", "event sourcing architecture", "event producers consumers", "reactive systems design", "event streaming system design", "event driven microservices"],
        readingTime: 6, chapter: 3, order: 7
      },
      {
        slug: "event-sourcing",
        title: "Event Sourcing",
        seoTitle: "Event Sourcing in System Design  Event Store, Replay, CQRS",
        description: "Storing events as the source of truth",
        seoDescription: "Learn event sourcing for system design: storing all state changes as events, event replay, event store databases, combining with CQRS, temporal queries, and audit logs.",
        keywords: ["event sourcing system design", "event sourcing pattern", "event store database", "event sourcing CQRS", "event replay system design", "audit log event sourcing", "event driven event sourcing"],
        readingTime: 6, chapter: 3, order: 8
      },
      {
        slug: "cqrs",
        title: "CQRS",
        seoTitle: "CQRS in System Design  Command Query Responsibility Segregation",
        description: "Command and Query Responsibility Segregation",
        seoDescription: "Learn CQRS (Command Query Responsibility Segregation) for system design: separating read and write models, eventual consistency, combining with event sourcing, and performance benefits.",
        keywords: ["CQRS system design", "command query responsibility segregation", "CQRS pattern", "CQRS event sourcing", "read write model separation", "CQRS microservices", "CQRS interview question"],
        readingTime: 6, chapter: 3, order: 9
      },
      {
        slug: "api-gateway",
        title: "API Gateway",
        seoTitle: "API Gateway in System Design  Routing, Auth, Rate Limiting",
        description: "Single entry point, routing, auth, rate limiting",
        seoDescription: "Master API gateway for system design: single entry point for microservices, request routing, authentication, rate limiting, load balancing, and API composition. AWS API Gateway, Kong examples.",
        keywords: ["API gateway system design", "API gateway pattern", "AWS API gateway", "Kong API gateway", "API gateway vs load balancer", "microservices API gateway", "reverse proxy API gateway"],
        readingTime: 6, chapter: 3, order: 10
      },
      {
        slug: "rest-graphql-grpc",
        title: "REST, GraphQL, gRPC",
        seoTitle: "REST vs GraphQL vs gRPC in System Design  API Design Comparison",
        description: "API paradigm comparison, use cases",
        seoDescription: "Compare REST vs GraphQL vs gRPC for system design: HTTP methods, overfetching/underfetching, Protocol Buffers, bidirectional streaming, and which API style to choose when.",
        keywords: ["REST vs GraphQL vs gRPC system design", "REST API system design", "GraphQL system design", "gRPC system design", "API design comparison", "REST API interview", "GraphQL vs REST", "protocol buffers gRPC"],
        readingTime: 8, chapter: 3, order: 11
      },
      {
        slug: "long-polling-websockets-sse",
        title: "Long Polling, WebSockets, SSE",
        seoTitle: "WebSockets vs Long Polling vs SSE in System Design  Real-Time Comms",
        description: "Real-time communication patterns",
        seoDescription: "Learn real-time communication for system design: short polling, long polling, WebSockets (full-duplex), Server-Sent Events (SSE), and when to use each for chat, notifications, and live feeds.",
        keywords: ["WebSocket system design", "long polling system design", "server sent events SSE", "real time communication system design", "WebSocket vs long polling", "push notifications system design", "real time updates system design"],
        readingTime: 7, chapter: 3, order: 12
      },
    ],
  },
  {
    id: 4,
    title: "Advanced Concepts & Security",
    description: "Explore advanced distributed systems patterns, security protocols, and reliability engineering.",
    seoDescription: "Advanced system design topics: geohashing, circuit breaker, rate limiting, service discovery, SLA/SLO/SLI, disaster recovery, OAuth 2.0, SSO, SSL/TLS, and containers vs VMs.",
    keywords: ["advanced system design concepts", "distributed systems patterns", "system design security", "reliability engineering system design"],
    icon: "Shield",
    color: "#f59e0b",
    topics: [
      {
        slug: "geohashing-and-quadtrees",
        title: "Geohashing & Quadtrees",
        seoTitle: "Geohashing and Quadtrees in System Design  Location-Based Systems",
        description: "Spatial indexing for location-based systems",
        seoDescription: "Learn geohashing and quadtrees for system design: spatial indexing, location-based search, proximity queries, Uber/Yelp system design, and how to find nearby places efficiently.",
        keywords: ["geohashing system design", "quadtree system design", "location based system design", "spatial indexing", "proximity search system design", "Uber system design geohashing", "nearby places system design", "geospatial system design"],
        readingTime: 6, chapter: 4, order: 1
      },
      {
        slug: "circuit-breaker",
        title: "Circuit Breaker",
        seoTitle: "Circuit Breaker Pattern in System Design  Fault Tolerance",
        description: "Fault tolerance pattern for distributed systems",
        seoDescription: "Learn the circuit breaker pattern for system design: open, closed, half-open states, preventing cascade failures, resilience4j, Hystrix, and fault tolerance in microservices.",
        keywords: ["circuit breaker system design", "circuit breaker pattern", "fault tolerance system design", "cascade failure prevention", "resilience4j circuit breaker", "Hystrix circuit breaker", "microservices fault tolerance"],
        readingTime: 6, chapter: 4, order: 2
      },
      {
        slug: "rate-limiting",
        title: "Rate Limiting",
        seoTitle: "Rate Limiting in System Design  Token Bucket, Leaky Bucket, Sliding Window",
        description: "Token bucket, leaky bucket, fixed/sliding window algorithms",
        seoDescription: "Master rate limiting for system design: token bucket, leaky bucket, fixed window counter, sliding window log algorithms. API rate limiting, throttling, and protecting services from abuse.",
        keywords: ["rate limiting system design", "token bucket algorithm", "leaky bucket algorithm", "sliding window rate limiting", "API rate limiting", "throttling system design", "rate limiter interview question", "how to design rate limiter"],
        readingTime: 7, chapter: 4, order: 3
      },
      {
        slug: "service-discovery",
        title: "Service Discovery",
        seoTitle: "Service Discovery in System Design  Client-Side vs Server-Side",
        description: "Client-side and server-side discovery patterns",
        seoDescription: "Learn service discovery for system design: client-side discovery (Eureka), server-side discovery (AWS ALB), service registry, health checks, Consul, and dynamic service registration.",
        keywords: ["service discovery system design", "client-side service discovery", "server-side service discovery", "Consul service discovery", "Eureka service registry", "Kubernetes service discovery", "microservices service discovery"],
        readingTime: 5, chapter: 4, order: 4
      },
      {
        slug: "sla-slo-sli",
        title: "SLA, SLO, SLI",
        seoTitle: "SLA vs SLO vs SLI in System Design  Reliability Metrics Explained",
        description: "Service reliability metrics and agreements",
        seoDescription: "Understand SLA, SLO, and SLI for system design: Service Level Agreements, Service Level Objectives, Service Level Indicators. Error budgets, reliability targets, and SRE practices.",
        keywords: ["SLA SLO SLI system design", "service level agreement", "service level objective", "service level indicator", "error budget SRE", "reliability metrics", "SRE system design", "SLA vs SLO vs SLI difference"],
        readingTime: 5, chapter: 4, order: 5
      },
      {
        slug: "disaster-recovery",
        title: "Disaster Recovery",
        seoTitle: "Disaster Recovery in System Design  RTO, RPO, Cold/Warm/Hot Sites",
        description: "Cold, warm, hot site strategies, RTO and RPO",
        seoDescription: "Learn disaster recovery for system design: Recovery Time Objective (RTO), Recovery Point Objective (RPO), cold/warm/hot standby strategies, backup strategies, and multi-region failover.",
        keywords: ["disaster recovery system design", "RTO RPO system design", "recovery time objective", "recovery point objective", "cold warm hot site", "disaster recovery strategies", "multi-region system design", "business continuity"],
        readingTime: 6, chapter: 4, order: 6
      },
      {
        slug: "virtual-machines-vs-containers",
        title: "VMs vs Containers",
        seoTitle: "VMs vs Containers in System Design  Docker, Kubernetes, Virtualization",
        description: "Virtualization comparison, Docker, orchestration",
        seoDescription: "Compare virtual machines vs containers for system design: hypervisors, Docker containers, Kubernetes orchestration, resource efficiency, isolation, and when to choose VMs over containers.",
        keywords: ["containers vs virtual machines system design", "Docker system design", "Kubernetes system design", "containerization system design", "VM vs Docker", "container orchestration", "microservices containers"],
        readingTime: 6, chapter: 4, order: 7
      },
      {
        slug: "oauth-and-openid",
        title: "OAuth 2.0 & OpenID Connect",
        seoTitle: "OAuth 2.0 and OpenID Connect in System Design  Authorization Flows",
        description: "Authorization and identity protocols",
        seoDescription: "Learn OAuth 2.0 and OpenID Connect for system design: authorization code flow, implicit flow, client credentials, access tokens, refresh tokens, PKCE, and identity federation.",
        keywords: ["OAuth 2.0 system design", "OpenID Connect system design", "OAuth authorization flow", "access token refresh token", "OAuth PKCE", "social login OAuth", "authorization vs authentication OAuth"],
        readingTime: 7, chapter: 4, order: 8
      },
      {
        slug: "single-sign-on",
        title: "Single Sign-On (SSO)",
        seoTitle: "Single Sign-On (SSO) in System Design  SAML, Federated Identity",
        description: "SSO patterns, SAML, federated identity",
        seoDescription: "Learn Single Sign-On (SSO) for system design: SAML 2.0, OAuth-based SSO, identity provider (IdP), service provider (SP), federated identity, and enterprise SSO patterns.",
        keywords: ["single sign on system design", "SSO system design", "SAML system design", "federated identity", "identity provider SSO", "enterprise SSO", "SSO authentication flow", "SAML vs OAuth SSO"],
        readingTime: 5, chapter: 4, order: 9
      },
      {
        slug: "ssl-tls-mtls",
        title: "SSL, TLS, mTLS",
        seoTitle: "SSL, TLS, and mTLS in System Design  Encryption and Certificates",
        description: "Encryption protocols, certificates, mutual authentication",
        seoDescription: "Learn SSL/TLS/mTLS for system design: TLS handshake, certificates, certificate authorities, mutual TLS (mTLS) for service-to-service authentication, and HTTPS in distributed systems.",
        keywords: ["SSL TLS system design", "mTLS mutual TLS", "TLS handshake system design", "HTTPS system design", "certificate authority", "SSL certificate", "mutual authentication mTLS", "service mesh mTLS"],
        readingTime: 6, chapter: 4, order: 10
      },
    ],
  },
  {
    id: 5,
    title: "Real-World Case Studies",
    description: "Apply everything you've learned by designing complete systems from scratch using real-world examples.",
    seoDescription: "System design case studies: design URL shortener, WhatsApp, Twitter, Netflix, Uber from scratch. Full system design interview preparation with architecture diagrams.",
    keywords: ["system design case studies", "system design interview examples", "how to design systems", "system design practice problems"],
    icon: "Rocket",
    color: "#10b981",
    topics: [
      {
        slug: "system-design-interview-tips",
        title: "Interview Tips & Framework",
        seoTitle: "System Design Interview Tips  Framework, How to Answer Questions",
        description: "Structured approach to system design interviews",
        seoDescription: "Ace your system design interview: step-by-step framework for answering questions, clarifying requirements, capacity estimation, API design, data model, and presenting trade-offs.",
        keywords: ["system design interview tips", "how to answer system design questions", "system design interview framework", "system design interview preparation", "system design interview guide", "FAANG system design interview", "system design cheat sheet"],
        readingTime: 8, chapter: 5, order: 1
      },
      {
        slug: "url-shortener",
        title: "URL Shortener",
        seoTitle: "Design a URL Shortener System Design  bit.ly, TinyURL Architecture",
        description: "Design a scalable URL shortening service like bit.ly",
        seoDescription: "Design a URL shortener like bit.ly or TinyURL: hash generation, database schema, 301 vs 302 redirects, caching, analytics, custom URLs, and scaling to billions of URLs.",
        keywords: ["URL shortener system design", "design bit.ly system design", "TinyURL system design", "URL shortening service design", "hash generation URL shortener", "scalable URL shortener", "system design interview URL shortener"],
        readingTime: 12, chapter: 5, order: 2
      },
      {
        slug: "whatsapp",
        title: "WhatsApp",
        seoTitle: "Design WhatsApp System Design  Messaging at Scale for Billions",
        description: "Design a global messaging platform for billions",
        seoDescription: "Design WhatsApp for system design interviews: real-time messaging, end-to-end encryption, message delivery receipts, group chats, media storage, WebSocket connections, and scaling to 2 billion users.",
        keywords: ["design WhatsApp system design", "WhatsApp architecture system design", "messaging system design", "real-time chat system design", "WhatsApp system design interview", "messaging app architecture", "chat application system design"],
        readingTime: 15, chapter: 5, order: 3
      },
      {
        slug: "twitter",
        title: "Twitter",
        seoTitle: "Design Twitter System Design  News Feed, Timeline, Fan-out",
        description: "Design a social media feed and timeline system",
        seoDescription: "Design Twitter for system design interviews: news feed generation, fan-out on write vs read, timeline service, tweet storage, follower graph, trending topics, and scaling to millions of users.",
        keywords: ["design Twitter system design", "Twitter architecture system design", "news feed system design", "social media system design", "Twitter timeline system design", "fan-out on write read", "Twitter system design interview"],
        readingTime: 15, chapter: 5, order: 4
      },
      {
        slug: "netflix",
        title: "Netflix",
        seoTitle: "Design Netflix System Design  Video Streaming at Global Scale",
        description: "Design a global video streaming platform",
        seoDescription: "Design Netflix for system design interviews: video encoding pipeline, CDN strategy, recommendation system, microservices architecture, Netflix Open Connect, and streaming 250 million subscribers.",
        keywords: ["design Netflix system design", "Netflix architecture system design", "video streaming system design", "Netflix CDN system design", "streaming platform system design", "Netflix system design interview", "video encoding system design"],
        readingTime: 15, chapter: 5, order: 5
      },
      {
        slug: "uber",
        title: "Uber",
        seoTitle: "Design Uber System Design  Real-Time Ride Sharing Architecture",
        description: "Design a real-time ride-sharing platform",
        seoDescription: "Design Uber for system design interviews: real-time location tracking, driver-rider matching, geohashing, surge pricing, trip management, payment processing, and scaling to millions of rides.",
        keywords: ["design Uber system design", "Uber architecture system design", "ride sharing system design", "real-time location system design", "Uber system design interview", "geolocation system design", "driver matching system design"],
        readingTime: 15, chapter: 5, order: 6
      },
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

  const prevChapter = getChapter(chapterId - 1);
  if (prevChapter && prevChapter.topics.length > 0) {
    return { chapter: prevChapter.id, topic: prevChapter.topics[prevChapter.topics.length - 1] };
  }

  return undefined;
}

export function getAllTopics(): Array<Topic & { chapterId: number }> {
  return CHAPTERS.flatMap((c) => c.topics.map((t) => ({ ...t, chapterId: c.id })));
}
