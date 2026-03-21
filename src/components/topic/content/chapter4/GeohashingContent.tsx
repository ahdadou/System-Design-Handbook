"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode, DatabaseNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode, database: DatabaseNode };

const nodes: Node[] = [
  { id: "world", type: "system", position: { x: 220, y: 20 }, data: { label: "World Map", sublabel: "Full coordinate space", icon: "🌍", color: "#3b82f6", description: "Entire Earth divided into a grid using Base32 characters. Precision increases with string length." } },
  { id: "r1", type: "system", position: { x: 60, y: 150 }, data: { label: "Region: 9q8y", sublabel: "San Francisco area", icon: "📍", color: "#06b6d4", description: "6-char geohash ≈ 1.2km × 0.6km precision. First chars shared = nearby location." } },
  { id: "r2", type: "system", position: { x: 230, y: 150 }, data: { label: "Region: dp3w", sublabel: "New York area", icon: "📍", color: "#8b5cf6", description: "Geohash uses interleaved bits of lat/lng. Nearby locations share a common prefix." } },
  { id: "r3", type: "system", position: { x: 400, y: 150 }, data: { label: "Region: u4pr", sublabel: "London area", icon: "📍", color: "#10b981", description: "Quadtree subdivides space recursively into 4 cells only where data exists  ideal for sparse datasets." } },
  { id: "q1", type: "system", position: { x: 0, y: 300 }, data: { label: "Quadrant NW", sublabel: "9q8y → 9q8yt", icon: "↖️", color: "#06b6d4", description: "Each subdivision appends one more Base32 character, narrowing the geographic area by ~32x." } },
  { id: "q2", type: "system", position: { x: 90, y: 300 }, data: { label: "Quadrant NE", sublabel: "9q8y → 9q8yv", icon: "↗️", color: "#06b6d4" } },
  { id: "q3", type: "system", position: { x: 180, y: 300 }, data: { label: "Quadrant SW", sublabel: "9q8y → 9q8ym", icon: "↙️", color: "#f59e0b", description: "Uber uses geohash cells to group drivers. Querying nearby cells = finding nearby drivers in O(1)." } },
  { id: "q4", type: "system", position: { x: 270, y: 300 }, data: { label: "Quadrant SE", sublabel: "9q8y → 9q8yq", icon: "↘️", color: "#f59e0b" } },
];

