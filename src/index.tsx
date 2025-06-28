// src\index.tsx
/// <reference path="./theme/mui.d.ts" />
import '@fontsource/roboto';
import '@fontsource/montserrat';
import '@fontsource/roboto/400.css';
import '@fontsource/montserrat/600.css';

import React, { useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';

import initI18n from '@src/i18n';
import { getTheme } from '@src/theme';
import { cookieStore } from '@src/stores/cookieStore';
import { Router } from '@components/molecules/Router';
import { chestsSecretStore } from '@src/stores/chestSecretStore';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

const AppWrapper = () => {
  const { loadFromStorage } = chestsSecretStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  const hydrated = cookieStore((s:any) => s.hydrated);
  

  if (!hydrated) return <div>Loading...</div>;

  return (
    <ThemeProvider theme={getTheme('dark')}>
      <CssBaseline />
      <Router />
    </ThemeProvider>
  );
};

cookieStore.getState().hydrate().then(() => {
  initI18n().then(() => {
    root.render(
      <React.StrictMode>
        <AppWrapper />
      </React.StrictMode>
    );
  });
});