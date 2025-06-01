// src/components/molecules/ThingMaskedPreview.tsx
import LockOutlined from '@mui/icons-material/LockOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';

import { THING_TYPES } from '@src/common/thingTypes';
import { TokenTotp } from '@components/molecules/TokenTotp';
import { useSecureCopy } from '@components/hooks/useSecureCopy';
import { ThingUsecaseModel } from '@usecase/model/thing.usecase.model';

export const ThingMaskedPreview = ({ thing }: { thing: ThingUsecaseModel }) => {
  const theme = useTheme();
  const copy = useSecureCopy();

  if (thing.type === THING_TYPES.CB && thing.cb?.number) {
    return (
      <Tooltip title="Numéro de carte">
        <Box display="flex" alignItems="center" gap={1}>
          <CreditCardOutlined />
          <Typography noWrap>****</Typography>
          <IconButton size="small" onClick={() => copy(thing.cb?.number!, 'cb.number')}>
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Tooltip>
    );
  }

  if (thing.type === THING_TYPES.CREDENTIAL && thing.credential?.password) {
    return (
      <Tooltip title="Mot de passe">
        <Box display="flex" alignItems="center" gap={1}>
          <LockOutlined />
          <Typography noWrap>****</Typography>
          <IconButton size="small" onClick={() => copy(thing.credential!.password!, 'credential.password')}>
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Tooltip>
    );
  }

  if (thing.type === THING_TYPES.CODE && thing.code?.code) {
    return (
      <Tooltip title="Code">
        <Box display="flex" alignItems="center" gap={1}>
          <VpnKeyOutlined />
          <Typography noWrap>****</Typography>
          <IconButton size="small" onClick={() => copy(thing.code?.code!, 'code.code')}>
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Tooltip>
    );
  }

  if (thing.type === THING_TYPES.TOTP && thing.totp?.secret) {
    return <TokenTotp secret={thing.totp.secret} compact />;
  }

  return null;
};
