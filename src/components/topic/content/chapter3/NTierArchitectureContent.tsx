"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "browser", type: "system", position: { x: 190, y: 20 }, data: { label: "Browser / Mobile", sublabel: "Client", icon: "🌐", color: "#3b82f6", description: "The presentation tier. Renders HTML/CSS/JS. Communicates with the web server over HTTP." } },
  { id: "webserver", type: "system", position: { x: 190, y: 130 }, data: { label: "Web Server", sublabel: "Nginx / Apache", icon: "⚡", color: "#06b6d4", description: "Presentation tier. Serves static assets, handles TLS termination, reverse-proxies dynamic requests to the app server." } },
  { id: "appserver", type: "system", position: { x: 190, y: 240 }, data: { label: "Application Server", sublabel: "Node / Django / Spring", icon: "⚙️", color: "#8b5cf6", description: "Business logic tier. Processes requests, enforces rules, coordinates data access. Contains no UI and no SQL." } },
  { id: "db", type: "database", position: { x: 190, y: 355 }, data: { label: "Database", sublabel: "PostgreSQL / MySQL", color: "#10b981", description: "Data tier. Stores, retrieves, and manages persistent data. Only the app server communicates here." } },
];

const edges: Edge[] = [
  { id: "e1", source: "browser", target: "webserver", label: "HTTP/HTTPS", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e2", source: "webserver", target: "appserver", label: "Proxy / API call", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
  { id: "e3", source: "appserver", target: "db", label: "SQL / ORM query", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 10 } },
];

