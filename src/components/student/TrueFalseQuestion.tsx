import type { TrueFalseQuestion as TFQ } from "../../types";

interface Props {
  question: TFQ;
  onSubmit: (answer: string) => void;
}

export default function TrueFalseQuestion({ onSubmit }: Props) {
  return (
    <div className="flex gap-4 mt-2">
      <button
        onClick={() => onSubmit("true")}
        className="flex-1 py-5 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 hover:border-emerald-400 transition-all font-bold text-emerald-700 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
      >
        ✓ True
      </button>
      <button
        onClick={() => onSubmit("false")}
        className="flex-1 py-5 rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 hover:border-rose-400 transition-all font-bold text-rose-700 text-lg focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
      >
        ✗ False
      </button>
    </div>
  );
}
