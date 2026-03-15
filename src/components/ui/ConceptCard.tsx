"use client";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon?: LucideIcon;
  color?: string;
  highlight?: boolean;
}

export function ConceptCard({ title, description, icon: Icon, color = "#3b82f6", highlight = false }: Props) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className={`rounded-xl p-5 border transition-all duration-200 ${
        highlight
          ? "border-[#3b82f6]/40 bg-[#3b82f6]/5"
          : "border-[#1e293b] bg-[#111827]/60 hover:border-[#1e293b] hover:bg-[#1a2332]"
      }`}
    >
      {Icon && (
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h4 className="font-semibold text-[#f1f5f9] text-sm mb-1 font-heading">{title}</h4>
      <p className="text-xs text-[#94a3b8] leading-relaxed">{description}</p>
    </motion.div>
  );
}
