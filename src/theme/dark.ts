// src\theme\dark.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

import {
  createSharedComponents,
  sharedShape,
  sharedTypography,
} from './shared';

export const darkPalette = {
  mode: 'dark' as const,
  primary: { main: '#B084F7', light: '#D7BFFF' },
  secondary: { main: '#8ECAE6', light: '#B2E4F3' },
  background: {
    default: '#1B1129',
    paper: '#2B1035',
  },
  text: {
    primary: '#F8F8FF',
  },
  gradient: `
    radial-gradient(ellipse at 50% 0%, rgba(176, 132, 247, 0.2) 0%, transparent 70%),
    linear-gradient(135deg, #1B1129 0%, #3D1B5B 100%)`,
};

export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      ...darkPalette,
    },
    shape: sharedShape,
    typography: {
      ...sharedTypography,
      h1: { ...sharedTypography.h1, color: darkPalette.text.primary },
      body1: { ...sharedTypography.body1, color: darkPalette.text.primary },
    },
    components: {
      ...createSharedComponents(darkPalette.primary),
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: darkPalette.background.default,
            backgroundImage: darkPalette.gradient,
          },
        },
      },
    },
  })
);