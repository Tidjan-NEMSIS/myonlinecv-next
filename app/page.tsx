'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './landing.css';
import DisplayCards from '@/components/ui/display-cards';
import { Sparkles, Globe, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Counter animation
          const counters = entry.target.querySelectorAll('.stat-number');
          counters.forEach((counter) => {
            const el = counter as HTMLElement;
            const target = +(el.dataset.target || 0);
            const duration = 1500;
            const start = performance.now();
            const animate = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = String(Math.floor(eased * target));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          });
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <Link href="/" className="nav-brand">
          <div className="nav-icon"><i className="fas fa-pen-nib"></i></div>
          MyOnlineCV
        </Link>
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link href="/decouvrir" className="nav-link">Découvrir</Link>
          <a href="#features" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Fonctionnalités</a>
          <a href="#why" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Pourquoi nous</a>
          <Link href="/auth" className="btn btn-outline">Se connecter</Link>
          <Link href="/auth" className="btn btn-accent">Créer mon CV</Link>
        </div>
        <button className={`nav-burger ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-bg-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          <div className="hero-content reveal">
            <div className="hero-badge">
              <i className="fas fa-sparkles"></i> Propulsé par l&apos;Intelligence Artificielle
            </div>
            <h1 className="hero-title">
              Votre CV en ligne.<br />
              <span className="title-gradient">Intelligent. Accessible. Inoubliable.</span>
            </h1>
            <p className="hero-desc">
              Fini les fichiers Word perdus et les portfolios encombrants. Créez un CV professionnel dynamique, 
              accessible partout via un simple lien ou QR code — et laissez notre IA le remplir pour vous.
            </p>
            <div className="hero-actions">
              <Link href="/auth" className="btn btn-accent btn-lg btn-glow">
                <i className="fas fa-rocket"></i> Commencer gratuitement
              </Link>
              <a href="#features" className="btn btn-outline btn-lg">
                <i className="fas fa-play-circle"></i> Découvrir
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number" data-target="100">0</span><span className="stat-suffix">%</span>
                <span className="stat-label">Personnalisable</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number" data-target="100">0</span><span className="stat-suffix">%</span>
                <span className="stat-label">Gratuit</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number" data-target="2">0</span><span className="stat-suffix">min</span>
                <span className="stat-label">Pour créer votre CV</span>
              </div>
            </div>
          </div>
          <div className="hero-visual reveal">
            <div className="hero-mockup-wrapper">
              <div className="hero-mockup">
                <img src="/assets/images/hero_illustration.png" alt="Aperçu du CV MyOnlineCV" />
              </div>
              <div className="floating-card card-1">
                <div className="fc-icon" style={{ background: 'var(--accent)', color: '#fff' }}><i className="fas fa-wand-magic-sparkles"></i></div>
                <div><div className="fc-title">IA Intelligente</div><div className="fc-sub">Remplissage auto</div></div>
              </div>
              <div className="floating-card card-2">
                <div className="fc-icon" style={{ background: 'var(--primary)', color: 'var(--accent)' }}><i className="fas fa-qrcode"></i></div>
                <div><div className="fc-title">QR Code</div><div className="fc-sub">Partagez instantanément</div></div>
              </div>
              <div className="floating-card card-3">
                <div className="fc-icon" style={{ background: '#38a169', color: '#fff' }}><i className="fas fa-check-circle"></i></div>
                <div><div className="fc-title">Toujours à jour</div><div className="fc-sub">Temps réel</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="trust-bar">
          <div className="trust-text">Propulsé par des technologies de pointe</div>
          <div className="trust-logos">
            <div className="trust-item"><i className="fas fa-brain"></i> Intelligence Artificielle</div>
            <div className="trust-item"><i className="fas fa-bolt"></i> Traitement Rapide</div>
            <div className="trust-item"><i className="fas fa-shield-alt"></i> Cloud Sécurisé</div>
            <div className="trust-item"><i className="fas fa-image"></i> Vision par Ordinateur</div>
            <div className="trust-item"><i className="fas fa-palette"></i> Palettes de Couleurs</div>
          </div>
        </section>

        {/* SHOWCASE CARDS */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(135deg,rgba(201,168,76,0.03)_0%,transparent_100%)] pointer-events-none"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 reveal">
              <div className="inline-block px-4 py-1.5 bg-[rgba(201,168,76,0.1)] text-[var(--accent)] font-bold text-sm tracking-wide rounded-full mb-4 uppercase">
                Aperçu
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--primary)] mb-6 leading-tight">
                L'élégance à portée <br />de main.
              </h2>
              <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                Vos compétences méritent le meilleur écrin. Avec nos cartes interactives et nos designs soignés, captivez l'attention des recruteurs dès la première seconde.
              </p>
              <ul className="space-y-4 text-[var(--text-secondary)] font-medium mb-10">
                <li className="flex items-center gap-3"><i className="fas fa-check text-[var(--accent)]"></i> Design ultra-moderne (Glassmorphism)</li>
                <li className="flex items-center gap-3"><i className="fas fa-check text-[var(--accent)]"></i> Couleurs et contrastes optimisés</li>
                <li className="flex items-center gap-3"><i className="fas fa-check text-[var(--accent)]"></i> Animations fluides à 60fps</li>
              </ul>
              <Link href="/auth" className="btn btn-accent btn-lg btn-glow inline-flex items-center gap-2">
                Voir un exemple <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            
            <div className="lg:w-1/2 flex justify-center lg:justify-end reveal transform lg:scale-110">
              <DisplayCards cards={[
                {
                  icon: <Sparkles className="size-4 text-[var(--accent2)]" />,
                  title: "Design Premium",
                  description: "Un rendu visuel exceptionnel",
                  date: "Nouveau",
                  iconClassName: "text-[var(--accent)]",
                  titleClassName: "text-[var(--accent)]",
                  className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 bg-white/90 border-[var(--border)] shadow-xl",
                },
                {
                  icon: <Globe className="size-4 text-[var(--primary-light)]" />,
                  title: "Accessibilité",
                  description: "Consultable sur tous supports",
                  date: "24/7",
                  iconClassName: "text-[var(--primary)]",
                  titleClassName: "text-[var(--primary)]",
                  className: "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 bg-[var(--bg-elevated)] border-[var(--border)] shadow-lg",
                },
                {
                  icon: <ShieldCheck className="size-4 text-emerald-500" />,
                  title: "Sécurisé",
                  description: "Vos données sont protégées",
                  date: "Garantie",
                  iconClassName: "text-emerald-600",
                  titleClassName: "text-emerald-600",
                  className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10 bg-white border-[var(--border)] shadow-md",
                },
              ]} />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features" id="features">
          <div className="section-head reveal">
            <div className="section-badge">Fonctionnalités</div>
            <h2 className="section-title">Tout pour créer le CV parfait</h2>
            <p className="section-desc">Des outils puissants, alimentés par l&apos;IA, pour que vous n&apos;ayez plus qu&apos;à briller.</p>
          </div>

          {/* Feature 1: AI Autofill */}
          <div className="feature-showcase reveal">
            <div className="feature-visual">
              <div className="feature-img-wrapper">
                <img src="/assets/images/feature_ai_autofill.png" alt="Remplissage automatique par IA" />
              </div>
            </div>
            <div className="feature-info">
              <div className="feature-number">01</div>
              <h3 className="feature-title"><i className="fas fa-wand-magic-sparkles"></i> Remplissage IA automatique</h3>
              <p className="feature-desc">
                Vous avez un ancien CV en PDF ou en image ? Téléversez-le et notre intelligence artificielle 
                <strong> analyse, extrait et remplit automatiquement</strong> tous les champs de votre nouveau CV : 
                expériences, formations, compétences, langues... En quelques secondes, c&apos;est fait.
              </p>
              <ul className="feature-list">
                <li><i className="fas fa-check"></i> Supporte les PDF et les images</li>
                <li><i className="fas fa-check"></i> Extraction intelligente par notre IA avancée</li>
                <li><i className="fas fa-check"></i> Remplissage en un clic, sans effort</li>
              </ul>
            </div>
          </div>

          {/* Feature 2: Chatbot Axel */}
          <div className="feature-showcase feature-reverse reveal">
            <div className="feature-visual">
              <div className="feature-img-wrapper">
                <img src="/assets/images/feature_chatbot.png" alt="Chatbot IA Axel" />
              </div>
            </div>
            <div className="feature-info">
              <div className="feature-number">02</div>
              <h3 className="feature-title"><i className="fas fa-comments"></i> Discutez avec Axel, votre assistant IA</h3>
              <p className="feature-desc">
                Pas envie de remplir des formulaires ? Parlez simplement à <strong>Axel</strong>, 
                notre chatbot IA intégré. Il vous pose les bonnes questions, comprend vos réponses 
                en langage naturel et <strong>remplit votre CV en temps réel</strong> pendant que vous discutez. 
                Vous pouvez même lui envoyer un document directement dans le chat !
              </p>
              <ul className="feature-list">
                <li><i className="fas fa-check"></i> Conversation naturelle et guidée</li>
                <li><i className="fas fa-check"></i> Remplissage en direct visible à gauche</li>
                <li><i className="fas fa-check"></i> Upload de documents dans le chat</li>
              </ul>
            </div>
          </div>

          {/* Feature 3: QR Code */}
          <div className="feature-showcase reveal">
            <div className="feature-visual">
              <div className="feature-img-wrapper">
                <img src="/assets/images/feature_qr_code.png" alt="Génération de QR Code" />
              </div>
            </div>
            <div className="feature-info">
              <div className="feature-number">03</div>
              <h3 className="feature-title"><i className="fas fa-qrcode"></i> QR Code instantané</h3>
              <p className="feature-desc">
                Générez un <strong>QR code unique</strong> qui mène directement vers votre CV en ligne. 
                Imprimez-le sur votre carte de visite, ajoutez-le à votre portfolio ou partagez-le lors 
                d&apos;un événement networking. Un scan et le recruteur voit votre profil complet.
              </p>
              <ul className="feature-list">
                <li><i className="fas fa-check"></i> Téléchargeable en haute résolution</li>
                <li><i className="fas fa-check"></i> Idéal pour cartes de visite et flyers</li>
                <li><i className="fas fa-check"></i> Partage LinkedIn avec accroche IA</li>
              </ul>
            </div>
          </div>

          {/* Feature 4: Background Removal */}
          <div className="feature-showcase feature-reverse reveal">
            <div className="feature-visual">
              <div className="feature-img-wrapper feature-img-icon">
                <div className="bg-removal-demo">
                  <div className="bg-demo-before">
                    <i className="fas fa-user-circle"></i>
                    <span>Avant</span>
                  </div>
                  <div className="bg-demo-arrow"><i className="fas fa-arrow-right"></i></div>
                  <div className="bg-demo-after">
                    <i className="fas fa-user-circle"></i>
                    <div className="sparkles">
                      <i className="fas fa-sparkles s1"></i>
                      <i className="fas fa-sparkles s2"></i>
                      <i className="fas fa-sparkles s3"></i>
                    </div>
                    <span>Après</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-info">
              <div className="feature-number">04</div>
              <h3 className="feature-title"><i className="fas fa-magic"></i> Suppression du fond photo</h3>
              <p className="feature-desc">
                Pas de photo de profil sur fond neutre ? Pas de problème. 
                Notre IA intégrée <strong>supprime automatiquement l&apos;arrière-plan</strong> de votre photo 
                en un clic, pour un rendu professionnel impeccable. Vous pouvez activer ou désactiver 
                cette option à volonté.
              </p>
              <ul className="feature-list">
                <li><i className="fas fa-check"></i> Propulsé par une IA de vision performante</li>
                <li><i className="fas fa-check"></i> Activation/désactivation en un clic</li>
                <li><i className="fas fa-check"></i> Rendu professionnel garanti</li>
              </ul>
            </div>
          </div>

          {/* Feature 5: AI Translation */}
          <div className="feature-showcase reveal">
            <div className="feature-visual">
              <div className="feature-img-wrapper feature-img-icon" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0) 100%)', border: '1px dashed var(--accent)' }}>
                <div className="bg-removal-demo">
                  <div className="bg-demo-before">
                    <i className="fas fa-flag" style={{ color: 'var(--text-secondary)' }}></i>
                    <span>Français</span>
                  </div>
                  <div className="bg-demo-arrow"><i className="fas fa-arrow-right" style={{ color: 'var(--accent)' }}></i></div>
                  <div className="bg-demo-after">
                    <i className="fas fa-globe" style={{ color: 'var(--accent)' }}></i>
                    <span>English, Español...</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-info">
              <div className="feature-number">05</div>
              <h3 className="feature-title"><i className="fas fa-language"></i> Traduction multi-langues par l&apos;IA</h3>
              <p className="feature-desc">
                Ne passez plus des heures à traduire votre CV. D&apos;un simple clic dans votre tableau de bord, 
                <strong> notre IA traduit l&apos;intégralité de votre profil</strong> (expériences, compétences, formations) 
                dans la langue de votre choix (Anglais, Espagnol, Allemand, etc.).
              </p>
              <ul className="feature-list">
                <li><i className="fas fa-check"></i> Menu déroulant automatique sur votre CV public</li>
                <li><i className="fas fa-check"></i> Traduction fidèle, professionnelle et contextuelle</li>
                <li><i className="fas fa-check"></i> 6 langues supportées actuellement</li>
              </ul>
            </div>
          </div>

          {/* Feature 6: Offre Clé en Main / Accompagnement */}
          <div className="feature-showcase feature-reverse reveal">
            <div className="feature-visual">
              <div className="feature-img-wrapper feature-img-icon" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0) 100%)', border: '1px dashed var(--accent)' }}>
                <div className="bg-removal-demo">
                  <div className="bg-demo-before">
                    <i className="fas fa-user-clock" style={{ color: 'var(--text-secondary)' }}></i>
                    <span>Zéro effort</span>
                  </div>
                  <div className="bg-demo-arrow"><i className="fas fa-arrow-right" style={{ color: 'var(--accent)' }}></i></div>
                  <div className="bg-demo-after">
                    <i className="fas fa-qrcode" style={{ color: 'var(--accent)' }}></i>
                    <span>Lien + QR Code</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-info">
              <div className="feature-number">06</div>
              <h3 className="feature-title"><i className="fas fa-handshake"></i> Service d&apos;accompagnement & Clé en main</h3>
              <p className="feature-desc">
                Vous n&apos;avez pas d&apos;ordinateur, pas le temps ou vous n&apos;êtes pas à l&apos;aise avec la technologie ? 
                <strong> Notre équipe s&apos;occupe de tout pour vous !</strong> Nos Super Admins rédigent et mettent en page votre CV, 
                puis vous envoient directement votre lien public personnalisé et votre QR Code imprimable par SMS, WhatsApp ou email. 
                Aucun compte requis de votre côté.
              </p>
              <ul className="feature-list">
                <li><i className="fas fa-check"></i> Saisie professionnelle de vos informations</li>
                <li><i className="fas fa-check"></i> Génération de votre QR Code et lien unique</li>
                <li><i className="fas fa-check"></i> Idéal pour les candidats pressés ou déconnectés</li>
              </ul>
            </div>
          </div>

          {/* Feature 7: Export HD et Partage par lien */}
          <div className="feature-showcase reveal">
            <div className="feature-visual">
              <div className="feature-img-wrapper feature-img-icon" style={{ background: 'linear-gradient(135deg, rgba(138,43,226,0.1) 0%, rgba(138,43,226,0) 100%)', border: '1px dashed var(--primary)' }}>
                <div className="bg-removal-demo">
                  <div className="bg-demo-before">
                    <i className="fas fa-file-pdf" style={{ color: 'var(--text-secondary)' }}></i>
                    <span>Pièce jointe lourde</span>
                  </div>
                  <div className="bg-demo-arrow"><i className="fas fa-arrow-right" style={{ color: 'var(--primary)' }}></i></div>
                  <div className="bg-demo-after">
                    <i className="fas fa-link" style={{ color: 'var(--primary)' }}></i>
                    <span>Lien + Export HD</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-info">
              <div className="feature-number">07</div>
              <h3 className="feature-title"><i className="fas fa-share-nodes"></i> La fin du vieux fichier PDF en pièce jointe</h3>
              <p className="feature-desc">
                Ne vous encombrez plus avec des fichiers PDF obsolètes et lourds. Envoyez simplement <strong>votre lien web unique</strong> 
                aux recruteurs. S&apos;ils souhaitent conserver une copie pour leurs archives, ils peuvent <strong>télécharger eux-mêmes votre CV en qualité Haute Définition</strong> 
                d&apos;un simple clic directement depuis votre page. Vous gardez le contrôle, ils gardent le confort.
              </p>
              <ul className="feature-list">
                <li><i className="fas fa-check"></i> Fini les pièces jointes bloquées par e-mail</li>
                <li><i className="fas fa-check"></i> Bouton d&apos;export HD natif à disposition des recruteurs</li>
                <li><i className="fas fa-check"></i> Format image pixel perfect, sans aucune coupure</li>
              </ul>
            </div>
          </div>
        </section>

        {/* WHY SECTION */}
        <section className="why-section" id="why">
          <div className="section-head reveal">
            <div className="section-badge">Réflexion</div>
            <h2 className="section-title">A-t-on vraiment besoin d&apos;un portfolio ?</h2>
            <p className="section-desc">Quand votre CV est en ligne, accessible partout et toujours à jour, la question se pose.</p>
          </div>

          <div className="why-grid reveal">
            <div className="why-card why-old">
              <div className="why-card-header">
                <i className="fas fa-folder-open"></i>
                <h4>Portfolio traditionnel</h4>
              </div>
              <ul className="why-list">
                <li><i className="fas fa-times"></i> Fichiers lourds à envoyer par email</li>
                <li><i className="fas fa-times"></i> Pas toujours à jour</li>
                <li><i className="fas fa-times"></i> Difficile à partager en situation réelle</li>
                <li><i className="fas fa-times"></i> Un seul format, pas adaptatif</li>
                <li><i className="fas fa-times"></i> Coûteux à maintenir (hébergement, domaine)</li>
              </ul>
            </div>
            <div className="why-vs">VS</div>
            <div className="why-card why-new">
              <div className="why-card-header">
                <i className="fas fa-globe"></i>
                <h4>MyOnlineCV</h4>
                <span className="why-badge">Recommandé</span>
              </div>
              <ul className="why-list">
                <li><i className="fas fa-check"></i> Un simple lien : <strong>mycvonline.web.app/cv/vous</strong></li>
                <li><i className="fas fa-check"></i> Toujours à jour en temps réel</li>
                <li><i className="fas fa-check"></i> QR Code pour partage instantané</li>
                <li><i className="fas fa-check"></i> 100% responsive (mobile, tablette, PC)</li>
                <li><i className="fas fa-check"></i> 100% gratuit, aucun hébergement nécessaire</li>
              </ul>
            </div>
          </div>

          <div className="why-visual reveal">
            <img src="/assets/images/feature_cv_anywhere.png" alt="CV accessible partout" className="why-img" />
            <p className="why-caption">
              <i className="fas fa-mobile-alt"></i> 
              Votre CV, dans votre poche. Accessible n&apos;importe où, n&apos;importe quand.
            </p>
          </div>
        </section>

        {/* MORE FEATURES */}
        <section className="more-features">
          <div className="section-head reveal">
            <div className="section-badge">Et ce n&apos;est pas tout</div>
            <h2 className="section-title">Des extras qui font la différence</h2>
          </div>
          <div className="extras-grid reveal">
            {[
              { icon: 'fa-palette', title: 'Large palette de couleurs', desc: "Changez l'ambiance de votre CV en un clic. De magnifiques thèmes conçus par des designers." },
              { icon: 'fa-bolt', title: 'Mise à jour en temps réel', desc: 'Modifiez votre profil depuis le dashboard et vos changements sont instantanément visibles.' },
              { icon: 'fa-mobile-alt', title: '100% Responsive', desc: "Votre CV s'adapte parfaitement à tous les écrans : ordinateurs, tablettes et smartphones." },
              { icon: 'fab fa-linkedin', title: 'Partage LinkedIn IA', desc: "Générez une accroche LinkedIn personnalisée par l'IA et partagez votre CV en un clic." },
              { icon: 'fa-shield-alt', title: 'Infrastructure Sécurisée', desc: 'Vos données sont protégées et stockées sur une infrastructure cloud fiable et sécurisée.' },
              { icon: 'fa-link', title: 'Lien personnalisé', desc: 'Obtenez une URL unique et mémorable pour votre CV professionnel en ligne.' },
            ].map((item, i) => (
              <div key={i} className="extra-card">
                <div className="extra-icon"><i className={`fas ${item.icon}`}></i></div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-content reveal">
            <h2 className="cta-title">Prêt à laisser une impression inoubliable ?</h2>
            <p className="cta-desc">
              Rejoignez MyOnlineCV et obtenez votre CV professionnel en ligne en moins de 2 minutes.
              C&apos;est gratuit, c&apos;est intelligent, c&apos;est maintenant.
            </p>
            <Link href="/auth" className="btn btn-accent btn-lg btn-glow" style={{ fontSize: '1.1rem', padding: '18px 44px' }}>
              <i className="fas fa-rocket"></i> Créer mon CV maintenant
            </Link>
          </div>
        </section>
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
    </>
  );
}
