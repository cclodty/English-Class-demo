import type { Question, Topic } from "../../types";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import ErrorCorrectionQuestion from "./ErrorCorrectionQuestion";
import Badge from "../shared/Badge";

interface Props {
  question: Question;
  topic?: Topic;
  onSubmit: (response: string) => void;
}

const typeConfig: Record<string, { label: string; icon: string; bg: string; text: string }> = {
  "multiple-choice": { label: "Multiple Choice", icon: "◉", bg: "bg-blue-100", text: "text-blue-700" },
  "true-false":      { label: "True / False",    icon: "⊕", bg: "bg-purple-100", text: "text-purple-700" },
  "error-correction":{ label: "Error Correction",icon: "✎", bg: "bg-amber-100",  text: "text-amber-700" },
};

export default function QuestionCard({ question, topic, onSubmit }: Props) {
  const cfg = typeConfig[question.type] ?? typeConfig["multiple-choice"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Top accent bar uses topic colour */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: topic?.color ?? "#6366f1" }}
      />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
            {cfg.icon} {cfg.label}
          </span>
          {topic && <Badge label={topic.name} color={topic.color} />}
        </div>
        <p className="text-gray-900 font-semibold text-lg leading-relaxed">{question.text}</p>
        {question.type === "multiple-choice" && (
          <MultipleChoiceQuestion question={question} onSubmit={onSubmit} />
        )}
        {question.type === "true-false" && (
          <TrueFalseQuestion question={question} onSubmit={onSubmit} />
        )}
        {question.type === "error-correction" && (
          <ErrorCorrectionQuestion question={question} onSubmit={onSubmit} />
        )}
      </div>
    </div>
  );
}
