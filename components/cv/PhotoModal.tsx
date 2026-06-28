'use client';

import React from 'react';

interface Props {
  photoUrl: string;
  onClose: () => void;
}

export default function PhotoModal({ photoUrl, onClose }: Props) {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="relative max-w-3xl max-h-[90vh] flex flex-col items-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute -top-12 right-0 md:-right-12 text-white text-3xl hover:text-gray-300 transition-colors"
          onClick={onClose}
          title="Fermer"
        >
          <i className="fas fa-times"></i>
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={photoUrl} 
          alt="Photo de profil en plein écran" 
          className="w-auto h-auto max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
        />
      </div>
    </div>
  );
}
