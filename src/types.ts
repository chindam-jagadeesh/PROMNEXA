export interface VisualElement {
  id: string;
  type?: string;
  content?: string;
  visible?: boolean;
  intensity?: number;
  color?: string;
  properties?: Record<string, any>;
}

export interface PromptEvaluation {
  score: number;
  feedback: string[];
  improvedPrompt: string;
}