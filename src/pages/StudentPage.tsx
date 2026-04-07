import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext";
import { useSession } from "../context/SessionContext";
import type { Question } from "../types";
import QuestionCard from "../components/student/QuestionCard";
import FeedbackPanel from "../components/student/FeedbackPanel";
import LiveMindMap from "../components/student/LiveMindMap";

function getCorrectAnswer(q: Question): string {
  if (q.type === "multiple-choice") {
    const opt = q.options.find((o) => o.id === q.correctOptionId);
    return opt ? `${opt.id.toUpperCase()}. ${opt.text}` : q.correctOptionId;
  }
  if (q.type === "true-false") return q.correctAnswer ? "True" : "False";
  return q.correction;
}

function checkAnswer(q: Question, response: string): boolean {
  if (q.type === "multiple-choice") return response === q.correctOptionId;
  if (q.type === "true-false") return response === String(q.correctAnswer);
  return response.trim().toLowerCase() === q.correction.trim().toLowerCase();
}

export default function StudentPage() {
  const { bank, loading } = useQuestions();
  const { currentQuestionId, answers, visitedPath, isComplete, startSession, submitAnswer } = useSession();
  const navigate = useNavigate();

  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ isCorrect: boolean } | null>(null);
  const [showMap, setShowMap] = useState(false);

  const questionsMap = useMemo(
    () => new Map(bank.questions.map((q) => [q.id, q])),
    [bank.questions]
  );
  const topicsMap = useMemo(
    () => new Map(bank.topics.map((t) => [t.id, t])),
    [bank.topics]
  );

  // Start session when bank loads
  useEffect(() => {
    if (!loading && bank.rootQuestionId && currentQuestionId === null && !isComplete) {
      startSession(bank.rootQuestionId);
    }
  }, [loading, bank.rootQuestionId, currentQuestionId, isComplete, startSession]);

  // Navigate to results when complete
  useEffect(() => {
    if (isComplete) navigate("/results");
  }, [isComplete, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading questions…</p>
        </div>
      </div>
    );
  }

  if (bank.questions.length === 0 || !bank.rootQuestionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white rounded-2xl p-8 shadow-md text-center max-w-sm mx-4">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-600 font-medium mb-2">No questions available yet.</p>
          <p className="text-sm text-gray-400">Ask your teacher to set up the quiz.</p>
        </div>
      </div>
    );
  }

  const question = currentQuestionId ? questionsMap.get(currentQuestionId) : null;
  const topic = question ? topicsMap.get(question.topicId) : undefined;
  const answered = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;

  const handleSubmit = (response: string) => {
    if (!question) return;
    const isCorrect = checkAnswer(question, response);
    const nextId = isCorrect ? question.onCorrect : question.onIncorrect;
    submitAnswer(
      { questionId: question.id, studentResponse: response, isCorrect, answeredAt: Date.now() },
      nextId
    );
    setLastAnswer({ isCorrect });
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setLastAnswer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Top bar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <a href="#/" className="text-gray-400 hover:text-indigo-600 text-sm transition-colors">← Home</a>
          <span className="text-gray-200">|</span>
          <span className="text-sm font-semibold text-gray-700">If Conditionals Quiz</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            <span className="text-green-600 font-semibold">{correct}</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="font-medium">{answered}</span>
            <span className="text-gray-400 ml-1">answered</span>
          </div>
          <button
            onClick={() => setShowMap((v) => !v)}
            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg font-medium transition-colors border border-indigo-200"
          >
            {showMap ? "Hide Map" : "🗺️ Show Map"}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className={`flex gap-6 ${showMap ? "flex-col lg:flex-row" : "justify-center"}`}>
          {/* Question panel */}
          <div className={`space-y-4 ${showMap ? "lg:w-1/2" : "w-full max-w-2xl"}`}>
            {/* Progress indicator */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {visitedPath.map((id, i) => {
                    const a = answers.find((ans) => ans.questionId === id);
                    return (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full ${
                        a?.isCorrect ? "bg-green-500" : a ? "bg-red-500" : "bg-indigo-500 animate-pulse"
                      }`} />
                    );
                  })}
                </div>
                <span className="text-xs text-gray-400">{answered} answered</span>
              </div>
              {topic && (
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: topic.color }}
                >
                  {topic.name}
                </span>
              )}
            </div>

            {/* Question or feedback */}
            {question && !showFeedback && (
              <QuestionCard question={question} topic={topic} onSubmit={handleSubmit} />
            )}
            {showFeedback && question && lastAnswer && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 pt-5 pb-1">
                  <p className="text-sm text-gray-500 line-clamp-2">{question.text}</p>
                </div>
                <div className="px-6 pb-5">
                  <FeedbackPanel
                    isCorrect={lastAnswer.isCorrect}
                    explanation={question.explanation}
                    correctAnswer={getCorrectAnswer(question)}
                    onNext={handleNext}
                    isLast={question.onCorrect === null && question.onIncorrect === null}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Live mind map panel */}
          {showMap && (
            <div className="lg:w-1/2 space-y-2">
              <div className="flex items-center justify-between px-1">
                <p className="text-sm font-semibold text-gray-700">Your Learning Path</p>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse inline-block" /> Current</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Correct</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Wrong</span>
                </div>
              </div>
              <LiveMindMap
                questions={bank.questions}
                topics={bank.topics}
                answers={answers}
                currentId={showFeedback ? null : currentQuestionId}
                visitedPath={visitedPath}
                height={560}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
