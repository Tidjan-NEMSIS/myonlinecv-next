import React from 'react';
import { CvData } from '@/lib/types';
import CvSkillBars from './CvSkillBars';
import CvLanguages from './CvLanguages';
import CvTags from './CvTags';

interface Props {
  cvData: CvData;
  onPhotoClick: () => void;
}

export default function CvSidebar({ cvData, onPhotoClick }: Props) {
  const { personal, skills, languages, expertise } = cvData;

  return (
    <div className="flex flex-col gap-10">
      {/* Photo */}
      <div className="flex justify-center md:justify-start">
        <div 
          className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gray-200 cursor-pointer relative group transition-transform hover:scale-105"
          onClick={onPhotoClick}
        >
          {cvData.photoBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={cvData.photoBase64} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <i className="fas fa-user text-4xl mb-2"></i>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <i className="fas fa-search-plus text-white text-2xl"></i>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-4 text-gray-600">
        <h3 className="text-lg font-bold text-[var(--primary-color)] mb-4 uppercase tracking-wider flex items-center gap-2">
          <i className="fas fa-address-card text-[var(--accent-color)]"></i> 
          Contact
        </h3>
        
        {personal?.email && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center shrink-0">
              <i className="fas fa-envelope text-sm"></i>
            </div>
            <a href={`mailto:${personal.email}`} className="hover:text-[var(--primary-color)] transition-colors break-all mt-1">
              {personal.email}
            </a>
          </div>
        )}
        
        {personal?.phone && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center shrink-0">
              <i className="fas fa-phone-alt text-sm"></i>
            </div>
            <span className="mt-1">{personal.phone}</span>
          </div>
        )}

        {personal?.location && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center shrink-0">
              <i className="fas fa-map-marker-alt text-sm"></i>
            </div>
            <span className="mt-1">{personal.location}</span>
          </div>
        )}
        
        {personal?.linkedin && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center shrink-0">
              <i className="fab fa-linkedin-in text-sm"></i>
            </div>
            <a href={personal.linkedin} target="_blank" rel="noreferrer" className="hover:text-[var(--primary-color)] transition-colors break-all mt-1">
              LinkedIn
            </a>
          </div>
        )}
        
        {personal?.github && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center shrink-0">
              <i className="fab fa-github text-sm"></i>
            </div>
            <a href={personal.github} target="_blank" rel="noreferrer" className="hover:text-[var(--primary-color)] transition-colors break-all mt-1">
              GitHub
            </a>
          </div>
        )}

        {personal?.portfolio && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center shrink-0">
              <i className="fas fa-globe text-sm"></i>
            </div>
            <a href={personal.portfolio} target="_blank" rel="noreferrer" className="hover:text-[var(--primary-color)] transition-colors break-all mt-1">
              Portfolio
            </a>
          </div>
        )}
      </div>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold text-[var(--primary-color)] mb-4 uppercase tracking-wider flex items-center gap-2">
            <i className="fas fa-laptop-code text-[var(--accent-color)]"></i> 
            Compétences IT
          </h3>
          <CvSkillBars skills={skills} />
        </div>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold text-[var(--primary-color)] mb-4 uppercase tracking-wider flex items-center gap-2">
            <i className="fas fa-language text-[var(--accent-color)]"></i> 
            Langues
          </h3>
          <CvLanguages languages={languages} />
        </div>
      )}

      {/* Expertise (Tags) */}
      {expertise && expertise.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold text-[var(--primary-color)] mb-4 uppercase tracking-wider flex items-center gap-2">
            <i className="fas fa-star text-[var(--accent-color)]"></i> 
            Domaines d'Expertise
          </h3>
          <CvTags tags={expertise} />
        </div>
      )}
    </div>
  );
}
