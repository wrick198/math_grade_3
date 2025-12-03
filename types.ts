export type ViewState = 'dashboard' | 'lesson';

export enum Difficulty {
  EASY = '基础巩固',
  MEDIUM = '能力提升',
  HARD = '奥数挑战',
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'calculation' | 'geometry' | 'concept' | 'logic';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface UserStats {
  topicsCompleted: number;
  correctAnswers: number;
  totalQuestions: number;
  stars: number;
}
