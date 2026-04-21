import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";
import type { Question, QuestionBank, Topic } from "../../types";
import Button from "../shared/Button";

// ─── Custom admin node ───────────────────────────────────────────────────────

function AdminQuestionNode({ data, selected }: NodeProps) {
  const topic = data.topic as Topic | undefined;
  const typeIcon: Record<string, string> = {
    "multiple-choice": "◉",
    "true-false": "⊕",
    "error-correction": "✎",
  };

  return (
    <div
      className={`relative bg-white rounded-xl border-2 shadow-sm min-w-[160px] max-w-[200px] transition-shadow ${
        selected ? "border-indigo-500 shadow-md shadow-indigo-100" : "border-gray-200"
      }`}
    >
      <div
        className="h-1.5 rounded-t-xl"
        style={{ backgroundColor: topic?.color ?? "#94a3b8" }}
      />
      <div className="px-3 py-2 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">
            {typeIcon[data.type as string] ?? "?"}
          </span>
          <span
            className="text-xs font-semibold truncate"
            style={{ color: topic?.color ?? "#64748b" }}
          >
            {topic?.name ?? "No topic"}
          </span>
          {!!data.isRoot && (
            <span className="text-xs bg-indigo-100 text-indigo-600 px-1 rounded font-bold ml-auto">
              START
            </span>
          )}
        </div>
        <p className="text-xs text-gray-700 line-clamp-2 leading-snug">
          {data.label as string}
        </p>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-gray-300 !border-white"
      />
      <Handle
        type="source"
        id="correct"
        position={Position.Bottom}
        style={{ left: "35%" }}
        className="!w-3 !h-3 !bg-emerald-500 !border-white"
        title="Drag to connect correct answer path"
      />
      <Handle
        type="source"
        id="incorrect"
        position={Position.Bottom}
        style={{ left: "65%" }}
        className="!w-3 !h-3 !bg-rose-500 !border-white"
        title="Drag to connect incorrect answer path"
      />
    </div>
  );
}

function TopicLabelNode({ data }: NodeProps) {
  return (
    <div
      className="px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-md select-none"
      style={{ backgroundColor: (data.color as string) ?? "#64748b" }}
    >
      {data.label as string}
    </div>
  );
}

