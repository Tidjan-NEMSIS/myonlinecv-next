'use client';

import React, { useState } from 'react';
import { useCvData } from '@/hooks/useCvData';
import { useToast } from '@/contexts/ToastContext';

export default function TranslationPanel() {
  const { cvData, saveSection, loading } = useCvData();
  const { showToast } = useToast();
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'Anglais (English)' },
    { code: 'es', name: 'Espagnol (Español)' },
    { code: 'de', name: 'Allemand (Deutsch)' },
    { code: 'it', name: 'Italien (Italiano)' },
    { code: 'pt', name: 'Portugais (Português)' },
    { code: 'nl', name: 'Néerlandais (Nederlands)' },
  ];

  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvDataPayload: cvData, targetLanguage }),
      });
      
      if (!response.ok) throw new Error('Erreur API translate');
      
      const data = await response.json();
      
      // Update translations map in cvData
      const updatedTranslations = {
        ...(cvData?.translations || {}),
        [targetLanguage]: data.translatedData
      };
      
      await saveSection({ translations: updatedTranslations }, true);
      showToast('Traduction générée avec succès !', 'success');
      
    } catch (error) {
      console.error('Translation error', error);
      showToast('Erreur lors de la traduction. (API Route en cours)', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDeleteTranslation = async (code: string) => {
    if (!cvData?.translations) return;
    
    const updatedTranslations = { ...cvData.translations };
    delete updatedTranslations[code];
    
    await saveSection({ translations: updatedTranslations }, true);
    showToast('Traduction supprimée', 'info');
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Traductions IA</h2>
        <p className="text-sm text-gray-500">Générez des versions de votre CV dans d'autres langues d'un simple clic.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Generateur */}
        <div className="flex-1 bg-blue-50 border border-blue-100 p-6 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <i className="fas fa-language text-blue-500"></i> Nouvelle Traduction
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Langue cible
              </label>
              <select 
                className="input-field border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            
            <button 
              className="btn btn-primary w-full"
              onClick={handleTranslate}
              disabled={isTranslating}
            >
              {isTranslating ? (
                <div className="spinner spinner-sm mr-2"></div>
              ) : (
                <i className="fas fa-magic mr-2"></i>
              )}
              {isTranslating ? 'Traduction en cours...' : 'Traduire maintenant'}
            </button>
            <p className="text-xs text-blue-600 text-center">
              La génération peut prendre jusqu'à 30 secondes.
            </p>
          </div>
        </div>

        {/* Liste des traductions existantes */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-4">Traductions disponibles</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">
                  FR
                </div>
                <span className="font-medium text-gray-700">Français (Défaut)</span>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Source</span>
            </div>
            
            {(!cvData?.translations || Object.keys(cvData.translations).length === 0) && (
              <p className="text-sm text-gray-500 italic py-4">Aucune autre langue disponible pour le moment.</p>
            )}

            {cvData?.translations && Object.keys(cvData.translations).map(code => {
              const langInfo = languages.find(l => l.code === code);
              return (
                <div key={code} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700 text-xs uppercase">
                      {code}
                    </div>
                    <span className="font-medium text-gray-700">{langInfo?.name || code}</span>
                  </div>
                  <button 
                    className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                    onClick={() => handleDeleteTranslation(code)}
                    title="Supprimer la traduction"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
