import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext";
import { useSession } from "../context/SessionContext";
import type { Question } from "../types";
import ProgressBar from "../components/student/ProgressBar";
import QuestionCard from "../components/student/QuestionCard";
import FeedbackPanel from "../components/student/FeedbackPanel";

function getCorrectAnswer(q: Question): string {
  if (q.type === "multiple-choice") {
    const opt = q.options.find((o) => o.id === q.correctOptionId);
    return opt ? `${opt.id.toUpperCase()}. ${opt.text}` : q.correctOptionId;
  }
  if (q.type === "true-false") {
    return q.correctAnswer ? "True" : "False";
  }
  return q.correction;
}

function checkAnswer(q: Question, response: string): boolean {
  if (q.type === "multiple-choice") {
    return response === q.correctOptionId;
  }
  if (q.type === "true-false") {
    return response === String(q.correctAnswer);
  }
  return response.trim().toLowerCase() === q.correction.trim().toLowerCase();
}

export default function StudentPage() {
  const { bank, loading } = useQuestions();
  const { currentIndex, answers, submitAnswer, advance } = useSession();
  const navigate = useNavigate();

  const [showFeedback, setShowFeedback] = useState(false);

  const questions = useMemo(
    () => [...bank.questions].sort((a, b) => a.order - b.order),
    [bank.questions]
  );

  const topicsMap = useMemo(
    () => new Map(bank.topics.map((t) => [t.id, t])),
    [bank.topics]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-gray-500 text-lg">Loading questions…</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl p-8 shadow-md text-center max-w-sm">
          <p className="text-gray-500 mb-4">No questions available yet.</p>
          <p className="text-sm text-gray-400">
            Ask your teacher to add questions via the admin panel.
          </p>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];
  const topic = question ? topicsMap.get(question.topicId) : undefined;
  const lastAnswer = answers[answers.length - 1];
  const correctCount = answers.filter((a) => a.isCorrect).length;

  const handleSubmit = (response: string) => {
    if (!question) return;
    const isCorrect = checkAnswer(question, response);
    submitAnswer({
      questionId: question.id,
      studentResponse: response,
      isCorrect,
      answeredAt: Date.now(),
    });
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      advance(questions.length);
      navigate("/results");
    } else {
      advance(questions.length);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-800">
            English Grammar Quiz
          </h1>
          <a
            href="#/admin"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Teacher login
          </a>
        </div>

        {/* Progress */}
        <ProgressBar
          current={currentIndex}
          total={questions.length}
          correctCount={correctCount}
        />

        {/* Question */}
        {question && !showFeedback && (
          <QuestionCard
            question={question}
            topic={topic}
            onSubmit={handleSubmit}
          />
        )}

        {/* Feedback */}
        {showFeedback && question && lastAnswer && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {question.text.length > 80
                  ? question.text.slice(0, 77) + "…"
                  : question.text}
              </span>
            </div>
            <FeedbackPanel
              isCorrect={lastAnswer.isCorrect}
              explanation={question.explanation}
              correctAnswer={getCorrectAnswer(question)}
              onNext={handleNext}
              isLast={currentIndex === questions.length - 1}
            />
          </div>
        )}
      </div>
    </div>
  );
}