const nodeTypes = {
  adminQuestion: AdminQuestionNode,
  topicLabel: TopicLabelNode,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const NODE_W = 210;
const NODE_H = 90;

function bankToFlow(bank: QuestionBank): { nodes: Node[]; edges: Edge[] } {
  const topicsMap = new Map(bank.topics.map((t) => [t.id, t]));
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const topicFirstQuestion = new Map<string, Question>();
  bank.questions.forEach((q) => {
    if (!topicFirstQuestion.has(q.topicId)) topicFirstQuestion.set(q.topicId, q);
  });
  topicFirstQuestion.forEach((q, topicId) => {
    const topic = topicsMap.get(topicId);
    if (topic && q.position) {
      nodes.push({
        id: `topic-${topicId}`,
        type: "topicLabel",
        data: { label: topic.name, color: topic.color },
        position: { x: q.position.x - 30, y: q.position.y - 60 },
        selectable: false,
        draggable: true,
      });
    }
  });

  bank.questions.forEach((q) => {
    const topic = topicsMap.get(q.topicId);
    nodes.push({
      id: q.id,
      type: "adminQuestion",
      data: {
        label: q.text,
        type: q.type,
        topic,
        isRoot: q.id === bank.rootQuestionId,
      },
      position: q.position ?? { x: 0, y: 0 },
      draggable: true,
    });

    if (q.onCorrect) {
      edges.push({
        id: `e-${q.id}-correct`,
        source: q.id,
        sourceHandle: "correct",
        target: q.onCorrect,
        label: "✓ correct",
        style: { stroke: "#22c55e", strokeWidth: 2 },
        labelStyle: { fill: "#22c55e", fontSize: 10, fontWeight: "bold" },
        labelBgStyle: { fill: "#f0fdf4", borderRadius: 4 },
      });
    }
    if (q.onIncorrect && q.onIncorrect !== q.onCorrect) {
      edges.push({
        id: `e-${q.id}-incorrect`,
        source: q.id,
        sourceHandle: "incorrect",
        target: q.onIncorrect,
        label: "✗ incorrect",
        style: { stroke: "#f43f5e", strokeWidth: 2, strokeDasharray: "5 3" },
        labelStyle: { fill: "#f43f5e", fontSize: 10, fontWeight: "bold" },
        labelBgStyle: { fill: "#fff1f2", borderRadius: 4 },
      });
    }
  });

  return { nodes, edges };
}

function applyFlowToBank(
  bank: QuestionBank,
  nodes: Node[],
  edges: Edge[]
): QuestionBank {
  const correctMap = new Map<string, string>();
  const incorrectMap = new Map<string, string>();
  edges.forEach((e) => {
    if (typeof e.source !== "string" || typeof e.target !== "string") return;
    if (e.sourceHandle === "correct") correctMap.set(e.source, e.target);
    else if (e.sourceHandle === "incorrect") incorrectMap.set(e.source, e.target);
  });

  const posMap = new Map(nodes.map((n) => [n.id, n.position]));

  const questions = bank.questions.map((q) => ({
    ...q,
    onCorrect: correctMap.get(q.id) ?? q.onCorrect,
    onIncorrect: incorrectMap.get(q.id) ?? q.onIncorrect,
    position: posMap.get(q.id) ?? q.position,
  }));

  return { ...bank, questions };
}

/** Run dagre layout on question nodes, then reposition topic labels above their group. */
function computeAutoLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 100, marginx: 60, marginy: 60 });

  const questionNodes = nodes.filter((n) => n.type === "adminQuestion");
  const topicLabelNodes = nodes.filter((n) => n.type !== "adminQuestion");

  questionNodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));

  // Only add edges between nodes that exist in the graph
  const nodeIds = new Set(questionNodes.map((n) => n.id));
  edges.forEach((e) => {
    if (nodeIds.has(e.source) && nodeIds.has(e.target)) {
      g.setEdge(e.source, e.target);
    }
  });

  dagre.layout(g);

  const layouted = questionNodes.map((n) => {
    const { x, y } = g.node(n.id);
    return { ...n, position: { x: x - NODE_W / 2, y: y - NODE_H / 2 } };
  });

  // Reposition topic labels: place each above the topmost node of its topic
  const topByTopic = new Map<string, { x: number; y: number }>();
  layouted.forEach((n) => {
    const topicId = (n.data?.topic as Topic | undefined)?.id;
    if (!topicId) return;
    const cur = topByTopic.get(topicId);
    if (!cur || n.position.y < cur.y || (n.position.y === cur.y && n.position.x < cur.x)) {
      topByTopic.set(topicId, n.position);
    }
  });

  const reposLabels = topicLabelNodes.map((n) => {
    // node id is `topic-{topicId}`, topicId itself may contain "topic-"
    const topicId = n.id.replace(/^topic-/, "");
    const pos = topByTopic.get(topicId);
    return pos
      ? { ...n, position: { x: pos.x - 30, y: pos.y - 60 } }
      : n;
  });

  return [...layouted, ...reposLabels];
}

// ─── Inner editor (has access to ReactFlow context via ReactFlowProvider) ────

interface Props {
  bank: QuestionBank;
  onSave: (bank: QuestionBank) => void;
  onEditQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onSetRoot: (id: string) => void;
  onAddQuestion: () => void;
}

