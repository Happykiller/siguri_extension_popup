// src\components\molecules\TokenTotp.tsx
import { authenticator } from 'otplib';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessTime, ContentCopy } from '@mui/icons-material';
import { Box, Grid2 as Grid, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';

import { useSecureCopy } from '@components/hooks/useSecureCopy';

export const TokenTotp = ({ secret, compact = false }: {
  secret: string;
  compact?: boolean;
}) => {
  const copy = useSecureCopy();
  const { t } = useTranslation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const token = authenticator.generate(secret);
  const seconds = time.getSeconds();
  const remaining = seconds >= 30 ? 60 - seconds : 30 - seconds;
  const progress = (seconds % 30) / 30 * 100;

  const handleCopy = () => {
    copy(token, 'totp.token');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container alignItems="center" spacing={1}>
        {/* Compact view */}
        {compact ? (
          <Grid size={12} display="flex" alignItems="center" gap={1}>
            <AccessTime
              fontSize="small"
              sx={{
                opacity: 0.8,
                transition: 'opacity 0.5s ease',
              }}
            />
            <Typography
              fontSize="0.8rem"
              color="gray"
              sx={{
                opacity: 0.8 + 0.2 * Math.abs(Math.cos(remaining / 30 * Math.PI)), // pulsation
                transition: 'opacity 0.8s ease',
              }}
            >
              {remaining}s
            </Typography>
            <Tooltip title={t('chest.copy.totp.token')}>
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
        ) : (
          <>
            {/* Full token */}
            <Grid size={{ xs: 12, sm: 6 }} display="flex" alignItems="center">
              <Typography noWrap fontWeight={500} fontSize="0.9rem">
                {token}
              </Typography>
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Grid>

            {/* Remaining time */}
            <Grid size={{ xs: 12, sm: 6 }} display="flex" justifyContent="flex-end">
              <Typography fontSize="0.8rem" color="gray">
                {remaining}s
              </Typography>
            </Grid>

            {/* Progress bar */}
            <Grid size={12}>
              <LinearProgress
                variant="determinate"
                value={100 - progress}
                sx={{
                  height: 4,
                  mt: 1,
                  borderRadius: 2,
                  backgroundColor: '#444',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#EA80FC',
                    transition: 'width 1s linear',
                  },
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};