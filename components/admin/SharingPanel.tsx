'use client';

import React, { useState } from 'react';
import { useCvData } from '@/hooks/useCvData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { QRCodeCanvas } from 'qrcode.react';

export default function SharingPanel() {
  const { cvData, saveSection, loading } = useCvData();
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);

  const [generatedPost, setGeneratedPost] = useState('');

  if (loading) return <div className="p-6">Chargement...</div>;

  const publicUrl = userProfile?.slug 
    ? `${window.location.origin}/cv/${userProfile.slug}` 
    : '';

  const handleCopyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    showToast('Lien copié dans le presse-papier !', 'success');
  };

  const handleToggleVisibility = () => {
    const newVisibility = !cvData?.isPublic;
    saveSection({ isPublic: newVisibility });
  };

  const handleGenerateLinkedInPost = async () => {
    if (!publicUrl) return;
    try {
      setIsGeneratingPost(true);
      
      const response = await fetch('/api/linkedin-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, publicLink: publicUrl }),
      });
      
      if (!response.ok) throw new Error('Erreur API linkedin-post');
      
      const data = await response.json();
      setGeneratedPost(data.postText);
      showToast('Post LinkedIn généré !', 'success');
      
    } catch (error) {
      console.error('LinkedIn post generation error', error);
      showToast('Erreur lors de la génération. (API Route en cours)', 'error');
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const handleCopyPost = () => {
    navigator.clipboard.writeText(generatedPost);
    showToast('Texte copié dans le presse-papier !', 'success');
  };

  const handlePublishLinkedIn = () => {
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(generatedPost)}`;
    window.open(url, '_blank');
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (!canvas) {
      showToast('Erreur QR Code', 'error');
      return;
    }
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode-myonlinecv.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1a3a5c]">Partage & Visibilité</h2>
        <p className="text-sm text-gray-500">Gérez la visibilité de votre CV et partagez-le avec votre réseau.</p>
      </div>

      <div className="space-y-6">
        {/* Toggle Visibilité */}
        <div className="flex items-center justify-between p-4 border border-amber-100 rounded-lg bg-amber-50">
          <div>
            <h3 className="font-medium text-[#1a3a5c] flex items-center gap-2">
              <i className="fas fa-globe-africa text-[#c9a84c]"></i> CV Public
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {cvData?.isPublic 
                ? 'Votre CV est actuellement visible par tous ceux qui ont le lien.' 
                : 'Votre CV est privé. Seul vous pouvez y accéder.'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={cvData?.isPublic || false}
              onChange={handleToggleVisibility}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c9a84c]"></div>
          </label>
        </div>

        {/* Lien Public */}
        {cvData?.isPublic && userProfile?.slug && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Votre lien public</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={publicUrl}
                className="form-input flex-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg px-4 py-2"
              />
              <button 
                style={{ backgroundColor: '#1a3a5c' }}
                className="inline-flex items-center justify-center text-white hover:opacity-90 px-4 py-2 rounded-lg transition-all font-medium"
                onClick={handleCopyLink}
                title="Copier le lien"
              >
                <i className="fas fa-copy"></i>
              </button>
              <a 
                href={publicUrl} 
                target="_blank" 
                rel="noreferrer"
                style={{ backgroundColor: '#1a3a5c' }}
                className="inline-flex items-center justify-center text-white hover:opacity-90 px-4 py-2 rounded-lg transition-all"
                title="Ouvrir le lien"
              >
                <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        )}

        {/* Actions Réseaux Sociaux & QR Code */}
        {cvData?.isPublic && publicUrl && (
          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-medium text-[#1a3a5c] mb-4">Réseaux sociaux & Code QR</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LinkedIn Section */}
              <div className="space-y-4 bg-[#faf8f5] p-5 rounded-xl border border-[#c9a84c]/20">
                <button 
                  style={{ backgroundColor: '#0a66c2' }}
                  className="w-full inline-flex items-center justify-center gap-2 text-white hover:opacity-90 py-3 rounded-lg transition-all font-bold"
                  onClick={handleGenerateLinkedInPost}
                  disabled={isGeneratingPost}
                >
                  {isGeneratingPost ? (
                    <div className="spinner spinner-sm" style={{ borderTopColor: '#0a66c2' }}></div>
                  ) : (
                    <i className="fab fa-linkedin text-xl"></i>
                  )}
                  Générer un post LinkedIn (IA)
                </button>
                
                {generatedPost && (
                  <div className="space-y-3 mt-4 animate-fade-in">
                    <textarea 
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[150px] focus:outline-none focus:border-[#0a66c2]" 
                      value={generatedPost}
                      onChange={(e) => setGeneratedPost(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button style={{ backgroundColor: '#1a3a5c' }} className="inline-flex items-center justify-center gap-2 text-white hover:opacity-90 flex-1 py-2.5 rounded-lg transition-all font-medium" onClick={handleCopyPost}>
                        <i className="fas fa-copy"></i> Copier
                      </button>
                      <button style={{ backgroundColor: '#0a66c2' }} className="inline-flex items-center justify-center gap-2 text-white hover:opacity-90 flex-1 py-2.5 rounded-lg transition-all font-bold" onClick={handlePublishLinkedIn}>
                        <i className="fas fa-share"></i> Publier
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center space-y-5 bg-[#faf8f5] p-5 rounded-xl border border-[#c9a84c]/20">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c9a84c]/30">
                  <QRCodeCanvas 
                    id="qr-code-canvas"
                    value={publicUrl} 
                    size={160}
                    level="H"
                    includeMargin={true}
                    fgColor="#1a3a5c"
                    imageSettings={{
                      src: "/images/logo.png",
                      x: undefined,
                      y: undefined,
                      height: 35,
                      width: 35,
                      excavate: true,
                    }}
                  />
                </div>
                <button 
                  style={{ backgroundColor: '#1a3a5c' }}
                  className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl text-white font-bold hover:opacity-90 transition-all mt-2 shadow-sm"
                  onClick={handleDownloadQR}
                >
                  <i className="fas fa-download"></i> Télécharger QR Code
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
