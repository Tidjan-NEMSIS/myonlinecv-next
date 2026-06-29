'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { genericCvData } from '@/lib/generic-cv';
import { TemplateId } from '@/lib/types';
import ClassicTemplate from '@/components/cv/templates/ClassicTemplate';
import ElegantTemplate from '@/components/cv/templates/ElegantTemplate';
import WaveTemplate from '@/components/cv/templates/WaveTemplate';
import SimplexTemplate from '@/components/cv/templates/SimplexTemplate';
import DuoTemplate from '@/components/cv/templates/DuoTemplate';
import VividTemplate from '@/components/cv/templates/VividTemplate';
import '../landing.css';
import './decouvrir.css';
import { Sparkles, ArrowRight, LayoutTemplate, Palette, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPublicCVs } from '@/lib/firestore';
import { CvData, UserProfile } from '@/lib/types';

const templates = [
  { id: 'classic', name: 'Le Classique', icon: <LayoutTemplate size={20} />, description: 'Propre, professionnel et intemporel. Idéal pour les environnements corporate.' },
  { id: 'elegant', name: 'L\'Élégant', icon: <Star size={20} />, description: 'Raffiné avec une touche de modernité. Parfait pour les cadres et managers.' },
  { id: 'wave', name: 'Le Moderne (Wave)', icon: <Palette size={20} />, description: 'Dynamique et créatif avec des courbes fluides. Conçu pour le digital et le design.' },
  { id: 'simplex', name: 'Le Simplex', icon: <Palette size={20} />, description: 'Épuré et moderne avec des cercles décoratifs. Focus sur le contenu essentiel.' },
  { id: 'duo', name: 'Le Duo', icon: <LayoutTemplate size={20} />, description: 'Deux colonnes pour séparer visuellement le contenu avec une ligne de chronologie.' },
  { id: 'vivid', name: 'Le Vivid', icon: <Sparkles size={20} />, description: 'Design organique et vif avec des formes arrondies et colorées.' }
];

