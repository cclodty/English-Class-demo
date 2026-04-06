import type { Question, Topic, StudentAnswer } from "../types";
import dagre from "@dagrejs/dagre";
import type { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;

export function buildMindMap(
  questions: Question[],
  topics: Topic[],
  answers: StudentAnswer[]
): { nodes: Node[]; edges: Edge[] } {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  // Gather covered topics (topics that have at least one question)
  const coveredTopicIds = new Set(questions.map((q) => q.topicId));
  const coveredTopics = topics
    .filter((t) => coveredTopicIds.has(t.id))
    .sort((a, b) => a.order - b.order);

  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 40, ranksep: 60 });
  g.setDefaultEdgeLabel(() => ({}));

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Root node
  const rootId = "root";
  g.setNode(rootId, { width: NODE_WIDTH, height: NODE_HEIGHT });
  nodes.push({
    id: rootId,
    type: "mindMapRoot",
    data: { label: "Your Learning Path" },
    position: { x: 0, y: 0 },
  });

  // Topic nodes
  for (const topic of coveredTopics) {
    g.setNode(topic.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    g.setEdge(rootId, topic.id);
    nodes.push({
      id: topic.id,
      type: "mindMapTopic",
      data: { label: topic.name, color: topic.color },
      position: { x: 0, y: 0 },
    });
    edges.push({
      id: `e-root-${topic.id}`,
      source: rootId,
      target: topic.id,
      style: { stroke: topic.color, strokeWidth: 2 },
    });
  }

  // Question nodes
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);
  for (const q of sortedQuestions) {
    const answer = answerMap.get(q.id);
    const status = answer
      ? answer.isCorrect
        ? "correct"
        : "incorrect"
      : "unanswered";

    g.setNode(q.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    g.setEdge(q.topicId, q.id);

    const shortText = q.text.length > 40 ? q.text.slice(0, 37) + "…" : q.text;
    nodes.push({
      id: q.id,
      type: "mindMapQuestion",
      data: { label: `Q${q.order}: ${shortText}`, status },
      position: { x: 0, y: 0 },
    });

    const topicColor =
      coveredTopics.find((t) => t.id === q.topicId)?.color ?? "#94a3b8";
    edges.push({
      id: `e-${q.topicId}-${q.id}`,
      source: q.topicId,
      target: q.id,
      style: { stroke: topicColor, strokeWidth: 1.5 },
    });
  }

  // Apply dagre layout
  dagre.layout(g);

  // Map positions back to nodes
  return {
    nodes: nodes.map((n) => {
      const pos = g.node(n.id);
      return {
        ...n,
        position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
      };
    }),
    edges,
  };
}
