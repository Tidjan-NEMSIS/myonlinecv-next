'use client';

import React from 'react';
import { useCvData } from '@/hooks/useCvData';

export default function ProfilePanel() {
  const { cvData, setCvData, saveSection } = useCvData();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCvData(prev => ({ 
      ...prev, 
      profile: e.target.value 
    }));
  };

  const handleSave = () => {
    saveSection({ profile: cvData.profile }, false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--primary)] font-serif">Profil & Résumé</h2>
          <p className="text-[var(--text-secondary)]">Votre objectif de carrière et résumé professionnel.</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/80 p-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent2)]"></div>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[var(--primary)] mb-2">Résumé de profil</label>
          <textarea 
            value={cvData.profile}
            onChange={handleChange}
            className="w-full h-48 px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all resize-none shadow-inner custom-scrollbar text-[var(--text-primary)]" 
            placeholder="Ex: Expert en développement logiciel avec 10 ans d'expérience..." 
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={handleSave} className="btn btn-accent">
            <i className="fas fa-save"></i> Enregistrer le profil
          </button>
        </div>
      </div>
    </div>
  );
}
