import React from 'react';
import { CvData } from '@/lib/types';
import './duo-cv.css';

interface Props {
  cvData: CvData;
  onPhotoClick: () => void;
}

export default function DuoTemplate({ cvData, onPhotoClick }: Props) {
  const p = cvData.personal || {};
  const experiences = cvData.experiences || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const itSkills = cvData.itSkills || [];
  const languages = cvData.languages || [];
  const expertise = cvData.expertise || [];
  const bailleurs = cvData.bailleurs || [];

  // Helper to render dots for skills (out of 5)
  const renderDots = (level: number) => {
    const dotsCount = Math.round((level / 100) * 5);
    return (
      <div className="duo-dots">
        {[1, 2, 3, 4, 5].map(d => (
          <span key={d} className={`duo-dot ${d <= dotsCount ? 'filled' : ''}`}></span>
        ))}
      </div>
    );
  };

  // Lang stars to dots
  const getLangDots = (level: string) => {
    const lbl = String(level || '').toLowerCase();
    if (lbl.includes('natif') || lbl.includes('bilingue') || lbl.includes('courant')) return 5;
    if (lbl.includes('professionnel') || lbl.includes('avancé')) return 4;
    if (lbl.includes('intermédiaire')) return 3;
    if (lbl.includes('scolaire') || lbl.includes('base')) return 2;
    return 3;
  };

  return (
    <div className="duo-wrapper">
      {/* HEADER */}
      <header className="duo-header">
        <div className="duo-header-left">
          <h1 className="duo-name">{(p.fullname || 'PRÉNOM NOM').toUpperCase()}</h1>
          {p.title && <h2 className="duo-title">{p.title.toUpperCase()}</h2>}
          <div className="duo-contact">
            {p.email && <div className="duo-contact-item"><i className="fas fa-envelope"></i> {p.email}</div>}
            {p.phone && <div className="duo-contact-item"><i className="fas fa-phone"></i> {p.phone}</div>}
            {p.location && <div className="duo-contact-item"><i className="fas fa-map-marker-alt"></i> {p.location}</div>}
          </div>
        </div>
        <div className="duo-photo-container" onClick={onPhotoClick} style={{ cursor: 'pointer' }}>
          <div className="duo-photo-border">
            {cvData.photoBase64 ? (
              <img src={cvData.photoBase64} alt="Profil" className="duo-photo" />
            ) : (
              <div className="duo-photo-placeholder"><i className="fas fa-user"></i></div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="duo-main">
        {/* LEFT COLUMN (Dark) */}
        <div className="duo-left-column">
          
          {/* Profile */}
          {(p.about || cvData.profile) && (
            <div className="duo-section-left">
              <div className="duo-section-title-left">
                <div className="duo-icon-box"><i className="fas fa-user"></i></div>
                <span>PROFIL</span>
              </div>
              <div className="duo-profile-text">
                {p.about || cvData.profile}
              </div>
            </div>
          )}

          {/* Skills (Languages, IT) */}
          {(languages.length > 0 || itSkills.length > 0) && (
            <div className="duo-section-left">
              <div className="duo-section-title-left">
                <div className="duo-icon-box"><i className="fas fa-chart-bar"></i></div>
                <span>COMPÉTENCES</span>
              </div>
              
              <div className="duo-skills-list">
                {languages.map((lang, i) => (
                  <div className="duo-skill-item" key={`l-${i}`}>
                    <span className="duo-skill-name">{lang.name}</span>
                    {renderDots(getLangDots(lang.level) * 20)}
                  </div>
                ))}
                
                {itSkills.map((skill, i) => (
                  <div className="duo-skill-item" key={`it-${i}`}>
                    <span className="duo-skill-name">{skill.name}</span>
                    {renderDots(skill.level)}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Expertise */}
          {expertise.length > 0 && (
            <div className="duo-section-left">
              <div className="duo-section-title-left">
                <div className="duo-icon-box"><i className="fas fa-star"></i></div>
                <span>EXPERTISE</span>
              </div>
              <div className="duo-tags-list">
                {expertise.map((exp, i) => (
                  <span className="duo-tag" key={i}>{exp}</span>
                ))}
              </div>
            </div>
          )}

          {/* Bailleurs de fonds */}
          {bailleurs.length > 0 && (
            <div className="duo-section-left">
              <div className="duo-section-title-left">
                <div className="duo-icon-box"><i className="fas fa-handshake"></i></div>
                <span>BAILLEURS DE FONDS</span>
              </div>
              <div className="duo-profile-text">
                <ul style={{ paddingLeft: '15px', listStyleType: 'disc' }}>
                  {bailleurs.map((b, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN (Light) */}
        <div className="duo-right-column">
          {/* Experience */}
          {experiences.length > 0 && (
            <div className="duo-section-right">
              <div className="duo-section-title-right">
                <div className="duo-icon-box-right"><i className="fas fa-briefcase"></i></div>
                <span>EXPÉRIENCE PROFESSIONNELLE</span>
              </div>
              <div className="duo-timeline-right">
                {experiences.map((exp, i) => (
                  <div className="duo-timeline-item-right" key={i}>
                    <div className="duo-timeline-marker"></div>
                    <div className="duo-timeline-content-right">
                      <div className="duo-exp-role">{exp.role}</div>
                      <div className="duo-exp-meta">{exp.date} | {exp.org}{exp.location ? ` - ${exp.location}` : ''}</div>
                      {exp.tasks && exp.tasks.length > 0 && (
                        <ul className="duo-exp-tasks">
                          {exp.tasks.map((task, tIdx) => (
                            <li key={tIdx}>{task}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="duo-section-right mt-6">
              <div className="duo-section-title-right">
                <div className="duo-icon-box-right"><i className="fas fa-graduation-cap"></i></div>
                <span>FORMATION</span>
              </div>
              <div className="duo-timeline-right">
                {education.map((edu, i) => (
                  <div className="duo-timeline-item-right" key={i}>
                    <div className="duo-timeline-marker"></div>
                    <div className="duo-timeline-content-right">
                      <div className="duo-exp-role">{edu.degree}</div>
                      <div className="duo-exp-meta">{edu.date} | {edu.school}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
