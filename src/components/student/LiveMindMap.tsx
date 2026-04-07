import { useMemo } from "react";
import { ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Question, Topic, StudentAnswer } from "../../types";

// ─── Node renderers ──────────────────────────────────────────────────────────

function QuestionNode({ data }: NodeProps) {
  const status = data.status as "current" | "correct" | "incorrect" | "unvisited";
  const styles: Record<string, string> = {
    current:   "bg-indigo-600 text-white ring-4 ring-indigo-300 ring-offset-2 shadow-lg shadow-indigo-400/40 animate-pulse",
    correct:   "bg-emerald-500 text-white shadow-md",
    incorrect: "bg-rose-500 text-white shadow-md",
    unvisited: "bg-white text-gray-400 border-2 border-dashed border-gray-200",
  };
  return (
    <div className={`px-3 py-2 rounded-xl text-xs font-medium text-center max-w-[150px] leading-snug transition-all duration-500 ${styles[status]}`}>
      {data.label as string}
    </div>
  );
}

function TopicNode({ data }: NodeProps) {
  const color = (data.color as string) ?? "#6366f1";
  return (
    <div
      className="px-4 py-2 rounded-xl text-white font-bold text-sm text-center shadow-md min-w-[120px]"
      style={{ backgroundColor: color }}
    >
      {data.label as string}
    </div>
  );
}

const nodeTypes = { questionNode: QuestionNode, topicNode: TopicNode };

// ─── Builder ─────────────────────────────────────────────────────────────────

function buildLiveNodes(
  questions: Question[],
  topics: Topic[],
  answers: StudentAnswer[],
  currentId: string | null,
  visitedPath: string[]
): { nodes: Node[]; edges: Edge[] } {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));
  const visitedSet = new Set(visitedPath);
  const topicsMap = new Map(topics.map((t) => [t.id, t]));

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Add topic label nodes (decorative banners)
  const topicPositions = new Map<string, { x: number; y: number }>();
  const topicXOffset = new Map<string, number>();
  questions.forEach((q) => {
    if (!topicXOffset.has(q.topicId) && q.position) {
      topicXOffset.set(q.topicId, q.position.x - 40);
      topicPositions.set(q.topicId, { x: q.position.x - 40, y: q.position.y - 70 });
    }
  });

  topicsMap.forEach((topic, topicId) => {
    const pos = topicPositions.get(topicId);
    if (pos) {
      nodes.push({
        id: `topic-${topicId}`,
        type: "topicNode",
        data: { label: topic.name, color: topic.color },
        position: pos,
        selectable: false,
        draggable: false,
      });
    }
  });

  questions.forEach((q) => {
    const answer = answerMap.get(q.id);
    let status: "current" | "correct" | "incorrect" | "unvisited";
    if (q.id === currentId) status = "current";
    else if (answer) status = answer.isCorrect ? "correct" : "incorrect";
    else if (visitedSet.has(q.id)) status = "unvisited";
    else status = "unvisited";

    const topic = topicsMap.get(q.topicId);
    const shortLabel = q.text.length > 45 ? q.text.slice(0, 42) + "…" : q.text;

    nodes.push({
      id: q.id,
      type: "questionNode",
      data: { label: shortLabel, status, topicColor: topic?.color },
      position: q.position ?? { x: 0, y: 0 },
      selectable: false,
      draggable: false,
    });

    // Correct edge
    if (q.onCorrect) {
      edges.push({
        id: `e-${q.id}-correct`,
        source: q.id,
        target: q.onCorrect,
        label: "✓",
        style: { stroke: "#22c55e", strokeWidth: 1.5 },
        labelStyle: { fill: "#22c55e", fontWeight: "bold", fontSize: 10 },
        animated: q.id === currentId,
      });
    }

    // Incorrect edge (only show if different from correct)
    if (q.onIncorrect && q.onIncorrect !== q.onCorrect) {
      edges.push({
        id: `e-${q.id}-incorrect`,
        source: q.id,
        target: q.onIncorrect,
        label: "✗",
        style: { stroke: "#f43f5e", strokeWidth: 1.5, strokeDasharray: "4 2" },
        labelStyle: { fill: "#f43f5e", fontWeight: "bold", fontSize: 10 },
      });
    }
  });

  return { nodes, edges };
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  questions: Question[];
  topics: Topic[];
  answers: StudentAnswer[];
  currentId: string | null;
  visitedPath: string[];
  height?: number;
}

export default function LiveMindMap({
  questions, topics, answers, currentId, visitedPath, height = 420,
}: Props) {
  const { nodes, edges } = useMemo(
    () => buildLiveNodes(questions, topics, answers, currentId, visitedPath),
    [questions, topics, answers, currentId, visitedPath]
  );

  return (
    <div className="w-full rounded-xl border border-gray-200 overflow-hidden bg-slate-50" style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15, maxZoom: 1.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll
        minZoom={0.15}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
    </div>
  );
}
