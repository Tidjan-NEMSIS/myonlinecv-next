'use client';

import React, { useState, useEffect } from 'react';
import { useCvData } from '@/hooks/useCvData';
import { Language } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export default function LanguagesPanel() {
  const { cvData, saveSection, loading } = useCvData();
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    if (cvData?.languages) {
      setLanguages(
        cvData.languages.map((l: Language) => ({
          ...l,
          id: l.id || uuidv4(),
        }))
      );
    }
  }, [cvData]);

  const handleAddLanguage = () => {
    setLanguages([...languages, { id: uuidv4(), name: '', level: 'Intermédiaire' }]);
  };

  const handleUpdateLanguage = (id: string, field: keyof Language, value: string) => {
    setLanguages(
      languages.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const handleDeleteLanguage = (id: string) => {
    setLanguages(languages.filter((l) => l.id !== id));
  };

  const handleSave = () => {
    saveSection({ languages });
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  const levelOptions = [
    'Débutant',
    'Intermédiaire',
    'Avancé',
    'Bilingue',
    'Courant',
    'Natif'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Langues</h2>
          <p className="text-sm text-gray-500">Ajoutez les langues que vous maîtrisez.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <i className="fas fa-save mr-2"></i> Enregistrer
        </button>
      </div>

      <div className="space-y-4">
        {languages.map((language, index) => (
          <div key={language.id || `lang-${index}`} className="relative p-4 border border-gray-200 rounded-lg bg-gray-50">
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
              onClick={() => handleDeleteLanguage(language.id)}
              title="Supprimer"
            >
              <i className="fas fa-trash-alt"></i>
            </button>

            <div className="flex flex-col md:flex-row gap-4 mb-2 pr-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Langue
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="ex: Anglais, Espagnol..."
                  value={language.name}
                  onChange={(e) => handleUpdateLanguage(language.id, 'name', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau
                </label>
                <select
                  className="input-field"
                  value={language.level}
                  onChange={(e) => handleUpdateLanguage(language.id, 'level', e.target.value)}
                >
                  {levelOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        {languages.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
            Aucune langue ajoutée.
          </div>
        )}

        <button
          className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          onClick={handleAddLanguage}
        >
          <i className="fas fa-plus mr-2"></i> Ajouter une langue
        </button>
      </div>
    </div>
  );
}
