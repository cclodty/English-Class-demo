import { useMemo } from "react";
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
    if (pct === 100) return { text: "Perfect score! Outstanding work!", emoji: "🏆", color: "text-amber-600" };
    if (pct >= 80) return { text: "Excellent! You have a strong grasp.", emoji: "🌟", color: "text-indigo-600" };
    if (pct >= 60) return { text: "Good effort! Review the explanations below.", emoji: "👍", color: "text-blue-600" };
    return { text: "Keep practising — every attempt helps!", emoji: "💪", color: "text-violet-600" };
  };

  const msg = getMessage();

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Circular progress */}
            <div className="relative flex-shrink-0">
              <svg width="100" height="100" className="-rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e7ff" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={pct >= 80 ? "#4f46e5" : pct >= 60 ? "#3b82f6" : "#8b5cf6"}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-extrabold text-gray-800">{pct}%</span>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="text-3xl mb-1">{msg.emoji}</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Quiz Complete!</h1>
              <p className={`font-medium ${msg.color} mb-4`}>{msg.text}</p>
              <div className="flex gap-6 justify-center sm:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{correct}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{total - correct}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Incorrect</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">{total}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mind map */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Your Learning Path</h2>
              <p className="text-xs text-gray-400">Mind map of topics and your answers</p>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Correct
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Incorrect
              </span>
            </div>
          </div>
          <MindMap nodes={nodes} edges={edges} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center pb-4">
          <Button onClick={() => { reset(); navigate("/quiz"); }} size="lg">
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => navigate("/")} size="lg">
            ← Home
          </Button>
        </div>
      </div>
    </div>
  );
}
