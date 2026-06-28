import { CvData, Theme } from './types';

export const genericTheme: Theme = {
  name: 'Ocean Pro',
  primary: '#1a3a5c',
  accent: '#c9a84c',
  accent2: '#e8c97a',
  emoji: '🌊'
};

// We use the generated profile image for the generic CV preview
const PLACEHOLDER_PHOTO = '/images/profile_metisse.png';

export const genericCvData: CvData = {
  isPublic: true,
  photoBase64: PLACEHOLDER_PHOTO,
  templateId: 'classic',
  theme: genericTheme,
  personal: {
    fullname: 'Prénom Nom',
    title: 'Responsable Commercial Senior',
    subtitle: '',
    email: 'prenom.nom@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    linkedin: 'linkedin.com/in/prenom-nom',
    github: 'github.com/prenom-nom',
    portfolio: 'prenom-nom.com',
    about: 'Professionnel expérimenté avec plus de 8 ans d\'expérience dans le développement commercial et la gestion de projets. Expert en stratégie de croissance, négociation et management d\'équipes pluridisciplinaires.',
  },
  profile: 'Professionnel expérimenté avec plus de 8 ans d\'expérience dans le développement commercial et la gestion de projets. Expert en stratégie de croissance, négociation et management d\'équipes pluridisciplinaires.',
  experiences: [
    {
      id: 'exp1',
      company: 'Entreprise Internationale SA',
      org: 'Entreprise Internationale SA',
      role: 'Responsable Commercial Senior',
      date: 'Jan 2020 - Présent',
      location: 'Paris, France',
      tasks: [
        'Pilotage de la stratégie commerciale B2B.',
        'Gestion d\'un portefeuille de 50+ clients grands comptes.',
        'Développement du CA de +35% en 3 ans.'
      ]
    },
    {
      id: 'exp2',
      company: 'Cabinet Conseil & Partners',
      org: 'Cabinet Conseil & Partners',
      role: 'Chargé de Développement',
      date: 'Mar 2017 - Déc 2019',
      location: 'Lyon, France',
      tasks: [
        'Prospection et acquisition de nouveaux clients.',
        'Négociation de contrats stratégiques.',
        'Animation d\'une équipe de 5 commerciaux.'
      ]
    },
    {
      id: 'exp3',
      company: 'StartUp Digital',
      org: 'StartUp Digital',
      role: 'Business Developer Junior',
      date: 'Sep 2015 - Fév 2017',
      location: 'Bordeaux, France',
      tasks: [
        'Mise en place de la stratégie de prospection digitale.',
        'Création de partenariats clés avec des acteurs du secteur tech.'
      ]
    },
  ],
  education: [
    {
      id: 'edu1',
      school: 'ESSEC Business School',
      degree: 'Master en Management',
      details: 'Spécialisation en stratégie et développement commercial international. (2013-2015)',
    },
    {
      id: 'edu2',
      school: 'Université Paris-Dauphine',
      degree: 'Licence Économie-Gestion',
      details: 'Parcours en gestion d\'entreprise et économie appliquée. (2010-2013)',
    },
  ],
  skills: [
    { id: 'sk1', name: 'Négociation', level: 90 },
    { id: 'sk2', name: 'Stratégie Commerciale', level: 85 },
    { id: 'sk3', name: 'CRM Salesforce', level: 80 },
    { id: 'sk4', name: 'Management', level: 85 },
    { id: 'sk5', name: 'Leadership', level: 90 }
  ],
  languages: [
    { id: 'l1', name: 'Français', level: 'Natif' },
    { id: 'l2', name: 'Anglais', level: 'Courant (C1)' },
    { id: 'l3', name: 'Espagnol', level: 'Intermédiaire (B1)' },
  ],
  expertise: [
    'Développement Commercial',
    'Management d\'équipes'
  ],
  bailleurs: []
};
