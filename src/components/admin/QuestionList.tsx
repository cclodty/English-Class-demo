import type { Question, Topic } from "../../types";
import Badge from "../shared/Badge";

interface Props {
  questions: Question[];
  topics: Topic[];
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
}

const typeLabels: Record<string, string> = {
  "multiple-choice": "MC",
  "true-false": "T/F",
  "error-correction": "EC",
};

const typeBg: Record<string, string> = {
  "multiple-choice": "bg-blue-100 text-blue-700",
  "true-false": "bg-purple-100 text-purple-700",
  "error-correction": "bg-orange-100 text-orange-700",
};

export default function QuestionList({ questions, topics, onEdit, onDelete }: Props) {
  const topicsMap = new Map(topics.map((t) => [t.id, t]));
  const sorted = [...questions].sort((a, b) => a.order - b.order);

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No questions yet.</p>
        <p className="text-sm mt-1">Click "Add Question" to get started.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {sorted.map((q) => {
        const topic = topicsMap.get(q.topicId);
        return (
          <div key={q.id} className="flex items-start gap-3 py-3 px-1 hover:bg-gray-50 rounded-lg group">
            <span className="text-xs font-mono text-gray-400 mt-0.5 w-5 flex-shrink-0">
              {q.order}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${typeBg[q.type] ?? "bg-gray-100 text-gray-600"}`}>
                  {typeLabels[q.type] ?? q.type}
                </span>
                {topic && <Badge label={topic.name} color={topic.color} />}
              </div>
              <p className="text-sm text-gray-700 line-clamp-2 leading-snug">
                {q.text}
              </p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => onEdit(q)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this question?")) onDelete(q.id);
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
