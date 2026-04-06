export type QuestionType = "multiple-choice" | "true-false" | "error-correction";

export interface Topic {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface ChoiceOption {
  id: string;
  text: string;
}

interface BaseQuestion {
  id: string;
  topicId: string;
  type: QuestionType;
  order: number;
  text: string;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: ChoiceOption[];
  correctOptionId: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  correctAnswer: boolean;
}

export interface ErrorCorrectionQuestion extends BaseQuestion {
  type: "error-correction";
  errorSegment: string;
  correction: string;
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | ErrorCorrectionQuestion;

export interface QuestionBank {
  topics: Topic[];
  questions: Question[];
}

export interface StudentAnswer {
  questionId: string;
  studentResponse: string;
  isCorrect: boolean;
  answeredAt: number;
}

export interface SessionState {
  currentIndex: number;
  answers: StudentAnswer[];
  isComplete: boolean;
  startedAt: number;
}

export interface MindMapNode {
  id: string;
  type: "root" | "topic" | "question";
  label: string;
  status?: "correct" | "incorrect" | "unanswered";
  color?: string;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
}
