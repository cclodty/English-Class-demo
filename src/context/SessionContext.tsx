import React, { createContext, useCallback, useContext, useState } from "react";
import type { StudentAnswer } from "../types";

interface SessionContextValue {
  currentIndex: number;
  answers: StudentAnswer[];
  isComplete: boolean;
  submitAnswer: (answer: StudentAnswer) => void;
  advance: (totalQuestions?: number) => void;
  reset: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const submitAnswer = useCallback((answer: StudentAnswer) => {
    setAnswers((prev) => [...prev, answer]);
  }, []);

  const advance = useCallback(
    (totalQuestions?: number) => {
      const nextIndex = currentIndex + 1;
      if (totalQuestions !== undefined && nextIndex >= totalQuestions) {
        setIsComplete(true);
      }
      setCurrentIndex(nextIndex);
    },
    [currentIndex]
  );

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setIsComplete(false);
  }, []);

  return (
    <SessionContext.Provider
      value={{ currentIndex, answers, isComplete, submitAnswer, advance, reset }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
