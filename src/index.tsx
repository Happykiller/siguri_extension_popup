import * as React from 'react';
import { CssBaseline } from '@mui/material';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import '@src/i18n';
import '@src/index.scss';
import Flash from '@component/molecule/flash';
import { Router } from '@component/molecule/router';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

root.render(
  <React.StrictMode>
    <div className='index'>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router />
        <Flash/>
      </ThemeProvider>
    </div>
  </React.StrictMode>
);