const questions = [
  {
    question: "In a 3-tier architecture, which tier is responsible for business logic?",
    options: [
      "Presentation tier (browser/UI)",
      "Application tier (app server)",
      "Data tier (database)",
      "All three tiers share business logic equally",
    ],
    correct: 1,
    explanation: "The application (middle) tier handles business logic  rules, calculations, and orchestration. The presentation tier handles UI, and the data tier handles persistence. Keeping business logic in the middle tier makes it independently scalable and testable.",
  },
  {
    question: "What is the primary advantage of separating tiers physically (on different servers)?",
    options: [
      "It always makes the application faster",
      "Each tier can be scaled independently based on its specific bottleneck",
      "It eliminates all network latency",
      "It removes the need for load balancers",
    ],
    correct: 1,
    explanation: "Physical separation enables independent scaling. If the app server is the bottleneck, you can add more app servers without touching the web server or database. This is impossible in a 1-tier (all-in-one) deployment.",
  },
  {
    question: "What is the key difference between a 'tier' and a 'layer' in software architecture?",
    options: [
      "They are synonymous terms with no meaningful difference",
      "A tier is a physical deployment boundary (separate server/process); a layer is a logical code separation within the same process",
      "A layer is always deployed on separate hardware; a tier is always in the same process",
      "Tiers apply only to databases; layers apply only to application code",
    ],
    correct: 1,
    explanation: "Tier implies physical separation — tiers run on different machines or processes and communicate over a network. A layer is purely a logical code organization (e.g., Controller/Service/Repository) within the same deployable artifact. You can have a 3-layer monolith running as a single tier.",
  },
  {
    question: "In a 2-tier (client-server) architecture, where does business logic typically reside?",
    options: [
      "In a dedicated middle-tier application server",
      "In the client application or in database stored procedures",
      "In the CDN edge nodes",
      "In the load balancer",
    ],
    correct: 1,
    explanation: "In 2-tier architectures, the client talks directly to the database. Business logic ends up embedded in the client code or in stored procedures inside the database. This makes scaling and maintenance difficult, which is why 3-tier architectures emerged.",
  },
  {
    question: "Which security benefit does N-tier separation provide for the database tier?",
    options: [
      "The database can encrypt all data automatically",
      "The database can be placed in a private subnet with no public network access, reachable only by the application tier",
      "The database gains built-in DDoS protection",
      "The database can authenticate users directly without passwords",
    ],
    correct: 1,
    explanation: "By placing the data tier in a private subnet (no public IP, firewall rules restricting access to only the app tier's IP range), the database is never directly exposed to the internet. Attackers must first compromise the application tier to reach it.",
  },
  {
    question: "A company's app servers are CPU-saturated during peak traffic but the database is idle. What does N-tier architecture allow them to do?",
    options: [
      "Rewrite the entire application from scratch",
      "Scale only the application tier by adding more app servers, without touching the web or database tiers",
      "Upgrade the database to a larger instance",
      "Add more CDN edge nodes",
    ],
    correct: 1,
    explanation: "Independent scalability is the primary operational benefit of N-tier. Since the application tier is a separate deployable unit, you can horizontally scale only those servers behind a load balancer. The database tier and web tier remain unchanged.",
  },
  {
    question: "Why is placing business logic in database stored procedures considered an anti-pattern in N-tier architecture?",
    options: [
      "Stored procedures are always slower than application code",
      "It blurs the boundary between the data tier and application tier, making the system harder to scale, test, and evolve independently",
      "Stored procedures cannot handle complex logic",
      "Databases do not support stored procedures in modern systems",
    ],
    correct: 1,
    explanation: "When business logic leaks into stored procedures, the data tier and application tier become tightly coupled. You can no longer swap databases, independently test business rules, or scale the application tier without worrying about stored procedure state. It creates an implicit dependency that violates tier separation.",
  },
  {
    question: "Which of the following best describes a typical modern production N-tier stack?",
    options: [
      "Browser → Database (2 tiers only)",
      "CDN → Load Balancer → Web Servers → API Gateway → App Servers → Cache → Database (multiple tiers)",
      "Client → Single Monolithic Server (1 tier)",
      "Browser → App Server → Message Queue (exactly 3 tiers always)",
    ],
    correct: 1,
    explanation: "Real production systems extend the 3-tier model with additional tiers: CDN for static assets, load balancers for distribution, an API gateway for cross-cutting concerns, caching layers (Redis) to reduce database load, and clustered databases. Each boundary provides isolation and independent scalability.",
  },
  {
    question: "What does the web server tier (e.g., Nginx) typically handle in a 3-tier web application?",
    options: [
      "Complex SQL queries and data aggregation",
      "User authentication and session management",
      "TLS/SSL termination, serving static assets, and reverse-proxying dynamic requests to the app server",
      "Business rule validation and transaction processing",
    ],
    correct: 2,
    explanation: "The web server (Nginx, Apache) sits at the presentation tier boundary. Its responsibilities are infrastructure-level: terminating HTTPS, serving static files (HTML, CSS, JS, images) from disk very efficiently, and forwarding dynamic requests to the application tier. It does not execute business logic.",
  },
  {
    question: "Multiple client types (web browser, iOS app, Android app) need to access the same data. What N-tier benefit does this illustrate?",
    options: [
      "Security isolation — each client gets its own database",
      "Reusability — all clients call the same application tier API without the data tier changing",
      "Independent scalability — each client scales its own tier",
      "Fault isolation — one client crashing doesn't affect others",
    ],
    correct: 1,
    explanation: "The application tier exposes an API that any client can consume. A web browser, iOS app, and Android app all call the same endpoints. The data tier never changes. This reusability means you build business logic once and serve all clients — a core advantage of separating the presentation tier from the application tier.",
  },
];

