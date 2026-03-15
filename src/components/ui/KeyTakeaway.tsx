import { Lightbulb, AlertCircle, Info, CheckCircle2, Zap } from "lucide-react";

type Variant = "info" | "warning" | "success" | "tip" | "important";

interface Props {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
}

const VARIANTS = {
  info: { icon: Info, color: "#3b82f6", bg: "#3b82f6/10", label: "Note" },
  warning: { icon: AlertCircle, color: "#f59e0b", bg: "#f59e0b/10", label: "Warning" },
  success: { icon: CheckCircle2, color: "#10b981", bg: "#10b981/10", label: "Good to Know" },
  tip: { icon: Lightbulb, color: "#8b5cf6", bg: "#8b5cf6/10", label: "Tip" },
  important: { icon: Zap, color: "#06b6d4", bg: "#06b6d4/10", label: "Key Takeaway" },
};

export function KeyTakeaway({ variant = "important", title, children }: Props) {
  const v = VARIANTS[variant];
  const Icon = v.icon;

  return (
    <div
      className="relative rounded-xl p-4 my-6"
      style={{
        backgroundColor: `rgba(${hexToRgb(v.color)}, 0.08)`,
        borderLeft: `3px solid ${v.color}`,
      }}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: v.color }} />
        <div>
          <div className="font-semibold text-sm mb-1" style={{ color: v.color }}>
            {title || v.label}
          </div>
          <div className="text-sm text-[#94a3b8] leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "59, 130, 246";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
