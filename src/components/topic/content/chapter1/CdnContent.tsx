"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { CdnCacheFlowDiagram } from "@/components/diagrams/cdn/CdnCacheFlowDiagram";

const questions = [
  {
    question: "What is the main benefit of using a CDN?",
    options: [
      "Reduced server costs",
      "Serving content from edge servers geographically close to users",
      "Encrypting all network traffic",
      "Eliminating the need for a database",
    ],
    correct: 1,
    explanation: "CDNs reduce latency by serving cached content from edge servers near users. A user in Singapore getting content from a Singapore CDN node vs. a US server saves 150-200ms per request.",
  },
  {
    question: "What is the difference between CDN Push and CDN Pull?",
    options: [
      "Push uses TCP, Pull uses UDP",
      "Push: you upload content to CDN proactively; Pull: CDN fetches from origin on first request",
      "Push is for dynamic content, Pull is for static content",
      "Push CDNs are cheaper than Pull CDNs",
    ],
    correct: 1,
    explanation: "Push CDN: you manually upload files to CDN (good for large files, predictable traffic). Pull CDN: CDN fetches from origin on first request and caches it (simpler, good for unknown access patterns).",
  },
  {
    question: "What is a CDN 'origin server'?",
    options: [
      "The CDN's central management server",
      "The original source server the CDN fetches content from on a cache miss",
      "The user's browser cache",
      "The DNS server that resolves CDN hostnames",
    ],
    correct: 1,
    explanation: "The origin server is your primary web server or storage (e.g., S3 bucket, application server). CDN edge nodes fetch content from the origin on a cache miss and then serve subsequent requests from their local cache.",
  },
  {
    question: "What type of content is best suited for CDN caching?",
    options: [
      "User-specific API responses with authentication",
      "Real-time stock prices that change every second",
      "Static assets like images, CSS, JavaScript, and videos",
      "Database query results",
    ],
    correct: 2,
    explanation: "CDNs excel at caching static, immutable content (images, CSS, JS, videos) that is identical for all users. Dynamic, user-specific content (personalized pages, auth-protected data) is generally not suitable for CDN caching.",
  },
  {
    question: "What is CDN cache invalidation and when is it needed?",
    options: [
      "The process of adding new content to the CDN",
      "Forcefully removing or expiring cached content from edge servers before its TTL expires",
      "Blocking users from accessing cached content",
      "Rotating CDN SSL certificates",
    ],
    correct: 1,
    explanation: "Cache invalidation purges content from CDN edge nodes before its TTL expires. It's needed when you deploy a new version of a file (CSS, JS) and want users to get the update immediately rather than waiting for the old cache to expire.",
  },
  {
    question: "How does a CDN determine which edge server to route a user's request to?",
    options: [
      "Random selection among available edge nodes",
      "The user's browser selects the nearest CDN node",
      "DNS-based anycast or BGP routing directs users to the geographically or network-closest edge node",
      "Load balancing using round-robin across all CDN nodes worldwide",
    ],
    correct: 2,
    explanation: "CDNs use Anycast routing (same IP announced from multiple locations; BGP picks the best route) or GeoDNS (DNS returns different IPs based on user location). This automatically directs users to the optimal edge node.",
  },
  {
    question: "What is 'edge computing' in the context of modern CDNs?",
    options: [
      "Running CDN management software on edge servers",
      "Executing application logic (code) at CDN edge nodes close to users",
      "Compressing images at the edge to reduce bandwidth",
      "Running security scans on traffic before it reaches the origin",
    ],
    correct: 1,
    explanation: "Edge computing (e.g., Cloudflare Workers, AWS Lambda@Edge) lets you run application code at CDN edge nodes worldwide. This enables low-latency personalization, A/B testing, authentication, and request transformation without round-tripping to origin.",
  },
  {
    question: "Netflix built its own CDN called Open Connect. Where did they deploy their CDN servers?",
    options: [
      "Only in major cloud provider data centers",
      "Directly inside ISPs and Internet Exchange Points close to end users",
      "In Netflix's own data centers only",
      "In users' home routers",
    ],
    correct: 1,
    explanation: "Netflix's Open Connect places CDN appliances directly inside ISPs and IXPs (Internet Exchange Points). This means Netflix content travels the minimum possible distance across the internet — often just within the user's ISP network.",
  },
  {
    question: "What HTTP response header controls how long a CDN (and browsers) cache content?",
    options: ["X-Cache-Control", "Cache-Control", "Expires-After", "CDN-TTL"],
    correct: 1,
    explanation: "The Cache-Control HTTP header controls caching behavior. For example, Cache-Control: public, max-age=86400 tells CDNs and browsers to cache the response for 86400 seconds (1 day). The s-maxage directive specifically controls CDN cache duration.",
  },
  {
    question: "What is the 'cache warming' problem with Pull CDNs?",
    options: [
      "CDN servers overheating due to high traffic",
      "The first request after a cold start or invalidation hits the origin, causing latency spikes",
      "CDN nodes becoming desynchronized with each other",
      "Too many simultaneous cache invalidation requests",
    ],
    correct: 1,
    explanation: "Pull CDNs only cache content after the first request. After a new deployment or cache invalidation, all edge nodes start 'cold'. The first requests from each region hit the origin directly, causing latency spikes. Solutions include pre-warming by making requests to each edge node after deployment.",
  },
];

export default function CdnContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        A <strong className="text-txt">Content Delivery Network (CDN)</strong> is a geographically distributed network of proxy servers and data centers. When a user requests content, it's served from the CDN node closest to them rather than your origin server thousands of miles away.
      </p>
      <p>
        Speed of light is a physical constraint  a round trip from New York to Tokyo takes ~150ms. CDNs collapse that latency by putting copies of your content in every major geographic region. Netflix uses CDNs so aggressively they've built their own (Open Connect) with servers physically installed inside ISPs.
      </p>

      <CdnCacheFlowDiagram />

      <h2 className="text-2xl font-bold font-heading text-txt">Push vs Pull CDN</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30">
          <div className="font-bold text-accent text-sm font-heading mb-2">Push CDN</div>
          <ul className="text-xs space-y-1.5">
            <li>• You upload content to CDN proactively</li>
            <li>• Content available globally immediately</li>
            <li>• You control what gets cached and for how long</li>
            <li>• Best for: Large files (videos, software downloads)</li>
            <li className="text-txt-3">Example: S3 + CloudFront (manual invalidation)</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30">
          <div className="font-bold text-c-success text-sm font-heading mb-2">Pull CDN</div>
          <ul className="text-xs space-y-1.5">
            <li>• CDN fetches from origin on first request</li>
            <li>• Zero management overhead</li>
            <li>• First user pays the latency cost</li>
            <li>• Best for: Web assets with unpredictable access</li>
            <li className="text-txt-3">Example: Cloudflare, Fastly (origin pull)</li>
          </ul>
        </div>
      </div>

      <KeyTakeaway variant="important">
        Don't just use CDNs for static assets. Modern CDNs like Cloudflare Workers and AWS Lambda@Edge let you run code at the edge. You can implement authentication, A/B testing, and personalization at the CDN layer  before the request even reaches your servers.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
