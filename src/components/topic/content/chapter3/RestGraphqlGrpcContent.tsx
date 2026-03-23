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
  {
    question: "What does 'over-fetching' mean in the context of REST APIs?",
    options: [
      "Making too many API requests in a short time period",
      "A REST response returning more data than the client needs, wasting bandwidth and processing",
      "A server fetching data from too many databases per request",
      "Fetching the same data multiple times from a cache",
    ],
    correct: 1,
    explanation: "Over-fetching occurs when a REST endpoint returns a fixed response with many fields, but the client only needs a few. For example, a mobile app displaying just a user's name and avatar receives the entire user object including address, preferences, and account metadata. GraphQL eliminates this by letting clients specify exactly which fields to return.",
  },
  {
    question: "What is 'under-fetching' (also known as the N+1 problem) in REST?",
    options: [
      "A server responding with an incomplete dataset due to a bug",
      "A client needing to make multiple requests to gather all required data because a single endpoint doesn't return everything needed",
      "A REST API that returns data slower than expected",
      "A client that doesn't send enough parameters in a request",
    ],
    correct: 1,
    explanation: "Under-fetching means one request isn't enough. To display a user's posts with each post's comments, you might call GET /users/1, then GET /users/1/posts, then GET /posts/{id}/comments for each post — potentially N+1 requests. GraphQL solves this with a single query that fetches all related data in one network round trip.",
  },
  {
    question: "gRPC requires HTTP/2. What key feature of HTTP/2 makes gRPC particularly efficient for microservice communication?",
    options: [
      "HTTP/2 supports larger request payloads than HTTP/1.1",
      "HTTP/2 multiplexing allows multiple requests and responses to be in-flight simultaneously over a single TCP connection, eliminating head-of-line blocking",
      "HTTP/2 encrypts data with a stronger algorithm than HTTP/1.1",
      "HTTP/2 supports JSON natively while HTTP/1.1 does not",
    ],
    correct: 1,
    explanation: "HTTP/2 multiplexing sends multiple streams over a single TCP connection. This eliminates the HTTP/1.1 limitation of one request per connection, which caused head-of-line blocking and required connection pool management. gRPC leverages this to handle high-concurrency service-to-service calls with lower overhead.",
  },
  {
    question: "What is a 'Protocol Buffer' (.proto file) in gRPC?",
    options: [
      "A network protocol for establishing gRPC connections",
      "A language-neutral schema definition for messages and service interfaces that generates type-safe client and server code in multiple languages",
      "A binary file format for storing gRPC logs",
      "A configuration file for gRPC load balancing",
    ],
    correct: 1,
    explanation: "Protocol Buffers (protobuf) are Google's interface definition language. A .proto file defines message structures and service methods. The protoc compiler generates strongly-typed client stubs and server interfaces in any supported language (Go, Java, Python, C++, etc.), ensuring type safety across service boundaries and enabling compact binary serialization.",
  },
  {
    question: "What is the 'Backend for Frontend' (BFF) pattern and which API style is typically used to implement it?",
    options: [
      "A gRPC service that generates frontend code automatically",
      "Separate API layers per client type (mobile BFF, web BFF) — often implemented with GraphQL or REST — that aggregate and tailor backend data for each frontend's specific needs",
      "A pattern where a single REST endpoint serves all client types",
      "A backend service that caches frontend assets",
    ],
    correct: 1,
    explanation: "The BFF pattern addresses the problem of different clients (mobile, web, partner) having different data needs. Each client gets its own API layer that aggregates data from backend microservices and shapes it optimally. GraphQL is popular for BFF because clients can request exactly the fields they need, making it natural for mobile (bandwidth-constrained) vs web (richer data) differences.",
  },
  {
    question: "Why does gRPC have limited browser support, and how is this typically addressed?",
    options: [
      "gRPC uses a proprietary encryption method that browsers cannot decrypt",
      "Browsers cannot make raw HTTP/2 requests with full control of headers and frames that gRPC requires — grpc-web is a proxy-based workaround",
      "gRPC is blocked by browser security policies for cross-origin requests",
      "gRPC requires WebSocket connections which modern browsers do not support",
    ],
    correct: 1,
    explanation: "Web browsers expose XHR and Fetch APIs but do not allow direct control of HTTP/2 frames needed by gRPC's binary framing protocol. grpc-web is a JavaScript library that communicates with a proxy (Envoy) which translates between grpc-web (HTTP/1.1 compatible) and native gRPC (HTTP/2). This is why gRPC is primarily used for server-to-server communication.",
  },
  {
    question: "Netflix uses gRPC between microservices but REST/GraphQL for public APIs. What architectural principle does this illustrate?",
    options: [
      "Netflix doesn't trust gRPC for public-facing traffic",
      "Different API styles serve different purposes — gRPC for high-performance internal communication, REST/GraphQL for broad client compatibility and developer experience",
      "Public APIs must use REST by regulatory requirement",
      "gRPC is too expensive to operate at public scale",
    ],
    correct: 1,
    explanation: "Internal microservice communication (same company, controlled environment) prioritizes throughput, latency, and type safety — gRPC excels here. Public APIs serve diverse clients (browsers, mobile apps, third parties) that need broad compatibility, human-readable formats, and caching — REST/GraphQL excels here. The best architectures use each API style where it fits best.",
  },
  {
    question: "Which API paradigm provides built-in support for bidirectional streaming, making it suitable for real-time data flows between services?",
    options: [
      "REST with long polling",
      "GraphQL with REST fallback",
      "gRPC with bidirectional streaming via HTTP/2",
      "REST with Server-Sent Events",
    ],
    correct: 2,
    explanation: "gRPC supports four communication patterns: unary (request-response), server streaming, client streaming, and bidirectional streaming — all over a single HTTP/2 connection. This makes gRPC suitable for real-time data flows like live telemetry, audio/video processing pipelines, and chat systems between backend services where both sides continuously send and receive data.",
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
