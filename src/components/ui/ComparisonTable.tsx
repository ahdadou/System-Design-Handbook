"use client";
import { useState } from "react";
import { Check, X, Minus } from "lucide-react";

interface Column {
  key: string;
  label: string;
  color?: string;
}

interface Row {
  feature: string;
  [key: string]: string | boolean | null;
}

interface Props {
  title?: string;
  columns: Column[];
  rows: Row[];
  verdict?: Record<string, string>;
}

export function ComparisonTable({ title, columns, rows, verdict }: Props) {
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);

  const renderCell = (value: string | boolean | null) => {
    if (value === true) return <Check className="w-4 h-4 text-[#10b981] mx-auto" />;
    if (value === false) return <X className="w-4 h-4 text-[#ef4444] mx-auto" />;
    if (value === null) return <Minus className="w-4 h-4 text-[#475569] mx-auto" />;
    return <span className="text-sm text-[#94a3b8]">{value}</span>;
  };

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-[#1e293b]">
      {title && (
        <div className="px-4 py-3 bg-[#1a2332] border-b border-[#1e293b]">
          <h4 className="font-semibold text-[#f1f5f9] text-sm font-heading">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase tracking-wider w-40">
                Feature
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
                  style={{
                    color: hoveredCol === col.key ? (col.color || "#3b82f6") : "#94a3b8",
                  }}
                  onMouseEnter={() => setHoveredCol(col.key)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-t border-[#1e293b] transition-colors ${
                  i % 2 === 0 ? "bg-[#0a0e17]" : "bg-[#111827]/50"
                } hover:bg-[#1a2332]`}
              >
                <td className="px-4 py-3 text-sm font-medium text-[#f1f5f9]">{row.feature}</td>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-center transition-colors ${
                      hoveredCol === col.key ? "bg-[#3b82f6]/5" : ""
                    }`}
                  >
                    {renderCell(row[col.key] as string | boolean | null)}
                  </td>
                ))}
              </tr>
            ))}
            {verdict && (
              <tr className="border-t-2 border-[#1e293b] bg-[#1a2332]">
                <td className="px-4 py-3 text-xs font-bold text-[#475569] uppercase tracking-wider">
                  Best For
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-center">
                    <span className="text-xs px-2 py-1 rounded-full" style={{
                      backgroundColor: `${col.color || "#3b82f6"}20`,
                      color: col.color || "#3b82f6",
                    }}>
                      {verdict[col.key] || "—"}
                    </span>
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
