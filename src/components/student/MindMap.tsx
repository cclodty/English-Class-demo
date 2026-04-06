import {
  ReactFlow,
  Background,
  Controls,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Node, Edge } from "@xyflow/react";

// Custom node: Root
function RootNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg text-center min-w-[140px]">
      {data.label as string}
    </div>
  );
}

// Custom node: Topic
function TopicNode({ data }: NodeProps) {
  const color = (data.color as string) ?? "#64748b";
  return (
    <div
      className="px-4 py-2 rounded-xl text-white font-semibold text-sm shadow-md text-center min-w-[120px]"
      style={{ backgroundColor: color }}
    >
      {data.label as string}
    </div>
  );
}

// Custom node: Question
function QuestionNode({ data }: NodeProps) {
  const status = data.status as "correct" | "incorrect" | "unanswered";
  const bg =
    status === "correct"
      ? "#22c55e"
      : status === "incorrect"
      ? "#ef4444"
      : "#94a3b8";
  return (
    <div
      className="px-3 py-2 rounded-lg text-white text-xs shadow-sm text-center max-w-[160px] leading-snug"
      style={{ backgroundColor: bg }}
    >
      {data.label as string}
    </div>
  );
}

const nodeTypes = {
  mindMapRoot: RootNode,
  mindMapTopic: TopicNode,
  mindMapQuestion: QuestionNode,
};

interface MindMapProps {
  nodes: Node[];
  edges: Edge[];
}

export default function MindMap({ nodes, edges }: MindMapProps) {
  return (
    <div className="w-full h-[500px] rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll
        minZoom={0.3}
        maxZoom={2}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
