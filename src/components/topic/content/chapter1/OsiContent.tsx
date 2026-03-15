"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { OsiModelDiagram } from "@/components/diagrams/osi/OsiModelDiagram";

const questions = [
  {
    question: "At which OSI layer does TCP operate?",
    options: ["Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)"],
    correct: 2,
    explanation: "TCP operates at Layer 4 (Transport). It provides end-to-end communication, segmentation, flow control, and reliable delivery.",
  },
  {
    question: "What is the PDU (Protocol Data Unit) at the Network layer?",
    options: ["Bit", "Frame", "Packet", "Segment"],
    correct: 2,
    explanation: "The Network layer (Layer 3) works with Packets. Layer 2 uses Frames, Layer 4 uses Segments, and Layer 1 uses Bits.",
  },
  {
    question: "Which layer is responsible for SSL/TLS encryption?",
    options: ["Layer 4 (Transport)", "Layer 5 (Session)", "Layer 6 (Presentation)", "Layer 7 (Application)"],
    correct: 2,
    explanation: "SSL/TLS operates at Layer 6 (Presentation), which handles data formatting, encryption, and compression.",
  },
];

export default function OsiContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-[#94a3b8]">
      <p className="text-base leading-relaxed">
        The <strong className="text-[#f1f5f9]">OSI (Open Systems Interconnection) model</strong> is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven distinct layers. Created by ISO in 1984, it provides a universal language for understanding how different network protocols interact.
      </p>
      <p>
        While the OSI model is theoretical (real internet uses TCP/IP which compresses some layers), every engineer needs to understand it. When you debug a network issue, trace a security vulnerability, or design a distributed system, you're thinking in OSI layers whether you know it or not.
      </p>

      <KeyTakeaway variant="tip">
        Remember the layers with: <strong className="text-[#f1f5f9]">"All People Seem To Need Data Processing"</strong> (Application, Presentation, Session, Transport, Network, Data Link, Physical).
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Interactive OSI Model</h2>
      <p>Click each layer to see its details, protocols, and responsibilities. Use the animate button to see data flow.</p>

      <OsiModelDiagram />

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">The TCP/IP Model (Real World)</h2>
      <p>
        In practice, the internet uses the <strong className="text-[#f1f5f9]">TCP/IP model</strong>, which collapses OSI's 7 layers into 4:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {[
          { name: "Application", osi: "Layers 5-7", color: "#3b82f6", protocols: "HTTP, DNS, SMTP" },
          { name: "Transport", osi: "Layer 4", color: "#8b5cf6", protocols: "TCP, UDP" },
          { name: "Internet", osi: "Layer 3", color: "#f59e0b", protocols: "IP, ICMP" },
          { name: "Link", osi: "Layers 1-2", color: "#10b981", protocols: "Ethernet, WiFi" },
        ].map((layer) => (
          <div key={layer.name} className="p-3 rounded-xl border border-[#1e293b]" style={{ backgroundColor: `${layer.color}10` }}>
            <div className="font-semibold text-sm font-heading" style={{ color: layer.color }}>{layer.name}</div>
            <div className="text-xs text-[#475569] mt-0.5">{layer.osi}</div>
            <div className="text-xs text-[#94a3b8] mt-1">{layer.protocols}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-[#f1f5f9]">Why It Matters for System Design</h2>
      <ul className="space-y-2 list-none text-sm">
        {[
          "Load balancers operate at L4 (TCP) or L7 (HTTP) — understanding this helps you choose the right type",
          "Firewalls can filter at L3 (IP) or L7 (application) — L7 firewalls are smarter but more expensive",
          "CDNs operate at L7 — they can inspect HTTP headers and cache content intelligently",
          "VPNs operate at L3 — they create a secure tunnel by wrapping packets in new IP packets",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-[#3b82f6] mt-1">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <KeyTakeaway variant="important">
        In system design interviews, when asked about L4 vs L7 load balancers: L4 is faster (just TCP routing), L7 is smarter (can route based on URL, headers, cookies) but adds latency. Use L7 for HTTP microservices, L4 for raw performance.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
