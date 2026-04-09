export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface RoadmapStep {
  title: string;
  description: string;
  topics: string[];
  estimatedTime?: string;
}

export interface Roadmap {
  topic: string;
  level: Level;
  overview: string;
  steps: RoadmapStep[];
}

export interface IntakeQuestions {
  summary: string;
  questions: string[];
}

export interface IntakeAnswer {
  question: string;
  answer: string;
}
