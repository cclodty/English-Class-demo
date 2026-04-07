import { createContext, useCallback, useContext, useState } from "react";
import type { StudentAnswer } from "../types";

interface SessionContextValue {
  currentQuestionId: string | null;
  answers: StudentAnswer[];
  /** Ordered list of question IDs the student has visited */
  visitedPath: string[];
  isComplete: boolean;
  startSession: (rootId: string) => void;
  submitAnswer: (answer: StudentAnswer, nextId: string | null) => void;
  reset: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [visitedPath, setVisitedPath] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const startSession = useCallback((rootId: string) => {
    setCurrentQuestionId(rootId);
    setVisitedPath([rootId]);
    setAnswers([]);
    setIsComplete(false);
  }, []);

  const submitAnswer = useCallback(
    (answer: StudentAnswer, nextId: string | null) => {
      setAnswers((prev) => [...prev, answer]);
      if (nextId === null) {
        setIsComplete(true);
        setCurrentQuestionId(null);
      } else {
        setCurrentQuestionId(nextId);
        setVisitedPath((prev) => [...prev, nextId]);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setCurrentQuestionId(null);
    setAnswers([]);
    setVisitedPath([]);
    setIsComplete(false);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        currentQuestionId,
        answers,
        visitedPath,
        isComplete,
        startSession,
        submitAnswer,
        reset,
      }}
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
