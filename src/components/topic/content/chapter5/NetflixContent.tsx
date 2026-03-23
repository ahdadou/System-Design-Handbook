"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "user", type: "system", position: { x: 220, y: 20 }, data: { label: "User", icon: "📺", color: "#ef4444" } },
  { id: "cdn", type: "system", position: { x: 220, y: 110 }, data: { label: "Open Connect CDN", sublabel: "ISP-embedded boxes", icon: "🌐", color: "#ef4444", description: "Netflix deploys its own CDN appliances inside ISPs. 95% of traffic served from Open Connect, minimizing internet backbone usage." } },
  { id: "api", type: "system", position: { x: 220, y: 210 }, data: { label: "API Gateway", sublabel: "Zuul / load balancer", icon: "🔀", color: "#3b82f6" } },
  { id: "video", type: "system", position: { x: 60, y: 320 }, data: { label: "Video Service", icon: "🎬", color: "#ef4444", description: "Handles video manifest requests, selects optimal CDN node for the user's location and network conditions" } },
  { id: "user_svc", type: "system", position: { x: 190, y: 320 }, data: { label: "User Service", icon: "👤", color: "#3b82f6" } },
  { id: "rec", type: "system", position: { x: 320, y: 320 }, data: { label: "Recommendation", sublabel: "ML-powered", icon: "🤖", color: "#8b5cf6", description: "Personalized recommendations using collaborative filtering and deep learning on viewing history" } },
  { id: "transcode", type: "system", position: { x: 80, y: 440 }, data: { label: "Transcoding Pipeline", sublabel: "1200+ versions per title", icon: "⚙️", color: "#f59e0b", description: "Every video is encoded into 1200+ versions: multiple resolutions (240p-4K), bitrates, codecs (H.264, H.265, AV1), and audio tracks" } },
  { id: "s3", type: "database", position: { x: 240, y: 440 }, data: { label: "S3 Storage", sublabel: "Video files", color: "#f59e0b" } },
  { id: "cassandra", type: "database", position: { x: 370, y: 440 }, data: { label: "Cassandra", sublabel: "User data, ratings", color: "#3b82f6" } },
];

