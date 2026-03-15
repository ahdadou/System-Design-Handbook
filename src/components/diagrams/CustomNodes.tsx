"use client";
import { Handle, Position } from "@xyflow/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define typed node data
export interface SystemNodeData {
  label: string;
  sublabel?: string;
  icon?: string;
  color?: string;
  description?: string;
  [key: string]: unknown;
}

// Base styled node
export function SystemNode({ data }: { data: SystemNodeData }) {
  const [expanded, setExpanded] = useState(false);
  const color = data.color || "#3b82f6";
  const icon = data.icon || "⬡";

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ background: color, border: "none" }} />
      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer"
      >
        <div
          className="rounded-xl border-2 min-w-[120px] shadow-lg transition-all"
          style={{
            backgroundColor: `${color}15`,
            borderColor: color,
            boxShadow: expanded ? `0 0 20px ${color}40` : `0 0 8px ${color}20`,
          }}
        >
          <div className="px-3 py-2.5 flex items-center gap-2">
            <span className="text-base">{icon}</span>
            <div>
              <div className="text-xs font-semibold text-[#f1f5f9] font-heading whitespace-nowrap">
                {data.label}
              </div>
              {data.sublabel && (
                <div className="text-[10px] text-[#475569] whitespace-nowrap">{data.sublabel}</div>
              )}
            </div>
          </div>
          <AnimatePresence>
            {expanded && data.description && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[#1e293b]"
              >
                <div className="px-3 py-2 text-[11px] text-[#94a3b8] max-w-[200px] leading-relaxed">
                  {data.description}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Handle type="source" position={Position.Bottom} style={{ background: color, border: "none" }} />
    </>
  );
}

// Layer node (for OSI model)
export interface LayerNodeData {
  label: string;
  layer?: number;
  protocols?: string[];
  description?: string;
  color?: string;
  [key: string]: unknown;
}

export function LayerNode({ data }: { data: LayerNodeData }) {
  const [expanded, setExpanded] = useState(false);
  const color = data.color || "#3b82f6";

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ background: "transparent", border: "none" }} />
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer"
      >
        <div
          className="rounded-lg border-l-4 min-w-[280px]"
          style={{
            backgroundColor: `${color}12`,
            borderLeftColor: color,
            borderTop: `1px solid ${color}30`,
            borderRight: `1px solid ${color}30`,
            borderBottom: `1px solid ${color}30`,
          }}
        >
          <div className="px-4 py-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono" style={{ color }}>
                Layer {data.layer}
              </span>
              <div className="text-sm font-bold text-[#f1f5f9] font-heading">{data.label}</div>
            </div>
            <div className="flex gap-1 flex-wrap justify-end max-w-[140px]">
              {(data.protocols || []).map((p: string) => (
                <span
                  key={p}
                  className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-2 text-xs text-[#94a3b8] border-t border-[#1e293b]">
                  {data.description}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Handle type="source" position={Position.Bottom} style={{ background: "transparent", border: "none" }} />
    </>
  );
}

// Database node
export function DatabaseNode({ data }: { data: SystemNodeData }) {
  const [expanded, setExpanded] = useState(false);
  const color = data.color || "#06b6d4";

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ background: color, border: "none" }} />
      <Handle type="target" position={Position.Left} style={{ background: color, border: "none" }} />
      <motion.div whileHover={{ scale: 1.05 }} onClick={() => setExpanded(!expanded)} className="cursor-pointer">
        <div
          className="rounded-lg border-2 min-w-[100px]"
          style={{ backgroundColor: `${color}15`, borderColor: color }}
        >
          <div className="px-3 py-2 text-center">
            <div className="text-2xl mb-1">🗄️</div>
            <div className="text-xs font-bold text-[#f1f5f9] font-heading whitespace-nowrap">{data.label}</div>
            {data.sublabel && <div className="text-[10px] text-[#475569]">{data.sublabel}</div>}
          </div>
          <AnimatePresence>
            {expanded && data.description && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[#1e293b]"
              >
                <div className="px-3 py-2 text-[11px] text-[#94a3b8] max-w-[160px]">{data.description}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Handle type="source" position={Position.Bottom} style={{ background: color, border: "none" }} />
      <Handle type="source" position={Position.Right} style={{ background: color, border: "none" }} />
    </>
  );
}

// Step node (numbered, for flows)
export function StepNode({ data }: { data: SystemNodeData & { step?: number } }) {
  const color = data.color || "#3b82f6";
  const step = data.step || 1;

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ background: color, border: "none" }} />
      <Handle type="target" position={Position.Top} style={{ background: color, border: "none" }} />
      <motion.div whileHover={{ scale: 1.05 }}>
        <div
          className="rounded-xl border-2 min-w-[130px]"
          style={{ backgroundColor: `${color}12`, borderColor: `${color}60` }}
        >
          <div className="px-3 py-2.5 flex items-start gap-2.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
              style={{ backgroundColor: color, color: "white" }}
            >
              {step}
            </div>
            <div>
              <div className="text-xs font-semibold text-[#f1f5f9] font-heading">{data.label}</div>
              {data.sublabel && <div className="text-[10px] text-[#475569] mt-0.5">{data.sublabel}</div>}
            </div>
          </div>
        </div>
      </motion.div>
      <Handle type="source" position={Position.Right} style={{ background: color, border: "none" }} />
      <Handle type="source" position={Position.Bottom} style={{ background: color, border: "none" }} />
    </>
  );
}

// State node (for state machines like Circuit Breaker)
export function StateNode({ data }: { data: SystemNodeData & { active?: boolean } }) {
  const color = data.color || "#3b82f6";
  const active = data.active;

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ background: color, border: "none" }} />
      <Handle type="target" position={Position.Left} style={{ background: color, border: "none" }} />
      <motion.div
        whileHover={{ scale: 1.08 }}
        animate={active ? { boxShadow: [`0 0 0px ${color}`, `0 0 30px ${color}`, `0 0 0px ${color}`] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div
          className="w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-lg"
          style={{
            backgroundColor: active ? `${color}30` : `${color}10`,
            borderColor: active ? color : `${color}50`,
            boxShadow: active ? `0 0 24px ${color}60` : "none",
          }}
        >
          <div className="text-2xl mb-1">{data.icon}</div>
          <div className="text-xs font-bold text-[#f1f5f9] font-heading text-center px-2">{data.label}</div>
        </div>
      </motion.div>
      <Handle type="source" position={Position.Bottom} style={{ background: color, border: "none" }} />
      <Handle type="source" position={Position.Right} style={{ background: color, border: "none" }} />
    </>
  );
}
