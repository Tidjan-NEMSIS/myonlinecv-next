'use client';

import React, { useState, useEffect } from 'react';
import { CvData, UserProfile } from '@/lib/types';
import ClassicTemplate from './templates/ClassicTemplate';
// import ModernTemplate from './templates/ModernTemplate'; // to be added later
// import MinimalTemplate from './templates/MinimalTemplate'; // to be added later
import CvExportBar from './CvExportBar';
import LanguageSelector from './LanguageSelector';
import PhotoModal from './PhotoModal';

interface Props {
  cvData: CvData;
  profile: UserProfile;
}

export default function CvRoot({ cvData, profile }: Props) {
  const [currentLang, setCurrentLang] = useState('fr');
  const [activeData, setActiveData] = useState<CvData>(cvData);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Apply theme CSS variables to body
  useEffect(() => {
    if (cvData.theme) {
      document.documentElement.style.setProperty('--primary', cvData.theme.primary);
      document.documentElement.style.setProperty('--accent', cvData.theme.accent);
      document.documentElement.style.setProperty('--accent2', cvData.theme.accent2 || cvData.theme.accent);
    }
  }, [cvData.theme]);

  // Handle translation switching
  useEffect(() => {
    if (currentLang === 'fr') {
      setActiveData(cvData);
    } else if (cvData.translations && cvData.translations[currentLang]) {
      // Merge base data with translation overrides
      setActiveData({
        ...cvData,
        ...cvData.translations[currentLang]
      });
    }
  }, [currentLang, cvData]);

  // Select the appropriate template
  const renderTemplate = () => {
    let TemplateComponent = ClassicTemplate;
    
    switch (cvData.templateId) {
      case 'wave': 
        TemplateComponent = require('./templates/WaveTemplate').default;
        break;
      case 'elegant':
        TemplateComponent = require('./templates/ElegantTemplate').default;
        break;
      case 'simplex':
        TemplateComponent = require('./templates/SimplexTemplate').default;
        break;
      case 'duo':
        TemplateComponent = require('./templates/DuoTemplate').default;
        break;
      case 'vivid':
        TemplateComponent = require('./templates/VividTemplate').default;
        break;
      // case 'modern': TemplateComponent = require('./templates/ModernTemplate').default; break;
      // case 'minimal': TemplateComponent = require('./templates/MinimalTemplate').default; break;
      case 'classic':
      default: 
        TemplateComponent = ClassicTemplate;
        break;
    }

    return <TemplateComponent cvData={activeData} onPhotoClick={() => setIsPhotoModalOpen(true)} />;
  };

  return (
    <div className="relative pb-24"> {/* pb-24 for the export bar at the bottom */}
      
      {/* Floating Controls */}
      <div className="fixed top-4 right-4 z-[9999] flex gap-2">
        {cvData.translations && Object.keys(cvData.translations).length > 0 && (
          <LanguageSelector 
            currentLang={currentLang} 
            onChange={setCurrentLang} 
            availableLangs={Object.keys(cvData.translations)} 
          />
        )}
      </div>

      {/* Render selected CV Template */}
      <div id="cv-render-area" className="w-full max-w-6xl mx-auto my-8 flex justify-center print:m-0">
        {renderTemplate()}
      </div>

      {/* Export Bar */}
      <CvExportBar cvData={activeData} />

      {/* Photo Modal */}
      {isPhotoModalOpen && activeData.photoBase64 && (
        <PhotoModal 
          photoUrl={activeData.photoBase64} 
          onClose={() => setIsPhotoModalOpen(false)} 
        />
      )}
    </div>
  );
}
