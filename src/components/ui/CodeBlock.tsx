"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "bash", filename }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-[#1e293b]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a2332] border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]/60" />
          </div>
          {filename && (
            <span className="text-xs text-[#475569] font-mono ml-2">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#475569] uppercase tracking-wider">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#94a3b8] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="text-[#10b981]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto bg-[#0a0e17] text-sm font-mono">
        <code className="text-[#94a3b8]">{code}</code>
      </pre>
    </div>
  );
}
