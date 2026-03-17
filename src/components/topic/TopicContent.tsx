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
const DatabasesAndDbmsContent = dynamic(() => import("./content/chapter2/DatabasesAndDbmsContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const SqlDatabasesContent = dynamic(() => import("./content/chapter2/SqlDatabasesContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const NoSqlDatabasesContent = dynamic(() => import("./content/chapter2/NoSqlDatabasesContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const NormalizationContent = dynamic(() => import("./content/chapter2/NormalizationContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const PacelcContent = dynamic(() => import("./content/chapter2/PacelcContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const DistributedTransactionsContent = dynamic(() => import("./content/chapter2/DistributedTransactionsContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const DatabaseFederationContent = dynamic(() => import("./content/chapter2/DatabaseFederationContent"), { ssr: false, loading: () => <ContentSkeleton /> });

// Chapter 3 topics
const PubSubContent = dynamic(() => import("./content/chapter3/PubSubContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const MicroservicesContent = dynamic(() => import("./content/chapter3/MicroservicesContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const RestGraphqlGrpcContent = dynamic(() => import("./content/chapter3/RestGraphqlGrpcContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const ApiGatewayContent = dynamic(() => import("./content/chapter3/ApiGatewayContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const CqrsContent = dynamic(() => import("./content/chapter3/CqrsContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const NTierArchitectureContent = dynamic(() => import("./content/chapter3/NTierArchitectureContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const MessageBrokersContent = dynamic(() => import("./content/chapter3/MessageBrokersContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const MessageQueuesContent = dynamic(() => import("./content/chapter3/MessageQueuesContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const EnterpriseServiceBusContent = dynamic(() => import("./content/chapter3/EnterpriseServiceBusContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const EventDrivenArchitectureContent = dynamic(() => import("./content/chapter3/EventDrivenArchitectureContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const EventSourcingContent = dynamic(() => import("./content/chapter3/EventSourcingContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const LongPollingWebsocketsContent = dynamic(() => import("./content/chapter3/LongPollingWebsocketsContent"), { ssr: false, loading: () => <ContentSkeleton /> });

// Chapter 4 topics
const CircuitBreakerContent = dynamic(() => import("./content/chapter4/CircuitBreakerContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const RateLimitingContent = dynamic(() => import("./content/chapter4/RateLimitingContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const OAuthContent = dynamic(() => import("./content/chapter4/OAuthContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const GeohashingContent = dynamic(() => import("./content/chapter4/GeohashingContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const ServiceDiscoveryContent = dynamic(() => import("./content/chapter4/ServiceDiscoveryContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const SlaSloSliContent = dynamic(() => import("./content/chapter4/SlaSloSliContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const DisasterRecoveryContent = dynamic(() => import("./content/chapter4/DisasterRecoveryContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const VmsContainersContent = dynamic(() => import("./content/chapter4/VmsContainersContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const SingleSignOnContent = dynamic(() => import("./content/chapter4/SingleSignOnContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const SslTlsContent = dynamic(() => import("./content/chapter4/SslTlsContent"), { ssr: false, loading: () => <ContentSkeleton /> });

// Chapter 5 topics
const UrlShortenerContent = dynamic(() => import("./content/chapter5/UrlShortenerContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const WhatsAppContent = dynamic(() => import("./content/chapter5/WhatsAppContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const InterviewTipsContent = dynamic(() => import("./content/chapter5/InterviewTipsContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const TwitterContent = dynamic(() => import("./content/chapter5/TwitterContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const NetflixContent = dynamic(() => import("./content/chapter5/NetflixContent"), { ssr: false, loading: () => <ContentSkeleton /> });
const UberContent = dynamic(() => import("./content/chapter5/UberContent"), { ssr: false, loading: () => <ContentSkeleton /> });

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
  "databases-and-dbms": (p) => <DatabasesAndDbmsContent {...p} />,
  "sql-databases": (p) => <SqlDatabasesContent {...p} />,
  "nosql-databases": (p) => <NoSqlDatabasesContent {...p} />,
  "normalization-and-denormalization": (p) => <NormalizationContent {...p} />,
  "cap-theorem": (p) => <CapTheoremContent {...p} />,
  "pacelc-theorem": (p) => <PacelcContent {...p} />,
  "consistent-hashing": (p) => <ConsistentHashingContent {...p} />,
  "sharding": (p) => <ShardingContent {...p} />,
  "database-replication": (p) => <ReplicationContent {...p} />,
  "acid-and-base": (p) => <AcidBaseContent {...p} />,
  "sql-vs-nosql": (p) => <SqlVsNoSqlContent {...p} />,
  "indexes": (p) => <IndexesContent {...p} />,
  "transactions": (p) => <TransactionsContent {...p} />,
  "distributed-transactions": (p) => <DistributedTransactionsContent {...p} />,
  "database-federation": (p) => <DatabaseFederationContent {...p} />,
  // Ch3
  "n-tier-architecture": (p) => <NTierArchitectureContent {...p} />,
  "message-brokers": (p) => <MessageBrokersContent {...p} />,
  "message-queues": (p) => <MessageQueuesContent {...p} />,
  "publish-subscribe": (p) => <PubSubContent {...p} />,
  "enterprise-service-bus": (p) => <EnterpriseServiceBusContent {...p} />,
  "monoliths-and-microservices": (p) => <MicroservicesContent {...p} />,
  "event-driven-architecture": (p) => <EventDrivenArchitectureContent {...p} />,
  "event-sourcing": (p) => <EventSourcingContent {...p} />,
  "cqrs": (p) => <CqrsContent {...p} />,
  "api-gateway": (p) => <ApiGatewayContent {...p} />,
  "rest-graphql-grpc": (p) => <RestGraphqlGrpcContent {...p} />,
  "long-polling-websockets-sse": (p) => <LongPollingWebsocketsContent {...p} />,
  // Ch4
  "geohashing-and-quadtrees": (p) => <GeohashingContent {...p} />,
  "circuit-breaker": (p) => <CircuitBreakerContent {...p} />,
  "rate-limiting": (p) => <RateLimitingContent {...p} />,
  "service-discovery": (p) => <ServiceDiscoveryContent {...p} />,
  "sla-slo-sli": (p) => <SlaSloSliContent {...p} />,
  "disaster-recovery": (p) => <DisasterRecoveryContent {...p} />,
  "virtual-machines-vs-containers": (p) => <VmsContainersContent {...p} />,
  "oauth-and-openid": (p) => <OAuthContent {...p} />,
  "single-sign-on": (p) => <SingleSignOnContent {...p} />,
  "ssl-tls-mtls": (p) => <SslTlsContent {...p} />,
  // Ch5
  "system-design-interview-tips": (p) => <InterviewTipsContent {...p} />,
  "url-shortener": (p) => <UrlShortenerContent {...p} />,
  "whatsapp": (p) => <WhatsAppContent {...p} />,
  "twitter": (p) => <TwitterContent {...p} />,
  "netflix": (p) => <NetflixContent {...p} />,
  "uber": (p) => <UberContent {...p} />,
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
