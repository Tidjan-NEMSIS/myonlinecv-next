'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useCvData } from '@/hooks/useCvData';
import { TEMPLATES, Theme } from '@/lib/types';
import { THEMES } from '@/lib/themes';
import ClassicTemplate from '@/components/cv/templates/ClassicTemplate';
import ElegantTemplate from '@/components/cv/templates/ElegantTemplate';
import WaveTemplate from '@/components/cv/templates/WaveTemplate';
import SimplexTemplate from '@/components/cv/templates/SimplexTemplate';
import DuoTemplate from '@/components/cv/templates/DuoTemplate';
import VividTemplate from '@/components/cv/templates/VividTemplate';
import { genericCvData } from '@/lib/generic-cv';

const getTemplateComponent = (id: string, theme: any) => {
  const data = { ...genericCvData, templateId: id as any, theme: theme || genericCvData.theme };
  switch (id) {
    case 'classic': return <ClassicTemplate cvData={data} onPhotoClick={() => {}} />;
    case 'elegant': return <ElegantTemplate cvData={data} onPhotoClick={() => {}} />;
    case 'wave':    return <WaveTemplate cvData={data} onPhotoClick={() => {}} />;
    case 'simplex': return <SimplexTemplate cvData={data} onPhotoClick={() => {}} />;
    case 'duo':     return <DuoTemplate cvData={data} onPhotoClick={() => {}} />;
    case 'vivid':   return <VividTemplate cvData={data} onPhotoClick={() => {}} />;
    default:        return <ClassicTemplate cvData={data} onPhotoClick={() => {}} />;
  }
};

// Only show templates that have an actual component
const AVAILABLE_TEMPLATES = TEMPLATES.filter(t => ['classic', 'elegant', 'wave', 'simplex', 'duo', 'vivid'].includes(t.id));

/**
 * Generates a random theme assignment for each template.
 * Classic always gets Ocean Pro (THEMES[0]).
 * Others get a random different theme each session.
 */
function generateRandomThemeMap(): Record<string, Theme> {
  const map: Record<string, Theme> = {};
  // Classic always = Ocean Pro
  map['classic'] = THEMES[0];
  
  // Shuffle remaining themes for the other templates
  const otherTemplates = AVAILABLE_TEMPLATES.filter(t => t.id !== 'classic');
  const shuffled = [...THEMES].sort(() => Math.random() - 0.5);
  
  otherTemplates.forEach((tmpl, i) => {
    // Use a theme different from Ocean Pro, cycle through shuffled
    const theme = shuffled[(i + 1) % shuffled.length]; // +1 to skip potential Ocean Pro at index 0
    map[tmpl.id] = theme;
  });
  
  return map;
}

