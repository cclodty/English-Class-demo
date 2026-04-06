import type { QuestionBank } from "../types";

export function exportBankAsJSON(bank: QuestionBank): void {
  const blob = new Blob([JSON.stringify(bank, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "questions.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importBankFromFile(
  file: File,
  onSuccess: (bank: QuestionBank) => void,
  onError: (message: string) => void
): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target?.result as string) as QuestionBank;
      if (!Array.isArray(parsed.topics) || !Array.isArray(parsed.questions)) {
        onError("Invalid JSON structure: must have 'topics' and 'questions' arrays.");
        return;
      }
      onSuccess(parsed);
    } catch {
      onError("Failed to parse JSON file. Please check the file format.");
    }
  };
  reader.readAsText(file);
}
