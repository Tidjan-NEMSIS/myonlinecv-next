'use client';

import React, { useState } from 'react';
import { useCvData } from '@/hooks/useCvData';

export default function ExpertisePanel() {
  const { cvData, setCvData, saveSection } = useCvData();
  const [newExpertise, setNewExpertise] = useState('');

  const handleAdd = () => {
    if (!newExpertise.trim()) return;
    setCvData(prev => ({
      ...prev,
      expertise: [...(prev.expertise || []), newExpertise.trim()]
    }));
    setNewExpertise('');
  };

  const handleRemove = (index: number) => {
    setCvData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    saveSection({ expertise: cvData.expertise }, false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--primary)] font-serif">Domaines d'Expertise</h2>
          <p className="text-[var(--text-secondary)]">Ajoutez vos domaines de compétences clés.</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/80 p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent2)]"></div>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input 
            type="text" 
            value={newExpertise}
            onChange={(e) => setNewExpertise(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all shadow-inner" 
            placeholder="Ex: Gestion de Projet Agile" 
          />
          <button onClick={handleAdd} className="inline-flex items-center justify-center bg-[#1a3a5c] text-white hover:bg-[#112a46] px-6 py-3 rounded-xl shrink-0 transition-colors font-bold">
            <i className="fas fa-plus mr-2"></i> Ajouter
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {cvData.expertise?.map((exp, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm group">
              <span className="text-[var(--primary)] font-medium text-sm">{exp}</span>
              <button 
                onClick={() => handleRemove(index)}
                className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
          ))}
          {(!cvData.expertise || cvData.expertise.length === 0) && (
            <p className="text-gray-400 text-sm italic">Aucune expertise ajoutée.</p>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={handleSave} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c9a84c] text-[#1a3a5c] font-bold hover:bg-[#b8973b] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
            <i className="fas fa-save"></i> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
