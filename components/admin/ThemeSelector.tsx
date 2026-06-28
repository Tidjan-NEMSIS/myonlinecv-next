'use client';

import React from 'react';
import { useCvData } from '@/hooks/useCvData';
import { THEMES } from '@/lib/themes';

export default function ThemeSelector() {
  const { cvData, saveSection, loading } = useCvData();

  const handleSelectTheme = (themeName: string) => {
    const selectedTheme = THEMES.find((t) => t.name === themeName);
    if (selectedTheme) {
      saveSection({ theme: selectedTheme }, false);
      // Apply immediately to the global dashboard UI
      document.documentElement.style.setProperty('--primary', selectedTheme.primary);
      document.documentElement.style.setProperty('--accent', selectedTheme.accent);
      document.documentElement.style.setProperty('--accent2', selectedTheme.accent2 || selectedTheme.accent);
      // Apply immediately to CV variables in case it's in the same DOM
      document.documentElement.style.setProperty('--primary-color', selectedTheme.primary);
      document.documentElement.style.setProperty('--accent-color', selectedTheme.accent);
      document.documentElement.style.setProperty('--accent2-color', selectedTheme.accent2 || selectedTheme.accent);
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  const currentThemeName = cvData?.theme?.name || THEMES[0].name;

  return (
    <div className="bg-gray-50 rounded-xl shadow-inner border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--primary)]">
          <i className="fas fa-palette mr-2 text-[var(--accent)]"></i>
          Thème &amp; Couleurs
        </h2>
        <p className="text-sm text-gray-500 mt-1">Choisissez la palette de couleurs de votre CV public.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {THEMES.map((theme) => {
          const isActive = theme.name === currentThemeName;
          return (
            <button
              key={theme.name}
              onClick={() => handleSelectTheme(theme.name)}
              className={`relative flex flex-col p-4 rounded-2xl border-2 transition-all duration-200 text-left bg-white hover:shadow-lg active:scale-[0.97] ${
                isActive ? 'border-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.2)]' : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              {/* Checkmark badge */}
              {isActive && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-sm">
                  <i className="fas fa-check text-white text-[9px]"></i>
                </div>
              )}

              {/* 3 Color circles */}
              <div className="flex gap-2 mb-3">
                <div
                  className="w-9 h-9 rounded-lg shadow-sm border border-black/5"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="w-9 h-9 rounded-lg shadow-sm border border-black/5"
                  style={{ backgroundColor: theme.accent }}
                />
                <div
                  className="w-9 h-9 rounded-lg shadow-sm border border-black/5"
                  style={{ backgroundColor: theme.accent2 }}
                />
              </div>

              {/* Emoji + Name */}
              <div className="flex items-center gap-1.5 mb-3 font-bold text-gray-800 text-[13px] leading-tight">
                <span>{theme.emoji}</span>
                <span className="truncate">{theme.name}</span>
              </div>

              {/* Mini CV wireframe preview */}
              <div className="w-full bg-gray-50 rounded-xl p-2.5 flex gap-2.5 border border-gray-100">
                {/* Sidebar mini */}
                <div
                  className="w-7 h-11 rounded-md shadow-sm flex flex-col items-center pt-1.5 gap-1"
                  style={{ backgroundColor: theme.primary }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
                  <div className="w-3 h-[2px] rounded-full bg-white/25"></div>
                </div>
                {/* Content lines */}
                <div className="flex-1 flex flex-col gap-1.5 justify-center">
                  <div
                    className="w-3/5 h-[3px] rounded-full"
                    style={{ backgroundColor: theme.accent, opacity: 0.7 }}
                  ></div>
                  <div className="w-full h-[2px] rounded-full bg-gray-200"></div>
                  <div className="w-4/5 h-[2px] rounded-full bg-gray-200"></div>
                  <div className="w-1/2 h-[2px] rounded-full bg-gray-200"></div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
