import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext";
import { useSession } from "../context/SessionContext";
import LiveMindMap from "../components/student/LiveMindMap";
import Button from "../components/shared/Button";

export default function ResultsPage() {
  const { bank } = useQuestions();
  const { answers, visitedPath, reset } = useSession();
  const navigate = useNavigate();

  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const topicStats = useMemo(() => {
    const stats = new Map<string, { correct: number; total: number; name: string; color: string }>();
    bank.topics.forEach((t) => stats.set(t.id, { correct: 0, total: 0, name: t.name, color: t.color }));
    answers.forEach((a) => {
      const q = bank.questions.find((q) => q.id === a.questionId);
      if (!q) return;
      const s = stats.get(q.topicId);
      if (s) { s.total += 1; if (a.isCorrect) s.correct += 1; }
    });
    return [...stats.values()].filter((s) => s.total > 0);
  }, [answers, bank]);

  const getMessage = () => {
    if (pct === 100) return { text: "Perfect! Outstanding mastery.", emoji: "🏆" };
    if (pct >= 80)  return { text: "Excellent! Strong understanding.", emoji: "🌟" };
    if (pct >= 60)  return { text: "Good effort! Keep reviewing.", emoji: "👍" };
    return { text: "Keep practising — you'll improve!", emoji: "💪" };
  };
  const msg = getMessage();

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Score card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <svg width="100" height="100" className="-rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e7ff" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none"
                  stroke={pct >= 80 ? "#4f46e5" : pct >= 60 ? "#3b82f6" : "#8b5cf6"}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1.2s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-extrabold text-gray-800">{pct}%</span>
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="text-3xl mb-1">{msg.emoji}</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Quiz Complete!</h1>
              <p className="text-gray-500 mb-4">{msg.text}</p>
              <div className="flex gap-5 justify-center sm:justify-start">
                {[
                  { label: "Correct", val: correct, color: "text-green-600" },
                  { label: "Wrong", val: total - correct, color: "text-red-500" },
                  { label: "Questions", val: total, color: "text-indigo-600" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Topic breakdown */}
        {topicStats.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Performance by Topic</h2>
            <div className="space-y-3">
              {topicStats.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium" style={{ color: s.color }}>{s.name}</span>
                    <span className="text-gray-500">{s.correct}/{s.total}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.round((s.correct / s.total) * 100)}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mind map */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Your Full Learning Path</h2>
              <p className="text-xs text-gray-400">The path you took through the question tree</p>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Correct</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Incorrect</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 inline-block" /> Not reached</span>
            </div>
          </div>
          <LiveMindMap
            questions={bank.questions}
            topics={bank.topics}
            answers={answers}
            currentId={null}
            visitedPath={visitedPath}
            height={500}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center pb-4">
          <Button onClick={() => { reset(); navigate("/quiz"); }} size="lg">Try Again</Button>
          <Button variant="secondary" onClick={() => navigate("/")} size="lg">← Home</Button>
        </div>
      </div>
    </div>
  );
}
