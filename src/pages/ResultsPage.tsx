import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext";
import { useSession } from "../context/SessionContext";
import Button from "../components/shared/Button";

export default function ResultsPage() {
  const { bank } = useQuestions();
  const { answers, reset } = useSession();
  const navigate = useNavigate();

  const mainAnswers = answers.filter((a) => {
    const q = bank.questions.find((q) => q.id === a.questionId);
    return q && !q.isBonus;
  });
  const bonusAnswers = answers.filter((a) => {
    const q = bank.questions.find((q) => q.id === a.questionId);
    return q?.isBonus;
  });

  const total = mainAnswers.length;
  const correct = mainAnswers.filter((a) => a.isCorrect).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const bonusTotal = bonusAnswers.length;
  const bonusCorrect = bonusAnswers.filter((a) => a.isCorrect).length;

  const topicStats = useMemo(() => {
    const stats = new Map<string, { correct: number; total: number; name: string; color: string }>();
    bank.topics.forEach((t) => stats.set(t.id, { correct: 0, total: 0, name: t.name, color: t.color }));
    mainAnswers.forEach((a) => {
      const q = bank.questions.find((q) => q.id === a.questionId);
      if (!q) return;
      const s = stats.get(q.topicId);
      if (s) { s.total += 1; if (a.isCorrect) s.correct += 1; }
    });
    return [...stats.values()].filter((s) => s.total > 0);
  }, [mainAnswers, bank]);

  // Question type breakdown (all answers including bonus)
  const typeStats = useMemo(() => {
    const stats: Record<string, { label: string; correct: number; total: number }> = {
      "multiple-choice": { label: "Multiple Choice", correct: 0, total: 0 },
      "true-false": { label: "True / False", correct: 0, total: 0 },
      "error-correction": { label: "Error Correction", correct: 0, total: 0 },
    };
    answers.forEach((a) => {
      const q = bank.questions.find((q) => q.id === a.questionId);
      if (!q || !stats[q.type]) return;
      stats[q.type].total += 1;
      if (a.isCorrect) stats[q.type].correct += 1;
    });
    return Object.values(stats).filter((s) => s.total > 0);
  }, [answers, bank]);

  const getMessage = () => {
    if (pct === 100) return { text: "Perfect! Outstanding mastery.", emoji: "🏆" };
    if (pct >= 80)  return { text: "Excellent! Strong understanding.", emoji: "🌟" };
    if (pct >= 60)  return { text: "Good effort! Keep reviewing.", emoji: "👍" };
    return { text: "Keep practising — you'll improve!", emoji: "💪" };
  };
  const msg = getMessage();

  const getTopicFeedback = (topicPct: number) => {
    if (topicPct >= 90) return { label: "Excellent", labelColor: "bg-green-100 text-green-700", tip: "You have a solid grasp of this topic. Keep it up!" };
    if (topicPct >= 70) return { label: "Good", labelColor: "bg-blue-100 text-blue-700", tip: "Good understanding. A quick revision of the rules will help consolidate your knowledge." };
    if (topicPct >= 50) return { label: "Needs Review", labelColor: "bg-amber-100 text-amber-700", tip: "You understand the basics but make some mistakes. Review the grammar rules and example sentences." };
    return { label: "Needs Practice", labelColor: "bg-red-100 text-red-700", tip: "This topic needs more attention. Revisit the formula and do extra exercises before moving on." };
  };

  const weakTopics = topicStats.filter((s) => s.total > 0 && s.correct / s.total < 0.7);
  const strongTopics = topicStats.filter((s) => s.total > 0 && s.correct / s.total >= 0.7);

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
              <div className="flex gap-5 justify-center sm:justify-start flex-wrap">
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

        {/* Bonus results */}
        {bonusTotal > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h2 className="font-semibold text-amber-800 mb-3">⭐ Bonus Questions</h2>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">{bonusCorrect}/{bonusTotal}</div>
                <div className="text-xs text-amber-700 mt-0.5">Correct</div>
              </div>
              <div className="flex-1">
                <div className="h-2.5 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-700"
                    style={{ width: `${bonusTotal > 0 ? Math.round((bonusCorrect / bonusTotal) * 100) : 0}%` }}
                  />
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  {bonusTotal > 0 ? Math.round((bonusCorrect / bonusTotal) * 100) : 0}% on bonus questions
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Topic breakdown */}
        {topicStats.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Performance by Topic</h2>
            <div className="space-y-4">
              {topicStats.map((s) => {
                const topicPct = Math.round((s.correct / s.total) * 100);
                const fb = getTopicFeedback(topicPct);
                return (
                  <div key={s.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: s.color }}>{s.name}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${fb.labelColor}`}>
                          {fb.label}
                        </span>
                      </div>
                      <span className="text-gray-500 tabular-nums">{s.correct}/{s.total} · {topicPct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${topicPct}%`, backgroundColor: s.color }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 leading-snug">{fb.tip}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Question type breakdown */}
        {typeStats.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Performance by Question Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {typeStats.map((s) => {
                const typePct = Math.round((s.correct / s.total) * 100);
                return (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{s.correct}/{s.total}</div>
                    <div className="text-xs font-semibold text-gray-600 mt-0.5">{s.label}</div>
                    <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                        style={{ width: `${typePct}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{typePct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {topicStats.length > 0 && (
          <div className={`rounded-2xl border-2 p-5 ${weakTopics.length === 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
            <h2 className={`font-semibold mb-2 ${weakTopics.length === 0 ? "text-green-800" : "text-amber-800"}`}>
              {weakTopics.length === 0 ? "🎉 Recommendation" : "📚 Recommendation"}
            </h2>
            {weakTopics.length === 0 ? (
              <p className="text-sm text-green-700">
                You performed well across all topics!{" "}
                {strongTopics.length > 0 && (
                  <>Keep practising <strong>{strongTopics.map((t) => t.name).join(", ")}</strong> to maintain your mastery.</>
                )}
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-amber-800">
                  We recommend spending more time on the following topic{weakTopics.length > 1 ? "s" : ""}:
                </p>
                <ul className="space-y-1">
                  {weakTopics.map((t) => {
                    const topicPct = Math.round((t.correct / t.total) * 100);
                    return (
                      <li key={t.name} className="flex items-start gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: t.color }} />
                        <span>
                          <strong style={{ color: t.color }}>{t.name}</strong>
                          {topicPct < 50
                            ? " — Review the formula and try the exercises from scratch."
                            : " — Review the grammar rules and practice with extra examples."}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {strongTopics.length > 0 && (
                  <p className="text-xs text-amber-700 mt-2">
                    You did well in: {strongTopics.map((t) => t.name).join(", ")}.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center pb-4">
          <Button onClick={() => { reset(); navigate("/quiz"); }} size="lg">Try Again</Button>
          <Button variant="secondary" onClick={() => navigate("/")} size="lg">← Home</Button>
        </div>
      </div>
    </div>
  );
}
