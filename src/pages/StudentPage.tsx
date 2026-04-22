import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext";
import { useSession } from "../context/SessionContext";
import type { Question } from "../types";
import QuestionCard from "../components/student/QuestionCard";
import FeedbackPanel from "../components/student/FeedbackPanel";
import LiveMindMap from "../components/student/LiveMindMap";

const TIMER_SECONDS = 210; // 3:30

type Phase = "main" | "bonus";

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
  const { answers, visitedPath, recordAnswer, markVisited, markComplete, reset } = useSession();
  const navigate = useNavigate();

  const questionsMap = useMemo(
    () => new Map(bank.questions.map((q) => [q.id, q])),
    [bank.questions]
  );
  const topicsMap = useMemo(
    () => new Map(bank.topics.map((t) => [t.id, t])),
    [bank.topics]
  );

  const bonusIds: string[] = bank.bonusIds ?? [];
  const topicEntries: string[] = bank.topicEntries ?? (bank.rootQuestionId ? [bank.rootQuestionId] : []);
  const bonusSet = useMemo(() => new Set(bonusIds), [bonusIds]);

  // Quiz navigation state
  const [phase, setPhase] = useState<Phase>("main");
  const [topicIdx, setTopicIdx] = useState(0);
  const [bonusQIdx, setBonusQIdx] = useState(0);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  // UI state
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ isCorrect: boolean } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start quiz when bank loads
  useEffect(() => {
    if (!loading && !started && topicEntries.length > 0) {
      const firstId = topicEntries[0];
      if (questionsMap.has(firstId)) {
        setCurrentQuestionId(firstId);
        markVisited(firstId);
        setStarted(true);
        // Start countdown
        timerRef.current = setInterval(() => {
          setTimeLeft((t) => {
            if (t <= 1) {
              clearInterval(timerRef.current!);
              return 0;
            }
            return t - 1;
          });
        }, 1000);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Auto-finish when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && started) {
      if (timerRef.current) clearInterval(timerRef.current);
      markComplete();
      navigate("/results");
    }
  }, [timeLeft, started, markComplete, navigate]);

  /** Given a raw nextId from the branching, resolve the actual next question ID.
   *  Bonus questions are skipped in the main phase by following their onCorrect. */
  function resolveNext(rawNext: string | null): string | null {
    if (!rawNext || !questionsMap.has(rawNext)) return null;
    if (bonusSet.has(rawNext)) {
      // Skip bonus in main flow; follow its onCorrect to continue
      const bonusQ = questionsMap.get(rawNext)!;
      const after = bonusQ.onCorrect;
      if (!after || !questionsMap.has(after) || bonusSet.has(after)) return null;
      return after;
    }
    return rawNext;
  }

  function advanceToNextTopic(currentTopicIdx: number) {
    const nextIdx = currentTopicIdx + 1;
    if (nextIdx >= topicEntries.length) {
      // All topics done — enter bonus phase
      if (bonusIds.length > 0) {
        setPhase("bonus");
        setBonusQIdx(0);
        const firstBonus = bonusIds[0];
        setCurrentQuestionId(firstBonus);
        markVisited(firstBonus);
      } else {
        markComplete();
        navigate("/results");
      }
    } else {
      setTopicIdx(nextIdx);
      const nextEntry = topicEntries[nextIdx];
      setCurrentQuestionId(nextEntry);
      markVisited(nextEntry);
    }
  }

  function advanceBonusPhase(currentBonusIdx: number) {
    const nextIdx = currentBonusIdx + 1;
    if (nextIdx >= bonusIds.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      markComplete();
      navigate("/results");
    } else {
      setBonusQIdx(nextIdx);
      const nextBonus = bonusIds[nextIdx];
      setCurrentQuestionId(nextBonus);
      markVisited(nextBonus);
    }
  }

  // Stores resolved next question ID so handleNext can navigate after feedback closes
  const pendingNextRef = useRef<string | null | undefined>(undefined);

  const handleSubmit = (response: string) => {
    const question = currentQuestionId ? questionsMap.get(currentQuestionId) : null;
    if (!question) return;

    const isCorrect = checkAnswer(question, response);
    recordAnswer({ questionId: question.id, studentResponse: response, isCorrect, answeredAt: Date.now() });
    setLastAnswer({ isCorrect });
    setShowFeedback(true);

    if (phase === "bonus") {
      pendingNextRef.current = undefined; // handled in advanceBonusPhase
      return;
    }

    // Resolve where to go next (don't navigate yet — feedback is showing)
    const rawNext = isCorrect ? question.onCorrect : question.onIncorrect;
    pendingNextRef.current = resolveNext(rawNext); // null = topic ends
  };

  const handleNext = () => {
    setShowFeedback(false);
    setLastAnswer(null);

    if (phase === "bonus") {
      advanceBonusPhase(bonusQIdx);
      return;
    }

    const nextId = pendingNextRef.current;
    pendingNextRef.current = undefined;

    if (nextId) {
      setCurrentQuestionId(nextId);
      markVisited(nextId);
    } else {
      // nextId === null: current topic section ended
      advanceToNextTopic(topicIdx);
    }
  };

  const handleAbandon = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    reset();
    navigate("/");
  };

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

  if (bank.questions.length === 0) {
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

  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, "0");
  const timerColor = timeLeft <= 30 ? "text-red-600" : timeLeft <= 60 ? "text-amber-600" : "text-gray-700";

  const isBonusQuestion = phase === "bonus";
  const bonusProgress = isBonusQuestion ? `${bonusQIdx + 1}/${bonusIds.length}` : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Top bar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">If Conditionals Quiz</span>
          {isBonusQuestion && (
            <span className="text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300 px-2 py-0.5 rounded-full">
              ⭐ Bonus {bonusProgress}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Countdown timer */}
          <div className={`text-sm font-mono font-bold tabular-nums ${timerColor}`}>
            {mins}:{secs}
          </div>
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
          {!confirmAbandon ? (
            <button
              onClick={() => setConfirmAbandon(true)}
              className="text-xs text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              Abandon Quiz
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
              <span className="text-xs text-red-600 font-medium">Quit?</span>
              <button
                onClick={handleAbandon}
                className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmAbandon(false)}
                className="text-xs text-gray-500 hover:text-gray-700 px-1"
              >
                No
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className={`flex gap-6 ${showMap ? "flex-col lg:flex-row" : "justify-center"}`}>
          {/* Question panel */}
          <div className={`space-y-4 ${showMap ? "lg:w-1/2" : "w-full max-w-2xl"}`}>
            {/* Progress indicator */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 flex-wrap">
                  {visitedPath.map((id, i) => {
                    const a = answers.find((ans) => ans.questionId === id);
                    const isBonus = bonusSet.has(id);
                    return (
                      <div
                        key={i}
                        title={id}
                        className={`w-2.5 h-2.5 rounded-full ${
                          isBonus
                            ? a?.isCorrect
                              ? "bg-amber-400"
                              : a
                              ? "bg-amber-300"
                              : "bg-amber-500 animate-pulse"
                            : a?.isCorrect
                            ? "bg-green-500"
                            : a
                            ? "bg-red-500"
                            : "bg-indigo-500 animate-pulse"
                        }`}
                      />
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

            {/* Bonus transition banner */}
            {isBonusQuestion && bonusQIdx === 0 && !showFeedback && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-center">
                <p className="text-sm font-semibold text-amber-800">
                  ⭐ Main quiz complete! Now answer {bonusIds.length} bonus questions to finish.
                </p>
              </div>
            )}

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
                    isLast={false}
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
