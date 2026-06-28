'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCvData } from '@/hooks/useCvData';
import ClassicTemplate from '@/components/cv/templates/ClassicTemplate';
import ElegantTemplate from '@/components/cv/templates/ElegantTemplate';
import WaveTemplate from '@/components/cv/templates/WaveTemplate';
import { genericCvData } from '@/lib/generic-cv';

export default function FloatingCvPreview() {
  const { cvData, loading } = useCvData();
  const [isOpen, setIsOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  if (loading) return null;

  const currentTemplateId = cvData?.templateId || 'classic';
  const currentTheme = cvData?.theme || genericCvData.theme;

  // Render the current template with the actual user's cvData
  // We merge with genericCvData to ensure no fields are completely undefined if they haven't filled them out yet,
  // but cvData from Firestore should already be merged with defaults in the hook.
  const renderTemplate = () => {
    const dataToRender = { ...cvData, theme: currentTheme };
    switch (currentTemplateId) {
      case 'elegant': return <ElegantTemplate cvData={dataToRender as any} onPhotoClick={() => {}} />;
      case 'wave':    return <WaveTemplate cvData={dataToRender as any} onPhotoClick={() => {}} />;
      case 'classic':
      default:        return <ClassicTemplate cvData={dataToRender as any} onPhotoClick={() => {}} />;
    }
  };

  const fullscreenModal = isOpen && portalTarget ? createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-lg overflow-y-auto"
      style={{ zIndex: 99999 }}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="min-h-[100dvh] w-full max-w-[820px] mx-auto bg-white shadow-2xl flex flex-col relative"
        onClick={(e) => e.stopPropagation()} // Prevent click-through closing
      >
        <div className="bg-[#f8fafc] border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
              <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
            </div>
            <div className="text-sm font-bold text-[#1a3a5c]">
              Aperçu en direct
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex-1 w-full bg-[#e2e8f0] flex justify-center items-start p-2 sm:p-4 overflow-y-auto">
          {/* Robust SVG scale wrapper for the CV */}
          <div className="w-full relative shadow-2xl rounded-xl overflow-hidden bg-white" style={{ aspectRatio: '11/14' }}>
            <svg viewBox="0 0 1100 1400" className="w-full h-full pointer-events-none absolute inset-0" preserveAspectRatio="xMidYMid meet">
              <foreignObject width="1100" height="1400">
                <div className="w-[1100px] h-[1400px] bg-white origin-top-left pointer-events-auto">
                  {renderTemplate()}
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </div>
    </div>,
    portalTarget
  ) : null;

  return (
    <>
      <div className="fixed bottom-40 right-6 z-[110] flex items-center">
        {/* Animated Tooltip */}
        <div className="absolute right-full mr-4 whitespace-nowrap bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-bounce hidden sm:block pointer-events-none">
          Voir mon CV <i className="fas fa-hand-point-right ml-1"></i>
          {/* Tooltip triangle */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-600 rotate-45"></div>
        </div>

        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 bg-white text-[#1a3a5c] hover:scale-110 hover:shadow-[0_8px_25px_rgba(26,58,92,0.2)] border border-gray-200 relative z-10"
          title="Aperçu du CV"
        >
          <i className="far fa-file-alt text-xl"></i>
        </button>
      </div>
      {fullscreenModal}
    </>
  );
}
