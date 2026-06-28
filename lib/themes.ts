import { Theme } from './types';

export const THEMES: Theme[] = [
  { name: 'Ocean Pro',       primary: '#1a3a5c', accent: '#c9a84c', accent2: '#e8c97a', emoji: '🌊' },
  { name: 'Emerald',         primary: '#1b4332', accent: '#40916c', accent2: '#74c69d', emoji: '🌿' },
  { name: 'Royal Purple',    primary: '#2d1b69', accent: '#9d4edd', accent2: '#c77dff', emoji: '👑' },
  { name: 'Slate Modern',    primary: '#1e293b', accent: '#38bdf8', accent2: '#7dd3fc', emoji: '🔷' },
  { name: 'Wine & Gold',     primary: '#4a0e0e', accent: '#d4a843', accent2: '#f0d78c', emoji: '🍷' },
  { name: 'Charcoal',        primary: '#212529', accent: '#ff6b35', accent2: '#ffaa5c', emoji: '🔥' },
  { name: 'Midnight Teal',   primary: '#0d2137', accent: '#2ec4b6', accent2: '#6be4d7', emoji: '🌙' },
  { name: 'Rose & Gray',     primary: '#3d3d3d', accent: '#e07a7a', accent2: '#f0a8a8', emoji: '🌹' },
  { name: 'Forest',          primary: '#1a2e1a', accent: '#8bc34a', accent2: '#b5d98c', emoji: '🌲' },
  { name: 'Cobalt',          primary: '#1a237e', accent: '#ffd54f', accent2: '#ffe082', emoji: '💎' },
  { name: 'Burgundy',        primary: '#3c1421', accent: '#c2185b', accent2: '#f06292', emoji: '🎭' },
  { name: 'Nordic',          primary: '#2c3e50', accent: '#1abc9c', accent2: '#76d7c4', emoji: '❄️' },
  { name: 'Sunset',          primary: '#2d0a1b', accent: '#ff7b54', accent2: '#ffd56b', emoji: '🌇' },
  { name: 'Neon Cyber',      primary: '#0b0c10', accent: '#66fcf1', accent2: '#45a29e', emoji: '🤖' },
  { name: 'Autumn',          primary: '#4a2511', accent: '#d96c06', accent2: '#eebb4d', emoji: '🍁' },
  { name: 'Neon Nights',     primary: '#050510', accent: '#ff007f', accent2: '#00f3ff', emoji: '🌌' },
];

export function getThemeByName(name: string): Theme | undefined {
  return THEMES.find(t => t.name === name);
}
