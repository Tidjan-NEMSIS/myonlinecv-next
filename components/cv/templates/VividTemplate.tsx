'use client';

import React from 'react';
import { CvData } from '@/lib/types';
import './vivid-cv.css';

interface Props {
  cvData: CvData;
  onPhotoClick: () => void;
}

export default function VividTemplate({ cvData, onPhotoClick }: Props) {
  const p = cvData.personal || {};
  const experiences = cvData.experiences || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const itSkills = cvData.itSkills || [];
  const languages = cvData.languages || [];
  const expertise = cvData.expertise || [];
  const bailleurs = cvData.bailleurs || [];

  // Split fullname into first/last
  const nameParts = (p.fullname || 'PRÉNOM NOM').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Dots renderer (out of 5)
  const renderDots = (level: number) => {
    const count = Math.round((level / 100) * 5);
    return (
      <div className="vivid-dots">
        {[1, 2, 3, 4, 5].map(d => (
          <span key={d} className={`vivid-dot ${d <= count ? 'filled' : ''}`}></span>
        ))}
      </div>
    );
  };

  // Lang level to dots
  const getLangDots = (level: string) => {
    const lbl = String(level || '').toLowerCase();
    if (lbl.includes('natif') || lbl.includes('bilingue') || lbl.includes('courant')) return 5;
    if (lbl.includes('professionnel') || lbl.includes('avancé')) return 4;
    if (lbl.includes('intermédiaire')) return 3;
    if (lbl.includes('scolaire') || lbl.includes('base')) return 2;
    return 3;
  };

  return (
    <div className="vivid-wrapper">
      {/* Decorative blobs */}
      <div className="vivid-blob vivid-blob-1"></div>
      <div className="vivid-blob vivid-blob-2"></div>
      <div className="vivid-blob vivid-blob-3"></div>

      {/* HEADER */}
      <header className="vivid-header">
        <div className="vivid-photo-area">
          <div className="vivid-photo-frame" onClick={onPhotoClick}>
            {cvData.photoBase64 ? (
              <img src={cvData.photoBase64} alt="Profil" />
            ) : (
              <div className="vivid-photo-placeholder"><i className="fas fa-user"></i></div>
            )}
          </div>
        </div>
        <div className="vivid-name-block">
          <h1 className="vivid-firstname">{firstName}</h1>
          <h1 className="vivid-lastname">{lastName}</h1>
          {p.title && <span className="vivid-title-badge">{p.title}</span>}
        </div>
      </header>

      {/* MAIN */}
      <div className="vivid-main">
        {/* LEFT COLUMN */}
        <div className="vivid-left">
          {/* Contact */}
          <div className="vivid-contact-block">
            <div className="vivid-section-title" style={{ marginTop: 0 }}>
              <div className="vivid-section-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <i className="fas fa-address-card"></i>
              </div>
              <span className="vivid-section-label" style={{ color: '#fff' }}>Contact</span>
            </div>
            {p.phone && <div className="vivid-contact-item"><i className="fas fa-phone"></i> {p.phone}</div>}
            {p.email && <div className="vivid-contact-item"><i className="fas fa-envelope"></i> {p.email}</div>}
            {p.location && <div className="vivid-contact-item"><i className="fas fa-map-marker-alt"></i> {p.location}</div>}
            {p.linkedin && <div className="vivid-contact-item"><i className="fab fa-linkedin"></i> {p.linkedin}</div>}
          </div>

          {/* Compétences (languages + IT) */}
          {(languages.length > 0 || itSkills.length > 0) && (
            <div>
              <div className="vivid-section-title">
                <div className="vivid-section-icon"><i className="fas fa-chart-bar"></i></div>
                <span className="vivid-section-label">Compétences</span>
              </div>
              {languages.map((lang, i) => (
                <div className="vivid-skill-item" key={`l-${i}`}>
                  <span className="vivid-skill-name">{lang.name}</span>
                  {renderDots(getLangDots(lang.level) * 20)}
                </div>
              ))}
              {itSkills.map((skill, i) => (
                <div className="vivid-skill-item" key={`it-${i}`}>
                  <span className="vivid-skill-name">{skill.name}</span>
                  {renderDots(skill.level)}
                </div>
              ))}
            </div>
          )}

          {/* Expertise */}
          {expertise.length > 0 && (
            <div>
              <div className="vivid-section-title">
                <div className="vivid-section-icon"><i className="fas fa-star"></i></div>
                <span className="vivid-section-label">Expertise</span>
              </div>
              <div className="vivid-tags">
                {expertise.map((exp, i) => (
                  <span className="vivid-tag" key={i}>{exp}</span>
                ))}
              </div>
            </div>
          )}

          {/* Bailleurs de fonds */}
          {bailleurs.length > 0 && (
            <div>
              <div className="vivid-section-title">
                <div className="vivid-section-icon"><i className="fas fa-handshake"></i></div>
                <span className="vivid-section-label">Bailleurs de fonds</span>
              </div>
              <ul className="vivid-bailleurs-list">
                {bailleurs.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="vivid-right">
          {/* Profil */}
          {(p.about || cvData.profile) && (
            <div>
              <div className="vivid-section-title" style={{ marginTop: 0 }}>
                <div className="vivid-section-icon"><i className="fas fa-user"></i></div>
                <span className="vivid-section-label">Profil Professionnel</span>
              </div>
              <p className="vivid-profile-text">{p.about || cvData.profile}</p>
            </div>
          )}

          {/* Expériences */}
          {experiences.length > 0 && (
            <div>
              <div className="vivid-section-title">
                <div className="vivid-section-icon"><i className="fas fa-briefcase"></i></div>
                <span className="vivid-section-label">Expérience Professionnelle</span>
              </div>
              <div className="vivid-timeline">
                {experiences.map((exp, i) => (
                  <div className="vivid-timeline-item" key={i}>
                    <div className="vivid-tl-role">{exp.role}</div>
                    <div className="vivid-tl-meta">{exp.date} | {exp.org}{exp.location ? ` — ${exp.location}` : ''}</div>
                    {exp.tasks && exp.tasks.length > 0 && (
                      <ul className="vivid-tl-tasks">
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
              <div className="vivid-section-title">
                <div className="vivid-section-icon"><i className="fas fa-graduation-cap"></i></div>
                <span className="vivid-section-label">Formation</span>
              </div>
              <div className="vivid-timeline">
                {education.map((edu, i) => (
                  <div className="vivid-timeline-item" key={i}>
                    <div className="vivid-tl-role">{edu.degree}</div>
                    <div className="vivid-tl-meta">{edu.date} | {edu.school}</div>
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
