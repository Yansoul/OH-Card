import React, { useState, useCallback } from 'react';
import { CardDisplay } from './components/CardDisplay';
import { QUOTES, getClassicCardImage } from './constants';
import { generateAiCard } from './services/geminiService';
import { OHCard } from './types';

export default function App() {
  const [currentCard, setCurrentCard] = useState<OHCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'classic' | 'ai'>('classic');

  // Draw a card from the pre-defined deck
  const drawClassicCard = useCallback(() => {
    setIsLoading(true);
    // Simulate a small delay for the ritual feel
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      const newCard: OHCard = {
        id: `classic-${randomIndex}-${Date.now()}`,
        text: QUOTES[randomIndex],
        imageUrl: getClassicCardImage(randomIndex),
        source: 'classic'
      };
      setCurrentCard(newCard);
      setIsLoading(false);
    }, 800);
  }, []);

  // Generate a card using Gemini
  const drawAiCard = useCallback(async () => {
    setIsLoading(true);
    try {
      const newCard = await generateAiCard();
      setCurrentCard(newCard);
    } catch (e) {
      console.error(e);
      // Fallback to classic if AI fails hard
      drawClassicCard();
    } finally {
      setIsLoading(false);
    }
  }, [drawClassicCard]);

  const handleDraw = () => {
    if (isLoading) return;
    if (mode === 'classic') {
      drawClassicCard();
    } else {
      drawAiCard();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans selection:bg-amber-100 text-stone-800">
      
      {/* Header */}
      <header className="w-full py-6 text-center z-10">
        <h1 className="font-serif text-3xl md:text-4xl text-stone-800 font-bold tracking-tight">
          潜意识投射卡 (OH Card)
        </h1>
        <p className="text-stone-500 mt-2 text-sm uppercase tracking-widest">
          探索内心 · 觉察当下
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 pb-32">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Context/Instruction */}
            {!currentCard && !isLoading && (
                <div className="text-center max-w-md mb-8 space-y-4 animate-fade-in-up">
                    <p className="font-serif text-lg text-stone-600 italic">
                        "每天一张 OH 卡，<br/>看见潜意识的指引，<br/>遇见未知的自己。"
                    </p>
                </div>
            )}

            {/* The Card */}
            <CardDisplay card={currentCard} isLoading={isLoading} />
        </div>
      </main>

      {/* Controls */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-stone-200 p-6 z-50">
        <div className="max-w-md mx-auto flex flex-col gap-4">
          
          <button
            onClick={handleDraw}
            disabled={isLoading}
            className="w-full py-4 bg-stone-900 text-white rounded-xl shadow-lg hover:bg-stone-800 active:scale-95 transition-all duration-300 font-medium tracking-wide text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '正在抽取...' : currentCard ? '换一张 (Next Card)' : '点击抽取今日 OH 卡'}
            {!isLoading && (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
               </svg>
            )}
          </button>

          <div className="flex items-center justify-center gap-4 text-xs font-medium text-stone-500">
             <button 
                onClick={() => setMode('classic')}
                className={`px-3 py-1 rounded-full transition-colors ${mode === 'classic' ? 'bg-stone-200 text-stone-800' : 'hover:bg-stone-100'}`}
             >
                经典卡牌 (100 Sentences)
             </button>
             <div className="w-px h-4 bg-stone-300"></div>
             <button 
                onClick={() => setMode('ai')}
                className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${mode === 'ai' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-stone-100'}`}
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 9a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 5H7a1 1 0 010-2h7.586l-1.293-1.293A1 1 0 0112 1z" clipRule="evenodd" />
                </svg>
                AI 灵感生成
             </button>
          </div>

        </div>
      </footer>
    </div>
  );
}