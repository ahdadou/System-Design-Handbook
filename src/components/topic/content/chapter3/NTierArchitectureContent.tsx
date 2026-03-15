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
    explanation: "The application (middle) tier handles business logic — rules, calculations, and orchestration. The presentation tier handles UI, and the data tier handles persistence. Keeping business logic in the middle tier makes it independently scalable and testable.",
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
];

export default function NTierArchitectureContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-[#94a3b8]">
      <p className="text-base leading-relaxed">
        <strong className="text-[#f1f5f9]">N-Tier Architecture</strong> organizes an application into distinct horizontal layers (tiers) where each tier has a specific responsibility and communicates only with adjacent tiers. The classic form is 3-tier: Presentation, Business Logic, and Data.
      </p>
      <p className="text-base leading-relaxed">
        The word <em>tier</em> implies physical separation — tiers can run on separate servers. This is distinct from <em>layer</em>, which is a logical code separation within the same process. A 3-tier deployment might have 10 web servers, 20 app servers, and a database cluster — all independently scaled.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Classic 3-Tier Architecture"
        description="Browser → Web Server → App Server → Database — each tier has a distinct role. Click nodes for details."
        height={460}
      />

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Tier Comparison</h2>
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
            <p className="text-xs text-[#94a3b8] mb-2 leading-relaxed">{t.description}</p>
            <div className="text-[10px] text-[#475569]"><strong className="text-[#64748b]">Examples:</strong> {t.examples}</div>
            <div className="text-[10px] text-[#475569] mt-1"><strong className="text-[#64748b]">Scaling:</strong> {t.scaling}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Benefits of N-Tier Separation</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "Separation of Concerns", color: "#3b82f6", body: "Each tier has a single responsibility. Frontend developers work on the presentation tier without touching database schemas. DBA teams optimize queries independently." },
          { title: "Independent Scalability", color: "#10b981", body: "Under heavy read load, add more app servers. Under write pressure, scale the database tier. Under heavy static assets, add a CDN in front of the web tier." },
          { title: "Security Isolation", color: "#8b5cf6", body: "The database tier can be placed in a private subnet with no public access. Only the app tier, behind a firewall, can reach it. The web tier handles TLS termination." },
          { title: "Reusability", color: "#06b6d4", body: "Multiple presentation clients (web browser, iOS app, Android app) can all call the same application tier API. The data tier never changes." },
        ].map((b) => (
          <div key={b.title} className="p-4 rounded-xl border" style={{ borderColor: `${b.color}30`, backgroundColor: `${b.color}0a` }}>
            <div className="font-semibold text-sm mb-1" style={{ color: b.color }}>{b.title}</div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">{b.body}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">N-Tier in Practice</h2>
      <p>
        Real systems add tiers beyond three. A typical production stack might look like:{" "}
        <span className="text-[#06b6d4] font-medium">CDN</span> →{" "}
        <span className="text-[#3b82f6] font-medium">Load Balancer</span> →{" "}
        <span className="text-[#06b6d4] font-medium">Web Servers</span> →{" "}
        <span className="text-[#8b5cf6] font-medium">API Gateway</span> →{" "}
        <span className="text-[#8b5cf6] font-medium">App Servers</span> →{" "}
        <span className="text-[#10b981] font-medium">Cache (Redis)</span> →{" "}
        <span className="text-[#10b981] font-medium">Database</span>.
        Each boundary introduces a network hop but buys you isolation, independent deployability, and security control.
      </p>

      <KeyTakeaway variant="important">
        The 3-tier pattern remains the most widely deployed architecture for web applications. When someone says "we need to scale," they usually mean "we need to separate our tiers so we can scale each one independently." Every AWS, GCP, or Azure reference architecture is a variation of N-tier.
      </KeyTakeaway>

      <KeyTakeaway variant="warning">
        Avoid business logic in stored procedures or database triggers — that blurs the data tier and the application tier, making the system harder to scale and test. Keep SQL dumb (data retrieval), and keep business rules in the application tier.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
