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
