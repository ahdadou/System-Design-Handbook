"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message { id: string; topic: string; content: string; ts: number; }

const TOPICS = [
  { id: "orders", label: "orders", color: "#3b82f6", subscribers: ["Inventory Service", "Email Service", "Analytics"] },
  { id: "payments", label: "payments", color: "#10b981", subscribers: ["Accounting", "Fraud Detection", "Notifications"] },
  { id: "events", label: "user-events", color: "#8b5cf6", subscribers: ["Analytics", "Recommendations", "Audit Log"] },
];

export function PubSubDiagram() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [routingMessages, setRoutingMessages] = useState<string[]>([]);

  const publish = useCallback((topicId: string) => {
    const topic = TOPICS.find((t) => t.id === topicId);
    if (!topic) return;
    const msgId = `msg_${Date.now()}`;
    const newMsg: Message = {
      id: msgId,
      topic: topicId,
      content: `${topic.label}:${Math.random().toString(36).slice(2, 7)}`,
      ts: Date.now(),
    };
    setMessages((prev) => [newMsg, ...prev].slice(0, 8));
    setActiveTopic(topicId);
    setRoutingMessages(topic.subscribers);
    setTimeout(() => {
      setActiveTopic(null);
      setRoutingMessages([]);
    }, 2500);
  }, []);

  return (
    <div className="my-8 space-y-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Publishers */}
        <div className="flex-shrink-0 w-full lg:w-48">
          <div className="text-xs text-[#475569] font-medium uppercase tracking-wider mb-3">Publishers</div>
          <div className="space-y-2">
            {TOPICS.map((topic) => (
              <motion.button
                key={topic.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => publish(topic.id)}
                className="w-full p-3 rounded-xl border text-left transition-all"
                style={{
                  backgroundColor: activeTopic === topic.id ? `${topic.color}20` : "#111827",
                  borderColor: activeTopic === topic.id ? topic.color : "#1e293b",
                }}
              >
                <div className="text-xs font-medium text-[#f1f5f9]">Publish</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: topic.color }}>
                  topic: {topic.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Center: Message Broker */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            animate={activeTopic ? { scale: [1, 1.05, 1], boxShadow: ["0 0 0 #3b82f600", "0 0 30px #3b82f660", "0 0 0 #3b82f600"] } : {}}
            transition={{ duration: 0.8 }}
            className="w-full max-w-xs p-5 rounded-2xl border-2 border-[#3b82f6]/50 bg-[#3b82f6]/10 text-center mb-4"
          >
            <div className="text-3xl mb-2">📨</div>
            <div className="font-bold text-[#f1f5f9] font-heading text-sm">Message Broker</div>
            <div className="text-xs text-[#475569] mt-1">Routes by topic</div>

            {/* Topics */}
            <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
              {TOPICS.map((t) => (
                <span
                  key={t.id}
                  className="text-[10px] px-2 py-0.5 rounded-full font-mono transition-all"
                  style={{
                    backgroundColor: activeTopic === t.id ? `${t.color}40` : `${t.color}15`,
                    color: t.color,
                    border: `1px solid ${activeTopic === t.id ? t.color : t.color + "40"}`,
                  }}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Arrows */}
          {activeTopic && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              className="text-[#3b82f6] text-lg"
            >
              ↓ routing to subscribers ↓
            </motion.div>
          )}
        </div>

        {/* Right: Subscribers */}
        <div className="flex-shrink-0 w-full lg:w-56">
          <div className="text-xs text-[#475569] font-medium uppercase tracking-wider mb-3">Subscribers</div>
          <div className="space-y-2">
            {Array.from(new Set(TOPICS.flatMap((t) => t.subscribers))).slice(0, 6).map((sub) => {
              const isActive = routingMessages.includes(sub);
              return (
                <motion.div
                  key={sub}
                  animate={isActive ? { x: [0, -4, 4, 0], backgroundColor: ["#1a2332", "#3b82f620", "#1a2332"] } : {}}
                  transition={{ duration: 0.4 }}
                  className="p-2.5 rounded-lg border border-[#1e293b] bg-[#1a2332] flex items-center gap-2"
                >
                  <div className={`w-2 h-2 rounded-full transition-all ${isActive ? "bg-[#10b981] shadow-[0_0_6px_#10b981]" : "bg-[#1e293b]"}`} />
                  <span className="text-xs text-[#94a3b8]">{sub}</span>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-auto text-[10px] text-[#10b981]"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Message log */}
      <div className="bg-[#0a0e17] rounded-xl border border-[#1e293b] p-4">
        <div className="text-xs text-[#475569] mb-2 font-mono">// Message Log</div>
        <AnimatePresence>
          {messages.length === 0 && (
            <div className="text-xs text-[#475569] font-mono">Click a publisher button to send messages...</div>
          )}
          {messages.map((msg) => {
            const topic = TOPICS.find((t) => t.id === msg.topic);
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 py-1.5 border-b border-[#1e293b] last:border-0"
              >
                <span className="text-[10px] text-[#475569] font-mono shrink-0">
                  {new Date(msg.ts).toLocaleTimeString()}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: topic?.color + "20", color: topic?.color }}>
                  {topic?.label}
                </span>
                <code className="text-[10px] text-[#94a3b8]">{msg.content}</code>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
