export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string | string[];
  userAnswer: string | string[];
  explanation: string;
  showExplanation: boolean;
  type: 'judge' | 'single' | 'multi';
}

export interface JudgeQuestion extends Question {
  answer: string;
  userAnswer: string;
}

export interface SingleQuestion extends Question {
  answer: string;
  userAnswer: string;
}

export interface MultiQuestion extends Question {
  answer: string[];
  userAnswer: string[];
}

export interface QuestionBank {
  judgeQuestions: JudgeQuestion[];
  singleQuestions: SingleQuestion[];
  multiQuestions: MultiQuestion[];
} 