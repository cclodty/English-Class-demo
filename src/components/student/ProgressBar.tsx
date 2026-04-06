interface ProgressBarProps {
  current: number;
  total: number;
  correctCount: number;
}

export default function ProgressBar({ current, total, correctCount }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-sm font-medium text-gray-700">
          Question <span className="text-indigo-600 font-bold">{Math.min(current + 1, total)}</span>
          <span className="text-gray-400"> / {total}</span>
        </span>
        <span className="text-sm font-medium text-green-600">
          {correctCount} correct
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
