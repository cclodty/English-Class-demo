import type { QuestionBank } from "../types";

const QUESTION_BANK_KEY = "questionBank";
const SCHEMA_VERSION_KEY = "questionBankSchemaVersion";
// Bump this string whenever the QuestionBank schema has breaking changes.
// Old stored data will be discarded and fresh data loaded from questions.json.
const SCHEMA_VERSION = "v3-branching-positions";

export function loadBankFromStorage(): QuestionBank | null {
  try {
    const storedVersion = localStorage.getItem(SCHEMA_VERSION_KEY);
    if (storedVersion !== SCHEMA_VERSION) {
      // Schema changed – wipe stale data so we reload from questions.json
      localStorage.removeItem(QUESTION_BANK_KEY);
      localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
      return null;
    }
    const raw = localStorage.getItem(QUESTION_BANK_KEY);
    if (!raw) return null;
    const bank = JSON.parse(raw) as QuestionBank;
    // Extra safety: discard if no rootQuestionId (completely invalid data)
    if (!bank.rootQuestionId) return null;
    return bank;
  } catch {
    return null;
  }
}

export function saveBankToStorage(bank: QuestionBank): void {
  localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(bank));
  localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
}

export function clearBankFromStorage(): void {
  localStorage.removeItem(QUESTION_BANK_KEY);
}
