import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import { analyzeTemperament } from './services/geminiService';
import { UserAnswer, TemperamentProfile, Question } from './types';
import QuestionCard from './components/QuestionCard';
import ResultView from './components/ResultView';
import { BrainIcon, ArrowRightIcon } from './components/Icons';

type AppState = 'intro' | 'quiz' | 'analyzing' | 'result';

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('intro');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [result, setResult] = useState<TemperamentProfile | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  
  // Estado para controlar visualmente a opção selecionada no momento
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);

  // Efeito para rolar a página para o topo sempre que a pergunta mudar
  useEffect(() => {
    if (appState === 'quiz') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestionIdx, appState]);

  const handleStart = () => {
    // Shuffle the options for each question to prevent bias
    const shuffledQuestions = questions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));

    setActiveQuestions(shuffledQuestions);
    setAppState('quiz');
    setCurrentQuestionIdx(0);
    setAnswers([]);
    setResult(null);
    setCurrentSelection(null);
  };

  const handleAnswerSelect = async (option: string) => {
    // 1. Marca visualmente a opção escolhida
    setCurrentSelection(option);

    const currentQ = activeQuestions[currentQuestionIdx];
    
    const newAnswer: UserAnswer = {
      questionId: currentQ.id,
      questionText: currentQ.text,
      selectedOption: option
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    // 2. Aguarda um pouco para o usuário ver o feedback visual, depois avança
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIdx(prev => prev + 1);
        setCurrentSelection(null); // Limpa a seleção para a próxima pergunta
      }, 400); // Aumentei levemente o tempo para melhor feedback visual
    } else {
      setAppState('analyzing');
      try {
        const profile = await analyzeTemperament(newAnswers);
        setResult(profile);
        setAppState('result');
      } catch (error) {
        console.error(error);
        alert("Ocorreu um erro ao analisar seu perfil. Tente novamente.");
        setAppState('intro');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-stone-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-orange-100/50 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-teal-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 md:py-12 min-h-screen flex flex-col">
        
        {/* Header (Minimal) */}
        {appState !== 'result' && (
          <header className="flex justify-between items-center mb-12 animate-fade-in-down">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-stone-900 text-white rounded-lg">
                <BrainIcon className="w-6 h-6" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-stone-900">Temperamentus</span>
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col justify-center">
          
          {appState === 'intro' && (
            <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">
                Quem é você <br/> <span className="text-teal-600 italic">por dentro?</span>
              </h1>
              <p className="text-xl text-stone-600 font-light leading-relaxed max-w-lg mx-auto">
                Descubra qual dos quatro temperamentos clássicos define sua personalidade e entenda melhor por que você sente e age como age.
              </p>
              <div className="pt-8">
                <button 
                  onClick={handleStart}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-stone-50 rounded-full text-lg font-medium tracking-wide overflow-hidden hover:bg-stone-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  <span>Iniciar Análise</span>
                  <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              
              <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-stone-400 uppercase tracking-widest font-semibold">
                <span>Sanguíneo</span>
                <span>Colérico</span>
                <span>Melancólico</span>
                <span>Fleumático</span>
              </div>
            </div>
          )}

          {appState === 'quiz' && activeQuestions.length > 0 && (
            <QuestionCard 
              question={activeQuestions[currentQuestionIdx]}
              selectedOption={currentSelection} 
              onSelect={handleAnswerSelect}
              total={activeQuestions.length}
              current={currentQuestionIdx + 1}
            />
          )}

          {appState === 'analyzing' && (
            <div className="text-center space-y-6 animate-pulse">
              <div className="w-16 h-16 border-4 border-stone-200 border-t-teal-600 rounded-full animate-spin mx-auto"/>
              <h2 className="text-2xl font-serif text-stone-800">Processando suas respostas...</h2>
              <p className="text-stone-500">A Inteligência Artificial está escrevendo seu perfil...</p>
            </div>
          )}

          {appState === 'result' && result && (
            <ResultView profile={result} onReset={handleStart} />
          )}

        </main>
        
        <footer className="mt-12 text-center text-stone-400 text-sm font-light">
          © {new Date().getFullYear()} Temperamentus • Baseado na teoria dos 4 temperamentos
        </footer>

      </div>
    </div>
  );
};

export default App;