import React, { useState } from "react";
import type { MultipleChoiceQuestion as MCQ } from "../../types";
import Button from "../shared/Button";

interface Props {
  question: MCQ;
  onSubmit: (selectedId: string) => void;
}

export default function MultipleChoiceQuestion({ question, onSubmit }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected) onSubmit(selected);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {question.options.map((opt) => (
          <label
            key={opt.id}
            className={`flex items-center gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-colors ${
              selected === opt.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
              className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${
                selected === opt.id
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {opt.id.toUpperCase()}
            </span>
            <span className="text-gray-800">{opt.text}</span>
          </label>
        ))}
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!selected}
        size="lg"
        className="w-full"
      >
        Submit Answer
      </Button>
    </div>
  );
}
