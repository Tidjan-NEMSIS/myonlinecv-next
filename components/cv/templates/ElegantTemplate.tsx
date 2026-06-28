import React from 'react';
import { CvData } from '@/lib/types';
import './elegant-cv.css';

interface Props {
  cvData: CvData;
  onPhotoClick: () => void;
}

export default function ElegantTemplate({ cvData, onPhotoClick }: Props) {
  const p = cvData.personal || {};
  const experiences = cvData.experiences || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const itSkills = cvData.itSkills || [];
  const languages = cvData.languages || [];
  const expertise = cvData.expertise || [];
  const bailleurs = cvData.bailleurs || [];

  return (
    <div className="elegant-wrapper">
      
      {/* ===== LEFT SIDEBAR ===== */}
      <aside className="elegant-sidebar">
        
        {/* Photo */}
        <div className="elegant-photo-container" onClick={onPhotoClick} style={{ cursor: 'pointer' }}>
          {cvData.photoBase64 ? (
            <img src={cvData.photoBase64} alt="Profile" className="elegant-photo" />
          ) : (
            <div className="elegant-photo-placeholder"><i className="fas fa-user-tie"></i></div>
          )}
        </div>

        {/* Contact Info */}
        <div className="elegant-contact">
          {p.phone && (
            <div className="elegant-contact-item">
              <div className="elegant-contact-icon"><i className="fas fa-phone-alt"></i></div>
              <span>{p.phone}</span>
            </div>
          )}
          {p.email && (
            <div className="elegant-contact-item">
              <div className="elegant-contact-icon"><i className="fas fa-envelope"></i></div>
              <span>{p.email}</span>
            </div>
          )}
          {p.location && (
            <div className="elegant-contact-item">
              <div className="elegant-contact-icon"><i className="fas fa-map-marker-alt"></i></div>
              <span>{p.location}</span>
            </div>
          )}
          {p.linkedin && (
            <div className="elegant-contact-item">
              <div className="elegant-contact-icon"><i className="fab fa-linkedin-in"></i></div>
              <span>{p.linkedin}</span>
            </div>
          )}
        </div>

        {/* Expertise */}
        {expertise.length > 0 && (
          <div>
            <div className="elegant-section-title-side">
              <i className="fas fa-star"></i> EXPERTISE
            </div>
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
              {expertise.map((exp, i) => (
                <li key={i} style={{ marginBottom: '5px' }}>{exp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Informatique */}
        {itSkills.length > 0 && (
          <div>
            <div className="elegant-section-title-side">
              <i className="fas fa-laptop-code"></i> INFORMATIQUE
            </div>
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
              {itSkills.map((skill, i) => (
                <li key={i} style={{ marginBottom: '5px' }}>
                  {skill.name} {skill.level ? `(${skill.level}%)` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
        {skills.length > 0 && (
          <div style={{ marginTop: itSkills.length > 0 ? '15px' : '0' }}>
            {itSkills.length === 0 && (
              <div className="elegant-section-title-side">
                <i className="fas fa-laptop-code"></i> INFORMATIQUE
              </div>
            )}
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
              {skills.map((skill, i) => (
                <li key={i} style={{ marginBottom: '5px' }}>
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Langues */}
        {languages.length > 0 && (
          <div>
            <div className="elegant-section-title-side">
              <i className="fas fa-language"></i> LANGUES
            </div>
            <div style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
              {languages.map((lang, i) => {
                let filled = 4;
                const lbl = lang.level ? String(lang.level).toLowerCase() : '';
                if (lbl.includes('natif') || lbl.includes('bilingue') || lbl.includes('courant')) filled = 5;
                else if (lbl.includes('professionnel') || lbl.includes('avancé') || lbl === '4' || lbl === '80') filled = 4;
                else if (lbl.includes('intermédiaire') || lbl === '3' || lbl === '60') filled = 3;
                else if (lbl.includes('base') || lbl.includes('scolaire') || lbl === '2' || lbl === '40') filled = 2;
                else if (lbl === '1' || lbl === '20') filled = 1;

                return (
                  <div key={i} className="elegant-lang-item">
                    <div className="elegant-lang-name">
                      <span>{lang.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{lang.level}</span>
                    </div>
                    <div className="elegant-lang-dots">
                      {[1, 2, 3, 4, 5].map(dot => (
                        <div key={dot} className={`elegant-lang-dot ${dot <= filled ? 'filled' : ''}`}></div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bailleurs de Fonds */}
        {bailleurs.length > 0 && (
          <div>
            <div className="elegant-section-title-side">
              <i className="fas fa-handshake"></i> BAILLEURS DE FONDS
            </div>
            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
              {bailleurs.map((item, i) => (
                <li key={i} style={{ marginBottom: '5px' }}>{item}</li>
              ))}
            </ul>
          </div>
        )}

      </aside>

      {/* ===== RIGHT MAIN CONTENT ===== */}
      <main className="elegant-main">
        
        {/* Header */}
        <header className="elegant-header">
          <h1 className="elegant-name">{p.fullname || 'PRÉNOM NOM'}</h1>
          <div>
            <div className="elegant-title-ribbon">
              {p.title || 'INTITULÉ DU POSTE'}
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="elegant-body">
          
          {/* Profil Professionnel */}
          {(p.about || cvData.profile) && (
            <div>
              <div className="elegant-section-title-main">
                <i className="fas fa-user"></i> PROFIL PROFESSIONNEL
              </div>
              <div className="elegant-text-main" style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#444', textAlign: 'justify' }}>
                {p.about || cvData.profile}
              </div>
            </div>
          )}

          {/* Expérience Professionnelle */}
          {experiences.length > 0 && (
            <div>
              <div className="elegant-section-title-main">
                <i className="fas fa-briefcase"></i> EXPÉRIENCE PROFESSIONNELLE
              </div>
              
              <div>
                {experiences.map((exp, i) => (
                  <div key={i} className="elegant-exp-item">
                    <div className="elegant-exp-header">{exp.role}</div>
                    <div className="elegant-exp-meta">
                      {exp.org || exp.company} {exp.location ? `, ${exp.location}` : ''} | {exp.date}
                    </div>
                    {exp.tasks && exp.tasks.length > 0 && (
                      <ul className="elegant-exp-tasks">
                        {exp.tasks.map((task, tIdx) => (
                          <li key={tIdx}>{task}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formation */}
          {education.length > 0 && (
            <div>
              <div className="elegant-section-title-main">
                <i className="fas fa-graduation-cap"></i> FORMATION
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {education.map((edu, i) => (
                  <div key={i}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>{edu.degree}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {edu.school} {edu.details && ` - ${edu.details}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
