import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext";
import { useSession } from "../context/SessionContext";
import { buildMindMap } from "../utils/mindMapBuilder";
import MindMap from "../components/student/MindMap";
import Button from "../components/shared/Button";

export default function ResultsPage() {
  const { bank } = useQuestions();
  const { answers, reset } = useSession();
  const navigate = useNavigate();

  const questions = useMemo(
    () => [...bank.questions].sort((a, b) => a.order - b.order),
    [bank.questions]
  );

  const { nodes, edges } = useMemo(
    () => buildMindMap(questions, bank.topics, answers),
    [questions, bank.topics, answers]
  );

  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const getMessage = () => {
    if (pct === 100) return { text: "Perfect score! Excellent work!", emoji: "🏆" };
    if (pct >= 80) return { text: "Great job! Keep it up!", emoji: "🌟" };
    if (pct >= 60) return { text: "Good effort! Review the explanations.", emoji: "👍" };
    return { text: "Keep practising — you'll improve!", emoji: "💪" };
  };

  const msg = getMessage();

  const handleTryAgain = () => {
    reset();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-2">{msg.emoji}</div>
          <h1 className="text-3xl font-bold text-indigo-800">Quiz Complete!</h1>
          <p className="text-gray-600 mt-1">{msg.text}</p>
        </div>

        {/* Score card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">{pct}%</div>
              <div className="text-sm text-gray-500 mt-1">Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{correct}</div>
              <div className="text-sm text-gray-500 mt-1">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500">{total - correct}</div>
              <div className="text-sm text-gray-500 mt-1">Incorrect</div>
            </div>
          </div>
        </div>

        {/* Mind map */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Your Learning Path</h2>
            <div className="flex gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Correct
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Incorrect
              </span>
            </div>
          </div>
          <MindMap nodes={nodes} edges={edges} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button onClick={handleTryAgain} size="lg">
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => navigate("/admin")} size="lg">
            Teacher Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
