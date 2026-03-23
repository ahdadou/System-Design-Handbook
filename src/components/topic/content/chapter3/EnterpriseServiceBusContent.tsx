"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "hr", type: "system", position: { x: 20, y: 40 }, data: { label: "HR System", sublabel: "SAP HR", icon: "👥", color: "#3b82f6" } },
  { id: "crm", type: "system", position: { x: 20, y: 140 }, data: { label: "CRM", sublabel: "Salesforce", icon: "🤝", color: "#3b82f6" } },
  { id: "erp", type: "system", position: { x: 20, y: 240 }, data: { label: "ERP", sublabel: "Oracle ERP", icon: "🏭", color: "#3b82f6" } },
  { id: "legacy", type: "database", position: { x: 20, y: 340 }, data: { label: "Legacy DB", sublabel: "Mainframe", color: "#3b82f6" } },
  { id: "esb", type: "system", position: { x: 195, y: 190 }, data: { label: "Enterprise Service Bus", sublabel: "MuleSoft / IBM MQ", icon: "🔀", color: "#f59e0b", description: "Central hub: transforms protocols, routes messages, orchestrates workflows, enforces security, monitors SLAs." } },
  { id: "web", type: "system", position: { x: 390, y: 40 }, data: { label: "Web Portal", icon: "🌐", color: "#10b981" } },
  { id: "mobile", type: "system", position: { x: 390, y: 140 }, data: { label: "Mobile App", icon: "📱", color: "#10b981" } },
  { id: "partner", type: "system", position: { x: 390, y: 240 }, data: { label: "Partner API", icon: "🔗", color: "#10b981" } },
  { id: "analytics", type: "system", position: { x: 390, y: 340 }, data: { label: "Analytics", icon: "📊", color: "#10b981" } },
];