const edges: Edge[] = [
  { id: "e1", source: "user", target: "cdn", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e2", source: "cdn", target: "api", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e3", source: "api", target: "video", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e4", source: "api", target: "user_svc", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e5", source: "api", target: "rec", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e6", source: "video", target: "transcode", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e7", source: "transcode", target: "s3", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e8", source: "user_svc", target: "cassandra", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
];

const questions = [
  {
    question: "What is Netflix's Open Connect and why does it exist?",
    options: [
      "A public API for third-party developers to build Netflix apps",
      "Netflix's own CDN appliances deployed inside ISPs to serve video traffic locally",
      "An open-source streaming protocol used by Netflix",
      "A monitoring system for Netflix's microservices",
    ],
    correct: 1,
    explanation: "Open Connect is Netflix's proprietary CDN. They deploy their own appliance servers inside ISPs globally. When users watch Netflix, video is served from a nearby ISP box rather than Netflix's data centers, reducing latency and internet backbone usage.",
  },
  {
    question: "Why does Netflix transcode each video into 1200+ versions?",
    options: [
      "For DRM and piracy protection",
      "To support multiple resolutions, bitrates, codecs, and audio tracks for adaptive bitrate streaming",
      "To comply with international broadcasting regulations",
      "To enable faster upload from content creators",
    ],
    correct: 1,
    explanation: "Adaptive Bitrate Streaming (ABR) adjusts video quality based on network conditions. Players switch between versions in real-time  switching to lower bitrate when bandwidth drops, higher when it improves. 1200+ versions cover all resolution/bitrate/codec combinations.",
  },
  {
    question: "What did Netflix pioneer to test system resilience?",
    options: [
      "Blue-green deployments",
      "Chaos Engineering  intentionally injecting failures in production",
      "Canary releases",
      "Feature flags",
    ],
    correct: 1,
    explanation: "Netflix created Chaos Monkey (part of the Simian Army), a tool that randomly terminates production instances to ensure their systems could survive unexpected failures. This practice of intentionally breaking things to build resilience is called Chaos Engineering.",
  },
  {
    question: "How does Adaptive Bitrate Streaming (ABR) work in Netflix's player?",
    options: [
      "The server selects the bitrate based on the user's subscription plan",
      "The player continuously monitors available bandwidth and buffer level, switching between pre-encoded segments of different quality levels in real time",
      "The video is compressed more aggressively when the server detects high load",
      "Users manually select quality in the settings menu, which persists for the session",
    ],
    correct: 1,
    explanation: "Netflix uses HLS or MPEG-DASH. Video is split into 2-10 second segments, each encoded at multiple bitrates. The player maintains a buffer and tracks download speed. If download speed drops below the current segment bitrate, the player switches to a lower quality segment for the next chunk. This happens seamlessly without interruption, trading quality for uninterrupted playback.",
  },
  {
    question: "Netflix uses Cassandra for user viewing history and ratings. What property of Cassandra makes it a good fit?",
    options: [
      "Cassandra supports ACID transactions, ensuring viewing history is always accurate",
      "Cassandra's wide-column model and leaderless replication handle high write throughput across multiple regions with tunable consistency",
      "Cassandra supports full-text search, making it easy to query viewing history",
      "Cassandra is the only database that supports time-series data",
    ],
    correct: 1,
    explanation: "Netflix's viewing events (play, pause, seek, completion) generate enormous write volume globally. Cassandra's leaderless architecture means any node in any region can accept writes, with no single write master. With tunable consistency (e.g., LOCAL_QUORUM), Netflix can balance consistency and availability per-region. The wide-column model allows storing a user's entire viewing history under a single partition key (user_id), enabling fast reads.",
  },
  {
    question: "What is Netflix's EVCache and why did they build it?",
    options: [
      "A video encoding cache that stores partially transcoded video segments",
      "A distributed cache built on top of Memcached, deployed across multiple AWS availability zones to cache user data with very high availability",
      "An event-driven cache that invalidates data based on Kafka events",
      "A CDN edge cache specifically for serving static web assets",
    ],
    correct: 1,
    explanation: "EVCache (Ephemeral Volatile Cache) is Netflix's in-house distributed caching system built on top of Memcached. It replicates cache data across multiple AWS Availability Zones so that a single AZ failure does not cause a cache cold start. It serves user preferences, recommendations, and session data. By replicating across AZs (at some cost in memory), Netflix achieves extremely high cache hit rates even during infrastructure failures.",
  },
  {
    question: "How does Netflix's recommendation system generate personalized content suggestions at scale?",
    options: [
      "By surveying users weekly and manually curating recommendations",
      "By running collaborative filtering and deep learning models on viewing history, ratings, and behavioral signals using Apache Spark, with results cached per user",
      "By sorting content alphabetically and showing the first items that match the user's subscription tier",
      "By recommending the most popular titles globally without personalization",
    ],
    correct: 1,
    explanation: "Netflix's recommendation engine uses collaborative filtering (users with similar tastes liked X, so you might too), content-based filtering (you watched thriller A, here are similar thrillers), and deep learning models. These run on Apache Spark on AWS, processing petabytes of behavioral data. Results are pre-computed daily and cached (in EVCache) per user. At request time, the system serves from cache with real-time contextual adjustments (time of day, device type).",
  },
  {
    question: "What is the circuit breaker pattern, and how does Netflix use it in their microservices architecture?",
    options: [
      "A hardware failsafe that cuts power to servers during overload to prevent damage",
      "A software pattern that monitors service call failure rates and stops routing requests to a failing dependency, returning fallback responses instead",
      "A load balancing algorithm that routes traffic to the least loaded service instance",
      "A database connection pool that limits the maximum number of concurrent queries",
    ],
    correct: 1,
    explanation: "Netflix built Hystrix (now Resilience4j) to implement circuit breakers. If a dependency (e.g., the Recommendation Service) starts failing, the circuit opens: subsequent calls immediately return a fallback (e.g., default popular titles) instead of waiting for a timeout. After a cooldown period, the circuit half-opens to test if the dependency recovered. This prevents cascading failures where one slow service causes all dependent services to exhaust their thread pools.",
  },
  {
    question: "How does Netflix's video transcoding pipeline process a new title efficiently?",
    options: [
      "A single powerful server transcodes the entire video sequentially through all 1200+ versions",
      "The video is split into parallel chunks, each processed independently by many machines simultaneously, then reassembled and stored as segments on S3",
      "Transcoding happens in real time on the CDN edge servers when a user first requests a title",
      "Users' devices perform transcoding locally when they first download a title",
    ],
    correct: 1,
    explanation: "Netflix's transcoding pipeline parallelizes both horizontally (across many encoding jobs simultaneously) and vertically (splitting one video file into chunks encoded in parallel). Each video is cut into scenes, then each scene is encoded at all required bitrate/resolution/codec combinations concurrently across thousands of machines. Encoded segments are stored in S3 as short chunks (2-10 seconds each). A 2-hour movie generates millions of segment files.",
  },
  {
    question: "Why does Netflix run almost entirely on AWS rather than its own data centers?",
    options: [
      "Netflix does not have the engineering talent to manage data centers",
      "AWS provides global infrastructure, elastic scaling for unpredictable peak demand (e.g., new season releases), and managed services that reduce operational overhead",
      "AWS guarantees 100% uptime, eliminating the need for Netflix's own resilience engineering",
      "It is cheaper for Netflix to use AWS than any alternative at their scale",
    ],
    correct: 1,
    explanation: "When a popular new season releases, Netflix may see 2-3x normal traffic within hours. AWS allows Netflix to elastically provision thousands of additional servers within minutes. Building and maintaining global data centers at sufficient scale to handle these peaks would require massive capital expenditure that sits idle most of the time. AWS also provides managed services (RDS, S3, EMR) that reduce the engineering burden of infrastructure management.",
  },
];

export default function NetflixContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Netflix</strong> serves 220M+ subscribers in 190 countries, delivering 100M+ hours of video daily. It accounts for roughly 15% of global internet traffic during peak hours. Designing this system requires solving video transcoding at scale, a custom CDN strategy, and microservices resilience.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { stat: "220M+", label: "Subscribers" },
          { stat: "190", label: "Countries" },
          { stat: "15%", label: "Internet traffic" },
          { stat: "1,200+", label: "Video versions each" },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-xl border border-border-ui bg-surface text-center">
            <div className="text-xl font-bold text-[#ef4444] font-heading">{item.stat}</div>
            <div className="text-[10px] text-txt-3 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Netflix Architecture"
        description="Click nodes to explore component details"
        height={530}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Key Challenges</h2>
      <div className="space-y-3">
        {[
          { title: "Video Transcoding at Scale", detail: "Every uploaded title must be encoded into 1200+ variants. Netflix uses a distributed encoding pipeline (formerly on AWS EMR, now custom) that processes each video in parallel chunks across thousands of machines. Encoding a 2-hour movie takes hours even with parallelism.", color: "#ef4444" },
          { title: "CDN Strategy", detail: "Netflix built Open Connect  their own CDN. Instead of paying for general CDN bandwidth, they deploy custom servers inside ISPs. Each box pre-loads popular content for that region. 95%+ of streaming traffic comes from Open Connect appliances, not Netflix data centers.", color: "#f59e0b" },
          { title: "Adaptive Bitrate Streaming", detail: "Players use HLS or MPEG-DASH to dynamically select video quality. If your network slows, the player seamlessly switches to a lower bitrate segment. Netflix builds custom adaptive algorithms that balance quality, buffer size, and switching frequency.", color: "#3b82f6" },
          { title: "Personalization at Scale", detail: "80% of watched content comes from recommendations. Netflix's ML models analyze viewing history, ratings, time of day, device type, and similar user behavior. The recommendation system runs on Apache Spark on AWS and updates models daily.", color: "#8b5cf6" },
        ].map((item) => (
          <div key={item.title} className="p-4 rounded-xl border border-border-ui bg-surface">
            <h3 className="font-bold text-sm font-heading mb-2" style={{ color: item.color }}>{item.title}</h3>
            <p className="text-xs text-txt-2">{item.detail}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Data Model</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { db: "Cassandra", use: "User profiles, viewing history, ratings. Wide-column DB handles high write throughput across regions.", color: "#3b82f6" },
          { db: "MySQL / RDS", use: "Billing, subscription data, content licensing metadata. Relational for transactional accuracy.", color: "#06b6d4" },
          { db: "S3", use: "All video files. Each title stored as thousands of segment files (2–10 second chunks) per codec/bitrate combination.", color: "#f59e0b" },
          { db: "Redis / EVCache", use: "Session data, user preferences cache, top-N recommendations cache. Netflix built EVCache on top of Memcached.", color: "#10b981" },
        ].map((item) => (
          <div key={item.db} className="p-3 rounded-lg border border-border-ui bg-surface">
            <span className="font-bold text-sm font-heading" style={{ color: item.color }}>{item.db}: </span>
            <span className="text-xs text-txt-2">{item.use}</span>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        Netflix invented Chaos Engineering  they run Chaos Monkey in production, randomly killing services to ensure resilience. Their microservices architecture (700+ services) is coordinated using Hystrix for circuit breaking and Eureka for service discovery. Every component is designed to degrade gracefully.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
