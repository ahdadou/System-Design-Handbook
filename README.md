<div align="center">

<h1>
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books.png" width="35" alt="books" />
  System Design Handbook
</h1>

<p><strong>An interactive, visual guide to system design concepts — built for engineers preparing for interviews and beyond.</strong></p>

<p>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer" />
  <img src="https://img.shields.io/badge/React_Flow-12-FF0072?style=flat-square" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=flat-square&logo=tailwindcss" />
</p>

<br/>

</div>

---

## What is this?

**System Design Handbook** is an interactive learning platform covering the fundamental building blocks of distributed systems. Instead of static walls of text, every concept comes with **live diagrams**, **step-by-step animations**, and **quizzes** — so you see *how* things work, not just *what* they are.

Built for engineers who want to deeply understand system design for interviews at top tech companies, or simply want a solid mental model of how large-scale systems are built.

---

## Topics Covered

### Chapter 1 — Foundations
| Topic | What you'll learn |
|---|---|
| 🌐 DNS | Resolution flow, recursive vs iterative queries |
| ⚖️ Load Balancing | Round Robin, Least Connections, Weighted, IP Hash — animated |
| 🔁 Caching | Cache strategies, TTL, eviction policies |
| 📡 CDN | Cache flow, edge nodes, origin pull |
| 🔀 Proxy / Reverse Proxy | Forward vs reverse, use cases |
| 📦 TCP vs UDP | Animated 3-way handshake, packet loss & recovery |
| 🏗️ OSI Model | All 7 layers, interactive breakdown |
| 📈 Scalability | Horizontal vs vertical, bottlenecks |
| 🖧 Clustering | Active-passive, active-active |
| 💾 Storage | Block, object, file storage |
| 🌍 IP Addresses | IPv4/IPv6, public/private, NAT |
| 📊 Availability | Nines of availability, SLA implications |

### Chapter 2 — Databases
| Topic | What you'll learn |
|---|---|
| 🗄️ SQL Databases | RDBMS internals, when to use |
| 🍃 NoSQL Databases | Document, key-value, columnar, graph |
| ⚖️ CAP Theorem | Consistency, Availability, Partition tolerance |
| 🔄 Replication | Leader-follower, multi-leader, leaderless |
| 🧩 Sharding | Horizontal partitioning strategies |
| ⚡ Consistent Hashing | Animated ring, virtual nodes |
| 📋 Indexes | B-tree, hash, when indexes hurt |
| 🔐 ACID / BASE | Transactions, isolation levels |
| 🌐 PACELC | Extension of CAP for latency |
| 📐 Normalization | 1NF → 3NF, denormalization tradeoffs |
| 🔗 Database Federation | Functional partitioning |
| 💸 Distributed Transactions | 2PC, Saga pattern |

### Chapter 3 — Architecture Patterns
| Topic | What you'll learn |
|---|---|
| 🧱 Microservices | Service decomposition, pros & cons |
| 📨 Message Queues | Point-to-point, ordering guarantees |
| 📣 Pub/Sub | Fan-out, event streaming |
| 🔌 Message Brokers | Kafka, RabbitMQ patterns |
| ⚡ Event-Driven Architecture | Event sourcing, eventual consistency |
| 🔄 CQRS | Command/Query separation |
| 🚪 API Gateway | Rate limiting, auth, routing |
| 🌐 REST / GraphQL / gRPC | When to use each |
| 📡 WebSockets / Long Polling | Real-time communication patterns |
| 🏢 N-Tier Architecture | Presentation, logic, data layers |
| 🚌 Enterprise Service Bus | Integration patterns |
| 📅 Event Sourcing | Audit trail, replay |

### Chapter 4 — Reliability & Security
| Topic | What you'll learn |
|---|---|
| ⚡ Circuit Breaker | Animated state machine: Closed → Open → Half-Open |
| 🔒 SSL / TLS | Animated TLS handshake |
| 🔑 OAuth 2.0 | Authorization flows |
| 🔐 Single Sign-On | SAML, OIDC flows |
| 🚦 Rate Limiting | Token bucket, sliding window |
| 🔍 Service Discovery | Client-side vs server-side |
| 📍 Geohashing | Spatial indexing |
| 📊 SLA / SLO / SLI | Reliability metrics |
| 🐳 VMs & Containers | Isolation tradeoffs |
| 🌪️ Disaster Recovery | RTO, RPO, strategies |

### Chapter 5 — Real-World Case Studies
Design walkthroughs for systems you know:
- **Twitter / X** — Feed generation, fanout
- **Netflix** — Video streaming, CDN strategy
- **Uber** — Geolocation, dispatch, surge pricing
- **WhatsApp** — Messaging at scale, presence
- **URL Shortener** — Classic interview question, end-to-end

---

## Interactive Features

- **🎬 Animated Diagrams** — Live sequence diagrams, packet animations, state machines
- **🖱️ Interactive Graphs** — Drag nodes, zoom, explore ReactFlow-powered diagrams
- **🧩 Step-by-step Playback** — Walk through protocols one step at a time
- **📝 Quizzes** — Test your understanding after each topic
- **🌙 Dark mode** — Easy on the eyes for long study sessions
- **📱 Responsive** — Works on all screen sizes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Diagrams | [React Flow](https://reactflow.dev) |
| Charts | [Recharts](https://recharts.org) |
| State | [Zustand](https://zustand-demo.pmnd.rs) |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/system-design-handbook.git
cd system-design-handbook

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
├── components/
│   ├── diagrams/               # All animated diagrams
│   │   ├── dns/                # DNS resolution flow
│   │   ├── load-balancer/      # Load balancer simulation
│   │   ├── tcp-udp/            # TCP/UDP animated sequence
│   │   ├── circuit-breaker/    # Circuit breaker state machine
│   │   ├── ssl-tls/            # TLS handshake animation
│   │   └── ...                 # 10+ more diagrams
│   ├── topic/
│   │   └── content/            # Per-topic content components
│   │       ├── chapter1/       # 12 networking topics
│   │       ├── chapter2/       # 13 database topics
│   │       ├── chapter3/       # 12 architecture topics
│   │       ├── chapter4/       # 10 reliability topics
│   │       └── chapter5/       # 6 case studies
│   ├── layout/                 # Sidebar, navigation
│   └── ui/                     # Reusable UI components
└── lib/                        # Content registry, store
```

---

## Contributing

Contributions are welcome! If you spot an error, want to add a topic, or improve a diagram:

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-topic`
3. Commit your changes
4. Open a pull request

---

## License

MIT — free to use, share, and modify.

---

<div align="center">
  <p>Built with ❤️ for engineers who want to understand systems deeply.</p>
  <p>If this helped you, consider giving it a ⭐</p>
</div>
