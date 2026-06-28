import React from 'react';
import { CvData } from '@/lib/types';
import './simplex-cv.css';

interface Props {
  cvData: CvData;
  onPhotoClick: () => void;
}

export default function SimplexTemplate({ cvData, onPhotoClick }: Props) {
  const p = cvData.personal || {};
  const experiences = cvData.experiences || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const itSkills = cvData.itSkills || [];
  const languages = cvData.languages || [];
  const expertise = cvData.expertise || [];
  const bailleurs = cvData.bailleurs || [];

  // Helper to render star rating from skill level (0-100 => 1-5 stars)
  const renderStars = (level: number) => {
    const stars = Math.round((level / 100) * 5);
    return (
      <div className="simplex-stars">
        {[1, 2, 3, 4, 5].map(s => (
          <span key={s} className={`simplex-star ${s <= stars ? 'filled' : ''}`}>★</span>
        ))}
      </div>
    );
  };

  // Derive language star count
  const getLangStars = (level: string) => {
    const lbl = String(level || '').toLowerCase();
    if (lbl.includes('natif') || lbl.includes('bilingue') || lbl.includes('courant')) return 5;
    if (lbl.includes('professionnel') || lbl.includes('avancé')) return 4;
    if (lbl.includes('intermédiaire')) return 3;
    if (lbl.includes('scolaire') || lbl.includes('base')) return 2;
    return 3;
  };

  return (
    <div className="simplex-wrapper">
      {/* Decorative pink circles */}
      <div className="simplex-deco-circle simplex-deco-1"></div>
      <div className="simplex-deco-circle simplex-deco-2"></div>
      <div className="simplex-deco-circle simplex-deco-3"></div>
      <div className="simplex-deco-circle simplex-deco-4"></div>

      {/* ===== HEADER ===== */}
      <header className="simplex-header">
        <div className="simplex-header-left">
          <h1 className="simplex-name">{(p.fullname || 'PRÉNOM NOM').toUpperCase()}</h1>
          <p className="simplex-about">{p.about || cvData.profile || ''}</p>
          
          {/* Contact Row */}
          <div className="simplex-contact-row">
            {p.email && (
              <div className="simplex-contact-item">
                <span className="simplex-contact-label">E-MAIL</span>
                <span className="simplex-contact-value">{p.email}</span>
              </div>
            )}
            {p.phone && (
              <div className="simplex-contact-item">
                <span className="simplex-contact-label">TÉLÉPHONE</span>
                <span className="simplex-contact-value">{p.phone}</span>
              </div>
            )}
            {p.location && (
              <div className="simplex-contact-item">
                <span className="simplex-contact-label">ADRESSE</span>
                <span className="simplex-contact-value">{p.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Photo */}
        <div className="simplex-photo-wrapper" onClick={onPhotoClick} style={{ cursor: 'pointer' }}>
          {cvData.photoBase64 ? (
            <img src={cvData.photoBase64} alt="Photo de profil" className="simplex-photo" />
          ) : (
            <div className="simplex-photo-placeholder"><i className="fas fa-user"></i></div>
          )}
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="simplex-body">

        {/* Expérience Professionnelle */}
        {experiences.length > 0 && (
          <section className="simplex-section">
            <h2 className="simplex-section-title">EXPÉRIENCE PROFESSIONNELLE</h2>
            {experiences.map((exp, i) => (
              <div className="simplex-entry" key={i}>
                <div className="simplex-entry-main">
                  <div className="simplex-entry-bullet"></div>
                  <div className="simplex-entry-content">
                    <div className="simplex-entry-role">{exp.role}</div>
                    <div className="simplex-entry-org">{exp.org}{exp.location ? `, ${exp.location}` : ''}</div>
                    {exp.tasks && exp.tasks.length > 0 && (
                      <ul className="simplex-entry-tasks">
                        {exp.tasks.map((task, tIdx) => (
                          <li key={tIdx}>{task}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="simplex-entry-date">{exp.date}</div>
              </div>
            ))}
          </section>
        )}

        {/* Formation */}
        {education.length > 0 && (
          <section className="simplex-section">
            <h2 className="simplex-section-title">FORMATION</h2>
            {education.map((edu, i) => (
              <div className="simplex-entry" key={i}>
                <div className="simplex-entry-main">
                  <div className="simplex-entry-bullet"></div>
                  <div className="simplex-entry-content">
                    <div className="simplex-entry-role">{edu.degree}</div>
                    <div className="simplex-entry-org">{edu.school}</div>
                    {edu.details && <div className="simplex-entry-details">{edu.details}</div>}
                  </div>
                </div>
                <div className="simplex-entry-date">{edu.date}</div>
              </div>
            ))}
          </section>
        )}

        {/* Compétences */}
        {(skills.length > 0 || expertise.length > 0) && (
          <section className="simplex-section">
            <h2 className="simplex-section-title">COMPÉTENCES</h2>
            <div className="simplex-skills-list">
              {expertise.map((exp, i) => (
                <div className="simplex-skill-item" key={`e-${i}`}>
                  <div className="simplex-skill-bullet"></div>
                  <span>{exp}</span>
                </div>
              ))}
              {skills.map((skill, i) => (
                <div className="simplex-skill-item" key={`s-${i}`}>
                  <div className="simplex-skill-bullet"></div>
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Informatique */}
        {itSkills.length > 0 && (
          <section className="simplex-section">
            <h2 className="simplex-section-title">INFORMATIQUE</h2>
            <div className="simplex-it-grid">
              {itSkills.map((skill, i) => (
                <div className="simplex-it-item" key={i}>
                  <div className="simplex-it-left">
                    <div className="simplex-skill-bullet"></div>
                    <span>{skill.name}</span>
                  </div>
                  {renderStars(skill.level)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Langues */}
        {languages.length > 0 && (
          <section className="simplex-section">
            <h2 className="simplex-section-title">LANGUES</h2>
            <div className="simplex-it-grid">
              {languages.map((lang, i) => {
                const stars = getLangStars(lang.level);
                return (
                  <div className="simplex-it-item" key={i}>
                    <div className="simplex-it-left">
                      <div className="simplex-skill-bullet"></div>
                      <span>{lang.name}</span>
                    </div>
                    <div className="simplex-stars">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={`simplex-star ${s <= stars ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Bailleurs de fonds */}
        {bailleurs.length > 0 && (
          <section className="simplex-section">
            <h2 className="simplex-section-title">PARTENAIRES / BAILLEURS DE FONDS</h2>
            <div className="simplex-skills-list">
              {bailleurs.map((b, i) => (
                <div className="simplex-skill-item" key={i}>
                  <div className="simplex-skill-bullet"></div>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
