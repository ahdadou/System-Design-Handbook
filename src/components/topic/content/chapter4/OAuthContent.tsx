"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, StepNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, step: StepNode };

const nodes: Node[] = [
  { id: "user", type: "system", position: { x: 0, y: 160 }, data: { label: "User", icon: "👤", color: "#3b82f6" } },
  { id: "app", type: "system", position: { x: 180, y: 160 }, data: { label: "Client App", sublabel: "Your Application", icon: "📱", color: "#06b6d4", description: "Never sees user's actual credentials. Gets access tokens instead." } },
  { id: "auth", type: "system", position: { x: 360, y: 80 }, data: { label: "Auth Server", sublabel: "Google/GitHub/etc", icon: "🔐", color: "#8b5cf6", description: "Authenticates user and issues access tokens (JWT). Example: Google, GitHub, Auth0, Keycloak." } },
  { id: "resource", type: "system", position: { x: 360, y: 240 }, data: { label: "Resource Server", sublabel: "Your API", icon: "🖥️", color: "#10b981", description: "Validates access tokens from Auth Server before serving protected resources." } },
];

const edges: Edge[] = [
  { id: "e1", source: "user", target: "app", label: "1. Click Login", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e2", source: "app", target: "auth", label: "2. Auth request", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e3", source: "auth", target: "user", label: "3. Login prompt", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 1.5, strokeDasharray: "4,4" }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e4", source: "auth", target: "app", label: "4. Auth code", animated: true, style: { stroke: "#10b981", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e5", source: "app", target: "auth", label: "5. Exchange code → token", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
  { id: "e6", source: "app", target: "resource", label: "6. API call + Bearer token", animated: true, style: { stroke: "#10b981", strokeWidth: 2 }, labelStyle: { fill: "#94a3b8", fontSize: 9 } },
];

const questions = [
  {
    question: "What is the key difference between OAuth 2.0 and OpenID Connect?",
    options: [
      "OAuth handles authentication; OpenID handles authorization",
      "OAuth is for authorization (access to resources); OpenID Connect adds authentication (who the user is) on top of OAuth",
      "They are the same protocol",
      "OpenID Connect is older than OAuth 2.0",
    ],
    correct: 1,
    explanation: "OAuth 2.0 is an authorization framework  it grants access to resources. OpenID Connect (OIDC) is an identity layer on top of OAuth 2.0 that adds authentication  it tells you WHO the user is via an ID token.",
  },
  {
    question: "In the OAuth 2.0 Authorization Code flow, why is the auth code exchanged server-side rather than directly in the browser?",
    options: [
      "Browsers do not support HTTP POST requests needed for token exchange",
      "Exchanging the code server-side keeps the access token out of browser history, logs, and referrer headers, preventing token leakage",
      "The authorization server only accepts requests from server IP addresses",
      "Browsers cannot store access tokens securely",
    ],
    correct: 1,
    explanation: "In the Authorization Code flow, the auth code is passed through the browser redirect but is short-lived and single-use. The actual access token exchange happens server-to-server (backend to auth server) using the client secret, so the sensitive access token never appears in the browser URL or history. This is why it is the most secure OAuth flow for server-side apps.",
  },
  {
    question: "What is PKCE (Proof Key for Code Exchange) and why is it used?",
    options: [
      "A method to encrypt JWT tokens before storing them in the browser",
      "An extension to the Authorization Code flow that prevents auth code interception attacks in mobile and SPA apps that cannot store a client secret",
      "A protocol for exchanging public keys between OAuth clients and servers",
      "A way to refresh expired access tokens without re-prompting the user",
    ],
    correct: 1,
    explanation: "Mobile apps and SPAs cannot securely store a client secret (it would be embedded in code users can inspect). PKCE solves this by generating a cryptographic code_verifier and code_challenge on the client. Even if an attacker intercepts the auth code, they cannot exchange it without the code_verifier, which was only known to the original client.",
  },
  {
    question: "Which OAuth 2.0 grant type is used for machine-to-machine (M2M) communication with no user involved?",
    options: [
      "Authorization Code",
      "Implicit",
      "Client Credentials",
      "Device Code",
    ],
    correct: 2,
    explanation: "The Client Credentials grant is for M2M scenarios where a service authenticates itself (not a user) to access another service. The client presents its client_id and client_secret to the auth server and receives an access token. Examples: a cron job calling an internal API, or a microservice calling another microservice.",
  },
  {
    question: "What is the purpose of a refresh token in OAuth 2.0?",
    options: [
      "To reset the user's password when their session expires",
      "To obtain a new access token after the current one expires, without requiring the user to log in again",
      "To refresh the auth server's certificate when it expires",
      "To sync the client's clock with the auth server's clock",
    ],
    correct: 1,
    explanation: "Access tokens are intentionally short-lived (minutes to hours) to limit damage from token theft. Refresh tokens are long-lived and stored securely. When an access token expires, the client presents the refresh token to the auth server to silently obtain a new access token without interrupting the user session.",
  },
  {
    question: "What is the difference between an access token and an ID token in OpenID Connect?",
    options: [
      "Access tokens are JWTs; ID tokens are opaque strings",
      "Access tokens authorize access to APIs; ID tokens contain claims about the authenticated user's identity (name, email, sub)",
      "ID tokens have a longer lifetime than access tokens",
      "Access tokens are sent in cookies; ID tokens are sent in HTTP headers",
    ],
    correct: 1,
    explanation: "In OIDC, the access token is a credential presented to resource servers to authorize API calls (Bearer token). The ID token is a JWT containing identity claims (who the user is) for the client application's consumption. The application reads the ID token to know who logged in; it uses the access token to make API calls on their behalf.",
  },
  {
    question: "Why should you never implement your own OAuth authorization server from scratch?",
    options: [
      "It is illegal to implement OAuth without a commercial license",
      "OAuth 2.0 has numerous security edge cases (token binding, PKCE, state parameter, redirect URI validation) where mistakes lead to critical vulnerabilities like token theft or account takeover",
      "Custom OAuth servers are not compatible with standard JWT libraries",
      "Only Google and GitHub are permitted to operate OAuth authorization servers",
    ],
    correct: 1,
    explanation: "OAuth security is notoriously complex: redirect URI validation flaws, missing state parameter (CSRF), implicit grant vulnerabilities, and improper token storage are all attack vectors. Mature providers (Auth0, Cognito, Okta, Clerk) have dedicated security teams, SOC 2 audits, and years of hardening. Rolling your own is a high-risk approach even for experienced teams.",
  },
  {
    question: "What does the OAuth 'scope' parameter control?",
    options: [
      "The geographic region where the auth server operates",
      "The specific permissions or resources the access token grants access to",
      "The expiration time of the access token",
      "The encryption algorithm used to sign the JWT",
    ],
    correct: 1,
    explanation: "Scopes define the granularity of access granted by an access token. For example, scope=read:repos grants read-only access to GitHub repositories, while scope=repo grants full access. The principle of least privilege means clients should request only the scopes they need. Users see the requested scopes during the consent screen.",
  },
  {
    question: "What is the OAuth 2.0 Device Code flow used for?",
    options: [
      "Authenticating IoT devices with no display or keyboard, like smart TVs or CLI tools, by displaying a code the user enters on a separate device",
      "Authorizing physical hardware devices to access manufacturing APIs",
      "A deprecated flow replaced by Authorization Code with PKCE",
      "Authenticating Docker containers when pulling from private registries",
    ],
    correct: 0,
    explanation: "The Device Code flow is designed for devices with limited input capabilities (smart TVs, gaming consoles, CLI tools). The device displays a short code and a URL. The user opens the URL on their phone or computer, enters the code, and authenticates. The device polls the auth server until the user completes authentication.",
  },
  {
    question: "How does a resource server (API) validate an OAuth access token?",
    options: [
      "It sends the token back to the client for verification",
      "It validates the JWT signature using the auth server's public key (for JWTs) or calls the auth server's introspection endpoint (for opaque tokens)",
      "It decrypts the token using a shared symmetric key stored in both servers",
      "It checks if the token exists in a local database of issued tokens",
    ],
    correct: 1,
    explanation: "For JWT access tokens, the resource server validates the signature using the auth server's public key (obtained from the JWKS endpoint), checks expiration (exp claim), and verifies the audience (aud) and issuer (iss). For opaque tokens, it calls the auth server's token introspection endpoint (RFC 7662) to check validity and retrieve associated metadata.",
  },
];

