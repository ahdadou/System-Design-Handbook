"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { TlsHandshakeDiagram } from "@/components/diagrams/ssl-tls/TlsHandshakeDiagram";

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
  {
    question: "What key improvement did TLS 1.3 make over TLS 1.2 in terms of performance?",
    options: [
      "TLS 1.3 uses stronger 4096-bit keys, improving security at the cost of speed",
      "TLS 1.3 reduced the handshake from 2 round trips to 1, and supports 0-RTT resumption for returning clients",
      "TLS 1.3 eliminates the need for Certificate Authorities entirely",
      "TLS 1.3 uses UDP instead of TCP for faster connection establishment",
    ],
    correct: 1,
    explanation: "TLS 1.3 redesigned the handshake to require only 1 round trip (vs 2 in TLS 1.2) before application data flows. For returning clients, 0-RTT resumption allows sending data with the very first message. TLS 1.3 also eliminated weak cipher suites and deprecated RSA key exchange in favor of ephemeral Diffie-Hellman.",
  },
  {
    question: "What is perfect forward secrecy (PFS) in TLS, and why is it important?",
    options: [
      "PFS ensures that encrypted packets are never stored on intermediate routers",
      "PFS uses ephemeral session keys (ECDHE) so that compromising the server's long-term private key cannot decrypt past recorded sessions",
      "PFS is a certificate pinning technique that prevents man-in-the-middle attacks",
      "PFS requires certificates to be rotated on every connection",
    ],
    correct: 1,
    explanation: "With PFS (provided by ECDHE key exchange), a unique ephemeral key pair is generated for each session. Even if an attacker records encrypted traffic and later compromises the server's private key, they cannot decrypt past sessions because the ephemeral keys were never stored. TLS 1.3 mandates PFS by removing non-ephemeral cipher suites.",
  },
  {
    question: "During a TLS handshake, at what point does the communication switch from asymmetric to symmetric encryption?",
    options: [
      "Immediately after the ClientHello message",
      "After both parties derive the symmetric session key via key exchange (ECDHE), all subsequent data is encrypted symmetrically",
      "After the server certificate is validated by the client",
      "Symmetric encryption is not used in TLS; all communication uses RSA",
    ],
    correct: 1,
    explanation: "Asymmetric cryptography (public/private key) is used only during the handshake for authentication and key exchange. Once both parties derive the same symmetric session key (via ECDHE), all application data is encrypted with fast symmetric ciphers like AES-GCM. Asymmetric operations are orders of magnitude slower than symmetric, so this hybrid approach is essential for performance.",
  },
  {
    question: "What is certificate pinning, and what problem does it solve?",
    options: [
      "Pinning is attaching an expiration date to a certificate to enforce rotation",
      "Pinning hardcodes a specific certificate or public key in the client, preventing acceptance of a different certificate even if signed by a trusted CA",
      "Pinning is a technique to compress certificate chains for faster transmission",
      "Pinning ensures the server certificate is pinned to a specific IP address",
    ],
    correct: 1,
    explanation: "Certificate pinning defends against a compromised CA issuing a fraudulent certificate for your domain. By hardcoding your expected certificate or public key in the client (common in mobile apps), the client rejects any other certificate even if it chains to a trusted root CA. The downside is operational complexity: if you rotate your certificate, you must update all clients.",
  },
  {
    question: "Which service mesh tools implement mTLS automatically between microservices in Kubernetes?",
    options: [
      "Redis and Memcached (in-cluster caching layers)",
      "Istio and Linkerd, which inject sidecar proxies that handle mTLS transparently without application code changes",
      "Prometheus and Grafana (monitoring tools)",
      "Nginx Ingress and Traefik (ingress controllers)",
    ],
    correct: 1,
    explanation: "Istio and Linkerd inject Envoy sidecar proxies alongside each pod. These proxies handle mTLS automatically, including certificate issuance, rotation, and mutual authentication. Application code communicates over plaintext to its local sidecar; the sidecar encrypts and authenticates traffic to other sidecars. This is zero-trust networking for microservices without code changes.",
  },
  {
    question: "What does HSTS (HTTP Strict Transport Security) enforce?",
    options: [
      "It forces all traffic to use HTTP/2 instead of HTTP/1.1",
      "It instructs browsers to only connect to the site over HTTPS for a specified duration, even if the user types http://",
      "It requires servers to use TLS 1.3 and reject older protocol versions",
      "It encrypts HTTP headers in addition to the body",
    ],
    correct: 1,
    explanation: "HSTS is an HTTP response header (Strict-Transport-Security) that tells browsers to always use HTTPS for the domain for the specified max-age. This prevents protocol downgrade attacks where an attacker intercepts an initial HTTP request. Once a browser sees HSTS, it refuses to connect over HTTP even if the user types http:// or clicks an http:// link.",
  },
  {
    question: "What does a TLS certificate's Subject Alternative Name (SAN) field contain?",
    options: [
      "The certificate's expiration date and the CA's contact information",
      "The list of domain names and IP addresses the certificate is valid for",
      "The public key algorithm and key length used to generate the certificate",
      "The OCSP responder URL for checking certificate revocation status",
    ],
    correct: 1,
    explanation: "The SAN field lists all the domains, subdomains, and IP addresses the certificate is valid for (e.g., example.com, www.example.com, api.example.com). Modern TLS requires SANs; the older Common Name (CN) field is deprecated for hostname validation. Wildcard certificates use *.example.com in the SAN to cover all direct subdomains.",
  },
  {
    question: "What is OCSP stapling and why is it used?",
    options: [
      "A technique where the server compresses its certificate chain before sending it to the client",
      "The server proactively fetches and caches the CA's OCSP response, then staples it to the TLS handshake so clients can verify revocation status without making a separate CA request",
      "A method for pinning the CA certificate to prevent substitution attacks",
      "A compression algorithm applied to TLS session tickets for performance",
    ],
    correct: 1,
    explanation: "Normally, clients would query the CA's OCSP endpoint during every TLS handshake to check if a certificate has been revoked, adding latency and a privacy concern (the CA learns which sites you visit). With OCSP stapling, the server queries the OCSP endpoint itself, caches the signed response, and includes it in the TLS handshake. Clients get revocation status with no extra round trip.",
  },
];

export default function SslTlsContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">TLS (Transport Layer Security)</strong> encrypts data in transit between client and server, preventing eavesdropping and tampering. SSL is the older predecessor  both terms are used interchangeably, but all modern systems use TLS 1.2 or 1.3. <strong className="text-txt">mTLS</strong> (mutual TLS) extends this by requiring both parties to authenticate.
      </p>

      <TlsHandshakeDiagram />

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

      <h2 className="text-2xl font-bold font-heading text-txt">mTLS  Mutual Authentication</h2>
      <p className="text-sm">In standard TLS, the client verifies the server but not vice versa. With mTLS, the server also requests a certificate from the client. This ensures that only trusted clients (services) can communicate  critical in zero-trust microservice architectures.</p>
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
        TLS 1.3 reduced the handshake from 2 round trips to 1 (and supports 0-RTT resumption for returning clients). Always enforce TLS 1.2+ and disable older versions. Certificate rotation is operationally important  automated tools like cert-manager in Kubernetes handle this.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