const edges: Edge[] = [
  { id: "e1", source: "world", target: "r1", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e2", source: "world", target: "r2", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e3", source: "world", target: "r3", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e4", source: "r1", target: "q1", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e5", source: "r1", target: "q2", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e6", source: "r1", target: "q3", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
  { id: "e7", source: "r1", target: "q4", animated: true, style: { stroke: "#f59e0b", strokeWidth: 2 } },
];

const questions = [
  {
    question: "How does geohashing enable efficient proximity search?",
    options: [
      "By sorting all coordinates numerically and doing a binary search",
      "By encoding lat/lng into a string  nearby locations share a common prefix, allowing prefix-based lookups",
      "By storing coordinates in a B-tree index",
      "By dividing the world into a fixed 1000×1000 grid",
    ],
    correct: 1,
    explanation: "Geohashing encodes lat/lng into a Base32 string where nearby locations share a common prefix. To find neighbors, you query cells with the same prefix (or adjacent cell hashes). This makes proximity queries O(1) with a simple string prefix match.",
  },
  {
    question: "Why is a Quadtree preferred over geohashing for ride-sharing driver tracking?",
    options: [
      "Quadtrees use less memory than geohashes",
      "Quadtrees only subdivide regions where data actually exists, avoiding empty cells in sparse datasets",
      "Quadtrees support faster string comparisons",
      "Quadtrees are simpler to implement",
    ],
    correct: 1,
    explanation: "Quadtrees subdivide 2D space recursively only where data points exist. In ride-sharing, drivers cluster in cities and sparse in rural areas. A quadtree adapts to this density  urban areas get deep subdivisions, rural areas stay as large coarse cells  making it far more efficient than a fixed geohash grid.",
  },
];

export default function GeohashingContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Geohashing</strong> encodes a geographic location (latitude, longitude) into a short alphanumeric string. <strong className="text-txt">Quadtrees</strong> recursively partition 2D space into four quadrants. Both are foundational to location-based services  used by Uber, Yelp, Tinder, and Google Maps to answer the deceptively hard question: "What's near me?"
      </p>
      <p>
        Without a spatial index, finding nearby restaurants means scanning every row in your database, computing distance for each one. At scale (millions of POIs, millions of queries per second), this is catastrophic. Geohashing and quadtrees turn O(n) scans into O(1) lookups.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Geohash Grid + Quadtree Subdivision"
        description="World → regions → recursive quadrants. Click nodes for details."
        height={460}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">How Geohashing Works</h2>
      <p>
        Geohashing interleaves the binary representations of latitude and longitude, then encodes the result in Base32 (32 characters: 0-9, b-z minus a, i, l, o). The resulting string has a powerful property: <strong className="text-txt">the longer the shared prefix, the closer two locations are.</strong>
      </p>
      <div className="grid grid-cols-1 gap-3">
        {[
          { precision: 1, chars: "1 char", area: "~5,000 km × 5,000 km", example: "9", use: "Country-level" },
          { precision: 4, chars: "4 chars", area: "~40 km × 20 km", example: "9q8y", use: "City-level" },
          { precision: 6, chars: "6 chars", area: "~1.2 km × 0.6 km", example: "9q8yy", use: "Neighborhood" },
          { precision: 8, chars: "8 chars", area: "~38m × 19m", example: "9q8yy9e2", use: "Building-level" },
          { precision: 12, chars: "12 chars", area: "~3.7cm × 1.9cm", example: "9q8yy9e2s5f7", use: "Sub-meter GPS" },
        ].map((row) => (
          <div key={row.precision} className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border-ui">
            <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center text-xs font-bold text-accent shrink-0">
              {row.precision}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-txt">{row.chars}  {row.use}</div>
              <div className="text-[10px] text-txt-3 font-mono mt-0.5">{row.example}</div>
            </div>
            <div className="text-[10px] text-txt-2 text-right shrink-0">{row.area}</div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="tip">
        For proximity search, query the target cell AND its 8 neighbors. Two points can be very close geographically but have different prefixes if they straddle a cell boundary. Always check adjacent cells to avoid false negatives.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">Quadtrees: Adaptive Spatial Indexing</h2>
      <p>
        A Quadtree is a tree where each internal node has exactly 4 children representing NW, NE, SW, SE quadrants. Subdivision only happens when a cell contains more than a threshold of points. This makes quadtrees ideal for <strong className="text-txt">sparse, unevenly distributed data</strong>  like drivers in a city.
      </p>
      <div className="space-y-3">
        {[
          { title: "Building the tree", color: "#3b82f6", desc: "Start with root = entire map. Insert each data point. When a cell exceeds capacity (e.g., >4 points), split into 4 children and redistribute. Depth grows only in dense regions." },
          { title: "Querying nearby points", color: "#06b6d4", desc: "Given a location, traverse the quadtree to find the leaf cell. Return all points in that cell + neighboring cells. Only traverse branches that intersect the search radius." },
          { title: "Dynamic updates", color: "#8b5cf6", desc: "Drivers move constantly. Update = delete from old leaf + insert into new leaf. Much cheaper than rebuilding a geohash index. Uber's H3 library builds on hexagonal hierarchical geospatial indexing for even better uniformity." },
        ].map((item) => (
          <div key={item.title} className="flex gap-3 p-4 rounded-xl bg-surface border border-border-ui">
            <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div>
              <div className="font-semibold text-sm text-txt font-heading mb-1">{item.title}</div>
              <p className="text-xs text-txt-2 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">Real-World Use Cases</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { company: "Uber / Lyft", icon: "🚗", tech: "Geohash + Quadtree", detail: "Driver locations indexed by geohash cells. Rider app queries cell + neighbors. Updated every few seconds per driver.", color: "#f59e0b" },
          { company: "Yelp / Google Maps", icon: "🍕", tech: "Geohash", detail: "Restaurants indexed by geohash precision 6-8. Prefix search returns candidates, then haversine distance for final ranking.", color: "#10b981" },
          { company: "Tinder", icon: "❤️", tech: "Geohash", detail: "Profiles stored with geohash. Match candidates queried from same + adjacent geohash cells within configurable radius.", color: "#ef4444" },
          { company: "PostGIS / MongoDB", icon: "🗄️", tech: "2D Spatial Index", detail: "Both support native geospatial indexing using R-trees or geohash. MongoDB's $near uses a 2dsphere index under the hood.", color: "#8b5cf6" },
        ].map((item) => (
          <div key={item.company} className="p-3 rounded-xl border bg-surface" style={{ borderColor: `${item.color}40` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-xs font-bold text-txt font-heading">{item.company}</div>
                <div className="text-[10px]" style={{ color: item.color }}>{item.tech}</div>
              </div>
            </div>
            <p className="text-[10px] text-txt-2 leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="info">
        Geohash vs Quadtree: use geohash when your data is uniformly distributed (POI search, restaurant lookup)  it's simpler to implement with just a database string index. Use quadtrees when data is sparse and clustered (live driver locations, sparse sensor data)  they adapt to density and avoid wasting memory on empty cells.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
