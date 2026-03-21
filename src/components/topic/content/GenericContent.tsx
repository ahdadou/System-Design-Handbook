"use client";
import { useLearningStore } from "@/lib/store";
import { getTopic, getChapter } from "@/lib/content";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode };

interface Props {
  slug: string;
  chapterId: number;
}

function generateNodes(slug: string): Node[] {
  return [
    { id: "main", type: "system", position: { x: 200, y: 100 }, data: { label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), icon: "📚", color: "#3b82f6", description: "Click to learn more about this concept" } },
    { id: "a", type: "system", position: { x: 50, y: 240 }, data: { label: "Component A", icon: "⬡", color: "#06b6d4" } },
    { id: "b", type: "system", position: { x: 200, y: 240 }, data: { label: "Component B", icon: "⬡", color: "#8b5cf6" } },
    { id: "c", type: "system", position: { x: 350, y: 240 }, data: { label: "Component C", icon: "⬡", color: "#10b981" } },
  ];
}

const defaultEdges: Edge[] = [
  { id: "ea", source: "main", target: "a", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "eb", source: "main", target: "b", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "ec", source: "main", target: "c", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
];

export default function GenericContent({ slug, chapterId }: Props) {
  const topic = getTopic(chapterId, slug);
  const chapter = getChapter(chapterId);
  const title = topic?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const quizQuestions = [
    {
      question: `What is the primary purpose of ${title}?`,
      options: [
        "To increase system complexity unnecessarily",
        topic?.description || "To solve a specific distributed systems challenge",
        "To replace existing database systems",
        "To eliminate the need for load balancers",
      ],
      correct: 1,
      explanation: topic?.description || "This concept addresses important challenges in distributed system design.",
    },
    {
      question: `When designing systems, ${title} is primarily used to:`,
      options: [
        "Handle user authentication only",
        "Store data permanently without redundancy",
        "Improve system reliability, scalability, or performance",
        "Reduce the number of servers needed",
      ],
      correct: 2,
      explanation: "System design concepts are generally applied to improve reliability, scalability, and performance of distributed systems.",
    },
  ];

  return (
    <div className="prose-custom space-y-6">
      <div className="text-txt-2 leading-relaxed text-base">
        <p className="text-lg">
          <strong className="text-txt">{title}</strong> is a fundamental concept in distributed systems and system design.
          Understanding it deeply will help you make better architectural decisions when building large-scale systems.
        </p>
        <p className="mt-4">
          In modern distributed architectures, {title.toLowerCase()} plays a critical role in ensuring system reliability,
          performance, and scalability. Engineers at companies like Google, Amazon, and Netflix rely on these patterns
          daily to serve millions of users.
        </p>
      </div>

      <KeyTakeaway variant="important">
        {title} is a core concept that appears frequently in system design interviews and real-world architectures.
        Master the fundamentals before moving to advanced patterns.
      </KeyTakeaway>

      <InteractiveDiagram
        nodes={generateNodes(slug)}
        edges={defaultEdges}
        nodeTypes={nodeTypes}
        title={`${title}  Architecture Overview`}
        description="Drag nodes to explore the relationships between components"
        height={350}
      />

      <h2 className="text-2xl font-bold font-heading text-txt mt-8">Key Concepts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["Core Principles", "Common Patterns", "Trade-offs", "Best Practices"].map((concept) => (
          <div key={concept} className="p-4 bg-surface rounded-xl border border-border-ui">
            <h3 className="font-semibold text-txt text-sm mb-2 font-heading">{concept}</h3>
            <p className="text-xs text-txt-2">
              Understanding {concept.toLowerCase()} for {title} helps you make informed design decisions
              and communicate effectively in technical discussions.
            </p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="tip">
        When studying {title}, focus on understanding the trade-offs rather than memorizing definitions.
        System design is about making informed decisions given constraints.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt mt-8">Knowledge Check</h2>
      <QuizBlock topicSlug={slug} questions={quizQuestions} />
    </div>
  );
}