const edges: Edge[] = [
  { id: "e1", source: "hr", target: "esb", animated: true, style: { stroke: "#3b82f6", strokeWidth: 1.5 } },
  { id: "e2", source: "crm", target: "esb", animated: true, style: { stroke: "#3b82f6", strokeWidth: 1.5 } },
  { id: "e3", source: "erp", target: "esb", animated: true, style: { stroke: "#3b82f6", strokeWidth: 1.5 } },
  { id: "e4", source: "legacy", target: "esb", animated: true, style: { stroke: "#3b82f6", strokeWidth: 1.5 } },
  { id: "e5", source: "esb", target: "web", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e6", source: "esb", target: "mobile", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e7", source: "esb", target: "partner", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
  { id: "e8", source: "esb", target: "analytics", animated: true, style: { stroke: "#10b981", strokeWidth: 1.5 } },
];

const questions = [
  {
    question: "What is the primary function of an Enterprise Service Bus (ESB)?",
    options: [
      "To replace all legacy systems with modern microservices",
      "To act as a central integration hub that routes, transforms, and orchestrates messages between disparate enterprise systems",
      "To serve as a database for storing enterprise configuration",
      "To enforce rate limiting across all APIs",
    ],
    correct: 1,
    explanation: "An ESB is a centralized middleware layer that connects heterogeneous enterprise systems. It handles protocol conversion (SOAP → REST), message transformation (XML → JSON), routing, and orchestration so each system only talks to the ESB instead of directly to every other system.",
  },
  {
    question: "What is the main architectural drawback of an ESB?",
    options: [
      "ESBs cannot handle legacy systems",
      "ESBs are too expensive for large enterprises",
      "The ESB becomes a single point of failure and a bottleneck  all integration logic centralizes in one 'smart' bus",
      "ESBs do not support message transformation",
    ],
    correct: 2,
    explanation: "The ESB anti-pattern is the 'monolithic bus': business logic creeps into the ESB (routing rules, transformations, orchestration), making it a heavyweight central dependency. Any change requires ESB deployment. Microservices architectures prefer 'dumb pipes, smart endpoints' to avoid this centralization.",
  },
  {
    question: "What integration problem does an ESB solve that direct point-to-point integrations create?",
    options: [
      "ESBs eliminate the need for network communication between services",
      "Without an ESB, N systems needing to talk to M others requires up to N×M direct integrations; an ESB reduces this to N+M connections",
      "ESBs prevent all integration failures by providing redundancy",
      "ESBs allow services to share a single database",
    ],
    correct: 1,
    explanation: "The N×M integration problem: if you have 10 enterprise systems and each needs to talk to the other 9, you need up to 90 direct point-to-point integrations, each with custom protocol and format handling. An ESB centralizes this: each system connects to the bus (N+M = 20 connections), and the bus handles all translation and routing.",
  },
  {
    question: "Which capability of an ESB allows a mainframe speaking CICS to communicate with a mobile REST API?",
    options: [
      "Content-based routing",
      "Orchestration and workflow management",
      "Protocol conversion — the ESB translates between CICS/SOAP and REST/JSON without either system changing",
      "Security mediation with OAuth",
    ],
    correct: 2,
    explanation: "Protocol conversion is one of the ESB's core capabilities. Legacy systems often speak proprietary protocols (CICS, CORBA, AS400) or older standards (SOAP, FTP, JMS). The ESB translates between these and modern protocols (REST, JSON, AMQP), allowing old and new systems to interoperate without modification.",
  },
  {
    question: "What does 'content-based routing' mean in an ESB context?",
    options: [
      "Routing messages based on the size of the payload",
      "Routing messages to different destinations based on the content or attributes of the message itself",
      "Encrypting message content before routing",
      "Routing all messages to the fastest available endpoint",
    ],
    correct: 1,
    explanation: "Content-based routing inspects the message body or headers to determine where to send it. For example: an order with total > $10,000 routes to a manual approval queue; orders < $10,000 go straight to fulfillment. This logic lives in the ESB rather than being duplicated in every sending system.",
  },
  {
    question: "What architectural principle do microservices favor over the ESB's centralized approach?",
    options: [
      "Smart pipes, dumb endpoints — the infrastructure does the heavy lifting",
      "Dumb pipes, smart endpoints — services own their business logic, and the communication layer is kept simple",
      "Centralized orchestration through a shared coordinator",
      "Single shared database for all services",
    ],
    correct: 1,
    explanation: "The microservices philosophy is 'dumb pipes, smart endpoints': use lightweight message brokers (Kafka, SQS) that simply route messages, while each service contains its own business logic. ESBs do the opposite — they accumulate logic in the 'smart pipe,' creating central dependency and bottleneck.",
  },
  {
    question: "An enterprise has SAP HR, Salesforce CRM, Oracle ERP, and a legacy mainframe all needing to exchange data. Which scenario best justifies using an ESB?",
    options: [
      "The company is building a new greenfield microservices application",
      "The company cannot modify legacy systems and needs centralized protocol translation, transformation, and governance across existing heterogeneous systems",
      "The company wants to maximize throughput for high-frequency trading",
      "The company needs real-time event streaming at millions of events per second",
    ],
    correct: 1,
    explanation: "ESBs shine in brownfield enterprise environments where you cannot modify the existing systems. When integrating unmodifiable legacy systems with different protocols and data formats under strict governance requirements, the ESB's centralized protocol conversion and transformation capabilities provide real value.",
  },
  {
    question: "What is the 'integration monolith' anti-pattern that ESBs can create?",
    options: [
      "When all services are deployed as a single binary",
      "When all business logic, routing rules, and transformations accumulate in the ESB, making all teams dependent on the ESB team for any change",
      "When all databases are consolidated into a single instance",
      "When the ESB is replicated across too many servers",
    ],
    correct: 1,
    explanation: "Over time, teams delegate more logic to the ESB — custom routing rules, business validations, data transformations. This turns the ESB into a de facto integration monolith. Every change requires ESB team involvement and deployment. Teams lose autonomy, the ESB becomes a bottleneck, and the system becomes harder to evolve than the original point-to-point mess it replaced.",
  },
  {
    question: "Which modern tool is most comparable to an ESB but follows the microservices philosophy?",
    options: [
      "A relational database with stored procedures",
      "A lightweight message broker (Kafka/SQS) combined with smart service endpoints that own their transformation logic",
      "A monolithic application with an internal plugin system",
      "A load balancer with advanced routing rules",
    ],
    correct: 1,
    explanation: "Modern microservices architectures replace the ESB with lightweight brokers (Kafka, SQS, RabbitMQ) that only route messages, while services themselves handle transformation and business logic. An API Gateway handles cross-cutting concerns like auth. This preserves the integration benefits while avoiding the centralized bottleneck.",
  },
  {
    question: "An ESB performing 'orchestration' is coordinating a multi-step workflow. What risk does this introduce?",
    options: [
      "The workflow becomes too fast to monitor",
      "The ESB becomes a stateful coordinator whose failure halts all in-progress workflows, creating a single point of failure for business processes",
      "Orchestration prevents protocol conversion from working correctly",
      "Orchestration requires all services to use the same programming language",
    ],
    correct: 1,
    explanation: "When the ESB orchestrates multi-step workflows (call SAP, transform response, call Salesforce, aggregate), it holds the state of those processes. If the ESB fails mid-workflow, those processes are lost or corrupted. Modern systems prefer choreography (services react to events independently) or dedicated saga orchestrators that are purpose-built for reliability.",
  },
];

export default function EnterpriseServiceBusContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        An <strong className="text-txt">Enterprise Service Bus (ESB)</strong> is a centralized middleware platform that connects multiple enterprise applications by acting as a hub for message routing, protocol translation, data transformation, and workflow orchestration. It originated in the SOA (Service-Oriented Architecture) era as a solution to the "N×M integration problem."
      </p>
      <p className="text-base leading-relaxed">
        Without an ESB, N enterprise systems each needing to talk to M others requires up to N×M direct point-to-point integrations. With an ESB, every system connects to one hub  reducing connections to N+M. Popular ESB platforms include <span className="text-[#f59e0b] font-medium">MuleSoft</span>, <span className="text-[#f59e0b] font-medium">IBM MQ / App Connect</span>, <span className="text-[#f59e0b] font-medium">TIBCO</span>, and <span className="text-[#f59e0b] font-medium">WSO2</span>.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Enterprise Service Bus Integration"
        description="Legacy and modern systems connect to the central ESB. The ESB transforms, routes, and orchestrates all communication. Click the ESB node for details."
        height={450}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">ESB Core Capabilities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "Protocol Conversion", color: "#3b82f6", icon: "🔄", desc: "Translates between SOAP, REST, FTP, JMS, AMQP, and proprietary protocols. A mainframe that speaks CICS can communicate with a mobile app via JSON without either changing." },
          { title: "Message Transformation", color: "#8b5cf6", icon: "✂️", desc: "Converts data formats  XML to JSON, CSV to XML, flat files to structured objects. Maps field names between systems (e.g. 'custId' → 'customer_id')." },
          { title: "Content-Based Routing", color: "#06b6d4", icon: "🗺️", desc: "Routes messages to different destinations based on content. An order above $10,000 routes to manual approval; smaller orders go straight to fulfillment." },
          { title: "Orchestration", color: "#f59e0b", icon: "🎼", desc: "Coordinates multi-step workflows across systems. The ESB calls System A, waits, transforms the response, calls System B with the result  acting as a process coordinator." },
          { title: "Security & Mediation", color: "#10b981", icon: "🔐", desc: "Enforces authentication (OAuth, SAML), authorization, encryption, and audit logging at the integration layer, centralizing security policy." },
          { title: "Monitoring & SLA", color: "#ef4444", icon: "📈", desc: "Tracks message throughput, latency, error rates, and SLA compliance across all integrations from a single dashboard." },
        ].map((c) => (
          <div key={c.title} className="p-4 rounded-xl border" style={{ borderColor: `${c.color}30`, backgroundColor: `${c.color}0a` }}>
            <div className="flex items-center gap-2 mb-1">
              <span>{c.icon}</span>
              <span className="font-semibold text-sm font-heading" style={{ color: c.color }}>{c.title}</span>
            </div>
            <p className="text-xs text-txt-2 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">ESB vs Microservices: The Monolithic Bus Problem</h2>
      <p>
        The ESB pattern predates microservices and reflects a different era. In practice, ESBs often accumulate business logic  routing rules, transformations, and orchestration that belong in services end up in the bus. This creates an <span className="text-[#ef4444] font-medium">integration monolith</span>: all teams depend on the ESB team for deployments, and the ESB becomes both a bottleneck and a single point of failure.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30">
          <div className="font-bold text-[#f59e0b] text-sm font-heading mb-2">When ESB Makes Sense</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Integrating many legacy systems you cannot modify</li>
            <li>• Enterprise with strict centralized governance requirements</li>
            <li>• When N×M point-to-point integrations already exist</li>
            <li>• Regulated industries needing centralized audit trails</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30">
          <div className="font-bold text-c-success text-sm font-heading mb-2">Modern Alternative</div>
          <ul className="text-xs space-y-1 text-txt-2">
            <li>• Microservices with lightweight message brokers (Kafka)</li>
            <li>• "Dumb pipes, smart endpoints"  services own their logic</li>
            <li>• API Gateway for external-facing orchestration</li>
            <li>• Choreography over centralized orchestration</li>
          </ul>
        </div>
      </div>

      <KeyTakeaway variant="important">
        The ESB solved a real problem (N×M integrations) but introduced a new one (central dependency and bottleneck). Modern distributed systems favor lightweight brokers (Kafka, SQS) and smart services over smart middleware. If you encounter an ESB in an interview, acknowledge its integration value while explaining the microservices alternative.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
