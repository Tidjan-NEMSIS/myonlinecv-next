'use client';

import React, { useEffect, useState } from 'react';

export default function OnboardingTour() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  const closeTour = () => {
    setShow(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={closeTour}></div>
      
      {/* Wave Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes circular-waves {
          0% { box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.7); }
          70% { box-shadow: 0 0 0 30px rgba(201, 168, 76, 0); }
          100% { box-shadow: 0 0 0 0 rgba(201, 168, 76, 0); }
        }
        .animate-waves {
          animation: circular-waves 2s infinite;
          border-radius: 50%;
        }
      `}} />

      {step === 0 && (
        <>
          {/* Tooltip positioned above the chatbot FAB */}
          <div className="absolute bottom-24 right-4 pointer-events-auto bg-white p-6 rounded-2xl shadow-2xl max-w-sm animate-fade-in">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[#1a3a5c] text-lg">L'assistant IA Axel</h3>
              <button onClick={closeTour} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
            </div>
            <p className="text-gray-600 mb-4 text-sm">Cliquez sur ce bouton flottant pour co-remplir votre CV en discutant avec notre IA. Elle vous posera des questions et rédigera le CV pour vous !</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Étape 1 sur 2</span>
              <button onClick={() => setStep(1)} className="px-4 py-2 bg-[#c9a84c] text-[#1a3a5c] rounded-xl font-bold hover:bg-[#b8973b] transition-colors">Suivant <i className="fas fa-arrow-right ml-1"></i></button>
            </div>
          </div>
          {/* Pulsing wave ring centered directly on the chatbot FAB (fixed bottom-6 right-6, 48px button) */}
          <div className="fixed bottom-[18px] right-[18px] w-14 h-14 border-4 border-[#c9a84c] animate-waves pointer-events-none" style={{ zIndex: 99998 }}></div>
        </>
      )}

      {step === 1 && (
        <>
          {/* Tooltip positioned near the save button area */}
          <div className="absolute top-24 right-4 pointer-events-auto bg-white p-6 rounded-2xl shadow-2xl max-w-sm animate-fade-in">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[#1a3a5c] text-lg">Enregistrement Rapide</h3>
              <button onClick={closeTour} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
            </div>
            <p className="text-gray-600 mb-4 text-sm">N'oubliez pas d'enregistrer toutes vos modifications avant de quitter ou d'exporter votre CV.</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Étape 2 sur 2</span>
              <button onClick={closeTour} className="px-4 py-2 bg-[#1a3a5c] text-white rounded-xl font-bold hover:bg-[#152e4a] transition-colors">C'est compris !</button>
            </div>
          </div>
          {/* Pulsing wave ring over the save button in the topbar */}
          <div className="fixed top-[30px] right-[24px] w-12 h-12 border-4 border-[#1a3a5c] animate-waves pointer-events-none" style={{ zIndex: 99998 }}></div>
        </>
      )}
    </div>
  );
}
