
interface ProgressBarProps {
  current: number;
  total: number;
  correctCount: number;
}

export default function ProgressBar({ current, total, correctCount }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1.5">
        <span>Question {Math.min(current + 1, total)} of {total}</span>
        <span className="text-green-600 font-medium">{correctCount} correct</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
