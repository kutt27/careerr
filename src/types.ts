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
