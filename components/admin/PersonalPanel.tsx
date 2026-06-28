'use client';

import React, { useState, useRef } from 'react';
import { useCvData } from '@/hooks/useCvData';
import { useToast } from '@/contexts/ToastContext';
import Image from 'next/image';

export default function PersonalPanel() {
  const { cvData, setCvData, saveSection } = useCvData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCvData(prev => ({ ...prev, [name]: checked }));
    } else {
      setCvData(prev => ({ 
        ...prev, 
        personal: { ...prev.personal, [name]: value } 
      }));
    }
  };

  const handleSave = () => {
    saveSection({
      isPublic: cvData.isPublic,
      personal: cvData.personal
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setStatus('Lecture du fichier...');

      let base64Data = '';
      let mimeType = file.type;

      if (file.type.startsWith('image/')) {
        base64Data = await fileToBase64(file);
      } else if (file.type === 'application/pdf') {
        setStatus('Le support PDF arrive bientôt. Veuillez uploader une capture d\'écran (PNG/JPG) de votre CV.');
        setIsProcessing(false);
        return;
      } else {
        throw new Error('Format non supporté. Uploadez une image (PNG, JPG).');
      }

      setStatus('Analyse par intelligence artificielle en cours...');
      const response = await fetch('/api/ai/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data: base64Data.split(',')[1],
          mimeType,
          prompt: `Tu es un expert en extraction de CV. Analyse cette image de CV et extrais toutes les informations structurées au format JSON. Renvoie UNIQUEMENT un objet JSON valide, sans balises Markdown, sans texte avant ou après.
          Structure attendue:
          {
            "personal": {"fullname": "", "title": "", "location": "", "phone": "", "email": ""},
            "profile": "",
            "experiences": [{"date": "", "location": "", "role": "", "org": "", "tasks": []}],
            "education": [{"degree": "", "school": "", "details": ""}],
            "expertise": [],
            "itSkills": [{"name": "", "level": 80}],
            "languages": [{"name": "", "label": "", "level": 100}]
          }`
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erreur API IA');
      }

      const data = await response.json();
      
      setStatus('Fusion des données...');
      mergeJsonToCv(data.result);
      showToast('CV rempli automatiquement avec succès ! 🎉', 'success');

    } catch (error: any) {
      console.error(error);
      showToast(error.message, 'error');
    } finally {
      setIsProcessing(false);
      setStatus('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const mergeJsonToCv = (json: any) => {
    setCvData(prev => ({
      ...prev,
      personal: { ...prev.personal, ...(json.personal || {}) },
      profile: json.profile || prev.profile,
      experiences: json.experiences || prev.experiences,
      education: json.education || prev.education,
      expertise: json.expertise || prev.expertise,
      itSkills: json.itSkills || prev.itSkills,
      languages: json.languages || prev.languages,
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a3a5c]">Informations Personnelles</h2>
          <p className="text-gray-500">Vos coordonnées de base affichées sur le CV.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="border-2 border-dashed border-[#c9a84c] bg-[#faf8f5] rounded-3xl p-10 flex flex-col items-center text-center mb-8">
          <input 
              type="file" 
              accept="image/png, image/jpeg" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <div className="w-48 h-48 relative mb-6 mix-blend-multiply">
              <Image src="/assets/images/Axel_rempli_formulaire.png" alt="Axel AI Robot" fill className="object-contain" />
            </div>
            
            <h3 className="text-2xl font-bold text-[#1a3a5c] mb-4">Laissez Axel remplir votre CV</h3>
            <p className="text-gray-500 max-w-xl mb-8">
              Notre IA de pointe va analyser votre document (image ou PDF) pour extraire et pré-remplir automatiquement toutes vos informations (Expériences, Formations, etc.).
            </p>
            
            {!isProcessing ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn border-none px-8 py-3 text-lg rounded-xl shadow-md font-semibold flex items-center gap-3 text-white"
                style={{ backgroundColor: '#c9a84c' }}
              >
                <i className="fas fa-file-import"></i> Importer un CV (PDF ou Image)
              </button>
            ) : (
              <div className="py-4 flex flex-col items-center">
                <div className="spinner spinner-primary mb-4" style={{ borderTopColor: '#c9a84c' }}></div>
                <p className="font-medium text-[#1a3a5c] animate-pulse">{status}</p>
              </div>
            )}
          </div>

        {/* Separator */}
        <div className="relative flex py-5 items-center mb-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 font-medium">Ou remplissez manuellement</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100 mb-6">
              <div>
                <h3 className="font-bold text-[#1a3a5c] flex items-center gap-2">
                  <i className="fas fa-globe-africa text-[#c9a84c]"></i> Visibilité publique du CV
                </h3>
                <p className="text-sm text-gray-600">Rendre mon CV public et visible dans la galerie "Découvrir"</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isPublic"
                  checked={cvData.isPublic} 
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c9a84c]"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Nom complet</label>
                <input 
                  type="text" 
                  name="fullname"
                  value={cvData.personal.fullname}
                  onChange={handleChange}
                  className="form-input" 
                  placeholder="Ex: CHEIKH AHMED TIDIANE SOW" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Titre professionnel</label>
                <input 
                  type="text" 
                  name="title"
                  value={cvData.personal.title}
                  onChange={handleChange}
                  className="form-input" 
                  placeholder="Ex: ÉTUDIANT" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Sous-titre (bannière)</label>
                <input 
                  type="text" 
                  name="subtitle"
                  value={cvData.personal.subtitle || ''}
                  onChange={handleChange}
                  className="form-input" 
                  placeholder="Ex: je suis etudiant" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Localisation</label>
                <input 
                  type="text" 
                  name="location"
                  value={cvData.personal.location}
                  onChange={handleChange}
                  className="form-input" 
                  placeholder="Ex: Dakar 67 Rue fleurs" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Téléphone</label>
                <input 
                  type="text" 
                  name="phone"
                  value={cvData.personal.phone}
                  onChange={handleChange}
                  className="form-input" 
                  placeholder="Ex: 78 349 60 12" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Email de contact</label>
                <input 
                  type="email" 
                  name="email"
                  value={cvData.personal.email}
                  onChange={handleChange}
                  className="form-input" 
                  placeholder="Ex: email@example.com" 
                />
              </div>
            </div>
      </div>
    </div>
  );
}

