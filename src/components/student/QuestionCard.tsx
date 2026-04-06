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

const typeLabels: Record<string, string> = {
  "multiple-choice": "Multiple Choice",
  "true-false": "True / False",
  "error-correction": "Error Correction",
};

export default function QuestionCard({ question, topic, onSubmit }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
          {typeLabels[question.type] ?? question.type}
        </span>
        {topic && (
          <Badge label={topic.name} color={topic.color} />
        )}
      </div>
      <p className="text-gray-900 font-medium text-lg leading-relaxed">
        {question.text}
      </p>
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
  );
}
