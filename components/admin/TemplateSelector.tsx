'use client';

import React from 'react';
import { useCvData } from '@/hooks/useCvData';
import { TEMPLATES } from '@/lib/types';
import ClassicTemplate from '@/components/cv/templates/ClassicTemplate';
import ElegantTemplate from '@/components/cv/templates/ElegantTemplate';
import WaveTemplate from '@/components/cv/templates/WaveTemplate';
import SimplexTemplate from '@/components/cv/templates/SimplexTemplate';
import DuoTemplate from '@/components/cv/templates/DuoTemplate';
import VividTemplate from '@/components/cv/templates/VividTemplate';
import { genericCvData } from '@/lib/generic-cv';

const getTemplateComponent = (id: string, theme: any) => {
  const data = { ...genericCvData, templateId: id as any, theme: theme || genericCvData.theme };
  switch(id) {
    case 'classic': return <ClassicTemplate cvData={data} onPhotoClick={() => {}} />;
    case 'elegant': return <ElegantTemplate cvData={data} onPhotoClick={() => {}} />;
    case 'wave': return <WaveTemplate cvData={data} onPhotoClick={() => {}} />;
    case 'simplex': return <SimplexTemplate cvData={data} onPhotoClick={() => {}} />;
    case 'duo': return <DuoTemplate cvData={data} onPhotoClick={() => {}} />;
    case 'vivid': return <VividTemplate cvData={data} onPhotoClick={() => {}} />;
    default: return <ClassicTemplate cvData={data} onPhotoClick={() => {}} />;
  }
};

export default function TemplateSelector() {
  const { cvData, saveSection, loading } = useCvData();

  const handleSelectTemplate = (templateId: any) => {
    saveSection({ templateId }, true);
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  const currentTemplateId = cvData?.templateId || 'classic';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Modèles de CV</h2>
        <p className="text-sm text-gray-500">Choisissez la structure et le design global de votre CV public.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => {
          const isActive = template.id === currentTemplateId;
          return (
            <div 
              key={template.id}
              className={`relative rounded-xl border-2 overflow-hidden transition-all duration-200 flex flex-col ${
                isActive ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="h-48 bg-gray-100 relative w-full border-b border-gray-100 overflow-hidden flex items-start justify-center">
                <div className="transform scale-[0.25] origin-top-left w-[400%] h-[400%] absolute top-0 left-0 pointer-events-none">
                  {getTemplateComponent(template.id, cvData?.theme)}
                </div>
                {template.isPremium && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                    PREMIUM
                  </div>
                )}
                {isActive && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                    <i className="fas fa-check"></i> Actif
                  </div>
                )}
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-800 text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-gray-500 flex-1 mb-4">{template.description}</p>
                
                <button
                  onClick={() => handleSelectTemplate(template.id)}
                  disabled={isActive}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 cursor-default'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {isActive ? 'Modèle Actuel' : 'Sélectionner ce modèle'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
