// src\components\Layout\Footer.tsx
import { Trans } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Link,
  useTheme,
  Tooltip,
} from '@mui/material';
import { Map, Language, Cloud, Email, BugReport } from '@mui/icons-material';

import config from '@src/common/config';
import inversify from '@src/common/inversify';

export function Footer() {
  const [backVersion, setBackVersion] = useState<string>('common.loading');
  const theme = useTheme();

  useEffect(() => {
    let isMounted = true;
    if (!inversify.systemInfoUsecase) {
      setBackVersion('N/A');
      return;
    }

    inversify.systemInfoUsecase.execute()
      .then((response: any) => {
        if (!isMounted) return;
        if (response.message === 'SUCCESS' && response.data) {
          setBackVersion(response.data.version);
        } else {
          setBackVersion('N/A');
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setBackVersion('N/A');
      });

    return () => { isMounted = false };
  }, [inversify.systemInfoUsecase]);

  const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.light,
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        position: 'relative',
        textAlign: 'center',
        fontSize: { xs: '8px', sm: '12px', md: '14px' },
        py: 0.5,
        px: 2,
        color: theme.palette.text.secondary,
        zIndex: theme.zIndex.appBar - 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="body2" component="span">
        <Link
          component="button"
          onClick={() => window.open(config.siguri_url, '_blank')}
          underline="hover"
          sx={iconStyle}
        >
          Siguri
        </Link>
      </Typography>

      <Tooltip title={<Trans>footer.email</Trans>}>
        <Link href={`mailto:fabrice.rosito@gmail.com`} underline="hover" sx={iconStyle}>
          <Email fontSize="small" />
        </Link>
      </Tooltip>

      <Tooltip title={<Trans>footer.front</Trans>}>
        <Typography variant="body2" component="span" sx={iconStyle}>
          <Language fontSize="small" /> {config.version}
        </Typography>
      </Tooltip>

      <Tooltip title={<Trans>footer.back</Trans>}>
        <Typography variant="body2" component="span" sx={iconStyle}>
          <Cloud fontSize="small" /> {backVersion}
        </Typography>
      </Tooltip>

      <Tooltip title={<Trans>footer.issues</Trans>}>
        <Link href="https://github.com/Happykiller/siguri_extension_popup/issues" target="_blank" rel="noopener noreferrer" underline="hover" sx={iconStyle}>
          <BugReport fontSize="small" />
        </Link>
      </Tooltip>

      <Tooltip title={<Trans>footer.roadmap</Trans>}>
        <Link href="https://github.com/users/Happykiller/projects/3/views/1" target="_blank" rel="noopener noreferrer" underline="hover" sx={iconStyle}>
          <Map fontSize="small" />
        </Link>
      </Tooltip>
    </Box>
  );
};
