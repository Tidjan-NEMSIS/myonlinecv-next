'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCvData } from '@/hooks/useCvData';
import { THEMES } from '@/lib/themes';

export default function FloatingThemePicker() {
  const { cvData, saveSection, loading } = useCvData();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentThemeName = cvData?.theme?.name || THEMES[0].name;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelectTheme = (themeName: string) => {
    const selectedTheme = THEMES.find((t) => t.name === themeName);
    if (selectedTheme) {
      saveSection({ theme: selectedTheme }, false);
      document.documentElement.style.setProperty('--primary', selectedTheme.primary);
      document.documentElement.style.setProperty('--accent', selectedTheme.accent);
      document.documentElement.style.setProperty('--accent2', selectedTheme.accent2 || selectedTheme.accent);
      document.documentElement.style.setProperty('--primary-color', selectedTheme.primary);
      document.documentElement.style.setProperty('--accent-color', selectedTheme.accent);
      document.documentElement.style.setProperty('--accent2-color', selectedTheme.accent2 || selectedTheme.accent);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[110]" ref={panelRef}>
      {/* Theme Panel — pops up above the FAB */}
      <div
        className={`absolute bottom-16 right-0 w-80 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden transition-all duration-400 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'
        }`}
      >
        {/* Panel Header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <i className="fas fa-palette text-amber-400"></i>
              Thèmes & Couleurs
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600 flex items-center justify-center transition-all text-xs"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Appliqué en temps réel sur votre CV</p>
        </div>

        {/* Theme Grid */}
        <div className="p-4 grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto custom-scrollbar">
          {THEMES.map((theme) => {
            const isActive = theme.name === currentThemeName;
            return (
              <button
                key={theme.name}
                onClick={() => handleSelectTheme(theme.name)}
                className={`relative flex flex-col p-3 rounded-xl border transition-all duration-200 text-left ${
                  isActive
                    ? 'border-amber-400/60 bg-amber-400/10 shadow-[0_0_10px_rgba(201,168,76,0.15)]'
                    : 'border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/50 hover:border-gray-600'
                }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 text-amber-400 text-[10px]">
                    <i className="fas fa-check-circle"></i>
                  </div>
                )}

                {/* Color swatches */}
                <div className="flex gap-1.5 mb-2">
                  <div
                    className="w-6 h-6 rounded-md shadow-sm border border-white/10"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded-md shadow-sm border border-white/10"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <div
                    className="w-6 h-6 rounded-md shadow-sm border border-white/10"
                    style={{ backgroundColor: theme.accent2 }}
                  />
                </div>

                <div className={`flex items-center gap-1.5 text-[11px] font-bold ${isActive ? 'text-amber-300' : 'text-gray-300'}`}>
                  <span>{theme.emoji}</span>
                  <span className="truncate">{theme.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
          isOpen
            ? 'bg-amber-400 text-gray-900 rotate-180 scale-90'
            : 'bg-gray-800 text-amber-400 hover:scale-110 hover:shadow-[0_8px_25px_rgba(201,168,76,0.3)] border border-gray-700'
        }`}
        title="Changer de thème"
      >
        <i className={`fas fa-palette text-lg transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
    </div>
  );
}
