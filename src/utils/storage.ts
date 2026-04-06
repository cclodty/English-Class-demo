import type { QuestionBank } from "../types";

const QUESTION_BANK_KEY = "questionBank";

export function loadBankFromStorage(): QuestionBank | null {
  try {
    const raw = localStorage.getItem(QUESTION_BANK_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuestionBank;
  } catch {
    return null;
  }
}

export function saveBankToStorage(bank: QuestionBank): void {
  localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(bank));
}

export function clearBankFromStorage(): void {
  localStorage.removeItem(QUESTION_BANK_KEY);
}
