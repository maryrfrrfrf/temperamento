export type TemperamentType = 'Sanguíneo' | 'Colérico' | 'Melancólico' | 'Fleumático';

export interface Question {
  id: number;
  text: string;
  options: string[];
}

export interface UserAnswer {
  questionId: number;
  questionText: string;
  selectedOption: string;
}

export interface TemperamentProfile {
  primary: TemperamentType;
  secondary: TemperamentType;
  percentages: {
    sanguine: number;
    choleric: number;
    melancholic: number;
    phlegmatic: number;
  };
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}