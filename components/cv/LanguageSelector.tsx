'use client';

import React from 'react';

interface Props {
  currentLang: string;
  availableLangs: string[];
  onChange: (lang: string) => void;
}

export default function LanguageSelector({ currentLang, availableLangs, onChange }: Props) {
  const allLangs = ['fr', ...availableLangs];

  return (
    <div className="bg-white backdrop-blur shadow-lg rounded-full px-3 py-1.5 flex items-center gap-2 border border-gray-200 ring-1 ring-black/5">
      <i className="fas fa-globe text-gray-500 text-sm"></i>
      <div className="flex gap-1">
        {allLangs.map((lang) => (
          <button
            key={lang}
            onClick={() => onChange(lang)}
            className={`w-8 h-8 rounded-full text-xs font-bold transition-colors uppercase ${
              currentLang === lang
                ? 'bg-[var(--primary)] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}
