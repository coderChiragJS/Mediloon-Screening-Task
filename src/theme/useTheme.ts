import { useColorScheme } from 'react-native';
import { darkPalette, lightPalette, Palette } from './colors';
import { radius, spacing } from './spacing';
import { typography } from './typography';

export interface Theme {
  mode: 'light' | 'dark';
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const mode = scheme === 'dark' ? 'dark' : 'light';
  return {
    mode,
    colors: mode === 'dark' ? darkPalette : lightPalette,
    spacing,
    radius,
    typography,
  };
}
