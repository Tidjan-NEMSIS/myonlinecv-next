'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCvData } from '@/hooks/useCvData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminSidebar({ 
  activePanel, 
  setActivePanel, 
  isMobileOpen, 
  setIsMobileOpen 
}: { 
  activePanel: string; 
  setActivePanel: (p: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}) {
  const { user, signOut, userRole } = useAuth();
  const { cvData } = useCvData();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  useEffect(() => {
    if (cvData?.theme) {
      document.documentElement.style.setProperty('--primary', cvData.theme.primary);
      document.documentElement.style.setProperty('--accent', cvData.theme.accent);
      document.documentElement.style.setProperty('--accent2', cvData.theme.accent2 || cvData.theme.accent);
    }
  }, [cvData?.theme]);

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'fa-home', group: 'GÉNÉRAL' },
    { id: 'theme', label: 'Apparence', icon: 'fa-palette', group: 'GÉNÉRAL' },
    { id: 'personal', label: 'Infos perso', icon: 'fa-user', group: 'CONTENU DU CV' },
    { id: 'photo', label: 'Photo', icon: 'fa-camera', group: 'CONTENU DU CV' },
    { id: 'profile', label: 'Profil', icon: 'fa-align-left', group: 'CONTENU DU CV' },
    { id: 'expertise', label: 'Expertise', icon: 'fa-star', group: 'CONTENU DU CV' },
    { id: 'experiences', label: 'Expériences', icon: 'fa-briefcase', group: 'CONTENU DU CV' },
    { id: 'education', label: 'Formation', icon: 'fa-graduation-cap', group: 'CONTENU DU CV' },
    { id: 'skills', label: 'Compétences IT', icon: 'fa-laptop-code', group: 'CONTENU DU CV' },
    { id: 'languages', label: 'Langues', icon: 'fa-language', group: 'CONTENU DU CV' },
    { id: 'bailleurs', label: 'Bailleurs', icon: 'fa-handshake', group: 'CONTENU DU CV' },
    { id: 'translation', label: 'Traduction (IA)', icon: 'fa-language', group: 'EXPORTATION & PARTAGE' },
    { id: 'sharing', label: 'Partage & Export', icon: 'fa-share-nodes', group: 'EXPORTATION & PARTAGE' },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-screen w-[260px] bg-[#1a3a5c] text-white flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Link href="/" className="flex items-center gap-3 p-6 border-b border-white/10 hover:bg-white/5 transition-colors">
          <div className="w-10 h-10 bg-[#c9a84c] rounded-xl flex items-center justify-center text-[#1a3a5c] text-xl shadow-md shrink-0 relative">
            <i className="fas fa-pen-nib"></i>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold text-lg leading-tight tracking-tight text-white">MyOnlineCV</h2>
            <span className="text-xs text-white/60 font-medium">Espace Client</span>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <style dangerouslySetInnerHTML={{__html: `
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
            .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
          `}} />
          {['GÉNÉRAL', 'CONTENU DU CV', 'EXPORTATION & PARTAGE'].map((group) => (
            <div key={group} className="mb-6">
              <div className="text-[10px] font-bold text-white/40 tracking-wider mb-2 px-3">{group}</div>
              <div className="space-y-1">
                {navItems.filter(i => i.group === group).map(item => {
                  const isActive = activePanel === item.id;
                  return (
                    <button
                      key={item.id}
                      data-panel={item.id}
                      onClick={() => {
                        setActivePanel(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-left
                        ${isActive 
                          ? 'shadow-md shadow-[#c9a84c]/20' 
                          : 'text-gray-300 hover:text-white hover:bg-[#2a4a6c]'
                        }`}
                      style={isActive ? { backgroundColor: '#c9a84c', color: '#1a3a5c' } : undefined}
                    >
                      <i className={`fas ${item.icon} w-5 text-center ${isActive ? '' : 'text-gray-400 group-hover:text-white'}`} style={isActive ? { color: '#1a3a5c' } : undefined}></i>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {userRole === 'superadmin' && (
            <div className="mt-8 mb-4">
              <div className="text-[10px] font-bold text-red-400/80 tracking-wider mb-2 px-3">SUPER ADMIN</div>
              <div className="space-y-1">
                <button
                  onClick={() => { setActivePanel('ai-config'); setIsMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-left
                    ${activePanel === 'ai-config' ? 'bg-[#c9a84c] text-[#1a3a5c]' : 'text-gray-300 hover:text-white hover:bg-[#2a4a6c]'}`}
                >
                  <i className="fas fa-robot w-5 text-center text-gray-400"></i>
                  <span>Configuration IA</span>
                </button>
                <button
                  onClick={() => { setActivePanel('clients'); setIsMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-left
                    ${activePanel === 'clients' ? 'bg-[#c9a84c] text-[#1a3a5c]' : 'text-gray-300 hover:text-white hover:bg-[#2a4a6c]'}`}
                >
                  <i className="fas fa-users-cog w-5 text-center text-gray-400"></i>
                  <span>Gestion Clients</span>
                </button>
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#152e4a]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden border border-white/20">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-user text-white/50"></i>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">{user?.displayName || 'Utilisateur'}</div>
              <div className="text-xs text-white/50 truncate">{user?.email}</div>
            </div>
          </div>
          <button 
            id="btn-logout"
            onClick={handleLogout}
            className="w-full py-2 px-4 rounded-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all text-sm font-medium flex items-center justify-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
