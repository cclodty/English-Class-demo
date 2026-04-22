import { createContext, useCallback, useContext, useState } from "react";
import type { StudentAnswer } from "../types";

interface SessionContextValue {
  answers: StudentAnswer[];
  visitedPath: string[];
  isComplete: boolean;
  recordAnswer: (answer: StudentAnswer) => void;
  markVisited: (id: string) => void;
  markComplete: () => void;
  reset: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [visitedPath, setVisitedPath] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const recordAnswer = useCallback((answer: StudentAnswer) => {
    setAnswers((prev) => [...prev, answer]);
  }, []);

  const markVisited = useCallback((id: string) => {
    setVisitedPath((prev) => [...prev, id]);
  }, []);

  const markComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  const reset = useCallback(() => {
    setAnswers([]);
    setVisitedPath([]);
    setIsComplete(false);
  }, []);

  return (
    <SessionContext.Provider value={{ answers, visitedPath, isComplete, recordAnswer, markVisited, markComplete, reset }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
