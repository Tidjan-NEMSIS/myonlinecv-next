'use client';

import React from 'react';
import { useCvData } from '@/hooks/useCvData';

export default function ExperiencesPanel() {
  const { cvData, setCvData, saveSection } = useCvData();

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experiences: [
        { date: '', location: '', role: '', org: '', tasks: [] },
        ...(prev.experiences || []),
      ]
    }));
  };

  const removeExperience = (index: number) => {
    setCvData(prev => {
      const arr = [...(prev.experiences || [])];
      arr.splice(index, 1);
      return { ...prev, experiences: arr };
    });
  };

  const handleChange = (index: number, field: string, value: any) => {
    setCvData(prev => {
      const arr = [...(prev.experiences || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, experiences: arr };
    });
  };

  const handleSave = () => {
    saveSection({ experiences: cvData.experiences });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Expériences professionnelles</h2>
          <p className="text-gray-500">Ajoutez vos expériences (les plus récentes en premier).</p>
        </div>
        <button onClick={addExperience} className="btn btn-primary shrink-0">
          <i className="fas fa-plus"></i> Ajouter une expérience
        </button>
      </div>

      <div className="space-y-6">
        {(cvData.experiences || []).map((exp, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative group">
            <button 
              onClick={() => removeExperience(index)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              title="Supprimer cette expérience"
            >
              <i className="fas fa-trash text-sm"></i>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Période</label>
                <input 
                  type="text" 
                  value={exp.date || ''}
                  onChange={(e) => handleChange(index, 'date', e.target.value)}
                  className="form-input" 
                  placeholder="Ex: 2020 - Présent" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Lieu</label>
                <input 
                  type="text" 
                  value={exp.location || ''}
                  onChange={(e) => handleChange(index, 'location', e.target.value)}
                  className="form-input" 
                  placeholder="Ex: Paris, France" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Poste</label>
                <input 
                  type="text" 
                  value={exp.role || ''}
                  onChange={(e) => handleChange(index, 'role', e.target.value)}
                  className="form-input" 
                  placeholder="Ex: Chef de projet" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Entreprise/Org</label>
                <input 
                  type="text" 
                  value={exp.org || ''}
                  onChange={(e) => handleChange(index, 'org', e.target.value)}
                  className="form-input" 
                  placeholder="Ex: Tech Solutions" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Tâches (1 par ligne)</label>
                <textarea 
                  value={(exp.tasks || []).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(t => t.trim() !== '');
                    handleChange(index, 'tasks', lines);
                  }}
                  className="form-textarea" 
                  rows={4}
                  placeholder="Géré une équipe de 5 personnes...&#10;Augmenté le CA de 20%..." 
                />
                <p className="text-xs text-gray-400 mt-1">Chaque ligne sera affichée comme une puce sur le CV.</p>
              </div>
            </div>
          </div>
        ))}

        {(!cvData.experiences || cvData.experiences.length === 0) && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
              <i className="fas fa-briefcase text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Aucune expérience ajoutée</h3>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">Ajoutez votre parcours professionnel pour permettre aux recruteurs de comprendre votre expertise.</p>
            <button onClick={addExperience} className="btn btn-primary">
              <i className="fas fa-plus"></i> Ajouter ma première expérience
            </button>
          </div>
        )}
      </div>

      {(cvData.experiences && cvData.experiences.length > 0) && (
        <div className="mt-6 flex justify-end">
          <button onClick={handleSave} className="btn btn-accent">
            <i className="fas fa-save"></i> Enregistrer les expériences
          </button>
        </div>
      )}
    </div>
  );
}
