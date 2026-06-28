import React from 'react';
import { Language } from '@/lib/types';

interface Props {
  languages: Language[];
}

export default function CvLanguages({ languages }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {languages.map((lang, index) => (
        <div key={lang.id || index} className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">{lang.name}</span>
          <span className="text-xs font-medium text-[var(--accent-color)] bg-[var(--primary-color)]/10 px-2 py-1 rounded">
            {lang.level}
          </span>
        </div>
      ))}
    </div>
  );
}