function MindMapEditorInner({
  bank,
  onSave,
  onEditQuestion,
  onDeleteQuestion,
  onSetRoot,
  onAddQuestion,
}: Props) {
  const initial = useMemo(() => bankToFlow(bank), [bank]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; questionId: string } | null>(null);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [layoutPending, setLayoutPending] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();

  // Sync when bank changes externally (e.g. after import)
  useEffect(() => {
    const { nodes: n, edges: e } = bankToFlow(bank);
    setNodes(n);
    setEdges(e);
    setHasUnsaved(false);
  }, [bank, setNodes, setEdges]);

  // Run fitView after auto-layout settles
  useEffect(() => {
    if (!layoutPending) return;
    const id = setTimeout(() => {
      fitView({ padding: 0.12, duration: 500 });
      setLayoutPending(false);
    }, 60);
    return () => clearTimeout(id);
  }, [layoutPending, fitView]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: false }, eds));
      setHasUnsaved(true);
    },
    [setEdges]
  );

  const handleNodesChange = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChange(changes);
      if (changes.some((c) => c.type === "position" && c.dragging === false)) {
        setHasUnsaved(true);
      }
    },
    [onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: Parameters<typeof onEdgesChange>[0]) => {
      onEdgesChange(changes);
      setHasUnsaved(true);
    },
    [onEdgesChange]
  );

  const handleSave = () => {
    const updated = applyFlowToBank(bank, nodes, edges);
    onSave(updated);
    setHasUnsaved(false);
  };

  const handleAutoLayout = useCallback(() => {
    setNodes((prev) => computeAutoLayout(prev, edges));
    setHasUnsaved(true);
    setLayoutPending(true);
  }, [edges, setNodes]);

  const handleNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "topicLabel") return;
      const q = bank.questions.find((q) => q.id === node.id);
      if (q) onEditQuestion(q);
    },
    [bank.questions, onEditQuestion]
  );

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.type === "topicLabel") return;
      event.preventDefault();
      const bounds = containerRef.current?.getBoundingClientRect();
      setContextMenu({
        x: event.clientX - (bounds?.left ?? 0),
        y: event.clientY - (bounds?.top ?? 0),
        questionId: node.id,
      });
    },
    []
  );

  const closeMenu = () => setContextMenu(null);

  return (
    <div ref={containerRef} className="relative w-full h-full" onClick={closeMenu}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={closeMenu}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.08}
        maxZoom={2}
        deleteKeyCode="Delete"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={24} />
        <Controls position="bottom-left" />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === "topicLabel") return "#94a3b8";
            const topic = (n.data?.topic as Topic | undefined);
            return topic?.color ?? "#94a3b8";
          }}
          position="bottom-right"
        />

        {/* Toolbar panel — rendered inside ReactFlow so useReactFlow works */}
        <Panel position="top-left">
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={onAddQuestion}>
              + Add Question
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAutoLayout}
              title="Automatically re-arrange all nodes to avoid overlaps"
            >
              ⬡ Auto Layout
            </Button>
            <Button
              size="sm"
              variant={hasUnsaved ? "primary" : "secondary"}
              onClick={handleSave}
            >
              {hasUnsaved ? "💾 Save Changes" : "Saved ✓"}
            </Button>
          </div>
        </Panel>

        {/* Legend */}
        <Panel position="top-right">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 px-3 py-2 text-xs space-y-1 shadow-sm">
            <div className="font-semibold text-gray-600 mb-1">Edge types</div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-emerald-500" />
              <span className="text-gray-600">Correct answer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5" style={{ backgroundImage: "repeating-linear-gradient(90deg,#f43f5e 0,#f43f5e 4px,transparent 4px,transparent 7px)", height: 2 }} />
              <span className="text-gray-600">Wrong answer</span>
            </div>
            <div className="flex items-center gap-2 mt-1 pt-1 border-t border-gray-100">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-gray-500">Drag from green = correct path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-gray-500">Drag from red = wrong path</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="absolute z-50 bg-white rounded-xl shadow-xl border border-gray-200 py-1 min-w-[160px] text-sm"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const q = bank.questions.find((q) => q.id === contextMenu.questionId);
            return (
              <>
                <div className="px-3 py-1.5 text-xs text-gray-400 border-b border-gray-100 truncate max-w-[200px]">
                  {q?.text.slice(0, 50)}…
                </div>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                  onClick={() => { if (q) onEditQuestion(q); closeMenu(); }}
                >
                  ✏️ Edit question
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 text-indigo-700 transition-colors"
                  onClick={() => { onSetRoot(contextMenu.questionId); closeMenu(); }}
                >
                  🚩 Set as start
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 transition-colors"
                  onClick={() => {
                    if (confirm("Delete this question?")) {
                      onDeleteQuestion(contextMenu.questionId);
                      closeMenu();
                    }
                  }}
                >
                  🗑️ Delete
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─── Public export: wraps inner component with ReactFlowProvider ─────────────

export default function MindMapEditor(props: Props) {
  return (
    <ReactFlowProvider>
      <MindMapEditorInner {...props} />
    </ReactFlowProvider>
  );
}
