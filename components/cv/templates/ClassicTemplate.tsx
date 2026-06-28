import React from 'react';
import { CvData } from '@/lib/types';
import './classic-cv.css';

interface Props {
  cvData: CvData;
  onPhotoClick: () => void;
}

export default function ClassicTemplate({ cvData, onPhotoClick }: Props) {
  const p = cvData.personal || {};
  const experiences = cvData.experiences || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const itSkills = cvData.itSkills || skills;
  const languages = cvData.languages || [];
  const expertise = cvData.expertise || [];
  const bailleurs = cvData.bailleurs || [];

  return (
    <div className="cv-wrapper">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        {/* Photo */}
        <div className="photo-section" onClick={onPhotoClick} style={{ cursor: 'pointer' }}>
          <div className="photo-ring">
            {cvData.photoBase64 ? (
              <img src={cvData.photoBase64} alt="Photo de profil" className="photo-img" />
            ) : (
              <div className="photo-placeholder">
                <i className="fas fa-user-tie"></i>
              </div>
            )}
          </div>
          <div className="name-block">
            <h1>{p.fullname || 'Votre Nom'}</h1>
            {p.title && <span className="title-badge">{p.title}</span>}
          </div>
        </div>

        <div className="gold-divider"></div>

        {/* Contact */}
        <div className="sidebar-section">
          <div className="sidebar-section-title"><i className="fas fa-address-card"></i> Contact</div>
          <ul className="contact-list">
            {p.location && (
              <li className="contact-item">
                <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                <span>{p.location}</span>
              </li>
            )}
            {p.phone && (
              <li className="contact-item">
                <div className="contact-icon"><i className="fas fa-phone"></i></div>
                <a href={`tel:${p.phone.replace(/\s/g, '')}`}>{p.phone}</a>
              </li>
            )}
            {p.email && (
              <li className="contact-item">
                <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                <a href={`mailto:${p.email}`}>{p.email}</a>
              </li>
            )}
          </ul>
        </div>

        {/* Expertise */}
        {expertise.length > 0 && (
          <>
            <div className="gold-divider"></div>
            <div className="sidebar-section">
              <div className="sidebar-section-title"><i className="fas fa-star"></i> Expertise</div>
              <div className="tags-grid">
                {expertise.map((exp, i) => (
                  <span key={i} className="cv-tag">{exp}</span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Informatique / Skills */}
        {itSkills.length > 0 && (
          <>
            <div className="gold-divider"></div>
            <div className="sidebar-section">
              <div className="sidebar-section-title"><i className="fas fa-laptop-code"></i> Informatique</div>
              <div className="skills-list">
                {itSkills.map((skill, i) => (
                  <div className="skill-item" key={i}>
                    <div className="skill-label">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-fill animated" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Langues */}
        {languages.length > 0 && (
          <>
            <div className="gold-divider"></div>
            <div className="sidebar-section">
              <div className="sidebar-section-title"><i className="fas fa-language"></i> Langues</div>
              <div className="lang-list">
                {languages.map((lang, i) => {
                  // Basic estimation: if level is percentage we map to 1-5, else if text we can guess.
                  let filled = 4;
                  const lbl = lang.level ? String(lang.level).toLowerCase() : '';
                  if (lbl.includes('natif') || lbl.includes('bilingue') || lbl.includes('courant')) filled = 5;
                  else if (lbl.includes('professionnel') || lbl.includes('avancé') || lbl === '4' || lbl === '80') filled = 4;
                  else if (lbl.includes('intermédiaire') || lbl === '3' || lbl === '60') filled = 3;
                  else if (lbl.includes('base') || lbl.includes('scolaire') || lbl === '2' || lbl === '40') filled = 2;
                  else if (lbl === '1' || lbl === '20') filled = 1;

                  return (
                    <div className="lang-item" key={i}>
                      <div className="lang-name">
                        <span>{lang.name}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--accent)' }}>{lang.level}</span>
                      </div>
                      <div className="lang-dots">
                        {[1, 2, 3, 4, 5].map(dot => (
                          <div key={dot} className={`lang-dot ${dot <= filled ? 'filled' : ''}`}></div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Bailleurs de fonds */}
        {bailleurs.length > 0 && (
          <>
            <div className="gold-divider"></div>
            <div className="sidebar-section">
              <div className="sidebar-section-title"><i className="fas fa-handshake"></i> Bailleurs de Fonds</div>
              <div className="tags-grid">
                {bailleurs.map((b, i) => (
                  <span key={i} className="cv-tag">{b}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">
        {/* Top Banner */}
        <div className="top-banner">
          <div className="top-banner-inner">
            <div className="banner-pretitle">Curriculum Vitae</div>
            <div className="banner-title">{p.fullname || 'Votre Nom'}</div>
            {p.title && <div className="banner-subtitle">{p.title}</div>}
          </div>
          <div className="banner-deco">
            {p.fullname ? p.fullname.split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase() : 'CV'}
          </div>
        </div>

        <div className="content-area">
          {/* Profile */}
          {(p.about || cvData.profile) && (
            <div className="cv-section">
              <div className="section-header">
                <div className="section-icon"><i className="fas fa-user"></i></div>
                <div className="section-title">Profil Professionnel</div>
                <div className="section-line"></div>
              </div>
              <div className="profile-text">{p.about || cvData.profile}</div>
            </div>
          )}

          {/* Expériences */}
          {experiences.length > 0 && (
            <div className="cv-section">
              <div className="section-header">
                <div className="section-icon"><i className="fas fa-briefcase"></i></div>
                <div className="section-title">Expérience Professionnelle</div>
                <div className="section-line"></div>
              </div>
              <div className="cv-timeline">
                {experiences.map((exp, i) => (
                  <div className="timeline-item" key={i}>
                    <div className="timeline-left">
                      <div className="timeline-date">{exp.date}</div>
                      {exp.location && (
                        <div className="timeline-loc">
                          <i className="fas fa-map-pin" style={{ fontSize: '0.6rem' }}></i> {exp.location}
                        </div>
                      )}
                    </div>
                    <div className="timeline-center">
                      <div className="timeline-dot"></div>
                      <div className="timeline-line"></div>
                    </div>
                    <div className="timeline-right">
                      <div className="exp-card">
                        <div className="exp-role">{exp.role}</div>
                        <div className="exp-org"><i className="fas fa-building"></i> {exp.org}</div>
                        {exp.tasks && exp.tasks.length > 0 && (
                          <ul className="exp-desc">
                            {exp.tasks.map((task, tIdx) => (
                              <li key={tIdx}>{task}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formation */}
          {education.length > 0 && (
            <div className="cv-section">
              <div className="section-header">
                <div className="section-icon"><i className="fas fa-graduation-cap"></i></div>
                <div className="section-title">Formation</div>
                <div className="section-line"></div>
              </div>
              <div className="edu-grid">
                {education.map((edu, i) => (
                  <div className="edu-card" key={i}>
                    <div className="edu-icon"><i className="fas fa-university"></i></div>
                    <div className="edu-info">
                      <div className="edu-degree">{edu.degree}</div>
                      <div className="edu-school">{edu.school}</div>
                      {edu.details && <div className="edu-details">{edu.details}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="cv-footer">
          <div className="footer-text">
            CONFIDENTIEL · CV {p.fullname ? p.fullname.toUpperCase() : ''} · {new Date().getFullYear()}
          </div>
          <div className="footer-badge">
            <i className="fas fa-shield-alt"></i> DOCUMENT OFFICIEL
          </div>
        </div>
      </main>
    </div>
  );
}
