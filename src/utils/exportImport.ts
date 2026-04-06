import * as XLSX from "xlsx";
import type { QuestionBank, Question, Topic } from "../types";

// ─── Excel column definitions ────────────────────────────────────────────────
// id | type | topicId | order | text | explanation |
// optionA | optionB | optionC | optionD | correctOptionId |
// correctAnswer | errorSegment | correction

interface ExcelRow {
  id: string;
  type: string;
  topicId: string;
  order: number;
  text: string;
  explanation: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctOptionId?: string;
  correctAnswer?: string;
  errorSegment?: string;
  correction?: string;
}

function bankToRows(bank: QuestionBank): ExcelRow[] {
  return [...bank.questions]
    .sort((a, b) => a.order - b.order)
    .map((q) => {
      const base: ExcelRow = {
        id: q.id,
        type: q.type,
        topicId: q.topicId,
        order: q.order,
        text: q.text,
        explanation: q.explanation,
      };
      if (q.type === "multiple-choice") {
        base.optionA = q.options.find((o) => o.id === "a")?.text ?? "";
        base.optionB = q.options.find((o) => o.id === "b")?.text ?? "";
        base.optionC = q.options.find((o) => o.id === "c")?.text ?? "";
        base.optionD = q.options.find((o) => o.id === "d")?.text ?? "";
        base.correctOptionId = q.correctOptionId;
      } else if (q.type === "true-false") {
        base.correctAnswer = String(q.correctAnswer);
      } else if (q.type === "error-correction") {
        base.errorSegment = q.errorSegment;
        base.correction = q.correction;
      }
      return base;
    });
}

function rowsToBank(rows: ExcelRow[], existingTopics: Topic[]): QuestionBank {
  const topicsMap = new Map(existingTopics.map((t) => [t.id, t]));

  const questions: Question[] = rows
    .filter((r) => r.id && r.type && r.text)
    .map((r): Question | null => {
      const base = {
        id: String(r.id),
        topicId: String(r.topicId ?? ""),
        order: Number(r.order) || 1,
        text: String(r.text),
        explanation: String(r.explanation ?? ""),
      };
      if (r.type === "multiple-choice") {
        return {
          ...base,
          type: "multiple-choice",
          options: [
            { id: "a", text: String(r.optionA ?? "") },
            { id: "b", text: String(r.optionB ?? "") },
            { id: "c", text: String(r.optionC ?? "") },
            { id: "d", text: String(r.optionD ?? "") },
          ],
          correctOptionId: String(r.correctOptionId ?? "a"),
        };
      } else if (r.type === "true-false") {
        return {
          ...base,
          type: "true-false",
          correctAnswer: String(r.correctAnswer).toLowerCase() === "true",
        };
      } else if (r.type === "error-correction") {
        return {
          ...base,
          type: "error-correction",
          errorSegment: String(r.errorSegment ?? ""),
          correction: String(r.correction ?? ""),
        };
      }
      return null;
    })
    .filter((q): q is Question => q !== null);

  return { topics: existingTopics, questions };
}

// ─── Export ──────────────────────────────────────────────────────────────────

export function exportBankAsExcel(bank: QuestionBank): void {
  const wb = XLSX.utils.book_new();

  // Questions sheet
  const qRows = bankToRows(bank);
  const qSheet = XLSX.utils.json_to_sheet(qRows, {
    header: [
      "id", "type", "topicId", "order", "text", "explanation",
      "optionA", "optionB", "optionC", "optionD",
      "correctOptionId", "correctAnswer", "errorSegment", "correction",
    ],
  });
  // Set column widths
  qSheet["!cols"] = [
    { wch: 20 }, { wch: 18 }, { wch: 14 }, { wch: 6 }, { wch: 50 }, { wch: 50 },
    { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 },
    { wch: 14 }, { wch: 13 }, { wch: 20 }, { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, qSheet, "Questions");

  // Topics sheet
  const tRows = bank.topics.map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color,
    order: t.order,
  }));
  const tSheet = XLSX.utils.json_to_sheet(tRows, {
    header: ["id", "name", "color", "order"],
  });
  tSheet["!cols"] = [{ wch: 20 }, { wch: 24 }, { wch: 10 }, { wch: 6 }];
  XLSX.utils.book_append_sheet(wb, tSheet, "Topics");

  XLSX.writeFile(wb, "questions.xlsx");
}

// ─── Import ──────────────────────────────────────────────────────────────────

export function importBankFromExcel(
  file: File,
  onSuccess: (bank: QuestionBank) => void,
  onError: (message: string) => void
): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });

      const qSheet = wb.Sheets["Questions"];
      if (!qSheet) {
        onError('Missing "Questions" sheet. Please use the exported template.');
        return;
      }

      const rows = XLSX.utils.sheet_to_json<ExcelRow>(qSheet);

      // Parse topics from Topics sheet if present
      let topics: Topic[] = [];
      const tSheet = wb.Sheets["Topics"];
      if (tSheet) {
        const tRows = XLSX.utils.sheet_to_json<Topic>(tSheet);
        topics = tRows.filter((t) => t.id && t.name);
      }

      const bank = rowsToBank(rows, topics);
      if (bank.questions.length === 0) {
        onError("No valid questions found in the Excel file.");
        return;
      }
      onSuccess(bank);
    } catch (err) {
      onError(`Failed to read Excel file: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  };
  reader.readAsArrayBuffer(file);
}

// ─── Legacy JSON helpers (kept for backward compatibility) ───────────────────

export function exportBankAsJSON(bank: QuestionBank): void {
  const blob = new Blob([JSON.stringify(bank, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "questions.json";
  a.click();
  URL.revokeObjectURL(url);
}
