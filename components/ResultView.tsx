import React from 'react';
import { TemperamentProfile, TemperamentType } from '../types';
import { FireIcon, WaterIcon, EarthIcon, WindIcon, StarIcon } from './Icons';

interface ResultViewProps {
  profile: TemperamentProfile;
  onReset: () => void;
}

const getTheme = (type: TemperamentType) => {
  switch (type) {
    case 'Colérico': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: <FireIcon className="w-6 h-6" /> };
    case 'Sanguíneo': return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: <WindIcon className="w-6 h-6" /> };
    case 'Melancólico': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: <WaterIcon className="w-6 h-6" /> };
    case 'Fleumático': return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: <EarthIcon className="w-6 h-6" /> };
    default: return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: null };
  }
};

const ProgressBar = ({ label, value, type }: { label: string, value: number, type: string }) => {
  let colorClass = 'bg-gray-400';
  if (label === 'Sanguíneo') colorClass = 'bg-yellow-400';
  if (label === 'Colérico') colorClass = 'bg-red-400';
  if (label === 'Melancólico') colorClass = 'bg-blue-400';
  if (label === 'Fleumático') colorClass = 'bg-green-400';

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs uppercase tracking-wider text-stone-500 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
};

const ResultView: React.FC<ResultViewProps> = ({ profile, onReset }) => {
  const primaryTheme = getTheme(profile.primary);
  const secondaryTheme = getTheme(profile.secondary);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header Result */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-stone-100 text-stone-600 text-sm tracking-widest uppercase font-medium">
          Resultado da Análise
        </div>
        <h2 className="text-5xl md:text-6xl font-serif text-stone-800">
          <span className={primaryTheme.color}>{profile.primary}</span>
        </h2>
        <p className="text-xl text-stone-500 font-light">
          com traços de <span className={`font-medium ${secondaryTheme.color}`}>{profile.secondary}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Analysis Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-xl font-serif text-stone-800 mb-4 flex items-center gap-2">
              {primaryTheme.icon}
              <span className={primaryTheme.color}>Sobre seu Temperamento</span>
            </h3>
            <p className="text-stone-600 leading-relaxed text-lg whitespace-pre-line">
              {profile.analysis}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
              <h4 className="text-emerald-800 font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Pontos Fortes
              </h4>
              <ul className="space-y-2">
                {profile.strengths.map((s, i) => (
                  <li key={i} className="text-emerald-700/80 text-sm">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
              <h4 className="text-rose-800 font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Pontos de Atenção
              </h4>
              <ul className="space-y-2">
                {profile.weaknesses.map((w, i) => (
                  <li key={i} className="text-rose-700/80 text-sm">• {w}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-stone-100">
             <h4 className="text-stone-800 font-serif mb-3">Recomendações de Equilíbrio</h4>
             <ul className="space-y-3">
                {profile.recommendations.map((rec, i) => (
                   <li key={i} className="flex gap-3 text-stone-600">
                     <span className="text-teal-500 font-bold text-lg">{(i + 1).toString().padStart(2, '0')}</span>
                     <span>{rec}</span>
                   </li>
                ))}
             </ul>
          </div>
        </div>

        {/* Sidebar Statistics */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 sticky top-6">
            <h3 className="text-lg font-serif text-stone-800 mb-6">Composição</h3>
            <ProgressBar label="Sanguíneo" value={profile.percentages.sanguine} type="air" />
            <ProgressBar label="Colérico" value={profile.percentages.choleric} type="fire" />
            <ProgressBar label="Melancólico" value={profile.percentages.melancholic} type="water" />
            <ProgressBar label="Fleumático" value={profile.percentages.phlegmatic} type="earth" />
            
            <div className="mt-8 pt-6 border-t border-stone-100 space-y-3">
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSeY3D5qOw7-piHagYskCByTJJq3BKRfo2l45R7ife1QA0wyNQ/viewform?usp=dialog" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.02] transition-all transform flex items-center justify-center gap-2 group"
              >
                <StarIcon className="w-5 h-5 group-hover:animate-pulse" />
                <span>Nos ajude a melhorar!</span>
              </a>

              <button 
                onClick={onReset}
                className="w-full py-3 rounded-xl bg-stone-900 text-stone-100 font-medium hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
              >
                Refazer Teste
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultView;