export type TemplateId = 'classic' | 'modern' | 'minimal' | 'wave' | 'elegant' | 'simplex' | 'duo' | 'vivid';

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
  isPremium: boolean;
  thumbnail: string;
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'classic',
    name: 'Classique',
    description: 'Le modèle original, élégant et intemporel',
    isPremium: false,
    thumbnail: '/assets/images/templates/classic.png'
  },
  {
    id: 'wave',
    name: 'Vagues (Nouveau)',
    description: 'Design dynamique avec courbes et bannières colorées',
    isPremium: false,
    thumbnail: '/assets/images/templates/wave.png' // Placeholder, the user can replace later
  },
  {
    id: 'elegant',
    name: 'Élégant (Nouveau)',
    description: 'Style premium avec colonne foncée et bordures dorées',
    isPremium: false,
    thumbnail: '/assets/images/templates/elegant.png'
  },
  {
    id: 'simplex',
    name: 'Simplex (Nouveau)',
    description: 'Design épuré avec cercles décoratifs et étoiles de notation',
    isPremium: false,
    thumbnail: '/assets/images/templates/simplex.png'
  },
  {
    id: 'duo',
    name: 'Le Duo (Bicolore)',
    description: 'Structure en deux colonnes (Turquoise et Gris Foncé) avec timeline.',
    isPremium: false,
    thumbnail: '/assets/images/templates/duo.png'
  },
  {
    id: 'vivid',
    name: 'Vivid (Créatif)',
    description: 'Design organique et vif avec des formes arrondies et colorées.',
    isPremium: false,
    thumbnail: '/assets/images/templates/vivid.png'
  },
  {
    id: 'modern',
    name: 'Moderne (Premium)',
    description: 'Design épuré avec des touches de couleurs vibrantes',
    isPremium: true,
    thumbnail: '/assets/images/templates/modern.png'
  },
  {
    id: 'minimal',
    name: 'Minimaliste (Premium)',
    description: 'Focus sur le contenu, parfait pour les profils seniors',
    isPremium: true,
    thumbnail: '/assets/images/templates/minimal.png'
  }
];

export interface PersonalInfo {
  fullname: string;
  title: string;
  subtitle?: string;
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  about: string;
}

export interface Experience {
  id?: string;
  role?: string;
  org?: string;
  company?: string;
  date?: string;
  location?: string;
  tasks?: string[];
}

export interface Education {
  id?: string;
  degree?: string;
  school?: string;
  date?: string;
  location?: string;
  details?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0 to 100
}

export interface Language {
  id: string;
  name: string;
  level: string; // e.g. "Courant", "Natif", "Intermédiaire"
}

export interface Theme {
  name: string;
  primary: string;
  accent: string;
  accent2: string;
  emoji: string;
}

export interface CvData {
  isPublic: boolean;
  photoBase64: string;
  templateId: TemplateId;
  theme: Theme;
  personal: PersonalInfo;
  profile: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  itSkills?: Skill[];
  languages: Language[];
  expertise: string[];
  bailleurs: string[];
  views?: number;
  translations?: Record<string, Partial<CvData>>;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  slug: string;
  isPremium: boolean;
  createdAt: number;
}
