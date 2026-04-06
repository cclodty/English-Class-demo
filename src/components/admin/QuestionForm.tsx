import React, { useEffect, useState } from "react";
import type {
  Question,
  QuestionType,
  Topic,
  ChoiceOption,
} from "../../types";
import Button from "../shared/Button";

interface Props {
  initial?: Question;
  topics: Topic[];
  onSave: (q: Question) => void;
  onCancel: () => void;
}

const EMPTY_OPTIONS: ChoiceOption[] = [
  { id: "a", text: "" },
  { id: "b", text: "" },
  { id: "c", text: "" },
  { id: "d", text: "" },
];

function generateId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function QuestionForm({ initial, topics, onSave, onCancel }: Props) {
  const [type, setType] = useState<QuestionType>(initial?.type ?? "multiple-choice");
  const [topicId, setTopicId] = useState(initial?.topicId ?? topics[0]?.id ?? "");
  const [order, setOrder] = useState(initial?.order ?? 1);
  const [text, setText] = useState(initial?.text ?? "");
  const [explanation, setExplanation] = useState(initial?.explanation ?? "");

  // MC specific
  const [options, setOptions] = useState<ChoiceOption[]>(
    initial?.type === "multiple-choice" ? initial.options : [...EMPTY_OPTIONS]
  );
  const [correctOptionId, setCorrectOptionId] = useState(
    initial?.type === "multiple-choice" ? initial.correctOptionId : "a"
  );

  // TF specific
  const [tfCorrect, setTfCorrect] = useState(
    initial?.type === "true-false" ? initial.correctAnswer : true
  );

  // EC specific
  const [errorSegment, setErrorSegment] = useState(
    initial?.type === "error-correction" ? initial.errorSegment : ""
  );
  const [correction, setCorrection] = useState(
    initial?.type === "error-correction" ? initial.correction : ""
  );

  useEffect(() => {
    if (topics.length > 0 && !topicId) setTopicId(topics[0].id);
  }, [topics, topicId]);

  const handleSave = () => {
    const base = { id: initial?.id ?? generateId(), topicId, order, text, explanation };
    let q: Question;
    if (type === "multiple-choice") {
      q = { ...base, type, options, correctOptionId };
    } else if (type === "true-false") {
      q = { ...base, type, correctAnswer: tfCorrect };
    } else {
      q = { ...base, type, errorSegment, correction };
    }
    onSave(q);
  };

  const isValid = () => {
    if (!text.trim() || !explanation.trim() || !topicId) return false;
    if (type === "multiple-choice") {
      return options.every((o) => o.text.trim()) && !!correctOptionId;
    }
    if (type === "error-correction") {
      return !!errorSegment.trim() && !!correction.trim();
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as QuestionType)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True / False</option>
            <option value="error-correction">Error Correction</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Order <span className="text-gray-400 font-normal">(display sequence)</span>
        </label>
        <input
          type="number"
          min={1}
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Enter the question..."
        />
      </div>

      {/* Multiple Choice options */}
      {type === "multiple-choice" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Options</label>
          {options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct-option"
                checked={correctOptionId === opt.id}
                onChange={() => setCorrectOptionId(opt.id)}
                title={`Mark option ${opt.id.toUpperCase()} as correct`}
                className="text-blue-600"
              />
              <span className="text-xs font-mono text-gray-500 w-5">{opt.id.toUpperCase()}.</span>
              <input
                type="text"
                value={opt.text}
                onChange={(e) => {
                  const updated = options.map((o) =>
                    o.id === opt.id ? { ...o, text: e.target.value } : o
                  );
                  setOptions(updated);
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                placeholder={`Option ${opt.id.toUpperCase()}`}
              />
              {correctOptionId === opt.id && (
                <span className="text-xs text-green-600 font-medium">✓ Correct</span>
              )}
            </div>
          ))}
          <p className="text-xs text-gray-400">Select the radio button next to the correct answer.</p>
        </div>
      )}

      {/* True/False */}
      {type === "true-false" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={tfCorrect === true}
                onChange={() => setTfCorrect(true)}
                className="text-green-600"
              />
              <span className="text-sm text-green-700 font-medium">True</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={tfCorrect === false}
                onChange={() => setTfCorrect(false)}
                className="text-red-600"
              />
              <span className="text-sm text-red-700 font-medium">False</span>
            </label>
          </div>
        </div>
      )}

      {/* Error Correction */}
      {type === "error-correction" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Error Segment <span className="text-gray-400 font-normal">(the exact text to highlight as wrong)</span>
            </label>
            <input
              type="text"
              value={errorSegment}
              onChange={(e) => setErrorSegment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. a elephant"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correction</label>
            <input
              type="text"
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. an elephant"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Explain why the correct answer is correct..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={!isValid()} className="flex-1">
          {initial ? "Update Question" : "Add Question"}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
