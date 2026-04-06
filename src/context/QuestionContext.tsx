import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Question, QuestionBank, Topic } from "../types";
import {
  loadBankFromStorage,
  saveBankToStorage,
} from "../utils/storage";

interface QuestionContextValue {
  bank: QuestionBank;
  loading: boolean;
  upsertQuestion: (q: Question) => void;
  deleteQuestion: (id: string) => void;
  upsertTopic: (t: Topic) => void;
  deleteTopic: (id: string) => void;
  replaceBank: (bank: QuestionBank) => void;
  resetToDefault: () => void;
}

const QuestionContext = createContext<QuestionContextValue | null>(null);

const emptyBank: QuestionBank = { topics: [], questions: [] };

export function QuestionProvider({ children }: { children: React.ReactNode }) {
  const [bank, setBank] = useState<QuestionBank>(emptyBank);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadBankFromStorage();
    if (stored) {
      setBank(stored);
      setLoading(false);
    } else {
      fetch(`${import.meta.env.BASE_URL}questions.json`)
        .then((r) => r.json())
        .then((data: QuestionBank) => {
          setBank(data);
        })
        .catch(() => setBank(emptyBank))
        .finally(() => setLoading(false));
    }
  }, []);

  const persist = useCallback((updated: QuestionBank) => {
    setBank(updated);
    saveBankToStorage(updated);
  }, []);

  const upsertQuestion = useCallback(
    (q: Question) => {
      const questions = bank.questions.filter((x) => x.id !== q.id);
      persist({ ...bank, questions: [...questions, q] });
    },
    [bank, persist]
  );

  const deleteQuestion = useCallback(
    (id: string) => {
      persist({ ...bank, questions: bank.questions.filter((q) => q.id !== id) });
    },
    [bank, persist]
  );

  const upsertTopic = useCallback(
    (t: Topic) => {
      const topics = bank.topics.filter((x) => x.id !== t.id);
      persist({ ...bank, topics: [...topics, t] });
    },
    [bank, persist]
  );

  const deleteTopic = useCallback(
    (id: string) => {
      persist({
        ...bank,
        topics: bank.topics.filter((t) => t.id !== id),
        questions: bank.questions.filter((q) => q.topicId !== id),
      });
    },
    [bank, persist]
  );

  const replaceBank = useCallback(
    (newBank: QuestionBank) => {
      persist(newBank);
    },
    [persist]
  );

  const resetToDefault = useCallback(() => {
    fetch(`${import.meta.env.BASE_URL}questions.json`)
      .then((r) => r.json())
      .then((data: QuestionBank) => {
        setBank(data);
        saveBankToStorage(data);
      });
  }, []);

  return (
    <QuestionContext.Provider
      value={{
        bank,
        loading,
        upsertQuestion,
        deleteQuestion,
        upsertTopic,
        deleteTopic,
        replaceBank,
        resetToDefault,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestions() {
  const ctx = useContext(QuestionContext);
  if (!ctx) throw new Error("useQuestions must be used within QuestionProvider");
  return ctx;
}
