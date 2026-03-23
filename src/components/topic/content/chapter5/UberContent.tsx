"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "driver", type: "system", position: { x: 40, y: 20 }, data: { label: "Driver App", sublabel: "GPS every 4s", icon: "🚗", color: "#10b981" } },
  { id: "rider", type: "system", position: { x: 360, y: 20 }, data: { label: "Rider App", icon: "📱", color: "#3b82f6" } },
  { id: "api", type: "system", position: { x: 200, y: 100 }, data: { label: "API Gateway", icon: "🔀", color: "#06b6d4" } },
  { id: "location", type: "system", position: { x: 40, y: 210 }, data: { label: "Location Service", sublabel: "Geohash index", icon: "📍", color: "#10b981", description: "Receives GPS updates from all active drivers every 4 seconds. Uses geohash to index by location for fast proximity queries." } },
  { id: "match", type: "system", position: { x: 170, y: 210 }, data: { label: "Matching Service", sublabel: "Driver-rider pairing", icon: "🔗", color: "#3b82f6", description: "Finds nearby available drivers within geohash cells, ranks by ETA, assigns best driver. Must complete within 1 second." } },
  { id: "trip", type: "system", position: { x: 300, y: 210 }, data: { label: "Trip Service", sublabel: "State machine", icon: "🗺️", color: "#8b5cf6" } },
  { id: "pricing", type: "system", position: { x: 420, y: 210 }, data: { label: "Surge Pricing", sublabel: "Supply/demand ML", icon: "💰", color: "#f59e0b", description: "Calculates surge multiplier based on supply (available drivers) vs demand (ride requests) per geohash cell in real-time." } },
  { id: "redis", type: "database", position: { x: 60, y: 360 }, data: { label: "Redis (Location)", sublabel: "Geospatial index", color: "#10b981" } },
  { id: "mysql", type: "database", position: { x: 220, y: 360 }, data: { label: "MySQL (Trips)", sublabel: "Trip records", color: "#3b82f6" } },
  { id: "kafka", type: "system", position: { x: 360, y: 360 }, data: { label: "Kafka", sublabel: "Location events", icon: "📨", color: "#f59e0b" } },
];