export default function AppearancePanel() {
  const { cvData, saveSection, loading } = useCvData();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // Generate random theme assignments once per session (on mount)
  const randomThemeMap = useMemo(() => generateRandomThemeMap(), []);

  // Set portal target after mount (client-side only)
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="spinner spinner-dark"></div>
      </div>
    );
  }

  const currentTemplateId = cvData?.templateId || 'classic';
  const currentTheme = cvData?.theme || genericCvData.theme;

  // For each template card: active template uses user's real theme, others use random
  const getCardTheme = (templateId: string): Theme => {
    if (templateId === currentTemplateId) {
      return currentTheme;
    }
    return randomThemeMap[templateId] || THEMES[0];
  };

  const handleSelectTemplate = (templateId: any) => {
    saveSection({ templateId }, true);
    setSelectedTemplate(null);
  };

  const handleCardClick = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  // ═══════ FULLSCREEN MODAL (rendered via Portal into <body>) ═══════
  const fullscreenModal = selectedTemplate && portalTarget ? createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-lg overflow-y-auto"
      style={{ zIndex: 99999 }}
      onClick={() => setSelectedTemplate(null)}
    >
      <div
        className="relative bg-white mx-auto my-0 sm:my-4 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-screen sm:min-h-0"
        style={{ width: '100%', maxWidth: '820px', height: '100dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile close bar */}
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 640px) {
            .modal-cv-container { height: 96vh !important; }
          }
        `}} />
        {/* Modal Header — clean macOS style */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="w-3.5 h-3.5 rounded-full bg-red-400 hover:bg-red-500 transition-colors border border-red-500/30"
                aria-label="Fermer"
              />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-500/30" />
              <div className="w-3.5 h-3.5 rounded-full bg-green-400 border border-green-500/30" />
            </div>
            <h3 className="font-bold text-sm text-gray-600 ml-2">
              {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {selectedTemplate !== currentTemplateId ? (
              <button
                onClick={() => handleSelectTemplate(selectedTemplate)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition-all text-sm shadow-lg hover:shadow-xl active:scale-95"
                style={{ background: 'linear-gradient(135deg, var(--primary), #2a4a6c)' }}
              >
                <i className="fas fa-check"></i> Appliquer ce modèle
              </button>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-600 font-semibold text-sm border border-green-200">
                <i className="fas fa-check-circle"></i> Modèle actuel
              </span>
            )}
            <button
              onClick={() => setSelectedTemplate(null)}
              className="w-9 h-9 rounded-xl bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 flex items-center justify-center transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Modal Body — scrollable, CV fills modal width */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-100 to-gray-200 p-2 sm:p-4 custom-scrollbar">
          <div 
            className="w-full shadow-2xl sm:rounded-xl overflow-hidden bg-white ring-1 ring-black/5"
            style={selectedTemplate ? {
              '--primary': getCardTheme(selectedTemplate).primary,
              '--accent': getCardTheme(selectedTemplate).accent,
              '--accent2': getCardTheme(selectedTemplate).accent2 || getCardTheme(selectedTemplate).accent
            } as React.CSSProperties : undefined}
          >
            {getTemplateComponent(selectedTemplate, selectedTemplate ? getCardTheme(selectedTemplate) : currentTheme)}
          </div>
        </div>
      </div>
    </div>,
    portalTarget
  ) : null;

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--primary)] font-serif">
            <i className="fas fa-layer-group mr-3 text-[var(--accent)]"></i>
            Modèles de CV
          </h2>
          <p className="text-sm text-gray-400 mt-1">Cliquez sur un modèle pour le prévisualiser et l&apos;appliquer.</p>
        </div>

        {/* Force all template wrappers to fill the 1100x1400 foreignObject in thumbnails */}
        <style dangerouslySetInnerHTML={{__html: `
          .appearance-thumb .simplex-wrapper,
          .appearance-thumb .duo-wrapper,
          .appearance-thumb .vivid-wrapper,
          .appearance-thumb .cv-wrapper,
          .appearance-thumb .elegant-wrapper,
          .appearance-thumb .wave-wrapper {
            max-width: 100% !important;
            width: 100% !important;
            min-height: 1400px !important;
            margin: 0 !important;
          }
        `}} />

        {/* Templates Grid — visual only, no descriptions, no buttons */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 flex-1">
          {AVAILABLE_TEMPLATES.map((template) => {
            const isActive = template.id === currentTemplateId;
            const cardTheme = getCardTheme(template.id);
            return (
              <div
                key={template.id}
                onClick={() => handleCardClick(template.id)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                  isActive
                    ? 'border-[var(--accent)] shadow-[0_0_20px_rgba(201,168,76,0.2)]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
                }`}
                style={{ aspectRatio: '11 / 14' }}
              >
                {/* CV Thumbnail Container */}
                <div className="absolute inset-0 bg-gray-50 overflow-hidden">
                  <svg 
                    viewBox="0 0 1100 1400" 
                    className="w-full h-full pointer-events-none"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <foreignObject width="1100" height="1400">
                      <div 
                        className="w-[1100px] h-[1400px] bg-white origin-top-left appearance-thumb"
                        style={{
                          '--primary': cardTheme.primary,
                          '--accent': cardTheme.accent,
                          '--accent2': cardTheme.accent2 || cardTheme.accent
                        } as React.CSSProperties}
                      >
                        {getTemplateComponent(template.id, cardTheme)}
                      </div>
                    </foreignObject>
                  </svg>
                </div>

                {/* Active badge */}
                {isActive && (
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[var(--accent)] text-[var(--primary)] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    <i className="fas fa-check"></i> Actif
                  </div>
                )}

                {/* Premium badge */}
                {template.isPremium && (
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    <i className="fas fa-crown mr-1"></i>PREMIUM
                  </div>
                )}

                {/* Hover overlay — name only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <h3 className="text-white font-bold text-lg drop-shadow-lg">{template.name}</h3>
                    <span className="text-white/70 text-xs font-medium">
                      <i className="fas fa-expand mr-1"></i>Cliquez pour agrandir
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portal-rendered modal — sits outside dashboard stacking context */}
      {fullscreenModal}
    </>
  );
}