export default function OAuthContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">OAuth 2.0</strong> is an authorization framework that lets users grant third-party applications access to their resources without sharing passwords. <strong className="text-txt">OpenID Connect (OIDC)</strong> builds on OAuth to add authentication  proving who the user actually is.
      </p>
      <p>
        Every time you click "Login with Google" or "Connect with GitHub," you're using OAuth 2.0 + OIDC. The application never sees your Google password  it gets a limited access token instead.
      </p>

      <InteractiveDiagram nodes={nodes} edges={edges} nodeTypes={nodeTypes} title="OAuth 2.0 Authorization Code Flow" description="The most secure OAuth flow for server-side applications" height={350} />

      <h2 className="text-2xl font-bold font-heading text-txt">OAuth 2.0 Grant Types</h2>
      <div className="space-y-2">
        {[
          { type: "Authorization Code", use: "Server-side apps (most secure)", desc: "Short-lived auth code exchanged for token server-side. Never exposes token to browser.", color: "#3b82f6" },
          { type: "Authorization Code + PKCE", use: "Mobile & SPA apps", desc: "Like auth code but with Proof Key for Code Exchange. Prevents auth code interception.", color: "#06b6d4" },
          { type: "Client Credentials", use: "Machine-to-machine (M2M)", desc: "No user involved. Service authenticates with client ID+secret to get token.", color: "#8b5cf6" },
          { type: "Device Code", use: "TV/limited input devices", desc: "User shown a code to enter on another device (phone). Used by smart TVs, CLI tools.", color: "#10b981" },
        ].map((g) => (
          <div key={g.type} className="flex gap-3 p-3 rounded-lg bg-surface border border-border-ui">
            <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
            <div>
              <div className="font-semibold text-xs text-txt font-heading">{g.type}</div>
              <div className="text-[10px] text-txt-3">Use for: {g.use}</div>
              <p className="text-xs text-txt-2 mt-0.5">{g.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        Never implement your own OAuth server unless you have a dedicated security team. Use Auth0, Cognito, Clerk, or Okta. The OAuth spec has many edge cases and security pitfalls that can lead to critical vulnerabilities.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
