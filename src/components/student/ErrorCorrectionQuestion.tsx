import { useState } from "react";
import type { ErrorCorrectionQuestion as ECQ } from "../../types";
import Button from "../shared/Button";

interface Props {
  question: ECQ;
  onSubmit: (correction: string) => void;
}

export default function ErrorCorrectionQuestion({ question, onSubmit }: Props) {
  const [value, setValue] = useState(question.errorSegment);
  const parts = question.text.split(question.errorSegment);

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-gray-800 leading-relaxed text-sm">
        {parts[0]}
        <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-medium underline decoration-wavy decoration-amber-500">
          {question.errorSegment}
        </span>
        {parts.slice(1).join(question.errorSegment)}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Type the corrected version of the highlighted part:
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && value.trim() && onSubmit(value.trim())}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-sm"
          placeholder="Type your correction here…"
          autoFocus
        />
      </div>
      <Button onClick={() => value.trim() && onSubmit(value.trim())} disabled={!value.trim()} size="lg" className="w-full">
        Submit Correction
      </Button>
    </div>
  );
}
