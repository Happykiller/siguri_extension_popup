// src\components\vues\Login.tsx
import * as React from 'react';
import { Send } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

const Login: React.FC = () => {
  const handleClick = () => {
    window.open('https://siguri.happykiller.net/', '_blank');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        variant="contained"
        startIcon={<Send />}
        onClick={handleClick}
      >
        Ouvrir le site
      </Button>
    </Box>
  );
};

export default Login;
