import React, { useRef, useState } from "react";
import type { QuestionBank } from "../../types";
import { exportBankAsJSON, importBankFromFile } from "../../utils/exportImport";
import Button from "../shared/Button";

interface Props {
  bank: QuestionBank;
  onImport: (bank: QuestionBank) => void;
  onReset: () => void;
}

export default function ImportExport({ bank, onImport, onReset }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setSuccess("");
    importBankFromFile(
      file,
      (imported) => {
        onImport(imported);
        setSuccess(`Imported ${imported.questions.length} questions successfully.`);
      },
      (msg) => setError(msg)
    );
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Import / Export</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => exportBankAsJSON(bank)}>
          ↓ Export JSON
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileRef.current?.click()}
        >
          ↑ Import JSON
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
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-600">{success}</p>}
      <p className="text-xs text-gray-400">
        Export to back up questions. Import to restore or share question sets.
      </p>
    </div>
  );
}
