export type QuestionType = "multiple-choice" | "true-false" | "error-correction";

export interface Topic {
  id: string;
  name: string;
  color: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
}

interface BaseQuestion {
  id: string;
  topicId: string;
  type: QuestionType;
  text: string;
  explanation: string;
  /** Starting question for the quiz */
  isRoot?: boolean;
  /** Next question ID when answered correctly (null = end of quiz) */
  onCorrect: string | null;
  /** Next question ID when answered incorrectly (null = end of quiz) */
  onIncorrect: string | null;
  /** Position on the mind map canvas */
  position?: { x: number; y: number };
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
  /** ID of the first question to show */
  rootQuestionId: string;
}

export interface StudentAnswer {
  questionId: string;
  studentResponse: string;
  isCorrect: boolean;
  answeredAt: number;
}