export default function NTierArchitectureContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">N-Tier Architecture</strong> organizes an application into distinct horizontal layers (tiers) where each tier has a specific responsibility and communicates only with adjacent tiers. The classic form is 3-tier: Presentation, Business Logic, and Data.
      </p>
      <p className="text-base leading-relaxed">
        The word <em>tier</em> implies physical separation  tiers can run on separate servers. This is distinct from <em>layer</em>, which is a logical code separation within the same process. A 3-tier deployment might have 10 web servers, 20 app servers, and a database cluster  all independently scaled.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Classic 3-Tier Architecture"
        description="Browser → Web Server → App Server → Database  each tier has a distinct role. Click nodes for details."
        height={460}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Tier Comparison</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            name: "1-Tier",
            color: "#f59e0b",
            description: "Everything in one process (desktop app, SQLite). Simple to develop, impossible to scale.",
            examples: "Local desktop apps, scripts",
            scaling: "No independent scaling",
          },
          {
            name: "2-Tier",
            color: "#3b82f6",
            description: "Client talks directly to the database. Business logic lives in client code or stored procedures.",
            examples: "Legacy ERP, early web apps",
            scaling: "Scale DB or clients only",
          },
          {
            name: "3-Tier",
            color: "#10b981",
            description: "Presentation, Application, and Data are separate. The dominant pattern for web services.",
            examples: "Most modern web applications",
            scaling: "Scale each tier independently",
          },
        ].map((t) => (
          <div key={t.name} className="p-4 rounded-xl border" style={{ borderColor: `${t.color}40`, backgroundColor: `${t.color}0d` }}>
            <div className="font-bold text-sm font-heading mb-2" style={{ color: t.color }}>{t.name}</div>
            <p className="text-xs text-txt-2 mb-2 leading-relaxed">{t.description}</p>
            <div className="text-[10px] text-txt-3"><strong className="text-txt-2">Examples:</strong> {t.examples}</div>
            <div className="text-[10px] text-txt-3 mt-1"><strong className="text-txt-2">Scaling:</strong> {t.scaling}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Benefits of N-Tier Separation</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "Separation of Concerns", color: "#3b82f6", body: "Each tier has a single responsibility. Frontend developers work on the presentation tier without touching database schemas. DBA teams optimize queries independently." },
          { title: "Independent Scalability", color: "#10b981", body: "Under heavy read load, add more app servers. Under write pressure, scale the database tier. Under heavy static assets, add a CDN in front of the web tier." },
          { title: "Security Isolation", color: "#8b5cf6", body: "The database tier can be placed in a private subnet with no public access. Only the app tier, behind a firewall, can reach it. The web tier handles TLS termination." },
          { title: "Reusability", color: "#06b6d4", body: "Multiple presentation clients (web browser, iOS app, Android app) can all call the same application tier API. The data tier never changes." },
        ].map((b) => (
          <div key={b.title} className="p-4 rounded-xl border" style={{ borderColor: `${b.color}30`, backgroundColor: `${b.color}0a` }}>
            <div className="font-semibold text-sm mb-1" style={{ color: b.color }}>{b.title}</div>
            <p className="text-xs text-txt-2 leading-relaxed">{b.body}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">N-Tier in Practice</h2>
      <p>
        Real systems add tiers beyond three. A typical production stack might look like:{" "}
        <span className="text-accent-2 font-medium">CDN</span> →{" "}
        <span className="text-accent font-medium">Load Balancer</span> →{" "}
        <span className="text-accent-2 font-medium">Web Servers</span> →{" "}
        <span className="text-accent font-medium">API Gateway</span> →{" "}
        <span className="text-accent font-medium">App Servers</span> →{" "}
        <span className="text-c-success font-medium">Cache (Redis)</span> →{" "}
        <span className="text-c-success font-medium">Database</span>.
        Each boundary introduces a network hop but buys you isolation, independent deployability, and security control.
      </p>

      <KeyTakeaway variant="important">
        The 3-tier pattern remains the most widely deployed architecture for web applications. When someone says "we need to scale," they usually mean "we need to separate our tiers so we can scale each one independently." Every AWS, GCP, or Azure reference architecture is a variation of N-tier.
      </KeyTakeaway>

      <KeyTakeaway variant="warning">
        Avoid business logic in stored procedures or database triggers  that blurs the data tier and the application tier, making the system harder to scale and test. Keep SQL dumb (data retrieval), and keep business rules in the application tier.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
