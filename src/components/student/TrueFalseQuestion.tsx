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
        className="flex-1 py-5 rounded-xl border-2 border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-400 transition-colors font-semibold text-green-700 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        ✓ True
      </button>
      <button
        onClick={() => onSubmit("false")}
        className="flex-1 py-5 rounded-xl border-2 border-red-300 bg-red-50 hover:bg-red-100 hover:border-red-400 transition-colors font-semibold text-red-700 text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        ✗ False
      </button>
    </div>
  );
}
