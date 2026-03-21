"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { QuizBlock } from "@/components/ui/QuizBlock";

const questions = [
  {
    question: "What problem does GraphQL solve that REST struggles with?",
    options: [
      "GraphQL is faster than REST",
      "Over-fetching and under-fetching  clients get exactly the data they need",
      "GraphQL provides better security",
      "GraphQL works without an internet connection",
    ],
    correct: 1,
    explanation: "REST returns fixed response shapes. GraphQL lets clients specify exactly what fields they need  no more getting a 50-field object when you need 3 fields (over-fetching), or making 5 calls to get related data (under-fetching).",
  },
  {
    question: "Why would you choose gRPC for internal microservice communication?",
    options: [
      "gRPC has better browser support than REST",
      "gRPC uses Protocol Buffers for efficient binary serialization  5-10x smaller and faster than JSON",
      "gRPC is easier to debug",
      "gRPC supports caching better",
    ],
    correct: 1,
    explanation: "gRPC uses Protocol Buffers (binary format) which is much more efficient than JSON. Combined with HTTP/2 multiplexing, it's ideal for high-throughput internal service communication.",
  },
];

export default function RestGraphqlGrpcContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        REST, GraphQL, and gRPC are three dominant API paradigms, each with distinct trade-offs. Choosing the right one depends on your use case, client types, and performance requirements.
      </p>

      <ComparisonTable
        title="REST vs GraphQL vs gRPC"
        columns={[
          { key: "rest", label: "REST", color: "#3b82f6" },
          { key: "graphql", label: "GraphQL", color: "#f59e0b" },
          { key: "grpc", label: "gRPC", color: "#10b981" },
        ]}
        rows={[
          { feature: "Protocol", rest: "HTTP/1.1, HTTP/2", graphql: "HTTP/1.1, HTTP/2", grpc: "HTTP/2 (required)" },
          { feature: "Data Format", rest: "JSON/XML", graphql: "JSON", grpc: "Protocol Buffers (binary)" },
          { feature: "Schema", rest: "OpenAPI (optional)", graphql: "Required (SDL)", grpc: "Required (.proto)" },
          { feature: "Type Safety", rest: "Optional", graphql: "Strong", grpc: "Strong" },
          { feature: "Browser Support", rest: "Native", graphql: "Native", grpc: "Limited (grpc-web)" },
          { feature: "Performance", rest: "Good", graphql: "Good", grpc: "Excellent" },
          { feature: "Streaming", rest: "Limited (SSE)", graphql: "Subscriptions", grpc: "Bidirectional" },
          { feature: "Best For", rest: "Public APIs, CRUD", graphql: "Complex queries, mobile", grpc: "Internal microservices" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { api: "REST", color: "#3b82f6", example: 'GET /users/123\nGET /users/123/posts\nGET /users/123/followers', when: "Public APIs, simple CRUD, when simplicity matters" },
          { api: "GraphQL", color: "#f59e0b", example: 'query {\n  user(id: "123") {\n    name\n    posts { title }\n    followers { count }\n  }\n}', when: "Mobile apps, complex data relationships, BFF pattern" },
          { api: "gRPC", color: "#10b981", example: 'service UserService {\n  rpc GetUser(GetUserReq)\n    returns (User);\n}', when: "Internal microservices, streaming, high-performance" },
        ].map((a) => (
          <div key={a.api} className="p-4 rounded-xl border border-border-ui bg-surface">
            <div className="font-bold text-sm font-heading mb-2" style={{ color: a.color }}>{a.api}</div>
            <pre className="text-[10px] font-mono text-txt-2 mb-3 bg-canvas p-2 rounded overflow-x-auto">{a.example}</pre>
            <p className="text-xs text-txt-3"><strong className="text-txt-2">Use when:</strong> {a.when}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        A common pattern: GraphQL (or REST) for public/mobile APIs, gRPC for internal service-to-service communication. Netflix uses gRPC between 1000+ microservices but REST+GraphQL for the public API.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
