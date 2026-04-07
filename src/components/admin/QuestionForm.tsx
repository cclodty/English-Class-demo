import { useEffect, useState } from "react";
import type { Question, QuestionType, Topic, ChoiceOption } from "../../types";
import Button from "../shared/Button";

interface Props {
  initial?: Question;
  topics: Topic[];
  allQuestions: Question[];
  onSave: (q: Question) => void;
  onCancel: () => void;
}

const EMPTY_OPTIONS: ChoiceOption[] = [
  { id: "a", text: "" }, { id: "b", text: "" },
  { id: "c", text: "" }, { id: "d", text: "" },
];

function generateId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function QuestionForm({ initial, topics, allQuestions, onSave, onCancel }: Props) {
  const [type, setType] = useState<QuestionType>(initial?.type ?? "multiple-choice");
  const [topicId, setTopicId] = useState(initial?.topicId ?? topics[0]?.id ?? "");
  const [text, setText] = useState(initial?.text ?? "");
  const [explanation, setExplanation] = useState(initial?.explanation ?? "");
  const [onCorrect, setOnCorrect] = useState<string>(initial?.onCorrect ?? "");
  const [onIncorrect, setOnIncorrect] = useState<string>(initial?.onIncorrect ?? "");

  // MC
  const [options, setOptions] = useState<ChoiceOption[]>(
    initial?.type === "multiple-choice" ? initial.options : [...EMPTY_OPTIONS]
  );
  const [correctOptionId, setCorrectOptionId] = useState(
    initial?.type === "multiple-choice" ? initial.correctOptionId : "a"
  );
  // TF
  const [tfCorrect, setTfCorrect] = useState(
    initial?.type === "true-false" ? initial.correctAnswer : true
  );
  // EC
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
    const base = {
      id: initial?.id ?? generateId(),
      topicId,
      text,
      explanation,
      onCorrect: onCorrect || null,
      onIncorrect: onIncorrect || null,
      position: initial?.position,
      isRoot: initial?.isRoot,
    };
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
    if (type === "multiple-choice") return options.every((o) => o.text.trim()) && !!correctOptionId;
    if (type === "error-correction") return !!errorSegment.trim() && !!correction.trim();
    return true;
  };

  const otherQuestions = allQuestions.filter((q) => q.id !== initial?.id);

  return (
    <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      {/* Type + Topic */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Question Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as QuestionType)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True / False</option>
            <option value="error-correction">Error Correction</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Topic</label>
          <select value={topicId} onChange={(e) => setTopicId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
            {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {/* Question text */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Question Text</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Enter the question…" />
      </div>

      {/* MC options */}
      {type === "multiple-choice" && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">Options (select correct one)</label>
          {options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <input type="radio" name="correct-opt" checked={correctOptionId === opt.id}
                onChange={() => setCorrectOptionId(opt.id)} className="text-blue-600 flex-shrink-0" />
              <span className="text-xs font-mono text-gray-400 w-4">{opt.id.toUpperCase()}.</span>
              <input type="text" value={opt.text}
                onChange={(e) => setOptions(options.map((o) => o.id === opt.id ? { ...o, text: e.target.value } : o))}
                className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                placeholder={`Option ${opt.id.toUpperCase()}`} />
              {correctOptionId === opt.id && <span className="text-xs text-green-600 font-medium flex-shrink-0">✓</span>}
            </div>
          ))}
        </div>
      )}

      {/* T/F */}
      {type === "true-false" && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Correct Answer</label>
          <div className="flex gap-4">
            {[true, false].map((v) => (
              <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tfCorrect === v} onChange={() => setTfCorrect(v)}
                  className={v ? "text-green-600" : "text-red-600"} />
                <span className={`text-sm font-medium ${v ? "text-green-700" : "text-red-700"}`}>
                  {v ? "True" : "False"}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* EC */}
      {type === "error-correction" && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Error Segment <span className="text-gray-400">(exact text to highlight)</span></label>
            <input type="text" value={errorSegment} onChange={(e) => setErrorSegment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. a elephant" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Correction</label>
            <input type="text" value={correction} onChange={(e) => setCorrection(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. an elephant" />
          </div>
        </div>
      )}

      {/* Explanation */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Explanation</label>
        <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Explain why the correct answer is correct…" />
      </div>

      {/* Branching */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-600 mb-3">Branching Connections</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-emerald-600 mb-1">✓ If Correct → go to</label>
            <select value={onCorrect} onChange={(e) => setOnCorrect(e.target.value)}
              className="w-full border border-emerald-300 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-emerald-500">
              <option value="">(end of quiz)</option>
              {otherQuestions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.id}: {q.text.slice(0, 40)}…
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-rose-600 mb-1">✗ If Wrong → go to</label>
            <select value={onIncorrect} onChange={(e) => setOnIncorrect(e.target.value)}
              className="w-full border border-rose-300 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-rose-500">
              <option value="">(end of quiz)</option>
              {otherQuestions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.id}: {q.text.slice(0, 40)}…
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={!isValid()} className="flex-1">
          {initial ? "Update Question" : "Add Question"}
        </Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
