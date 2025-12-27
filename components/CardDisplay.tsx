import React, { useState, useEffect } from 'react';
import { OHCard } from '../types';

interface CardDisplayProps {
  card: OHCard | null;
  isLoading: boolean;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ card, isLoading }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Auto-flip when a new card arrives and isn't loading
  useEffect(() => {
    if (card && !isLoading) {
      // Reset flip state briefly to allow animation re-trigger if needed, 
      // but usually we want to start 'back' then flip to 'front'.
      setIsFlipped(false);
      const timer = setTimeout(() => setIsFlipped(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsFlipped(false);
    }
  }, [card, isLoading]);

  return (
    <div className="relative w-full max-w-sm aspect-[3/4] group perspective-1000 mx-auto">
      <div
        className={`relative w-full h-full duration-1000 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Card Back (Face Down) */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl overflow-hidden border-4 border-white bg-stone-800 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 p-8 text-center border-2 border-stone-600 m-2 rounded-xl">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-stone-500 border-t-amber-400 rounded-full animate-spin"></div>
                        <span className="font-serif italic text-lg animate-pulse">
                            正在链接宇宙能量...
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">OH</span>
                        <span className="font-serif text-sm tracking-[0.3em] uppercase">Inner Self</span>
                    </div>
                )}
            </div>
        </div>

        {/* Card Front (Face Up) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl shadow-2xl overflow-hidden bg-white border-8 border-white">
          {card && (
            <div className="relative w-full h-full flex flex-col">
              {/* Image Section */}
              <div className="relative flex-1 overflow-hidden bg-stone-100">
                <img 
                  src={card.imageUrl} 
                  alt="OH Card Art" 
                  className="w-full h-full object-cover transition-transform duration-[10s] ease-in-out hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-60"></div>
              </div>
              
              {/* Text Section */}
              <div className="relative h-1/3 bg-white p-6 flex items-center justify-center text-center">
                 <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                 </div>
                 <p className="font-serif text-xl md:text-2xl text-stone-800 leading-relaxed font-medium">
                   “{card.text}”
                 </p>
              </div>
              
              {card.source === 'ai' && (
                 <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white uppercase tracking-wider">
                   AI Generated
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};