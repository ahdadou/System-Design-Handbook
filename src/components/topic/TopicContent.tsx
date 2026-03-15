"use client";
import dynamic from "next/dynamic";

// Chapter 1 topics
const DnsContent = dynamic(() => import("./content/chapter1/DnsContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const OsiContent = dynamic(() => import("./content/chapter1/OsiContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const LoadBalancingContent = dynamic(() => import("./content/chapter1/LoadBalancingContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const CachingContent = dynamic(() => import("./content/chapter1/CachingContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const IpAddressesContent = dynamic(() => import("./content/chapter1/IpAddressesContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const TcpUdpContent = dynamic(() => import("./content/chapter1/TcpUdpContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const ScalabilityContent = dynamic(() => import("./content/chapter1/ScalabilityContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const AvailabilityContent = dynamic(() => import("./content/chapter1/AvailabilityContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const CdnContent = dynamic(() => import("./content/chapter1/CdnContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const ProxyContent = dynamic(() => import("./content/chapter1/ProxyContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const StorageContent = dynamic(() => import("./content/chapter1/StorageContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const ClusteringContent = dynamic(() => import("./content/chapter1/ClusteringContent"), { ssr: false, loading: () => <ContentSkeleton /> });

// Chapter 2 topics
const CapTheoremContent = dynamic(() => import("./content/chapter2/CapTheoremContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const ConsistentHashingContent = dynamic(() => import("./content/chapter2/ConsistentHashingContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const ShardingContent = dynamic(() => import("./content/chapter2/ShardingContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const ReplicationContent = dynamic(() => import("./content/chapter2/ReplicationContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const AcidBaseContent = dynamic(() => import("./content/chapter2/AcidBaseContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const SqlVsNoSqlContent = dynamic(() => import("./content/chapter2/SqlVsNoSqlContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const IndexesContent = dynamic(() => import("./content/chapter2/IndexesContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const TransactionsContent = dynamic(() => import("./content/chapter2/TransactionsContent"), { ssr: false, loading: () => <ContentSkeleton /> });

// Chapter 3 topics
const PubSubContent = dynamic(() => import("./content/chapter3/PubSubContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const MicroservicesContent = dynamic(() => import("./content/chapter3/MicroservicesContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const RestGraphqlGrpcContent = dynamic(() => import("./content/chapter3/RestGraphqlGrpcContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const ApiGatewayContent = dynamic(() => import("./content/chapter3/ApiGatewayContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const CqrsContent = dynamic(() => import("./content/chapter3/CqrsContent"), { ssr: false, loading: () => <ContentSkeleton /> });

// Chapter 4 topics
const CircuitBreakerContent = dynamic(() => import("./content/chapter4/CircuitBreakerContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const RateLimitingContent = dynamic(() => import("./content/chapter4/RateLimitingContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const OAuthContent = dynamic(() => import("./content/chapter4/OAuthContent"), { ssr: false, loading: () => <ContentSkeleton /> });

// Chapter 5 topics
const UrlShortenerContent = dynamic(() => import("./content/chapter5/UrlShortenerContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const WhatsAppContent = dynamic(() => import("./content/chapter5/WhatsAppContent"), { ssr: false, loading: () => <ContentSkeleton /> });

// Generic content for remaining topics
const GenericContent = dynamic(() => import("./content/GenericContent"), { ssr: false, loading: () => <ContentSkeleton /> });

const CONTENT_MAP: Record<string, React.ComponentType<{ slug: string; chapterId: number }>> = {
  // Ch1
  "ip-addresses": (p) => <IpAddressesContent {...p} />,
  "osi-model": (p) => <OsiContent {...p} />,
  "tcp-and-udp": (p) => <TcpUdpContent {...p} />,
  "dns": (p) => <DnsContent {...p} />,
  "load-balancing": (p) => <LoadBalancingContent {...p} />,
  "clustering": (p) => <ClusteringContent {...p} />,
  "caching": (p) => <CachingContent {...p} />,
  "cdn": (p) => <CdnContent {...p} />,
  "proxy": (p) => <ProxyContent {...p} />,
  "availability": (p) => <AvailabilityContent {...p} />,
  "scalability": (p) => <ScalabilityContent {...p} />,
  "storage": (p) => <StorageContent {...p} />,
  // Ch2
  "cap-theorem": (p) => <CapTheoremContent {...p} />,
  "consistent-hashing": (p) => <ConsistentHashingContent {...p} />,
  "sharding": (p) => <ShardingContent {...p} />,
  "database-replication": (p) => <ReplicationContent {...p} />,
  "acid-and-base": (p) => <AcidBaseContent {...p} />,
  "sql-vs-nosql": (p) => <SqlVsNoSqlContent {...p} />,
  "indexes": (p) => <IndexesContent {...p} />,
  "transactions": (p) => <TransactionsContent {...p} />,
  // Ch3
  "publish-subscribe": (p) => <PubSubContent {...p} />,
  "monoliths-and-microservices": (p) => <MicroservicesContent {...p} />,
  "rest-graphql-grpc": (p) => <RestGraphqlGrpcContent {...p} />,
  "api-gateway": (p) => <ApiGatewayContent {...p} />,
  "cqrs": (p) => <CqrsContent {...p} />,
  // Ch4
  "circuit-breaker": (p) => <CircuitBreakerContent {...p} />,
  "rate-limiting": (p) => <RateLimitingContent {...p} />,
  "oauth-and-openid": (p) => <OAuthContent {...p} />,
  // Ch5
  "url-shortener": (p) => <UrlShortenerContent {...p} />,
  "whatsapp": (p) => <WhatsAppContent {...p} />,
};

interface Props {
  slug: string;
  chapterId: number;
}

function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-[#1e293b] rounded w-3/4" />
      <div className="h-4 bg-[#1e293b] rounded" />
      <div className="h-4 bg-[#1e293b] rounded w-5/6" />
      <div className="h-32 bg-[#1e293b] rounded-xl mt-6" />
      <div className="h-4 bg-[#1e293b] rounded w-2/3" />
      <div className="h-4 bg-[#1e293b] rounded" />
      <div className="h-64 bg-[#1e293b] rounded-xl mt-6" />
    </div>
  );
}

export function TopicContent({ slug, chapterId }: Props) {
  const Component = CONTENT_MAP[slug];
  if (Component) return <Component slug={slug} chapterId={chapterId} />;
  return <GenericContent slug={slug} chapterId={chapterId} />;
}
