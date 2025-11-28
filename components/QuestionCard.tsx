import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  onSelect: (option: string) => void;
  total: number;
  current: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, selectedOption, onSelect, total, current }) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-6 flex justify-between items-end">
        <span className="text-sm font-semibold tracking-wider text-teal-700 uppercase">
          Questão {current} de {total}
        </span>
        <div className="h-1 flex-1 mx-4 bg-stone-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-600 transition-all duration-500 ease-out"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-serif font-medium text-stone-800 mb-8 leading-tight">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={idx}
              onClick={() => onSelect(option)}
              className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden
                ${isSelected 
                  ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-md' 
                  : 'border-stone-200 bg-white text-stone-600 hover:border-teal-300 hover:bg-stone-50'
                }`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                  ${isSelected ? 'border-teal-600 bg-teal-600' : 'border-stone-300 group-hover:border-teal-400'}`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-lg font-light">{option}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;