import React from 'react';
import { PersonalInfo, Theme } from '@/lib/types';

interface Props {
  personal: PersonalInfo;
  theme: Theme;
}

export default function CvBanner({ personal, theme }: Props) {
  return (
    <div 
      className="w-full h-48 md:h-64 relative z-10 flex items-end px-8 md:px-12 pb-8 shadow-sm"
      style={{ 
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
        color: 'white'
      }}
    >
      <div className="flex flex-col md:ml-[35%] lg:ml-[30%]">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md">
          {personal?.fullname || 'Prénom Nom'}
        </h1>
        <h2 className="text-xl md:text-2xl font-light text-white/90 drop-shadow-sm">
          {personal?.title || 'Titre Professionnel'}
        </h2>
      </div>
    </div>
  );
}
