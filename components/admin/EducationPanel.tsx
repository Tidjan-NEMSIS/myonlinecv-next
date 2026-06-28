'use client';

import React from 'react';
import { useCvData } from '@/hooks/useCvData';

export default function EducationPanel() {
  const { cvData, setCvData, saveSection } = useCvData();

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [
        { degree: '', school: '', details: '' },
        ...(prev.education || []),
      ]
    }));
  };

  const removeEducation = (index: number) => {
    setCvData(prev => {
      const arr = [...(prev.education || [])];
      arr.splice(index, 1);
      return { ...prev, education: arr };
    });
  };

  const handleChange = (index: number, field: string, value: string) => {
    setCvData(prev => {
      const arr = [...(prev.education || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, education: arr };
    });
  };

  const handleSave = () => {
    saveSection({ education: cvData.education });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Formation</h2>
          <p className="text-gray-500">Vos diplômes et certificats (les plus récents en premier).</p>
        </div>
        <button onClick={addEducation} className="btn btn-primary shrink-0">
          <i className="fas fa-plus"></i> Ajouter une formation
        </button>
      </div>

      <div className="space-y-6">
        {(cvData.education || []).map((edu, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative group">
            <button 
              onClick={() => removeEducation(index)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              title="Supprimer cette formation"
            >
              <i className="fas fa-trash text-sm"></i>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Diplôme</label>
                <input 
                  type="text" 
                  value={edu.degree || ''}
                  onChange={(e) => handleChange(index, 'degree', e.target.value)}
                  className="form-input" 
                  placeholder="Ex: Master en Informatique" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">École/Université</label>
                <input 
                  type="text" 
                  value={edu.school || ''}
                  onChange={(e) => handleChange(index, 'school', e.target.value)}
                  className="form-input" 
                  placeholder="Ex: Université de Dakar" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Détails (Période, mentions, etc.)</label>
                <input 
                  type="text" 
                  value={edu.details || ''}
                  onChange={(e) => handleChange(index, 'details', e.target.value)}
                  className="form-input" 
                  placeholder="Ex: 2018 - 2020 | Mention Très Bien" 
                />
              </div>
            </div>
          </div>
        ))}

        {(!cvData.education || cvData.education.length === 0) && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
              <i className="fas fa-graduation-cap text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Aucune formation ajoutée</h3>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">Ajoutez vos diplômes et certifications pour mettre en valeur votre parcours académique.</p>
            <button onClick={addEducation} className="btn btn-primary">
              <i className="fas fa-plus"></i> Ajouter ma première formation
            </button>
          </div>
        )}
      </div>

      {(cvData.education && cvData.education.length > 0) && (
        <div className="mt-6 flex justify-end">
          <button onClick={handleSave} className="btn btn-accent">
            <i className="fas fa-save"></i> Enregistrer les formations
          </button>
        </div>
      )}
    </div>
  );
}