export default function DecouvrirPage() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('classic');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [publicCVs, setPublicCVs] = useState<{uid: string, cvData: CvData, profile: UserProfile}[]>([]);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const cvs = await getPublicCVs();
        setPublicCVs(cvs);
      } catch (error) {
        console.error("Erreur lors de la récupération des CVs publics:", error);
      }
    };
    fetchCVs();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play carousel logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTemplate((current) => {
        const currentIndex = templates.findIndex(t => t.id === current);
        const nextIndex = (currentIndex + 1) % templates.length;
        return templates[nextIndex].id as TemplateId;
      });
    }, 4000); // Change template every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    const currentIndex = templates.findIndex(t => t.id === activeTemplate);
    const nextIndex = (currentIndex + 1) % templates.length;
    setActiveTemplate(templates[nextIndex].id as TemplateId);
  };

  const handlePrev = () => {
    const currentIndex = templates.findIndex(t => t.id === activeTemplate);
    const prevIndex = (currentIndex - 1 + templates.length) % templates.length;
    setActiveTemplate(templates[prevIndex].id as TemplateId);
  };

  const renderTemplate = () => {
    const data = { ...genericCvData, templateId: activeTemplate as TemplateId };
    switch (activeTemplate) {
      case 'elegant':
        return <ElegantTemplate cvData={data} onPhotoClick={() => {}} />;
      case 'wave':
        return <WaveTemplate cvData={data} onPhotoClick={() => {}} />;
      case 'simplex':
        return <SimplexTemplate cvData={data} onPhotoClick={() => {}} />;
      case 'duo':
        return <DuoTemplate cvData={data} onPhotoClick={() => {}} />;
      case 'vivid':
        return <VividTemplate cvData={data} onPhotoClick={() => {}} />;
      case 'classic':
      default:
        return <ClassicTemplate cvData={data} onPhotoClick={() => {}} />;
    }
  };

  return (
    <div className="discover-page">
      {/* NAVBAR */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <Link href="/" className="nav-brand">
          <div className="nav-icon"><i className="fas fa-pen-nib"></i></div>
          MyOnlineCV
        </Link>
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link href="/decouvrir" className="nav-link active">Découvrir</Link>
          <Link href="/#features" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Fonctionnalités</Link>
          <Link href="/#why" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Pourquoi nous</Link>
          <Link href="/auth" className="btn btn-outline">Se connecter</Link>
          <Link href="/auth" className="btn btn-accent">Créer mon CV</Link>
        </div>
        <button className={`nav-burger ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <main className="discover-main">
        {/* PART 1: HERO SECTION */}
        <div className="discover-hero text-center relative overflow-hidden min-h-screen flex flex-col justify-center">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(135deg,rgba(201,168,76,0.03)_0%,transparent_100%)] pointer-events-none"></div>
          <div className="container mx-auto px-6 relative z-10 pt-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(201,168,76,0.1)] text-[var(--accent)] font-bold text-sm tracking-wide rounded-full mb-6 uppercase">
              <Sparkles size={16} /> Showcase Premium
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-[var(--primary)] mb-6 leading-tight">
              Trouvez l'écrin parfait <br className="hidden md:block"/>pour votre parcours.
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Explorez nos modèles de CV conçus par des experts. Changez de design en un clic, votre contenu s'adapte automatiquement et de façon spectaculaire.
            </p>
          </div>
        </div>

        {/* PART 2: CENTERED CAROUSEL SHOWCASE */}
        <div className="discover-showcase bg-white min-h-screen flex flex-col justify-center py-10">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-10">
            
            <div className="w-full lg:w-2/3 max-w-4xl relative flex items-center justify-center">
              {/* Left Arrow */}
              <button 
                onClick={handlePrev}
                className="absolute left-0 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[var(--primary)] hover:bg-[var(--accent)] hover:text-white transition-all transform -translate-x-3 md:-translate-x-6"
                aria-label="Modèle précédent"
              >
                <ChevronLeft size={24} />
              </button>

              {/* PREVIEW */}
              <div className="w-full bg-white border border-[var(--border)] rounded-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="bg-[#f8fafc] border-b border-[var(--border)] py-2 px-4 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                  </div>
                  <div className="text-xs md:text-sm text-[var(--text-secondary)] font-medium flex-1 text-center truncate">
                    Modèle - <strong className="text-[var(--primary)]">{templates.find(t => t.id === activeTemplate)?.name}</strong>
                  </div>
                </div>
                {/* Increased max height for carousel to take advantage of row layout */}
                <div className="bg-[#e2e8f0] p-4 flex justify-center items-center h-[70vh] max-h-[800px] min-h-[400px]">
                  {/* Robust SVG scale wrapper for the CV */}
                  <div className="h-full max-w-full max-h-full relative shadow-xl rounded-lg overflow-hidden transition-all duration-500 ease-in-out" style={{ aspectRatio: '11/14' }}>
                    <svg viewBox="0 0 1100 1400" className="w-full h-full pointer-events-none absolute inset-0 bg-white" preserveAspectRatio="xMidYMid meet">
                      <foreignObject width="1100" height="1400">
                        <div className="w-[1100px] h-[1400px] bg-white origin-top-left pointer-events-auto">
                          {renderTemplate()}
                        </div>
                      </foreignObject>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right Arrow */}
              <button 
                onClick={handleNext}
                className="absolute right-0 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[var(--primary)] hover:bg-[var(--accent)] hover:text-white transition-all transform translate-x-3 md:translate-x-6"
                aria-label="Modèle suivant"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* CTA Box */}
            <div className="w-full lg:w-1/3 max-w-sm p-8 bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 text-center flex flex-col justify-center">
              <h4 className="font-bold text-xl text-[var(--primary)] mb-2 font-serif">Prêt à utiliser l'un de ces modèles ?</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-5">
                Créez votre compte gratuitement et laissez notre IA remplir votre CV en moins de 2 minutes.
              </p>
              <Link href="/auth" className="btn btn-accent inline-flex justify-center items-center gap-2 py-2.5 px-6 rounded-xl font-medium shadow-md hover:shadow-lg transition-all text-sm">
                Créer mon CV maintenant <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* PART 3: PUBLIC TALENTS SECTION */}
        <div className="bg-[#f2f4f8] min-h-screen flex flex-col justify-center py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#1a3a5c] mb-3">
                Découvrir les Talents
              </h2>
              <p className="text-[#64748b] max-w-2xl mx-auto text-base md:text-lg">
                Explorez les Curriculum Vitae publics générés par notre communauté de professionnels.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 max-w-7xl mx-auto">
              {publicCVs.map((user, index) => {
                const cv = user.cvData;
                const personal = cv.personal || {} as any;
                // Alternate colors for a vibrant grid if needed, or use the theme color
                const colors = ['text-[var(--accent)]', 'text-red-400', 'text-orange-500', 'text-blue-500', 'text-teal-500'];
                const colorClass = colors[index % colors.length];

                return (
                  <div 
                    key={user.uid} 
                    className="w-[calc(50%-0.375rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] xl:w-[calc(20%-1.2rem)] bg-white rounded-2xl p-4 sm:p-5 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col items-center"
                  >
                    
                    {/* Smaller Avatar */}
                    <div className="relative mb-3">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-orange-300 to-rose-300">
                        <div className="w-full h-full rounded-full bg-white p-0.5">
                          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                             {cv.photoBase64 ? (
                               <img src={cv.photoBase64} alt={personal.fullname || user.profile.name} className="w-full h-full object-cover" />
                             ) : (
                               <i className="fas fa-user text-xl sm:text-2xl text-gray-400"></i>
                             )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info: smaller text, tighter margins */}
                    <h3 className="text-xs sm:text-sm font-bold text-[#1a3a5c] mb-1 uppercase tracking-wide leading-tight min-h-[36px] flex items-center justify-center line-clamp-2">
                      {personal.fullname || user.profile.name || 'Utilisateur Anonyme'}
                    </h3>
                    
                    <div className={`font-semibold text-[10px] sm:text-xs mb-2 ${colorClass} uppercase tracking-wider line-clamp-1`}>
                      {personal.title || 'Profil Professionnel'}
                    </div>
                    
                    <div className="text-gray-400 text-[10px] sm:text-xs mb-4 flex items-center justify-center gap-1">
                      <i className="fas fa-map-marker-alt text-red-400"></i> <span className="truncate max-w-[100px]">{personal.location || 'Non renseigné'}</span>
                    </div>

                    {/* Smaller Button */}
                    <Link 
                      href={`/cv/${user.profile.slug}`} 
                      className={`mt-auto w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${colorClass} bg-opacity-10 hover:bg-opacity-20`}
                      style={{ backgroundColor: 'rgba(201,168,76, 0.1)' }}
                    >
                      Voir le CV
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-icon" style={{ width: 32, height: 32, fontSize: '0.9rem', borderRadius: 8 }}><i className="fas fa-pen-nib"></i></div>
            <span>MyOnlineCV</span>
          </div>
          <div className="footer-text">&copy; 2026 MyOnlineCV. Tous droits réservés. Construit avec passion.</div>
          <div className="footer-links">
            <Link href="/decouvrir">Découvrir</Link>
            <a href="https://tidjan-sow.web.app" target="_blank" rel="noreferrer"><i className="fas fa-envelope"></i> Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
