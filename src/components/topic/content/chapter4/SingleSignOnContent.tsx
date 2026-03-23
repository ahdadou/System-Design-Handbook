"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, StepNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, step: StepNode };

const nodes: Node[] = [
  { id: "user", type: "system", position: { x: 180, y: 20 }, data: { label: "User", icon: "👤", color: "#3b82f6" } },
  { id: "idp", type: "system", position: { x: 180, y: 140 }, data: { label: "Identity Provider", sublabel: "SSO Server (Okta, Auth0)", icon: "🔐", color: "#8b5cf6", description: "Authenticates the user once and issues tokens/assertions. All other apps trust this IdP." } },
  { id: "app1", type: "system", position: { x: 40, y: 280 }, data: { label: "App A", sublabel: "HR Portal", icon: "🏢", color: "#10b981" } },
  { id: "app2", type: "system", position: { x: 180, y: 280 }, data: { label: "App B", sublabel: "Slack", icon: "💬", color: "#10b981" } },
  { id: "app3", type: "system", position: { x: 320, y: 280 }, data: { label: "App C", sublabel: "GitHub", icon: "🐙", color: "#10b981" } },
];

const edges: Edge[] = [
  { id: "e1", source: "user", target: "idp", animated: true, label: "1. Login once", style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "idp", target: "user", animated: false, label: "Token", style: { stroke: "#8b5cf6", strokeWidth: 2, strokeDasharray: "5 5" } },
  { id: "e3", source: "idp", target: "app1", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e4", source: "idp", target: "app2", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e5", source: "idp", target: "app3", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
];

const questions = [
  {
    question: "What is the main benefit of Single Sign-On (SSO)?",
    options: [
      "It encrypts all data in transit",
      "Users authenticate once and gain access to all connected applications",
      "It eliminates the need for passwords entirely",
      "It stores passwords in a central database for all apps",
    ],
    correct: 1,
    explanation: "SSO lets users log in once to the Identity Provider (IdP) and then access all connected Service Providers (SPs) without re-authenticating. This improves UX and centralizes access control.",
  },
  {
    question: "What is the key difference between SAML and OAuth/OIDC?",
    options: [
      "SAML is newer; OAuth is older",
      "SAML uses XML assertions for enterprise federation; OAuth/OIDC uses JSON tokens and is designed for modern web/mobile apps",
      "OAuth requires on-premise servers; SAML is cloud-only",
      "SAML is for authorization; OAuth is for authentication",
    ],
    correct: 1,
    explanation: "SAML 2.0 uses XML-based assertions, is heavyweight, and is common in enterprise environments (Active Directory, Okta, enterprise portals). OAuth 2.0 + OIDC uses lightweight JSON tokens and is designed for web APIs and mobile apps.",
  },
  {
    question: "In an SSO system, what is the role of the Identity Provider (IdP)?",
    options: [
      "It stores the application's business data and user preferences",
      "It authenticates the user and issues tokens or assertions that connected Service Providers trust to grant access",
      "It acts as a reverse proxy routing requests to the correct application",
      "It manages API rate limits and request throttling across applications",
    ],
    correct: 1,
    explanation: "The IdP is the central authority for authentication. It verifies user credentials (password, MFA, biometrics) and issues signed tokens or assertions. Service Providers (the individual apps) trust the IdP's assertions without needing to authenticate the user themselves. Examples: Okta, Azure AD, Google Workspace, Auth0.",
  },
  {
    question: "What is the primary security risk of SSO, and how is it mitigated?",
    options: [
      "SSO transmits passwords to all connected applications, creating multiple exposure points",
      "The IdP is a single point of compromise: if it is breached, all connected applications are accessible; mitigated by MFA, phishing-resistant authentication, and continuous access evaluation",
      "SAML tokens can be replayed indefinitely without expiration",
      "SSO cannot enforce different permission levels across different applications",
    ],
    correct: 1,
    explanation: "SSO centralizes authentication, which means the IdP becomes a high-value target. A compromised IdP account grants access to all connected apps. Mitigations include: requiring MFA, using hardware security keys (FIDO2/WebAuthn), short token lifetimes, anomaly detection, and conditional access policies (block access from unrecognized locations or devices).",
  },
  {
    question: "What does SP-initiated SSO flow mean?",
    options: [
      "The Service Provider generates the SAML assertion and sends it to the IdP",
      "The user starts at a Service Provider (e.g., Slack), which redirects them to the IdP to authenticate, then redirects back with an assertion",
      "The IdP initiates the login flow by pushing tokens to all registered Service Providers",
      "The user's browser initiates a direct connection to the IdP bypassing the Service Provider",
    ],
    correct: 1,
    explanation: "In SP-initiated SSO, the user accesses the application (SP) directly. The SP detects no active session, generates a SAML AuthnRequest, and redirects the user to the IdP. After authentication, the IdP redirects the user back to the SP with a SAML assertion. This is the most common enterprise SSO flow.",
  },
  {
    question: "Why is Single Logout (SLO) in SSO systems more complex than Single Login?",
    options: [
      "Logout requires re-authenticating the user to confirm their identity",
      "SLO must propagate the logout to all active sessions across every Service Provider, requiring coordination among potentially many independent systems",
      "Logout tokens use a different cryptographic algorithm than login tokens",
      "SLO only works with SAML; OAuth/OIDC does not support logout",
    ],
    correct: 1,
    explanation: "When a user logs out of the IdP, all their sessions across every connected SP should also terminate. This requires the IdP to send logout requests to each SP that has an active session, and each SP must acknowledge and invalidate its local session. Network failures or unresponsive SPs can leave dangling sessions, making SLO a practically challenging feature.",
  },
  {
    question: "What is federated identity in the context of SSO?",
    options: [
      "A system where each application maintains a separate identity store synchronized nightly",
      "The ability to use an identity from one organization or domain (the IdP) to access resources in a different organization or domain without creating a separate account",
      "A load balancing strategy for distributing authentication requests across multiple IdP servers",
      "The practice of federating multiple databases into a single identity store",
    ],
    correct: 1,
    explanation: "Federated identity enables cross-organizational SSO. For example, a contractor from Company A can access Company B's systems using their Company A credentials, because both organizations trust a shared IdP or have established a SAML federation. This eliminates the need to create separate accounts for external users.",
  },
  {
    question: "How does SSO typically handle Multi-Factor Authentication (MFA)?",
    options: [
      "Each Service Provider must implement its own MFA independently",
      "MFA is enforced by the IdP during the initial authentication; once the SSO session is established, connected SPs inherit the MFA-verified session",
      "MFA is only supported in OAuth/OIDC flows, not SAML",
      "SSO and MFA are incompatible because SSO requires a single credential",
    ],
    correct: 1,
    explanation: "One of SSO's major security benefits is centralizing MFA at the IdP. The user authenticates with MFA once (e.g., password + TOTP or push notification). The resulting IdP session is marked as MFA-verified, and this claim is passed to SPs in the SAML assertion or OIDC token (amr claim). SPs can require MFA without implementing it themselves.",
  },
  {
    question: "Which protocol is most commonly used for enterprise SSO between an organization's internal systems and third-party SaaS applications?",
    options: [
      "OAuth 2.0 Client Credentials grant",
      "SAML 2.0 with the IdP configured in the SaaS application",
      "OpenID Connect with the Device Code flow",
      "Kerberos tickets transmitted over HTTPS",
    ],
    correct: 1,
    explanation: "SAML 2.0 is the dominant protocol for enterprise B2B SSO. Most SaaS applications (Salesforce, Slack, GitHub Enterprise, AWS SSO) support SAML SP configuration where the enterprise's IdP (Okta, Azure AD, Ping Identity) acts as the SAML IdP. The SP is configured with the IdP's metadata and certificate to validate incoming assertions.",
  },
  {
    question: "What claim in a SAML assertion uniquely identifies the authenticated user?",
    options: [
      "The NameID element, which contains a persistent or transient identifier for the user",
      "The X.509 certificate embedded in the SAML signature",
      "The Issuer element identifying the IdP",
      "The NotBefore timestamp indicating when the session started",
    ],
    correct: 0,
    explanation: "The NameID element in a SAML assertion carries the user's identifier as seen by the IdP. It can be a persistent ID (same value every session, enabling user account linking in the SP), transient (random, privacy-preserving), or an email address. The SP maps the NameID to its own user record to establish the session.",
  },
];

export default function SingleSignOnContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Single Sign-On (SSO)</strong> lets users authenticate once with a central Identity Provider and then access multiple applications without logging in again. Instead of each app maintaining its own user database, they all trust the same IdP to verify identity.
      </p>
      <p>
        You use SSO every day: logging in with Google to access YouTube, Gmail, and Drive without separate passwords. Enterprise SSO (Okta, Azure AD) extends this to internal tools  log in once to access Slack, GitHub, Jira, Confluence, and your HR portal.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="SSO Architecture"
        description="One identity provider, multiple trusting applications"
        height={380}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">SSO Flow (SAML)</h2>
      <div className="space-y-2">
        {[
          { step: 1, action: "User visits App A (Service Provider)", color: "#3b82f6" },
          { step: 2, action: "App A redirects user to IdP with SAML request", color: "#3b82f6" },
          { step: 3, action: "IdP authenticates user (username/password or MFA)", color: "#8b5cf6" },
          { step: 4, action: "IdP issues signed SAML assertion (XML) and redirects back", color: "#8b5cf6" },
          { step: 5, action: "App A validates assertion signature and grants access", color: "#10b981" },
          { step: 6, action: "User visits App B  IdP session exists, assertion issued instantly", color: "#10b981" },
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface border border-border-ui">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white" style={{ backgroundColor: item.color }}>
              {item.step}
            </div>
            <span className="text-xs text-txt-2">{item.action}</span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">SAML vs OAuth 2.0 + OIDC</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { name: "SAML 2.0", points: ["XML-based assertions", "Enterprise & legacy systems", "SP-initiated or IdP-initiated", "Complex but feature-rich", "Okta, ADFS, Shibboleth"], color: "#f59e0b" },
          { name: "OAuth 2.0 + OIDC", points: ["JSON Web Tokens (JWT)", "Modern web & mobile apps", "Authorization + identity layer", "Lightweight & developer-friendly", "Google, Auth0, Cognito"], color: "#3b82f6" },
        ].map((item) => (
          <div key={item.name} className="p-4 rounded-xl border border-border-ui bg-surface">
            <h3 className="font-bold text-sm font-heading mb-3" style={{ color: item.color }}>{item.name}</h3>
            <ul className="space-y-1">
              {item.points.map((p) => (
                <li key={p} className="text-xs text-txt-2 flex gap-2">
                  <span style={{ color: item.color }}>•</span> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="info">
        For new applications, use OAuth 2.0 + OpenID Connect. For integrating with enterprise systems that already use SAML (Active Directory, legacy portals), implement SAML. Most modern IdPs (Okta, Auth0) support both.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
