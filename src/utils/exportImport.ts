import * as XLSX from "xlsx";
import type { QuestionBank, Question, Topic } from "../types";

// ─── Excel row shape ──────────────────────────────────────────────────────────
// Columns: id | type | topicId | text | explanation |
//          optionA | optionB | optionC | optionD | correctOptionId |
//          correctAnswer | errorSegment | correction |
//          onCorrect | onIncorrect

interface ExcelRow {
  id: string;
  type: string;
  topicId: string;
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
  onCorrect?: string;
  onIncorrect?: string;
}

const HEADERS = [
  "id", "type", "topicId", "text", "explanation",
  "optionA", "optionB", "optionC", "optionD", "correctOptionId",
  "correctAnswer", "errorSegment", "correction",
  "onCorrect", "onIncorrect",
];

function bankToRows(bank: QuestionBank): ExcelRow[] {
  return bank.questions.map((q) => {
    const row: ExcelRow = {
      id: q.id,
      type: q.type,
      topicId: q.topicId,
      text: q.text,
      explanation: q.explanation,
      onCorrect: q.onCorrect ?? "",
      onIncorrect: q.onIncorrect ?? "",
    };
    if (q.type === "multiple-choice") {
      row.optionA = q.options.find((o) => o.id === "a")?.text ?? "";
      row.optionB = q.options.find((o) => o.id === "b")?.text ?? "";
      row.optionC = q.options.find((o) => o.id === "c")?.text ?? "";
      row.optionD = q.options.find((o) => o.id === "d")?.text ?? "";
      row.correctOptionId = q.correctOptionId;
    } else if (q.type === "true-false") {
      row.correctAnswer = String(q.correctAnswer);
    } else if (q.type === "error-correction") {
      row.errorSegment = q.errorSegment;
      row.correction = q.correction;
    }
    return row;
  });
}

function rowsToQuestions(rows: ExcelRow[]): Question[] {
  return rows
    .filter((r) => r.id && r.type && r.text)
    .map((r): Question | null => {
      const base = {
        id: String(r.id),
        topicId: String(r.topicId ?? ""),
        text: String(r.text),
        explanation: String(r.explanation ?? ""),
        onCorrect: r.onCorrect && String(r.onCorrect).trim() ? String(r.onCorrect).trim() : null,
        onIncorrect: r.onIncorrect && String(r.onIncorrect).trim() ? String(r.onIncorrect).trim() : null,
      };
      if (r.type === "multiple-choice") {
        return {
          ...base, type: "multiple-choice",
          options: [
            { id: "a", text: String(r.optionA ?? "") },
            { id: "b", text: String(r.optionB ?? "") },
            { id: "c", text: String(r.optionC ?? "") },
            { id: "d", text: String(r.optionD ?? "") },
          ],
          correctOptionId: String(r.correctOptionId ?? "a"),
        };
      } else if (r.type === "true-false") {
        return { ...base, type: "true-false", correctAnswer: String(r.correctAnswer).toLowerCase() === "true" };
      } else if (r.type === "error-correction") {
        return { ...base, type: "error-correction", errorSegment: String(r.errorSegment ?? ""), correction: String(r.correction ?? "") };
      }
      return null;
    })
    .filter((q): q is Question => q !== null);
}

// ─── Export ──────────────────────────────────────────────────────────────────

export function exportBankAsExcel(bank: QuestionBank): void {
  const wb = XLSX.utils.book_new();

  // Questions sheet
  const qSheet = XLSX.utils.json_to_sheet(bankToRows(bank), { header: HEADERS });
  qSheet["!cols"] = [
    { wch: 20 }, { wch: 18 }, { wch: 14 }, { wch: 60 }, { wch: 60 },
    { wch: 35 }, { wch: 35 }, { wch: 35 }, { wch: 35 }, { wch: 14 },
    { wch: 13 }, { wch: 25 }, { wch: 25 }, { wch: 18 }, { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(wb, qSheet, "Questions");

  // Topics sheet
  const tSheet = XLSX.utils.json_to_sheet(
    bank.topics.map((t) => ({ id: t.id, name: t.name, color: t.color })),
    { header: ["id", "name", "color"] }
  );
  tSheet["!cols"] = [{ wch: 20 }, { wch: 24 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, tSheet, "Topics");

  // Meta sheet
  const metaSheet = XLSX.utils.json_to_sheet([{ rootQuestionId: bank.rootQuestionId }]);
  XLSX.utils.book_append_sheet(wb, metaSheet, "Meta");

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
      if (!qSheet) { onError('Missing "Questions" sheet.'); return; }
      const rows = XLSX.utils.sheet_to_json<ExcelRow>(qSheet);
      const questions = rowsToQuestions(rows);
      if (questions.length === 0) { onError("No valid questions found."); return; }

      let topics: Topic[] = [];
      const tSheet = wb.Sheets["Topics"];
      if (tSheet) {
        topics = (XLSX.utils.sheet_to_json<Topic>(tSheet)).filter((t) => t.id && t.name);
      }

      let rootQuestionId = questions[0]?.id ?? "";
      const metaSheet = wb.Sheets["Meta"];
      if (metaSheet) {
        const meta = XLSX.utils.sheet_to_json<{ rootQuestionId: string }>(metaSheet);
        if (meta[0]?.rootQuestionId) rootQuestionId = meta[0].rootQuestionId;
      }

      onSuccess({ topics, questions, rootQuestionId });
    } catch (err) {
      onError(`Failed to read Excel file: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  };
  reader.readAsArrayBuffer(file);
}

// ─── Legacy JSON export ───────────────────────────────────────────────────────

export function exportBankAsJSON(bank: QuestionBank): void {
  const blob = new Blob([JSON.stringify(bank, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "questions.json"; a.click();
  URL.revokeObjectURL(url);
}
