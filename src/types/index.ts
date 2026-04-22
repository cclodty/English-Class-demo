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
  isRoot?: boolean;
  /** Mandatory bonus question shown after the main quiz */
  isBonus?: boolean;
  onCorrect: string | null;
  onIncorrect: string | null;
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
  rootQuestionId: string;
  /** Entry question ID for each topic section, in order */
  topicEntries?: string[];
  /** IDs of bonus questions shown after the main quiz, in order */
  bonusIds?: string[];
}

export interface StudentAnswer {
  questionId: string;
  studentResponse: string;
  isCorrect: boolean;
  answeredAt: number;
}
