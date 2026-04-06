import { useNavigate } from "react-router-dom";
import Button from "../components/shared/Button";

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
            with instant feedback and a visual mind map of your progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/quiz")}
              size="lg"
              className="bg-white text-indigo-700 hover:bg-indigo-50 border-transparent shadow-lg shadow-indigo-900/20 text-base"
            >
              Start Quiz →
            </Button>
            <Button
              onClick={() => navigate("/admin")}
              variant="ghost"
              size="lg"
              className="text-white border-white/40 hover:bg-white/10 text-base"
            >
              Teacher Admin
            </Button>
          </div>
          <p className="mt-5 text-blue-200 text-sm">20 questions · No login required · Free forever</p>
        </div>
      </header>

      {/* Conditional types overview */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">What You'll Learn</h2>
        <p className="text-gray-500 text-center mb-8">Four types of conditionals, from facts to imagination</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {conditionalTypes.map((c) => (
            <div
              key={c.type}
              className={`rounded-2xl border-2 p-5 ${c.light}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`${c.color} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                  {c.type} Conditional
                </span>
              </div>
              <p className={`text-xs font-mono font-medium mb-1 ${c.text}`}>{c.formula}</p>
              <p className="text-gray-700 text-sm italic mb-2">"{c.example}"</p>
              <p className="text-gray-500 text-xs">{c.use}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "1", icon: "❓", title: "Answer Questions", desc: "Multiple choice, True/False, and error correction — guiding you from basics to advanced." },
              { step: "2", icon: "💡", title: "Get Instant Feedback", desc: "See whether you're correct immediately, with a clear grammar explanation for every question." },
              { step: "3", icon: "🗺️", title: "View Your Mind Map", desc: "After finishing, see your full learning journey as an interactive mind map." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button onClick={() => navigate("/quiz")} size="lg">
              Start Now →
            </Button>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-xs text-gray-400">
        English Grammar Learning App · For classroom use
      </footer>
    </div>
  );
}
