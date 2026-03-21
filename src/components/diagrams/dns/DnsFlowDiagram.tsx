"use client";

export function DnsFlowDiagram() {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--ui-border)", background: "var(--bg-surface)" }}
    >
      {/* Title bar */}
      <div
        className="px-5 py-4 border-b"
        style={{ borderColor: "var(--ui-border)", background: "var(--bg-elevated)" }}
      >
        <h3 className="text-sm font-semibold" style={{ color: "var(--ui-text)" }}>
          DNS Resolution Flow
        </h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--ui-text-3)" }}>
          How a domain name is resolved to an IP address — recursive + iterative queries
        </p>
      </div>

      <div className="p-4">
        <svg viewBox="0 0 760 530" className="w-full" style={{ maxHeight: 480 }}>
          <defs>
            <marker id="dns-arr-solid" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
              <polygon points="0 0, 9 3.5, 0 7" fill="#94a3b8" />
            </marker>
            <marker id="dns-arr-dashed" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
              <polygon points="0 0, 9 3.5, 0 7" fill="#64748b" />
            </marker>
          </defs>

          {/* ── BOXES ─────────────────────────────────── */}

          {/* Client */}
          <rect x="28" y="18" width="172" height="100" rx="12"
            fill="#3b82f60d" stroke="#3b82f650" strokeWidth="1.5" />
          <text x="114" y="58"  textAnchor="middle" fontSize="28">🌐</text>
          <text x="114" y="88"  textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="600">Client</text>
          <text x="114" y="106" textAnchor="middle" fill="#64748b"  fontSize="11">User's Device</text>

          {/* DNS Resolver */}
          <rect x="18" y="184" width="214" height="132" rx="12"
            fill="#06b6d40d" stroke="#06b6d450" strokeWidth="1.5" />
          <text x="125" y="226" textAnchor="middle" fontSize="26">🔄</text>
          <text x="125" y="262" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="600">DNS Resolver</text>
          <text x="125" y="280" textAnchor="middle" fill="#64748b"  fontSize="11">ISP / Recursive</text>
          <text x="125" y="296" textAnchor="middle" fill="#64748b"  fontSize="10">8.8.8.8 / 1.1.1.1</text>

          {/* Root Server */}
          <rect x="482" y="22" width="248" height="96" rx="12"
            fill="#8b5cf60d" stroke="#8b5cf650" strokeWidth="1.5" />
          <text x="606" y="60"  textAnchor="middle" fontSize="26">🌍</text>
          <text x="606" y="91"  textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="600">Root Server</text>
          <text x="606" y="107" textAnchor="middle" fill="#64748b"  fontSize="11">13 clusters worldwide</text>

          {/* TLD Server */}
          <rect x="482" y="204" width="248" height="96" rx="12"
            fill="#f59e0b0d" stroke="#f59e0b50" strokeWidth="1.5" />
          <text x="606" y="242" textAnchor="middle" fontSize="26">📡</text>
          <text x="606" y="273" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="600">TLD Server</text>
          <text x="606" y="289" textAnchor="middle" fill="#64748b"  fontSize="11">.com / .org / .net</text>

          {/* Authoritative NS */}
          <rect x="482" y="390" width="248" height="96" rx="12"
            fill="#10b9810d" stroke="#10b98150" strokeWidth="1.5" />
          <text x="606" y="428" textAnchor="middle" fontSize="26">🏛️</text>
          <text x="606" y="459" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="600">Authoritative NS</text>
          <text x="606" y="475" textAnchor="middle" fill="#64748b"  fontSize="11">Domain's Nameserver</text>

          {/* ── ARROWS ────────────────────────────────── */}

          {/* 1 — Client → Resolver (solid, down) */}
          <line x1="104" y1="120" x2="104" y2="182"
            stroke="#94a3b8" strokeWidth="2" markerEnd="url(#dns-arr-solid)" />
          <text x="84" y="156" fill="#94a3b8" fontSize="12" fontWeight="700">1</text>

          {/* 8 — Resolver → Client (solid, up) */}
          <line x1="124" y1="182" x2="124" y2="120"
            stroke="#94a3b8" strokeWidth="2" markerEnd="url(#dns-arr-solid)" />
          <text x="130" y="156" fill="#94a3b8" fontSize="12" fontWeight="700">8</text>

          {/* 2 — Resolver → Root Server (dashed, up-right) */}
          <line x1="232" y1="228" x2="480" y2="74"
            stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#dns-arr-dashed)" />
          <text x="322" y="140" fill="#94a3b8" fontSize="12" fontWeight="700">2</text>

          {/* 3 — Root Server → Resolver (dashed, down-left) */}
          <line x1="480" y1="88" x2="234" y2="244"
            stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#dns-arr-dashed)" />
          <text x="368" y="174" fill="#94a3b8" fontSize="12" fontWeight="700">3</text>

          {/* 4 — Resolver → TLD Server (dashed, right) */}
          <line x1="232" y1="250" x2="480" y2="250"
            stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#dns-arr-dashed)" />
          <text x="342" y="244" fill="#94a3b8" fontSize="12" fontWeight="700">4</text>

          {/* 5 — TLD Server → Resolver (dashed, left) */}
          <line x1="480" y1="265" x2="234" y2="265"
            stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#dns-arr-dashed)" />
          <text x="342" y="281" fill="#94a3b8" fontSize="12" fontWeight="700">5</text>

          {/* 6 — Resolver → Authoritative NS (dashed, down-right) */}
          <line x1="232" y1="278" x2="480" y2="422"
            stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#dns-arr-dashed)" />
          <text x="330" y="338" fill="#94a3b8" fontSize="12" fontWeight="700">6</text>

          {/* 7 — Authoritative NS → Resolver (dashed, up-left) */}
          <line x1="480" y1="436" x2="234" y2="292"
            stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#dns-arr-dashed)" />
          <text x="372" y="374" fill="#94a3b8" fontSize="12" fontWeight="700">7</text>

          {/* ── LEGEND ────────────────────────────────── */}
          <line x1="30" y1="506" x2="72" y2="506"
            stroke="#94a3b8" strokeWidth="2" markerEnd="url(#dns-arr-solid)" />
          <text x="82" y="511" fill="#94a3b8" fontSize="12">Recursive</text>

          <line x1="190" y1="506" x2="232" y2="506"
            stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#dns-arr-dashed)" />
          <text x="242" y="511" fill="#94a3b8" fontSize="12">Iterative</text>
        </svg>
      </div>
    </div>
  );
}
