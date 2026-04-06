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
      className={`mt-4 rounded-xl border-2 p-5 space-y-3 animate-fade-in ${
        isCorrect
          ? "border-green-300 bg-green-50"
          : "border-red-300 bg-red-50"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{isCorrect ? "🎉" : "💡"}</span>
        <span
          className={`font-semibold text-lg ${
            isCorrect ? "text-green-700" : "text-red-700"
          }`}
        >
          {isCorrect ? "Correct!" : "Not quite!"}
        </span>
      </div>
      {!isCorrect && (
        <p className="text-sm text-gray-700">
          <span className="font-medium">Correct answer: </span>
          <span className="font-semibold text-green-700">{correctAnswer}</span>
        </p>
      )}
      <p className="text-sm text-gray-700">{explanation}</p>
      <Button onClick={onNext} size="lg" className="w-full mt-2">
        {isLast ? "See Results" : "Next Question →"}
      </Button>
    </div>
  );
}
