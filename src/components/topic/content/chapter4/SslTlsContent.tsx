"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, StepNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, step: StepNode };

const nodes: Node[] = [
  { id: "client", type: "system", position: { x: 20, y: 140 }, data: { label: "Client", icon: "💻", color: "#3b82f6" } },
  { id: "s1", type: "step", position: { x: 140, y: 20 }, data: { label: "ClientHello", sublabel: "Cipher suites, TLS version", step: 1, color: "#3b82f6" } },
  { id: "s2", type: "step", position: { x: 140, y: 100 }, data: { label: "ServerHello", sublabel: "Chosen cipher + cert", step: 2, color: "#06b6d4" } },
  { id: "s3", type: "step", position: { x: 140, y: 180 }, data: { label: "Key Exchange", sublabel: "ECDHE pre-master secret", step: 3, color: "#8b5cf6" } },
  { id: "s4", type: "step", position: { x: 140, y: 260 }, data: { label: "Finished", sublabel: "Encrypted handshake done", step: 4, color: "#10b981" } },
  { id: "server", type: "system", position: { x: 320, y: 140 }, data: { label: "Server", icon: "🖥️", color: "#10b981", description: "Presents its certificate signed by a trusted Certificate Authority. Client verifies the signature chain." } },
];

const edges: Edge[] = [
  { id: "e1", source: "client", target: "s1", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "s1", target: "server", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e3", source: "server", target: "s2", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e4", source: "s2", target: "client", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e5", source: "client", target: "s3", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e6", source: "s3", target: "s4", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
];

const questions = [
  {
    question: "What is the difference between TLS and mTLS?",
    options: [
      "TLS uses symmetric encryption; mTLS uses asymmetric encryption",
      "TLS only authenticates the server; mTLS requires both client and server to present certificates",
      "mTLS is faster than TLS",
      "TLS is deprecated; mTLS is its replacement",
    ],
    correct: 1,
    explanation: "In standard TLS, only the server presents a certificate (so the client can verify the server's identity). In mutual TLS (mTLS), both parties present certificates, enabling bidirectional authentication. This is critical for service-to-service communication in microservices.",
  },
  {
    question: "What role does a Certificate Authority (CA) play in TLS?",
    options: [
      "It encrypts the data being transmitted",
      "It stores private keys on behalf of servers",
      "It signs server certificates, allowing clients to verify the server's identity by trusting the CA",
      "It manages session tokens between client and server",
    ],
    correct: 2,
    explanation: "A CA is a trusted third party that digitally signs server certificates. Browsers and OS come pre-loaded with trusted root CAs. When a server presents a certificate signed by a trusted CA, the client knows the server is who it claims to be.",
  },
];

export default function SslTlsContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">TLS (Transport Layer Security)</strong> encrypts data in transit between client and server, preventing eavesdropping and tampering. SSL is the older predecessor — both terms are used interchangeably, but all modern systems use TLS 1.2 or 1.3. <strong className="text-txt">mTLS</strong> (mutual TLS) extends this by requiring both parties to authenticate.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="TLS 1.3 Handshake"
        description="Client and server negotiate encryption keys before any data is exchanged"
        height={360}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">TLS Handshake (Simplified)</h2>
      <div className="space-y-2">
        {[
          { step: "ClientHello", detail: "Client sends supported TLS versions, cipher suites, and a random nonce.", color: "#3b82f6" },
          { step: "ServerHello", detail: "Server picks cipher suite, sends its certificate (signed by a CA), and its own random nonce.", color: "#06b6d4" },
          { step: "Certificate Verify", detail: "Client verifies the certificate chain up to a trusted root CA. If valid, server's identity is confirmed.", color: "#8b5cf6" },
          { step: "Key Exchange", detail: "Both sides derive the same symmetric session key using ECDHE (Diffie-Hellman). The private keys never travel the network.", color: "#f59e0b" },
          { step: "Finished", detail: "Both sides send encrypted Finished messages. All subsequent data is encrypted with the symmetric session key.", color: "#10b981" },
        ].map((item) => (
          <div key={item.step} className="p-3 rounded-lg border border-border-ui bg-surface flex gap-3">
            <div className="w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div>
              <span className="font-semibold text-sm font-heading" style={{ color: item.color }}>{item.step}: </span>
              <span className="text-xs text-txt-2">{item.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">mTLS — Mutual Authentication</h2>
      <p className="text-sm">In standard TLS, the client verifies the server but not vice versa. With mTLS, the server also requests a certificate from the client. This ensures that only trusted clients (services) can communicate — critical in zero-trust microservice architectures.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <div className="p-4 rounded-xl border border-[#3b82f6]/30 bg-[#3b82f6]/5">
          <h3 className="font-bold text-sm text-accent font-heading mb-2">Standard TLS</h3>
          <ul className="space-y-1 text-xs text-txt-2">
            <li>• Server authenticates to client</li>
            <li>• Client is anonymous</li>
            <li>• HTTPS for public websites</li>
            <li>• API calls with bearer tokens</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/5">
          <h3 className="font-bold text-sm text-accent font-heading mb-2">Mutual TLS (mTLS)</h3>
          <ul className="space-y-1 text-xs text-txt-2">
            <li>• Both parties authenticate</li>
            <li>• Service-to-service in Kubernetes</li>
            <li>• Istio / Linkerd service mesh</li>
            <li>• IoT device authentication</li>
          </ul>
        </div>
      </div>

      <KeyTakeaway variant="success">
        TLS 1.3 reduced the handshake from 2 round trips to 1 (and supports 0-RTT resumption for returning clients). Always enforce TLS 1.2+ and disable older versions. Certificate rotation is operationally important — automated tools like cert-manager in Kubernetes handle this.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
