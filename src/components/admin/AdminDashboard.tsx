import React, { useState } from "react";
import type { Question, Topic } from "../../types";
import { useQuestions } from "../../context/QuestionContext";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";
import ImportExport from "./ImportExport";
import Modal from "../shared/Modal";
import Button from "../shared/Button";

interface Props {
  onLogout: () => void;
}

// Simple topic manager
function TopicManager({
  topics,
  onUpsert,
  onDelete,
}: {
  topics: Topic[];
  onUpsert: (t: Topic) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4F86C6");

  const handleAdd = () => {
    if (!name.trim()) return;
    onUpsert({
      id: `topic-${Date.now()}`,
      name: name.trim(),
      color,
      order: topics.length + 1,
    });
    setName("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
          placeholder="Topic name"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-9 border border-gray-300 rounded-lg cursor-pointer"
          title="Pick topic colour"
        />
        <Button size="sm" onClick={handleAdd} disabled={!name.trim()}>
          Add
        </Button>
      </div>
      <ul className="space-y-1">
        {[...topics].sort((a, b) => a.order - b.order).map((t) => (
          <li key={t.id} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: t.color }}
            />
            <span className="flex-1 text-gray-700">{t.name}</span>
            <button
              onClick={() => {
                if (confirm(`Delete topic "${t.name}"? All questions in this topic will be deleted too.`))
                  onDelete(t.id);
              }}
              className="text-gray-300 hover:text-red-500 transition-colors"
              title="Delete topic"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminDashboard({ onLogout }: Props) {
  const { bank, upsertQuestion, deleteQuestion, upsertTopic, deleteTopic, replaceBank, resetToDefault } =
    useQuestions();

  const [editingQuestion, setEditingQuestion] = useState<Question | null | undefined>(undefined);
  // undefined = form closed, null = add new, Question = editing existing

  const [showTopics, setShowTopics] = useState(false);

  const handleSave = (q: Question) => {
    upsertQuestion(q);
    setEditingQuestion(undefined);
  };

  const sorted = [...bank.questions].sort((a, b) => a.order - b.order);
  const nextOrder = sorted.length > 0 ? sorted[sorted.length - 1].order + 1 : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Teacher Admin</h1>
          <p className="text-sm text-gray-500">Manage grammar questions</p>
        </div>
        <div className="flex gap-3">
          <a
            href="#/"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Student View
          </a>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-6">
        {/* Left: Question list */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Questions ({bank.questions.length})
            </h2>
            <Button
              size="sm"
              onClick={() =>
                setEditingQuestion({
                  id: "",
                  topicId: bank.topics[0]?.id ?? "",
                  type: "multiple-choice",
                  order: nextOrder,
                  text: "",
                  explanation: "",
                  options: [
                    { id: "a", text: "" },
                    { id: "b", text: "" },
                    { id: "c", text: "" },
                    { id: "d", text: "" },
                  ],
                  correctOptionId: "a",
                } as Question)
              }
            >
              + Add Question
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <QuestionList
              questions={bank.questions}
              topics={bank.topics}
              onEdit={(q) => setEditingQuestion(q)}
              onDelete={deleteQuestion}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Topics */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <button
              onClick={() => setShowTopics((v) => !v)}
              className="flex items-center justify-between w-full text-sm font-semibold text-gray-700"
            >
              <span>Topics ({bank.topics.length})</span>
              <span className="text-gray-400">{showTopics ? "▲" : "▼"}</span>
            </button>
            {showTopics && (
              <TopicManager
                topics={bank.topics}
                onUpsert={upsertTopic}
                onDelete={deleteTopic}
              />
            )}
          </div>

          {/* Import / Export */}
          <ImportExport
            bank={bank}
            onImport={replaceBank}
            onReset={resetToDefault}
          />
        </div>
      </div>

      {/* Edit/Add question modal */}
      <Modal
        isOpen={editingQuestion !== undefined}
        onClose={() => setEditingQuestion(undefined)}
        title={editingQuestion?.id ? "Edit Question" : "Add Question"}
        size="xl"
      >
        {editingQuestion !== undefined && (
          <QuestionForm
            initial={editingQuestion?.id ? editingQuestion : undefined}
            topics={bank.topics}
            onSave={handleSave}
            onCancel={() => setEditingQuestion(undefined)}
          />
        )}
      </Modal>
    </div>
  );
}
