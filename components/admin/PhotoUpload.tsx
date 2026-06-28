'use client';

import React, { useState, useRef } from 'react';
import { useCvData } from '@/hooks/useCvData';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function PhotoUpload() {
  const { cvData, saveSection, loading } = useCvData();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image trop volumineuse (max 5Mo)', 'error');
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      if (!user) throw new Error('Non authentifié');
      formData.append('uid', user.uid);

      const token = await user.getIdToken();

      const response = await fetch('/api/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erreur API upload');
      }

      const data = await response.json();
      // data.url contains the R2 public URL
      await saveSection({ photoBase64: data.url }, true);
      showToast('Photo mise à jour avec succès', 'success');
      
    } catch (error) {
      console.error('Upload error', error);
      showToast('Erreur lors du téléchargement', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveBg = async () => {
    if (!cvData?.photoBase64) return;
    
    try {
      setIsRemovingBg(true);
      
      if (!user) throw new Error('Non authentifié');
      const token = await user.getIdToken();

      // Implementation ready for Phase 5 API Route
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageBase64: cvData.photoBase64 }),
      });
      
      if (!response.ok) {
        let errMessage = 'Erreur API remove.bg';
        try {
          const errData = await response.json();
          if (errData.error) errMessage = errData.error;
        } catch (e) {}
        throw new Error(errMessage);
      }
      const data = await response.json();
      await saveSection({ photoBase64: data.resultBase64 }, true);
      showToast('Fond supprimé avec succès !', 'success');
      
    } catch (error: any) {
      console.error('Remove BG error', error);
      showToast(error.message || 'Erreur lors de la suppression du fond.', 'error');
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleDeletePhoto = async () => {
    await saveSection({ photoBase64: '' }, true);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  const hasPhoto = !!cvData?.photoBase64;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Photo de profil</h2>
        <p className="text-sm text-gray-500">Ajoutez une photo professionnelle pour personnaliser votre CV.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Photo Preview */}
        <div className="w-48 h-48 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden shrink-0">
          {hasPhoto ? (
            <Image
              src={cvData.photoBase64}
              alt="Photo de profil"
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <i className="fas fa-camera text-4xl mb-2"></i>
              <span className="text-sm">Aucune photo</span>
            </div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="spinner spinner-primary"></div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <button 
              className="btn btn-primary w-full md:w-auto"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <i className="fas fa-upload mr-2"></i> 
              {hasPhoto ? 'Changer la photo' : 'Importer une photo'}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Format JPG ou PNG, poids maximum 5 Mo.
            </p>
          </div>

          {hasPhoto && (
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <button 
                className="btn btn-primary w-full md:w-auto flex items-center justify-center"
                onClick={handleRemoveBg}
                disabled={isRemovingBg}
              >
                {isRemovingBg ? (
                  <div className="spinner spinner-sm mr-2"></div>
                ) : (
                  <i className="fas fa-magic mr-2"></i>
                )}
                Supprimer le fond (IA)
              </button>
              
              <button 
                className="btn btn-danger w-full md:w-auto flex items-center justify-center"
                onClick={handleDeletePhoto}
              >
                <i className="fas fa-trash-alt mr-2"></i> Supprimer la photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
