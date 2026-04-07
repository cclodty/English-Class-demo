import { useState } from "react";
import type { Question, Topic } from "../../types";
import { useQuestions } from "../../context/QuestionContext";
import MindMapEditor from "./MindMapEditor";
import QuestionForm from "./QuestionForm";
import ImportExport from "./ImportExport";
import Modal from "../shared/Modal";
import Button from "../shared/Button";

function TopicManager({ topics, onUpsert, onDelete }: {
  topics: Topic[];
  onUpsert: (t: Topic) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4F86C6");

  const handleAdd = () => {
    if (!name.trim()) return;
    onUpsert({ id: `topic-${Date.now()}`, name: name.trim(), color });
    setName("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
          placeholder="Topic name" />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
          className="w-9 h-9 border border-gray-300 rounded-lg cursor-pointer" title="Pick colour" />
        <Button size="sm" onClick={handleAdd} disabled={!name.trim()}>Add</Button>
      </div>
      <ul className="space-y-1">
        {topics.map((t) => (
          <li key={t.id} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
            <span className="flex-1 text-gray-700">{t.name}</span>
            <button onClick={() => {
              if (confirm(`Delete topic "${t.name}"? All questions in this topic will also be deleted.`))
                onDelete(t.id);
            }} className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const {
    bank, upsertQuestion, deleteQuestion, upsertTopic, deleteTopic,
    replaceBank, resetToDefault, setRootQuestion,
  } = useQuestions();

  const [editingQuestion, setEditingQuestion] = useState<Question | null | "new">(null);
  const [showTopics, setShowTopics] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  const handleSave = (q: Question) => {
    upsertQuestion(q);
    setEditingQuestion(null);
  };

  const newQuestionTemplate: Question = {
    id: "",
    topicId: bank.topics[0]?.id ?? "",
    type: "multiple-choice",
    text: "",
    explanation: "",
    onCorrect: null,
    onIncorrect: null,
    position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
    options: [
      { id: "a", text: "" }, { id: "b", text: "" },
      { id: "c", text: "" }, { id: "d", text: "" },
    ],
    correctOptionId: "a",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Teacher Admin</h1>
            <p className="text-xs text-gray-400">
              {bank.questions.length} questions · {bank.topics.length} topics ·
              <span className="text-indigo-600 ml-1">Start: {bank.rootQuestionId}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowTopics(true)}>
            Topics
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowImportExport(true)}>
            Import/Export
          </Button>
          <a href="#/" className="text-sm text-blue-600 hover:underline px-2">← Student View</a>
          <Button variant="ghost" size="sm" onClick={onLogout}>Logout</Button>
        </div>
      </header>

      {/* Hint bar */}
      <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-2 text-xs text-indigo-600 flex-shrink-0">
        💡 <strong>Double-click</strong> a question to edit · <strong>Right-click</strong> for options ·
        Drag from <span className="text-emerald-600 font-semibold">green handle</span> (correct) or
        <span className="text-rose-600 font-semibold ml-1">red handle</span> (wrong) to connect · <strong>Delete</strong> key removes selected edges
      </div>

      {/* Mind map editor fills remaining space */}
      <div className="flex-1 min-h-0" style={{ height: "calc(100vh - 100px)" }}>
        <MindMapEditor
          bank={bank}
          onSave={replaceBank}
          onEditQuestion={(q) => setEditingQuestion(q)}
          onDeleteQuestion={deleteQuestion}
          onSetRoot={setRootQuestion}
          onAddQuestion={() => setEditingQuestion("new")}
        />
      </div>

      {/* Question edit modal */}
      <Modal
        isOpen={editingQuestion !== null}
        onClose={() => setEditingQuestion(null)}
        title={editingQuestion === "new" || !editingQuestion?.id ? "Add Question" : "Edit Question"}
        size="xl"
      >
        {editingQuestion !== null && (
          <QuestionForm
            initial={editingQuestion === "new" ? undefined : editingQuestion ?? undefined}
            topics={bank.topics}
            allQuestions={bank.questions}
            onSave={handleSave}
            onCancel={() => setEditingQuestion(null)}
          />
        )}
      </Modal>

      {/* Topics modal */}
      <Modal isOpen={showTopics} onClose={() => setShowTopics(false)} title="Manage Topics" size="sm">
        <TopicManager topics={bank.topics} onUpsert={upsertTopic} onDelete={deleteTopic} />
      </Modal>

      {/* Import/Export modal */}
      <Modal isOpen={showImportExport} onClose={() => setShowImportExport(false)} title="Import / Export" size="md">
        <ImportExport bank={bank} onImport={replaceBank} onReset={resetToDefault} />
      </Modal>
    </div>
  );
}