const edges: Edge[] = [
  { id: "e1", source: "driver", target: "api", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e2", source: "rider", target: "api", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e3", source: "api", target: "location", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e4", source: "api", target: "match", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e5", source: "api", target: "trip", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e6", source: "api", target: "pricing", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e7", source: "location", target: "redis", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e8", source: "trip", target: "mysql", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e9", source: "location", target: "kafka", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
];

const questions = [
  {
    question: "How does Uber efficiently find nearby drivers for a ride request?",
    options: [
      "By querying GPS coordinates of all drivers and sorting by distance",
      "By using geohashing to index drivers by location cell, then querying nearby cells",
      "By assigning each driver to a fixed zone in the database",
      "By broadcasting the request to all drivers and waiting for responses",
    ],
    correct: 1,
    explanation: "Uber uses geohashing to divide the world into grid cells. Driver locations are indexed by their geohash cell in Redis. When a ride is requested, the system queries the rider's cell and adjacent cells to find nearby available drivers  making the search O(1) rather than scanning all drivers.",
  },
  {
    question: "Why does Uber use WebSockets for driver location updates?",
    options: [
      "WebSockets are required by Apple App Store guidelines",
      "To enable real-time bidirectional communication  drivers push location, riders receive ETA updates",
      "WebSockets use less battery than HTTP polling",
      "For authentication purposes",
    ],
    correct: 1,
    explanation: "WebSockets maintain a persistent connection between driver/rider apps and Uber's servers. Drivers push GPS updates every 4 seconds without HTTP overhead. The same connection pushes trip status updates back to the app in real-time  essential for showing the driver's moving position on the map.",
  },
  {
    question: "What is surge pricing and how is it calculated?",
    options: [
      "A fixed 2x multiplier applied after midnight",
      "A dynamic multiplier calculated from supply (available drivers) vs demand (requests) per geographic area in real-time",
      "A fee added to long-distance trips",
      "A penalty charged to slow drivers",
    ],
    correct: 1,
    explanation: "Surge pricing dynamically adjusts fare based on local supply-demand imbalance. If requests in a geohash cell exceed available drivers, the surge multiplier increases. This incentivizes more drivers to come to that area, rebalancing supply and demand.",
  },
  {
    question: "What is geohashing and why is it used in Uber's location system?",
    options: [
      "A cryptographic hash of GPS coordinates used to protect driver privacy",
      "A technique that encodes latitude/longitude into a short alphanumeric string representing a rectangular grid cell, enabling efficient proximity searches",
      "A compression algorithm that reduces the size of GPS data transmitted from driver apps",
      "A distributed hash table that maps driver IDs to their database shard",
    ],
    correct: 1,
    explanation: "Geohashing encodes any lat/lng coordinate into a short string (e.g., 'dr5ru'). Nearby locations share a common prefix. Longer strings = smaller cells = more precision. In Redis, driver locations are stored with geohash as the key prefix. To find nearby drivers, query the rider's geohash cell and the 8 surrounding cells  a constant-time operation regardless of total driver count, far more efficient than a distance-sorted full scan.",
  },
  {
    question: "How does Uber calculate ETA (Estimated Time of Arrival) for a driver pick-up?",
    options: [
      "By dividing the straight-line distance between driver and rider by the speed limit",
      "By routing through a road network graph with real-time traffic weights, using algorithms like Dijkstra or A* with live traffic data from GPS traces",
      "By asking the driver to estimate their own arrival time",
      "By using a simple circular radius formula (circumference = 2πr)",
    ],
    correct: 1,
    explanation: "ETA requires routing through the actual road network, not straight-line distance. Uber built a road network graph where nodes are intersections and edges are road segments with weights representing travel time. Weights are updated in real-time using aggregated GPS traces from active drivers (historical patterns by time-of-day, live congestion). Uber also open-sourced H3 (hexagonal hierarchical indexing) for efficient geographic queries at multiple resolutions.",
  },
  {
    question: "Uber's location service receives ~750K location writes per second at peak. What storage system handles this and why?",
    options: [
      "MySQL with a geospatial index; it supports POINT data types and spatial queries natively",
      "Redis with geospatial commands (GEOADD, GEORADIUS); in-memory storage handles extreme write throughput with sub-millisecond latency",
      "Cassandra with a geohash partition key; wide-column storage scales writes horizontally",
      "PostgreSQL with PostGIS extension; it has the best geospatial query support",
    ],
    correct: 1,
    explanation: "Redis is ideal for Uber's location data: GEOADD stores driver coordinates in an in-memory sorted set using the geohash score. GEORADIUS queries return all drivers within a radius in O(N+log M) time. The entire active driver dataset (3M drivers × ~100 bytes = ~300MB) fits in RAM. Redis handles hundreds of thousands of writes per second with sub-millisecond latency. Data is ephemeral (driver positions update every 4 seconds), so persistence requirements are low.",
  },
  {
    question: "How does Uber's trip service maintain the state of a trip (requested, accepted, in-progress, completed)?",
    options: [
      "The client tracks trip state locally and syncs to the server when the trip ends",
      "A state machine in the Trip Service manages transitions; state is persisted in MySQL with ACID guarantees to ensure billing accuracy",
      "Kafka topics represent each trip state; consumers update a Redis cache",
      "State is tracked only in the driver app to minimize server load",
    ],
    correct: 1,
    explanation: "Trip state (REQUESTED → ACCEPTED → DRIVER_ARRIVED → IN_PROGRESS → COMPLETED → PAID) is a classic finite state machine. Each transition is persisted to MySQL with a transaction, ensuring that billing, driver payment, and rider charge are consistent. MySQL's ACID properties guarantee that a trip cannot be billed twice or left in an ambiguous state if a service crashes mid-transition. The Trip Service is one of the few places where Uber uses strong consistency.",
  },
  {
    question: "Why does Uber publish driver location updates to Kafka in addition to writing to Redis?",
    options: [
      "Kafka serves as a backup in case Redis loses data",
      "Kafka decouples the location stream from downstream consumers like analytics, ML demand forecasting, ETA calculation, and surge pricing without overloading the Location Service",
      "Kafka converts GPS data from binary to JSON format for storage",
      "Kafka is used to rate-limit the number of location updates from each driver",
    ],
    correct: 1,
    explanation: "The Location Service writes to Redis for real-time proximity queries. It also publishes each update to Kafka. Multiple consumers independently read the same location events: Analytics processes movement patterns; Demand Forecasting aggregates density per geohash for surge pricing; ETA Service uses recent driver traces to update road network weights; ML Training stores historical data. None of these consumers need to query the Location Service directly, preventing them from overloading it.",
  },
  {
    question: "How does Uber's matching service rank candidate drivers found near a rider's pickup location?",
    options: [
      "By selecting the driver who has been waiting the longest (FIFO queue)",
      "By ranking candidates using a combination of ETA to pickup, driver rating, vehicle type match, and driver acceptance rate",
      "By randomly selecting a driver to ensure fair distribution",
      "By selecting the nearest driver based purely on straight-line distance",
    ],
    correct: 1,
    explanation: "After finding nearby available drivers via geohash queries in Redis, the Matching Service ranks candidates by multiple factors: (1) ETA to the pickup point (not raw distance, since a driver on a parallel road may be closer by distance but slower by ETA). (2) Driver rating and acceptance rate (to avoid low-quality drivers or cherry-pickers). (3) Vehicle type match (UberX vs Uber Black). The highest-ranked driver gets the trip offer first; if they decline within 15 seconds, the next candidate is offered.",
  },
  {
    question: "What architectural evolution did Uber make as they scaled from a startup to a global platform?",
    options: [
      "They migrated from a microservices architecture to a monolith for operational simplicity",
      "They evolved from a monolith to microservices, then introduced DOSA (Domain-Oriented Microservice Architecture) to group related services and manage inter-service complexity",
      "They replaced all custom services with third-party SaaS tools to reduce engineering overhead",
      "They adopted a serverless architecture to eliminate the need for server management",
    ],
    correct: 1,
    explanation: "Uber started as a monolith, split into microservices as teams grew (enabling independent deployment and scaling), but eventually faced microservices sprawl: hundreds of services with complex dependencies. DOSA groups related microservices into 'domains' (e.g., Rider, Driver, Marketplace) with well-defined boundaries and APIs. Domain gateways mediate cross-domain calls. This reduces the N^2 service-to-service dependency problem while preserving independent deployment within domains.",
  },
];

export default function UberContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Uber</strong> processes 5M+ trips per day across 70+ countries, connecting 3M+ active drivers with riders in real-time. The core challenges are real-time location tracking at massive scale, sub-second driver matching, and dynamic surge pricing based on local supply and demand.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { stat: "5M+", label: "Trips/day" },
          { stat: "3M+", label: "Active drivers" },
          { stat: "4s", label: "Location update interval" },
          { stat: "<1s", label: "Matching SLA" },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-xl border border-border-ui bg-surface text-center">
            <div className="text-xl font-bold text-c-success font-heading">{item.stat}</div>
            <div className="text-[10px] text-txt-3 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Uber System Architecture"
        description="Click nodes to explore component details"
        height={460}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Key Challenges</h2>
      <div className="space-y-3">
        {[
          { title: "Real-Time Location Tracking", detail: "3M+ active drivers send GPS updates every 4 seconds = ~750K location writes/second at peak. Uber uses WebSockets for persistent connections and writes to Redis geospatial indexes. Kafka streams location events to downstream consumers (analytics, demand prediction, ETA calculation).", color: "#10b981" },
          { title: "Driver-Rider Matching", detail: "When a rider requests a trip, the system must find the best nearby available driver within 1 second. Geohashing divides the world into cells  query the rider's cell and adjacent cells in Redis. Rank candidates by ETA (not just distance). The matching service considers driver rating, vehicle type, and acceptance rate.", color: "#3b82f6" },
          { title: "Surge Pricing", detail: "Supply-demand imbalance triggers surge pricing. The system aggregates requests vs available drivers per geohash cell every 60 seconds. An ML model calculates the surge multiplier. Higher prices incentivize idle drivers to activate and discourage excess demand, rebalancing the marketplace.", color: "#f59e0b" },
          { title: "ETA Estimation", detail: "Uber built H3 (hexagonal geospatial indexing) and a custom road network graph to compute ETAs. The system accounts for real-time traffic conditions, historical patterns by time-of-day, and weather. Maps data is updated every few minutes from GPS traces of completed trips.", color: "#8b5cf6" },
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
          { db: "Redis (Geospatial)", use: "Active driver positions indexed by geohash. GEORADIUS queries for proximity search in O(N+log M) time.", color: "#10b981" },
          { db: "MySQL (Trips)", use: "Trip records, billing, user accounts. Sharded by trip_id. ACID guarantees for payment transactions.", color: "#3b82f6" },
          { db: "Kafka", use: "Location event stream, trip lifecycle events. Consumed by analytics, ML training, demand forecasting, and ETA services.", color: "#f59e0b" },
          { db: "Schemaless (Cassandra-like)", use: "Uber built their own NoSQL store for high-throughput writes: driver metadata, preferences, document-style storage.", color: "#8b5cf6" },
        ].map((item) => (
          <div key={item.db} className="p-3 rounded-lg border border-border-ui bg-surface">
            <span className="font-bold text-sm font-heading" style={{ color: item.color }}>{item.db}: </span>
            <span className="text-xs text-txt-2">{item.use}</span>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="important">
        Uber open-sourced H3 (hexagonal hierarchical geospatial indexing), which is now used industry-wide for location-based systems. Their architecture evolved from a monolith to microservices, with DOSA (Domain-Oriented Microservice Architecture) grouping related services into domains to manage complexity at their scale.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
