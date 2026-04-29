import { useNavigate } from "react-router-dom";

const conditionalTypes = [
  {
    type: "Zero",
    color: "bg-emerald-500",
    light: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    formula: "If + present simple, present simple",
    example: "If you heat water, it boils.",
    use: "General truths & facts",
  },
  {
    type: "First",
    color: "bg-blue-500",
    light: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    formula: "If + present simple, will + base verb",
    example: "If it rains, I will stay home.",
    use: "Real future possibilities",
  },
  {
    type: "Second",
    color: "bg-violet-500",
    light: "bg-violet-50 border-violet-200",
    text: "text-violet-700",
    formula: "If + past simple, would + base verb",
    example: "If I were rich, I would travel.",
    use: "Imaginary present / future",
  },
  {
    type: "Third",
    color: "bg-rose-500",
    light: "bg-rose-50 border-rose-200",
    text: "text-rose-700",
    formula: "If + past perfect, would have + past participle",
    example: "If she had studied, she would have passed.",
    use: "Imaginary past situations",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">

      {/* Top Nav */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <span className="font-bold text-indigo-700 text-sm tracking-wide">If Conditionals</span>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-12 text-9xl font-bold select-none">if</div>
          <div className="absolute bottom-4 right-16 text-8xl font-bold select-none rotate-12">?</div>
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            English Grammar · Secondary Level
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Master If Conditionals
          </h1>
          <p className="text-lg text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">
            A guided, interactive quiz that takes you from Zero to Third Conditional — step by step,
            with instant feedback.
          </p>
          <button
            onClick={() => navigate("/quiz")}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-blue-900/30 transition-colors"
          >
            Start Now →
          </button>
        </div>
      </header>

      {/* Topic overview */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Choose a Topic to Practise</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          The quiz covers all four conditional types in sequence
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {conditionalTypes.map((c) => (
            <div
              key={c.type}
              className={`rounded-2xl border-2 p-5 ${c.light} flex flex-col gap-3`}
            >
              <div className="flex items-center gap-3">
                <span className={`${c.color} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                  {c.type} Conditional
                </span>
              </div>
              <p className={`text-xs font-mono font-medium ${c.text}`}>{c.formula}</p>
              <p className="text-gray-700 text-sm italic">"{c.example}"</p>
              <p className="text-gray-500 text-xs">{c.use}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-6 text-xs text-gray-400">
        English Grammar Learning App · For classroom use
      </footer>
    </div>
  );
}
