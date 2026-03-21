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
