'use client';

import React, { useState, useRef } from 'react';
import { useCvData } from '@/hooks/useCvData';
import { useToast } from '@/contexts/ToastContext';

export default function AIFillModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { cvData, setCvData, saveSection } = useCvData();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setStatus('Lecture du fichier...');

      let base64Data = '';
      let mimeType = file.type;

      // Simple file reader for images
      if (file.type.startsWith('image/')) {
        base64Data = await fileToBase64(file);
      } else if (file.type === 'application/pdf') {
        setStatus('Le support PDF arrive bientôt. Veuillez uploader une capture d\'écran (PNG/JPG) de votre CV.');
        setIsProcessing(false);
        return; // Temporarily block PDFs until pdfjs is fully wired or we send it directly to Gemini
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
      onClose();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <i className="fas fa-magic text-purple-500"></i> Auto-remplissage IA
          </h3>
          <button onClick={onClose} disabled={isProcessing} className="text-gray-400 hover:text-red-500">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="p-8 text-center">
          <input 
            type="file" 
            accept="image/png, image/jpeg" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          {!isProcessing ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-purple-200 bg-purple-50 hover:bg-purple-100 cursor-pointer rounded-2xl p-10 transition-colors"
            >
              <i className="fas fa-cloud-upload-alt text-4xl text-purple-400 mb-4"></i>
              <p className="font-medium text-purple-800 mb-2">Cliquez pour importer votre CV</p>
              <p className="text-xs text-purple-600/70">Format image (JPG, PNG) - Max 5Mo</p>
            </div>
          ) : (
            <div className="py-10">
              <div className="spinner spinner-primary mb-4 mx-auto"></div>
              <p className="font-medium text-gray-700 animate-pulse">{status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
