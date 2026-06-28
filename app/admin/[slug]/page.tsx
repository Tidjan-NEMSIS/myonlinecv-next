'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PersonalPanel from '@/components/admin/PersonalPanel';
import ExperiencesPanel from '@/components/admin/ExperiencesPanel';
import EducationPanel from '@/components/admin/EducationPanel';
import SkillsPanel from '@/components/admin/SkillsPanel';
import LanguagesPanel from '@/components/admin/LanguagesPanel';

import PhotoUpload from '@/components/admin/PhotoUpload';
import SharingPanel from '@/components/admin/SharingPanel';
import TranslationPanel from '@/components/admin/TranslationPanel';
import SuperAdminPanel from '@/components/admin/SuperAdminPanel';
import ProfilePanel from '@/components/admin/ProfilePanel';
import ExpertisePanel from '@/components/admin/ExpertisePanel';
import BailleursPanel from '@/components/admin/BailleursPanel';
import AxelChatbot from '@/components/admin/AxelChatbot';
import FloatingThemePicker from '@/components/admin/FloatingThemePicker';
import FloatingCvPreview from '@/components/admin/FloatingCvPreview';
import AiConfigPanel from '@/components/admin/AiConfigPanel';
import AppearancePanel from '@/components/admin/AppearancePanel';
import OnboardingTour from '@/components/admin/OnboardingTour';

import DashboardPanel from '@/components/admin/DashboardPanel';
import { CvDataProvider } from '@/contexts/CvDataContext';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { showToast } = useToast();

  const [activePanel, setActivePanel] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="spinner spinner-dark"></div></div>;
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'dashboard': return <DashboardPanel />;
      case 'personal': return <PersonalPanel />;
      case 'profile': return <ProfilePanel />;
      case 'expertise': return <ExpertisePanel />;
      case 'bailleurs': return <BailleursPanel />;
      case 'experiences': return <ExperiencesPanel />;
      case 'education': return <EducationPanel />;
      case 'skills': return <SkillsPanel />;
      case 'languages': return <LanguagesPanel />;
      case 'theme': return <AppearancePanel />;
      case 'photo': return <PhotoUpload />;
      case 'sharing': return <SharingPanel />;
      case 'translation': return <TranslationPanel />;
      case 'clients': return <SuperAdminPanel />;
      case 'ai-config': return <AiConfigPanel />;
      // other panels will be added here
      default: return <div className="p-6">En cours de construction...</div>;
    }
  };

  return (
    <CvDataProvider>
    <div className="flex h-screen overflow-hidden bg-[#FAFAF9] relative font-sans">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[var(--accent)]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[var(--primary)]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>

      <AdminSidebar 
        activePanel={activePanel} 
        setActivePanel={setActivePanel}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 lg:ml-[260px]">
        {/* TOPBAR */}
        <header className="h-20 bg-transparent flex items-center justify-between px-6 lg:px-10 shrink-0 relative z-[100] mt-2">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-black/5 hover:bg-gray-50 text-[var(--primary)] transition-all"
              onClick={() => setIsMobileOpen(true)}
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a3a5c] capitalize drop-shadow-sm">
              {activePanel === 'dashboard' ? 'Tableau de bord' : activePanel.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center justify-center sm:px-4 w-10 h-10 sm:w-auto sm:h-auto py-2.5 rounded-xl bg-[#c9a84c] text-[#1a3a5c] font-bold shadow-sm hover:bg-[#b8973b] transition-colors"
              title="Co-remplir avec le chatbot"
            >
              <i className="fas fa-comments"></i> <span className="hidden sm:inline sm:ml-2">Co-remplir avec le chatbot</span>
            </button>
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowAiMenu(!showAiMenu); }}
                className="flex items-center justify-center sm:px-4 w-10 h-10 sm:w-auto sm:h-auto py-2.5 rounded-xl border-2 border-[#c9a84c] text-[#c9a84c] font-bold bg-white hover:bg-[#c9a84c]/10 transition-colors"
                title="IA"
              >
                <i className="fas fa-magic"></i> <span className="hidden sm:inline sm:ml-2">IA</span>
              </button>
              
              {showAiMenu && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-[9999] animate-fade-in" onClick={(e) => e.stopPropagation()}>
                  <button className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors border-b border-gray-100" onClick={() => { setShowAiMenu(false); setActivePanel('photo'); }}>
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                      <i className="fas fa-image"></i>
                    </div>
                    Suppression bg photo profil
                  </button>
                  <button className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors border-b border-gray-100" onClick={() => { setShowAiMenu(false); setActivePanel('translation'); }}>
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <i className="fas fa-language"></i>
                    </div>
                    Traduire CV
                  </button>
                  <button className="w-full px-4 py-3 text-left hover:bg-green-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors" onClick={() => { setShowAiMenu(false); setActivePanel('personal'); }}>
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                      <i className="fas fa-wand-magic-sparkles"></i>
                    </div>
                    Auto remplir
                  </button>
                </div>
              )}
            </div>
            <a href={`/cv/${slug}`} target="_blank" rel="noreferrer" className="flex items-center justify-center sm:px-4 w-10 h-10 sm:w-auto sm:h-auto py-2.5 rounded-xl border border-gray-200 text-[#1a3a5c] font-bold hover:bg-[#1a3a5c] hover:text-white transition-colors bg-white" title="Visiter la page du CV">
              <i className="fas fa-eye"></i> <span className="hidden sm:inline sm:ml-2">Visiter la page du CV</span>
            </a>
            <button 
              onClick={() => showToast('Toutes les modifications ont été enregistrées', 'success')}
              style={{ backgroundColor: '#1a3a5c' }}
              className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 py-2.5 rounded-xl text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              title="Enregistrer tout"
            >
              <i className="fas fa-save"></i> <span className="hidden sm:inline sm:ml-2">Enregistrer tout</span>
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 lg:px-10 lg:pb-10 custom-scrollbar relative z-0" onClick={() => setShowAiMenu(false)}>
          <div className="max-w-6xl mx-auto h-full">
            {renderPanel()}
          </div>
        </div>

        {/* Floating CV Preview — sits above Theme Picker */}
        <FloatingCvPreview />

        {/* Floating Theme Picker — sits above the chatbot */}
        <FloatingThemePicker />

        {/* AI Chatbot Floating Bubble */}
        <AxelChatbot externalIsOpen={isChatOpen} setExternalIsOpen={setIsChatOpen} onNavigatePanel={(panelId) => setActivePanel(panelId)} />
        
        {/* Onboarding Tour */}
        <OnboardingTour />
      </main>
    </div>
    </CvDataProvider>
  );
}
