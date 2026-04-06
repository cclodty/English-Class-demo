import React, { useState } from "react";
import type { ErrorCorrectionQuestion as ECQ } from "../../types";
import Button from "../shared/Button";

interface Props {
  question: ECQ;
  onSubmit: (correction: string) => void;
}

export default function ErrorCorrectionQuestion({ question, onSubmit }: Props) {
  const [value, setValue] = useState(question.errorSegment);

  const parts = question.text.split(question.errorSegment);

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 text-gray-800 leading-relaxed">
        {parts[0]}
        <span className="bg-yellow-200 text-yellow-900 px-1 rounded underline decoration-wavy decoration-yellow-500">
          {question.errorSegment}
        </span>
        {parts.slice(1).join(question.errorSegment)}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Type the correction for the highlighted part:
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="Type your correction here..."
          autoFocus
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!value.trim()}
        size="lg"
        className="w-full"
      >
        Submit Correction
      </Button>
    </div>
  );
}
