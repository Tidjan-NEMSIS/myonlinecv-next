'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DisplayCards from '@/components/ui/display-cards';
import { Sparkles, Globe, Zap } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading, user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showToast('Connexion réussie', 'success');
      router.push('/admin');
    } catch (error) {
      console.error(error);
      showToast('Erreur de connexion avec Google', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        const result = await signInWithEmail(email, password);
        // Check email verification
        if (result?.user && !result.user.emailVerified) {
          showToast('Veuillez vérifier votre email avant de vous connecter. Un email de vérification a été envoyé.', 'error');
          setIsSubmitting(false);
          return;
        }
        showToast('Connexion réussie', 'success');
      } else {
        await signUpWithEmail(email, password, name, slug);
        showToast('Compte créé ! Vérifiez votre boîte email pour activer votre compte.', 'success');
      }
      router.push('/admin');
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Une erreur est survenue';
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'Cet email est déjà utilisé par un autre compte.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Le mot de passe est trop faible (minimum 6 caractères).';
            break;
          case 'auth/invalid-email':
            errorMessage = 'L\'adresse email n\'est pas valide.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Trop de tentatives échouées. Veuillez réessayer plus tard.';
            break;
          default:
            errorMessage = error.message;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || user) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)]">
      <div className="spinner spinner-dark"></div>
    </div>
  );

  const displayCardsData = [
    {
      icon: <Sparkles className="size-4 text-[var(--accent2)]" />,
      title: "IA Intégrée",
      description: "Remplissage auto par IA",
      date: "Instant",
      iconClassName: "text-[var(--accent)]",
      titleClassName: "text-white",
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-3xl before:outline-white/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/5 grayscale-[50%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 bg-[#122338]/80 backdrop-blur-md border-white/10 shadow-2xl transition-all duration-500",
    },
    {
      icon: <Globe className="size-4 text-[var(--accent2)]" />,
      title: "100% En ligne",
      description: "Accessible partout",
      date: "24/7",
      iconClassName: "text-[var(--accent)]",
      titleClassName: "text-white",
      className: "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-3xl before:outline-white/10 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/5 grayscale-[50%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 bg-[#122338]/80 backdrop-blur-md border-white/10 shadow-2xl transition-all duration-500",
    },
    {
      icon: <Zap className="size-4 text-[var(--accent2)]" />,
      title: "Rapide",
      description: "Prêt en 2 minutes",
      date: "Éclair",
      iconClassName: "text-[var(--accent)]",
      titleClassName: "text-white",
      className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10 bg-[#122338]/80 backdrop-blur-md border-white/10 shadow-2xl transition-all duration-500",
    },
  ];

  return (
    <div className="min-h-screen flex w-full relative overflow-hidden font-sans text-white bg-[var(--primary)]">
      
      {/* Global Animated Liquid Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[var(--accent)]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10">
        
        <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
          <Link href="/" className="flex items-center gap-3 font-serif text-2xl font-black text-white hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent-glow)]">
              <i className="fas fa-pen-nib"></i>
            </div>
            MyOnlineCV
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto mt-20 p-8 sm:p-10 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="mb-10 animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-3 text-white tracking-tight font-serif">
              {isLogin ? 'Bon retour !' : 'Créer un compte'}
            </h1>
            <p className="text-white/60 text-lg">
              {isLogin 
                ? 'Connectez-vous pour mettre à jour votre CV.' 
                : 'Rejoignez-nous et propulsez votre carrière.'}
            </p>
          </div>

          <div className="flex p-1 mb-8 bg-black/20 rounded-2xl animate-fade-in-up backdrop-blur-md" style={{ animationDelay: '0.1s' }}>
            <button 
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 ${isLogin ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-white/50 hover:text-white'}`}
              onClick={() => setIsLogin(true)}
            >
              Connexion
            </button>
            <button 
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 ${!isLogin ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-white/50 hover:text-white'}`}
              onClick={() => setIsLogin(false)}
            >
              Inscription
            </button>
          </div>

          <form className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }} onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/70 pl-1">Nom complet</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="John Doe" 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--accent)] focus:bg-black/40 transition-all duration-300" 
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70 pl-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="john@example.com" 
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--accent)] focus:bg-black/40 transition-all duration-300" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70 pl-1">Mot de passe</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••" 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-[var(--accent)] focus:bg-black/40 transition-all duration-300" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5 pt-2">
                <label className="text-sm font-medium text-white/70 pl-1">Identifiant (slug)</label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  required 
                  placeholder="john-doe" 
                  pattern="[a-z0-9_-]+" 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--accent)] focus:bg-black/40 transition-all duration-300 font-mono text-sm" 
                />
                <p className="text-xs text-[var(--accent)] mt-2 pl-1 flex items-center gap-1.5">
                  <i className="fas fa-link"></i>
                  mycvonline.web.app/cv/<strong>{slug || '...'}</strong>
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[var(--primary)] font-bold text-lg shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:-translate-y-0.5 transition-all duration-300 mt-6 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? <div className="spinner spinner-dark border-white/30 border-t-white"></div> : null}
              {isSubmitting ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon CV')}
            </button>
          </form>

          <div className="relative my-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-transparent text-sm font-medium text-white/40 backdrop-blur-sm rounded-full">OU</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 rounded-2xl text-white font-medium flex items-center justify-center gap-3 hover:opacity-90 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: '0.4s', backgroundColor: '#2563eb' }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continuer avec Google
          </button>
        </div>
      </div>

      {/* Visual Section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center z-10 pl-10">
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <div className="mb-24 text-center px-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-5xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Le CV du futur <br/><span className="text-[var(--accent2)] italic">est ici.</span>
            </h2>
            <p className="text-white/70 text-lg max-w-md mx-auto leading-relaxed">
              Démarquez-vous avec un profil en ligne interactif, conçu pour convertir vos visites en opportunités.
            </p>
          </div>
          
          <div className="transform scale-110 pl-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
             <DisplayCards cards={displayCardsData} />
          </div>
        </div>
      </div>
    </div>
  );
}
