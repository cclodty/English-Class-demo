import Button from "../shared/Button";

interface FeedbackPanelProps {
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
  onNext: () => void;
  isLast: boolean;
}

export default function FeedbackPanel({
  isCorrect,
  explanation,
  correctAnswer,
  onNext,
  isLast,
}: FeedbackPanelProps) {
  return (
    <div
      className={`rounded-2xl border-2 p-5 space-y-3 mt-4 ${
        isCorrect
          ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50"
          : "border-rose-300 bg-gradient-to-br from-rose-50 to-red-50"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">{isCorrect ? "🎉" : "💡"}</span>
        <span className={`font-bold text-lg ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
          {isCorrect ? "Correct!" : "Not quite!"}
        </span>
      </div>
      {!isCorrect && (
        <div className="bg-white/60 rounded-xl px-4 py-2.5">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Correct answer</span>
          <p className="font-semibold text-emerald-700 mt-0.5">{correctAnswer}</p>
        </div>
      )}
      <div className="bg-white/60 rounded-xl px-4 py-2.5">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Explanation</span>
        <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{explanation}</p>
      </div>
      <Button onClick={onNext} size="lg" className="w-full mt-1">
        {isLast ? "See Results →" : "Next Question →"}
      </Button>
    </div>
  );
}
