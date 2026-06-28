'use client';

import React from 'react';
import { useCvData } from '@/hooks/useCvData';
import Image from 'next/image';

export default function DashboardPanel() {
  const { cvData, loading } = useCvData();

  if (loading) return <div className="p-6">Chargement du tableau de bord...</div>;

  const expsCount = (cvData?.experiences || []).length;
  const edusCount = (cvData?.education || []).length;
  const tagsCount = (cvData?.expertise || []).length;
  const viewsCount = cvData?.views || 0;

  const dashboardItems: { id: string; label: string; icon: string; color: string; image?: string }[] = [
    { id: 'theme', label: 'Apparence', icon: 'fa-palette', color: 'bg-pink-50 text-pink-500' },
    { id: 'personal', label: 'Infos perso', icon: 'fa-user', color: 'bg-blue-50 text-blue-500' },
    { id: 'photo', label: 'Photo', icon: 'fa-camera', color: 'bg-purple-50 text-purple-500' },
    { id: 'profile', label: 'Profil', icon: 'fa-align-left', color: 'bg-indigo-50 text-indigo-500' },
    { id: 'expertise', label: 'Expertise', icon: 'fa-star', color: 'bg-yellow-50 text-yellow-600' },
    { id: 'experiences', label: 'Expériences', icon: 'fa-briefcase', color: 'bg-orange-50 text-orange-500' },
    { id: 'education', label: 'Formation', icon: 'fa-graduation-cap', color: 'bg-green-50 text-green-500' },
    { id: 'skills', label: 'Compétences IT', icon: 'fa-laptop-code', color: 'bg-teal-50 text-teal-500' },
    { id: 'languages', label: 'Langues', icon: 'fa-language', color: 'bg-cyan-50 text-cyan-500' },
    { id: 'bailleurs', label: 'Bailleurs', icon: 'fa-handshake', color: 'bg-rose-50 text-rose-500' },
    { id: 'sharing', label: 'Partage & Export', icon: 'fa-share-nodes', color: 'bg-emerald-50 text-emerald-500' },
  ];

  return (
    <div className="space-y-6 max-w-6xl no-scrollbar pb-10">
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1a3a5c] font-serif">Tableau de bord</h2>
        <p className="text-gray-500">Aperçu général de votre profil et de vos statistiques.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Expériences */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 hover:shadow-md transition-all text-center sm:text-left">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-lg sm:text-2xl shrink-0">
            <i className="fas fa-briefcase"></i>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800">{expsCount}</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium">Expériences</div>
          </div>
        </div>

        {/* Formations */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 hover:shadow-md transition-all text-center sm:text-left">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-lg sm:text-2xl shrink-0">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800">{edusCount}</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium">Formations</div>
          </div>
        </div>

        {/* Domaines d'expertise */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 hover:shadow-md transition-all text-center sm:text-left">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-yellow-50 text-[#c9a84c] flex items-center justify-center text-lg sm:text-2xl shrink-0">
            <i className="fas fa-star"></i>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800">{tagsCount}</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium">Expertises</div>
          </div>
        </div>

        {/* Vues du profil */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 hover:shadow-md transition-all text-center sm:text-left">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center text-lg sm:text-2xl shrink-0">
            <i className="fas fa-eye"></i>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800">{viewsCount}</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium">Vues</div>
          </div>
        </div>
      </div>
      
      {/* Suggestions d'actions */}
      <div className="bg-gradient-to-br from-[#1a3a5c]/5 to-[#c9a84c]/10 rounded-3xl p-8 border border-[#c9a84c]/20 mt-8">
        <h3 className="text-2xl font-bold text-[#1a3a5c] mb-2">Bienvenue sur votre espace !</h3>
        <p className="text-gray-600 mb-8">Complétez votre profil pour augmenter votre visibilité. Naviguez à travers les sections ci-dessous :</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dashboardItems.map(item => (
            <button 
              key={item.id}
              className="bg-white hover:bg-gray-50 hover:shadow-md transition-all rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border border-gray-100 text-center group"
              onClick={() => document.querySelector<HTMLButtonElement>(`button[data-panel="${item.id}"]`)?.click()}
            >
              {item.image ? (
                <div className="w-16 h-16 relative transition-transform group-hover:scale-110">
                  <Image src={item.image} alt={item.label} fill className="object-contain mix-blend-multiply" />
                </div>
              ) : (
                <div className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center text-2xl transition-transform group-hover:scale-110`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
              )}
              <span className="font-medium text-sm text-gray-700 group-hover:text-[#c9a84c] transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
