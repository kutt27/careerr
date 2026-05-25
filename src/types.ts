export type Level = 'Quick' | 'Planning';

export interface ReflectionProfile {
  sentiment: string;
  learning_style_preference: string;
  motivation_trigger: string;
  risk_factors: string[];
  current_trend_frame: string;
}

export interface RoadmapPhase {
  id: string; // e.g. "P1"
  title: string;
  style: string;
  motivation_hook: string;
  tasks: string[];
}

export interface Roadmap {
  topic: string;
  level: Level;
  overview: string;
  phase_count: number;
  phases: RoadmapPhase[];
}

export interface IntakeQuestions {
  summary: string;
  questions: string[];
}

export interface IntakeAnswer {
  question: string;
  answer: string;
}

