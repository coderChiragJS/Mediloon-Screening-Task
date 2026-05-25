export interface Palette {
  primary: string;
  primaryMuted: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textMuted: string;
  textInverse: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  overlay: string;
}

export const lightPalette: Palette = {
  primary: '#0F766E',
  primaryMuted: '#CCFBF1',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',
  success: '#15803D',
  danger: '#DC2626',
  warning: '#B45309',
  info: '#1D4ED8',
  overlay: 'rgba(15, 23, 42, 0.4)',
};

export const darkPalette: Palette = {
  primary: '#2DD4BF',
  primaryMuted: '#134E4A',
  background: '#0B1220',
  surface: '#111A2E',
  surfaceElevated: '#162038',
  border: '#1F2A44',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  textInverse: '#0B1220',
  success: '#4ADE80',
  danger: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',
  overlay: 'rgba(0, 0, 0, 0.6)',
};
