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
