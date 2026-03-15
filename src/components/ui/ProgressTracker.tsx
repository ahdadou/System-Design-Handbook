"use client";
import { motion } from "framer-motion";

interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showText?: boolean;
}

export function ProgressTracker({
  progress,
  size = 80,
  strokeWidth = 6,
  color = "#3b82f6",
  label,
  showText = true,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-[#f1f5f9] font-heading">{progress}%</span>
        </div>
      )}
      {label && <span className="text-xs text-[#475569] mt-1">{label}</span>}
    </div>
  );
}
