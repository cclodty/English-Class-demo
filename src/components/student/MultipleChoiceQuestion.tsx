import { useState } from "react";
import type { MultipleChoiceQuestion as MCQ } from "../../types";
import Button from "../shared/Button";

interface Props {
  question: MCQ;
  onSubmit: (selectedId: string) => void;
}

export default function MultipleChoiceQuestion({ question, onSubmit }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {question.options.map((opt) => (
          <label
            key={opt.id}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected === opt.id
                ? "border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-100"
                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="mc-option"
              value={opt.id}
              checked={selected === opt.id}
              onChange={() => setSelected(opt.id)}
              className="sr-only"
            />
            <span
              className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors ${
                selected === opt.id
                  ? "border-indigo-500 bg-indigo-500 text-white"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {opt.id.toUpperCase()}
            </span>
            <span className={`text-sm ${selected === opt.id ? "text-indigo-900 font-medium" : "text-gray-700"}`}>
              {opt.text}
            </span>
          </label>
        ))}
      </div>
      <Button onClick={() => selected && onSubmit(selected)} disabled={!selected} size="lg" className="w-full">
        Submit Answer
      </Button>
    </div>
  );
}
