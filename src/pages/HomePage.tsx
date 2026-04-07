import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext";
import type { QuestionBank } from "../types";

const conditionalTypes = [
  {
    type: "Zero",
    color: "bg-emerald-500",
    light: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    btnBg: "bg-emerald-500 hover:bg-emerald-600",
    formula: "If + present simple, present simple",
    example: "If you heat water, it boils.",
    use: "General truths & facts",
  },
  {
    type: "First",
    color: "bg-blue-500",
    light: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    btnBg: "bg-blue-500 hover:bg-blue-600",
    formula: "If + present simple, will + base verb",
    example: "If it rains, I will stay home.",
    use: "Real future possibilities",
  },
  {
    type: "Second",
    color: "bg-violet-500",
    light: "bg-violet-50 border-violet-200",
    text: "text-violet-700",
    btnBg: "bg-violet-500 hover:bg-violet-600",
    formula: "If + past simple, would + base verb",
    example: "If I were rich, I would travel.",
    use: "Imaginary present / future",
  },
  {
    type: "Third",
    color: "bg-rose-500",
    light: "bg-rose-50 border-rose-200",
    text: "text-rose-700",
    btnBg: "bg-rose-500 hover:bg-rose-600",
    formula: "If + past perfect, would have + past participle",
    example: "If she had studied, she would have passed.",
    use: "Imaginary past situations",
  },
];

function getTopicEntryId(bank: QuestionBank, topicId: string): string | null {
  const topicQs = bank.questions.filter((q) => q.topicId === topicId);
  if (topicQs.length === 0) return null;
  const topicQIds = new Set(topicQs.map((q) => q.id));
  if (topicQIds.has(bank.rootQuestionId)) return bank.rootQuestionId;
  const entry = bank.questions.find(
    (q) => q.topicId !== topicId && q.onCorrect && topicQIds.has(q.onCorrect)
  );
  if (entry?.onCorrect) return entry.onCorrect;
  return [...topicQs].sort((a, b) => (a.position?.y ?? 0) - (b.position?.y ?? 0))[0].id;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { bank } = useQuestions();

  const enrichedTypes = useMemo(() =>
    conditionalTypes.map((ct) => {
      const topic = bank.topics.find((t) =>
        t.name.toLowerCase().includes(ct.type.toLowerCase())
      );
      const entryId = topic ? getTopicEntryId(bank, topic.id) : null;
      return { ...ct, entryId };
    }),
    [bank]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">

      {/* Top Nav */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <span className="font-bold text-indigo-700 text-sm tracking-wide">If Conditionals</span>
        <button
          onClick={() => navigate("/admin")}
          className="text-xs font-medium text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 rounded-lg px-3 py-1.5 transition-colors"
        >
          Teacher Admin
        </button>
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
            with instant feedback and a visual mind map of your progress.
          </p>
          <button
            onClick={() => navigate("/quiz")}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-blue-900/30 transition-colors"
          >
            Start Now →
          </button>
          <p className="mt-5 text-blue-200 text-sm">50 questions · Adaptive learning · No login required</p>
        </div>
      </header>

      {/* Choose topic section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Choose a Topic to Practise</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Jump straight to the conditional type you want to focus on
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {enrichedTypes.map((c) => (
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
              {c.entryId ? (
                <button
                  onClick={() => navigate("/quiz", { state: { startId: c.entryId } })}
                  className={`mt-1 self-start text-xs font-semibold text-white ${c.btnBg} px-3.5 py-1.5 rounded-lg transition-colors shadow-sm`}
                >
                  Start from here →
                </button>
              ) : (
                <button
                  onClick={() => navigate("/quiz")}
                  className={`mt-1 self-start text-xs font-semibold text-white ${c.btnBg} px-3.5 py-1.5 rounded-lg transition-colors shadow-sm`}
                >
                  Start from here →
                </button>
              )}
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
              { icon: "❓", title: "Answer Questions", desc: "Multiple choice, True/False, and error correction — guiding you from basics to advanced." },
              { icon: "💡", title: "Get Instant Feedback", desc: "See whether you're correct immediately, with a clear grammar explanation for every question." },
              { icon: "🗺️", title: "View Your Mind Map", desc: "After finishing, see your full learning journey as an interactive mind map." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-xs text-gray-400">
        English Grammar Learning App · For classroom use
      </footer>
    </div>
  );
}
