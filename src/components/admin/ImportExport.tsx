import { useRef, useState } from "react";
import type { QuestionBank } from "../../types";
import {
  exportBankAsExcel,
  exportBankAsJSON,
  importBankFromExcel,
} from "../../utils/exportImport";
import Button from "../shared/Button";

interface Props {
  bank: QuestionBank;
  onImport: (bank: QuestionBank) => void;
  onReset: () => void;
}

export default function ImportExport({ bank, onImport, onReset }: Props) {
  const excelRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setSuccess("");
    importBankFromExcel(
      file,
      (imported) => {
        onImport(imported);
        setSuccess(`Imported ${imported.questions.length} questions successfully.`);
      },
      (msg) => setError(msg)
    );
    if (excelRef.current) excelRef.current.value = "";
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Import / Export</h3>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-gray-500 mb-1.5 font-medium">Excel (.xlsx)</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => exportBankAsExcel(bank)}>
              ↓ Export Excel
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => excelRef.current?.click()}
            >
              ↑ Import Excel
            </Button>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1.5 font-medium">Other</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => exportBankAsJSON(bank)}>
              ↓ Export JSON
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Reset to default questions? This cannot be undone.")) {
                  onReset();
                  setSuccess("Reset to default questions.");
                }
              }}
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={excelRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleExcelImport}
        className="hidden"
      />

      {error && (
        <div className="text-xs text-red-600 bg-red-50 rounded-lg p-2">{error}</div>
      )}
      {success && (
        <div className="text-xs text-green-600 bg-green-50 rounded-lg p-2">{success}</div>
      )}
      <p className="text-xs text-gray-400 leading-relaxed">
        Export first to get the correct Excel template, then fill in your questions and import.
      </p>
    </div>
  );
}
