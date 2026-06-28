'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AiConfigPanel() {
  const { userRole } = useAuth();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    provider: 'groq',
    geminiModel: 'gemini-2.5-flash',
    groqModel: 'gpt-oss-20b',
    geminiKeys: [''],
    groqKeys: [''],
    removeBgKeys: ['']
  });

  useEffect(() => {
    if (userRole === 'superadmin') {
      loadConfig();
    }
  }, [userRole]);

  const loadConfig = async () => {
    try {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Migration logic for old singular keys
        const removeBgKeys = data.removeBgKeys?.length ? data.removeBgKeys : (data.removeBgKey ? [data.removeBgKey] : ['']);
        const geminiKeys = data.geminiKeys?.length ? data.geminiKeys : (data.geminiKey ? [data.geminiKey] : ['']);
        const groqKeys = data.groqKeys?.length ? data.groqKeys : (data.groqKey ? [data.groqKey] : ['']);

        setConfig(prev => ({
          ...prev,
          ...data,
          geminiKeys,
          groqKeys,
          removeBgKeys
        }));
      }
    } catch (err) {
      console.error(err);
      showToast('Erreur lors du chargement de la configuration IA', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Clean up empty keys
      const cleanConfig = {
        ...config,
        geminiKeys: config.geminiKeys.filter((k: string) => k.trim() !== ''),
        groqKeys: config.groqKeys.filter((k: string) => k.trim() !== ''),
        removeBgKeys: config.removeBgKeys.filter((k: string) => k.trim() !== '')
      };
      
      await setDoc(doc(db, 'settings', 'global'), cleanConfig, { merge: true });
      showToast('Configuration IA enregistrée avec succès', 'success');
      setConfig({
        ...cleanConfig,
        geminiKeys: cleanConfig.geminiKeys.length ? cleanConfig.geminiKeys : [''],
        groqKeys: cleanConfig.groqKeys.length ? cleanConfig.groqKeys : [''],
        removeBgKeys: cleanConfig.removeBgKeys.length ? cleanConfig.removeBgKeys : ['']
      });
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la sauvegarde (Droits insuffisants ?)', 'error');
    }
  };

  const updateKey = (provider: 'geminiKeys' | 'groqKeys' | 'removeBgKeys', index: number, value: string) => {
    const newKeys = [...config[provider]];
    newKeys[index] = value;
    setConfig({ ...config, [provider]: newKeys });
  };

  const addKey = (provider: 'geminiKeys' | 'groqKeys' | 'removeBgKeys') => {
    setConfig({ ...config, [provider]: [...config[provider], ''] });
  };

  const removeKey = (provider: 'geminiKeys' | 'groqKeys' | 'removeBgKeys', index: number) => {
    const newKeys = [...config[provider]];
    newKeys.splice(index, 1);
    setConfig({ ...config, [provider]: newKeys.length ? newKeys : [''] });
  };

  if (userRole !== 'superadmin') {
    return (
      <div className="p-6 text-center text-gray-500">
        <i className="fas fa-lock text-4xl mb-4 text-gray-300"></i>
        <h2 className="text-xl font-semibold mb-2">Accès Restreint</h2>
        <p>Vous n'avez pas les droits nécessaires pour accéder à ce panneau.</p>
      </div>
    );
  }

  if (loading) return <div className="p-6">Chargement de la configuration IA...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--primary)] font-serif">Configuration IA Centrale</h2>
          <p className="text-[var(--text-secondary)]">Gérez les clés d'API et les modèles utilisés par tous les utilisateurs.</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/80 p-8">
        
        {/* Provider Selection */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-[var(--primary)] mb-3">Fournisseur d'Intelligence Artificielle Par Défaut</label>
          <div className="flex gap-4">
            <button 
              className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${config.provider === 'groq' ? 'border-[var(--accent)] bg-[var(--accent)]/5 shadow-md' : 'border-gray-200 hover:border-[var(--accent)]/50 bg-white'}`}
              onClick={() => setConfig({ ...config, provider: 'groq' })}
            >
              <i className={`fas fa-bolt text-2xl ${config.provider === 'groq' ? 'text-[var(--accent)]' : 'text-gray-400'}`}></i>
              <span className={`font-bold ${config.provider === 'groq' ? 'text-[var(--primary)]' : 'text-gray-500'}`}>Groq (Rapide)</span>
            </button>
            <button 
              className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${config.provider === 'gemini' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
              onClick={() => setConfig({ ...config, provider: 'gemini' })}
            >
              <i className={`fas fa-brain text-2xl ${config.provider === 'gemini' ? 'text-blue-500' : 'text-gray-400'}`}></i>
              <span className={`font-bold ${config.provider === 'gemini' ? 'text-[var(--primary)]' : 'text-gray-500'}`}>Google Gemini</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* GROQ CONFIG */}
          <div className={`p-6 rounded-2xl border ${config.provider === 'groq' ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-gray-200 bg-white opacity-60'}`}>
            <h3 className="font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
              <i className="fas fa-bolt text-[var(--accent)]"></i> Paramètres Groq
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Modèle Groq</label>
                <select 
                  value={config.groqModel}
                  onChange={e => setConfig({...config, groqModel: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm"
                >
                  <option value="gpt-oss-20b">GPT OSS 20B (Défaut Rapide)</option>
                  <option value="gpt-oss-120b">GPT OSS 120B (Haute Performance)</option>
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
                  <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant</option>
                  <option value="qwen3-32b">Qwen3 32B (Raisonnement)</option>
                  <option value="llama-3.2-90b-vision-preview">Llama 3.2 90B Vision Preview (Héritage)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 flex justify-between">
                  <span>Clés API Groq</span>
                  <button onClick={() => addKey('groqKeys')} className="text-[var(--accent)] hover:underline"><i className="fas fa-plus"></i> Ajouter</button>
                </label>
                {config.groqKeys.map((key, i) => (
                  <div key={`groq-${i}`} className="flex gap-2 mb-2">
                    <input 
                      type="password" 
                      value={key}
                      placeholder="gsk_..."
                      onChange={e => updateKey('groqKeys', i, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm font-mono"
                    />
                    <button onClick={() => removeKey('groqKeys', i)} className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center shrink-0">
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GEMINI CONFIG */}
          <div className={`p-6 rounded-2xl border ${config.provider === 'gemini' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white opacity-60'}`}>
            <h3 className="font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
              <i className="fas fa-brain text-blue-500"></i> Paramètres Gemini
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Modèle Gemini</label>
                <select 
                  value={config.geminiModel}
                  onChange={e => setConfig({...config, geminiModel: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Défaut)</option>
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Le plus récent - 2026)</option>
                  <option value="gemini-3.1-pro">Gemini 3.1 Pro (Raisonnement Avancé)</option>
                  <option value="gemini-omni">Gemini Omni (Multimodal)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Héritage)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 flex justify-between">
                  <span>Clés API Gemini</span>
                  <button onClick={() => addKey('geminiKeys')} className="text-blue-500 hover:underline"><i className="fas fa-plus"></i> Ajouter</button>
                </label>
                {config.geminiKeys.map((key, i) => (
                  <div key={`gemini-${i}`} className="flex gap-2 mb-2">
                    <input 
                      type="password" 
                      value={key}
                      placeholder="AIza..."
                      onChange={e => updateKey('geminiKeys', i, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                    />
                    <button onClick={() => removeKey('geminiKeys', i)} className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center shrink-0">
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-[var(--primary)] mb-1 flex items-center gap-2 justify-between">
            <span><i className="fas fa-magic text-purple-500"></i> Clés Remove.bg</span>
            <button onClick={() => addKey('removeBgKeys')} className="text-purple-500 hover:underline text-xs"><i className="fas fa-plus"></i> Ajouter</button>
          </label>
          <p className="text-xs text-gray-500 mb-3">Utilisées pour le détourage automatique de la photo de profil (50 crédits/mois/clé).</p>
          <div className="space-y-2 max-w-md">
            {config.removeBgKeys.map((key, i) => (
              <div key={`rmbg-${i}`} className="flex gap-2">
                <input 
                  type="password" 
                  value={key}
                  onChange={e => updateKey('removeBgKeys', i, e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 outline-none text-sm font-mono shadow-inner"
                  placeholder="Clé API Remove.bg"
                />
                <button onClick={() => removeKey('removeBgKeys', i)} className="w-11 h-11 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center shrink-0">
                  <i className="fas fa-trash text-sm"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button onClick={handleSave} style={{ backgroundColor: '#1a3a5c' }} className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
            <i className="fas fa-save"></i> Enregistrer la configuration IA
          </button>
        </div>

      </div>
    </div>
  );
}
