"use client";
import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  BackgroundVariant,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

interface Props {
  nodes: Node[];
  edges: Edge[];
  nodeTypes?: Record<string, React.ComponentType<any>>;
  edgeTypes?: Record<string, React.ComponentType<any>>;
  title?: string;
  description?: string;
  height?: number;
  fitView?: boolean;
}

function DiagramInner({ nodes: initNodes, edges: initEdges, nodeTypes, edgeTypes, title, description, height = 450, fitView = true }: Props) {
  const [nodes, setNodes] = useState<Node[]>(initNodes);
  const [edges, setEdges] = useState<Edge[]>(initEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const reset = () => {
    setNodes(initNodes);
    setEdges(initEdges);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-8 rounded-2xl overflow-hidden border border-[#1e293b]"
    >
      {(title || description) && (
        <div className="flex items-center justify-between px-5 py-3 bg-[#111827] border-b border-[#1e293b]">
          <div>
            {title && <h4 className="font-semibold text-[#f1f5f9] text-sm font-heading">{title}</h4>}
            {description && <p className="text-xs text-[#475569] mt-0.5">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#475569] hidden sm:block">Drag nodes • Scroll to zoom</span>
            <button
              onClick={reset}
              className="p-1.5 rounded-lg bg-[#1a2332] hover:bg-[#1e293b] border border-[#1e293b] text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
              title="Reset layout"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
      <div style={{ height: `${height}px` }} className="bg-[#0a0e17] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView={fitView}
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={2}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="rgba(59, 130, 246, 0.12)"
          />
          <Controls
            showInteractive={false}
            className="!bg-[#1a2332] !border-[#1e293b]"
          />

        </ReactFlow>
      </div>
    </motion.div>
  );
}

export function InteractiveDiagram(props: Props) {
  return (
    <ReactFlowProvider>
      <DiagramInner {...props} />
    </ReactFlowProvider>
  );
}
