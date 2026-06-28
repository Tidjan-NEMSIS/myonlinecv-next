import { CvData, Theme } from './types';

export const defaultTheme: Theme = {
  name: 'Ocean Pro',
  primary: '#1a3a5c',
  accent: '#c9a84c',
  accent2: '#e8c97a',
  emoji: '🌊'
};

export const defaultCvData: CvData = {
  isPublic: false,
  photoBase64: '',
  templateId: 'classic',
  theme: defaultTheme,
  personal: {
    fullname: '',
    title: '',
    phone: '',
    email: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    about: '',
  },
  experiences: [],
  education: [],
  skills: [],
  itSkills: [],
  languages: [],
  expertise: [],
  profile: '',
  bailleurs: [],
};
