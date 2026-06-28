import React from 'react';
import { CvData } from '@/lib/types';
import './wave-cv.css';

interface Props {
  cvData: CvData;
  onPhotoClick: () => void;
}

export default function WaveTemplate({ cvData, onPhotoClick }: Props) {
  const p = cvData.personal || {};
  const experiences = cvData.experiences || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const itSkills = cvData.itSkills || [];
  const languages = cvData.languages || [];
  const expertise = cvData.expertise || [];
  const bailleurs = cvData.bailleurs || [];

  return (
    <div className="wave-wrapper">
      
      {/* Header Area */}
      <header className="wave-header">
        <div className="wave-header-content">
          <h1 className="wave-name">{p.fullname || 'Prénom Nom'}</h1>
        </div>
        
        {/* The Wave SVG */}
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: '140px' }}>
          <path 
            fill="var(--primary)" 
            fillOpacity="1" 
            d="M0,160L48,144C96,128,192,96,288,112C384,128,480,192,576,213.3C672,235,768,213,864,186.7C960,160,1056,128,1152,122.7C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>

        {/* Profile Photo */}
        <div className="wave-photo-container" onClick={onPhotoClick} style={{ cursor: 'pointer' }}>
          {cvData.photoBase64 ? (
            <img src={cvData.photoBase64} alt="Profile" className="wave-photo" />
          ) : (
            <div className="wave-photo-placeholder"><i className="fas fa-user"></i></div>
          )}
        </div>
      </header>

      {/* Main Body */}
      <div className="wave-body">
        
        {/* ===== LEFT COLUMN ===== */}
        <div className="wave-left">
          
          {/* Contact */}
          <div className="wave-contact-list">
            {p.phone && (
              <div className="wave-contact-item">
                <div className="wave-contact-icon"><i className="fas fa-phone-alt"></i></div>
                <span>{p.phone}</span>
              </div>
            )}
            {p.email && (
              <div className="wave-contact-item">
                <div className="wave-contact-icon"><i className="fas fa-envelope"></i></div>
                <span>{p.email}</span>
              </div>
            )}
            {p.location && (
              <div className="wave-contact-item">
                <div className="wave-contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                <span>{p.location}</span>
              </div>
            )}
            {p.linkedin && (
              <div className="wave-contact-item">
                <div className="wave-contact-icon"><i className="fab fa-linkedin-in"></i></div>
                <span>{p.linkedin}</span>
              </div>
            )}
          </div>

          {/* Expertise */}
          {expertise.length > 0 && (
            <div>
              <div className="wave-section-title">Expertise</div>
              <div className="wave-skills-list">
                {expertise.map((exp, i) => (
                  <div key={i} className="wave-skill-item">{exp}</div>
                ))}
              </div>
            </div>
          )}

          {/* Informatique / Skills */}
          {itSkills.length > 0 && (
            <div>
              <div className="wave-section-title">Informatique</div>
              <div className="wave-skills-list">
                {itSkills.map((skill, i) => (
                  <div key={i} className="wave-skill-item">
                    <span>{skill.name}</span>
                    {skill.level ? <span style={{fontSize: '0.8rem', color: '#666', marginLeft: 'auto'}}>{skill.level}%</span> : null}
                  </div>
                ))}
              </div>
            </div>
          )}
          {skills.length > 0 && (
            <div style={{ marginTop: itSkills.length > 0 ? '15px' : '0' }}>
              {itSkills.length === 0 && <div className="wave-section-title">Informatique</div>}
              <div className="wave-skills-list">
                {skills.map((skill, i) => (
                  <div key={i} className="wave-skill-item">
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <div>
              <div className="wave-section-title">Langues</div>
              <div className="wave-skills-list">
                {languages.map((lang, i) => {
                  let filled = 4;
                  const lbl = lang.level ? String(lang.level).toLowerCase() : '';
                  if (lbl.includes('natif') || lbl.includes('bilingue') || lbl.includes('courant')) filled = 5;
                  else if (lbl.includes('professionnel') || lbl.includes('avancé') || lbl === '4' || lbl === '80') filled = 4;
                  else if (lbl.includes('intermédiaire') || lbl === '3' || lbl === '60') filled = 3;
                  else if (lbl.includes('base') || lbl.includes('scolaire') || lbl === '2' || lbl === '40') filled = 2;
                  else if (lbl === '1' || lbl === '20') filled = 1;

                  return (
                    <div key={i} className="wave-lang-item">
                      <div className="wave-lang-name">
                        <strong>{lang.name}</strong> 
                        <span style={{fontSize: '0.8rem', color: '#666'}}>{lang.level}</span>
                      </div>
                      <div className="wave-lang-dots">
                        {[1, 2, 3, 4, 5].map(dot => (
                          <div key={dot} className={`wave-lang-dot ${dot <= filled ? 'filled' : ''}`}></div>
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
              <div className="wave-section-title">Bailleurs de Fonds</div>
              <div className="wave-skills-list">
                {bailleurs.map((item, i) => (
                  <div key={i} className="wave-skill-item">{item}</div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="wave-right">
          
          <div className="wave-job-title">{p.title || 'Titre du poste'}</div>

          {/* Profil Professionnel */}
          {(p.about || cvData.profile) && (
            <div>
              <div className="wave-section-title" style={{ width: '100%' }}>Profil Professionnel</div>
              <div className="wave-profile-text">
                {p.about || cvData.profile}
              </div>
            </div>
          )}

          {/* Expérience Professionnelle */}
          {experiences.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div className="wave-section-title" style={{ width: '100%' }}>Expérience Professionnelle</div>
              
              {experiences.map((exp, i) => (
                <div key={i} className="wave-exp-item">
                  <div className="wave-exp-header">{exp.role}</div>
                  <div className="wave-exp-meta">
                    {exp.org || exp.company} {exp.location ? `, ${exp.location}` : ''} | {exp.date}
                  </div>
                  {exp.tasks && exp.tasks.length > 0 && (
                    <ul className="wave-exp-tasks">
                      {exp.tasks.map((task, tIdx) => (
                        <li key={tIdx}>{task}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Formation */}
          {education.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div className="wave-section-title" style={{ width: '100%' }}>Formation</div>
              {education.map((edu, i) => (
                <div key={i} className="wave-edu-item">
                  <div className="wave-edu-degree">{edu.degree}</div>
                  <div className="wave-edu-school">
                    {edu.school}
                    {edu.details && <span> - {edu.details}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Footer Area with bottom wave */}
      <div className="wave-footer">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path 
            fill="#2b2b2b" 
            fillOpacity="1" 
            d="M0,128L48,149.3C96,171,192,213,288,208C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,170.7C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
        {/* A second smaller wave over it for the "primary" color effect at the bottom */}
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0, zIndex: -1 }}>
          <path 
            fill="var(--primary)" 
            fillOpacity="1" 
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,224C960,203,1056,149,1152,149.3C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>

    </div>
  );
}
