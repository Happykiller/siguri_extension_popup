// src\components\molecules\thingRowDetails.tsx
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import PinOutlined from '@mui/icons-material/PinOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import PersonOutline from '@mui/icons-material/PersonOutline';
import EventOutlined from '@mui/icons-material/EventOutlined';
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined';
import SecurityOutlined from '@mui/icons-material/SecurityOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import TextFieldsOutlined from '@mui/icons-material/TextFieldsOutlined';
import StickyNote2Outlined from '@mui/icons-material/StickyNote2Outlined';
import AlternateEmailOutlined from '@mui/icons-material/AlternateEmailOutlined';
import { Box, Grid2 as Grid, IconButton, Tooltip, Typography } from '@mui/material';

import { THING_TYPES } from '@src/common/thingTypes';
import { TokenTotp } from '@components/molecules/TokenTotp';
import { useSecureCopy } from '@components/hooks/useSecureCopy';
import { ThingUsecaseModel } from '@usecase/model/thing.usecase.model';

const getFieldIcon = (label: string) => {
  const iconMap: Record<string, JSX.Element> = {
    'credential.id': <PersonOutline fontSize="small" />,
    'credential.password': <LockOutlined fontSize="small" />,
    'credential.address': <AlternateEmailOutlined fontSize="small" />,
    'cb.number': <CreditCardOutlined fontSize="small" />,
    'cb.expiration_date': <EventOutlined fontSize="small" />,
    'cb.crypto': <SecurityOutlined fontSize="small" />,
    'cb.label': <TextFieldsOutlined fontSize="small" />,
    'cb.code': <PinOutlined fontSize="small" />,
    'note.note': <StickyNote2Outlined fontSize="small" />,
    'code.code': <VpnKeyOutlined fontSize="small" />,
    'totp.secret': <AccessTimeOutlined fontSize="small" />,
  };

  return iconMap[label] || null;
};

const getFieldTooltip = (label: string) => {
  const { t } = useTranslation();
  return t(`chest.${label}`);
};

export const ThingRowDetails = ({ thing }: {
  thing: ThingUsecaseModel
}) => {
  const copy = useSecureCopy();

  const renderField = (
    label: string,
    value?: string,
    openLink?: boolean
  ) => value ? (
    <Grid
      size={{ xs: 12, sm: 6, md: 4 }}
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        py: 0.5,
        px: 1,
        wordBreak: 'break-word',
      }}
    >
      {/* Icon + Tooltip */}
      {getFieldIcon(label) && (
        <Tooltip title={getFieldTooltip(label)}>
          <Box display="flex" alignItems="center">
            {getFieldIcon(label)}
          </Box>
        </Tooltip>
      )}

      {/* Copy */}
      <IconButton size="small" onClick={() => {
        copy(value, label);
      }}>
        <ContentCopy fontSize="small" />
      </IconButton>

      {/* Text */}
      <Typography noWrap fontSize="0.9rem" flex={1} title={label}>
        {value}
      </Typography>

      {/* Optional link */}
      {openLink && (
        <IconButton size="small" onClick={() => window.open(value, '_blank')}>
          <OpenInNew fontSize="small" />
        </IconButton>
      )}
    </Grid>
  ) : null;

  if (thing.type === THING_TYPES.CREDENTIAL && thing.credential) {
    return (
      <Grid container spacing={1} sx={{ p: 1 }} size={12}>
        {renderField('credential.id', thing.credential.id)}
        {renderField('credential.password', thing.credential.password)}
        {renderField('credential.address', thing.credential.address, true)}
      </Grid>
    );
  }

  if (thing.type === THING_TYPES.TOTP && thing.totp) {
    return (
      <Grid container spacing={1} sx={{ p: 1 }} size={12}>
        <Grid size={6}>
          {renderField('totp.secret', thing.totp.secret)}
        </Grid>
        <Grid size={6}>
          <TokenTotp secret={thing.totp.secret} />
        </Grid>
      </Grid>
    );
  }

  if (thing.type === THING_TYPES.NOTE && thing.note) {
    return renderField('note.note', thing.note.note);
  }

  if (thing.type === THING_TYPES.CODE && thing.code) {
    return renderField('code.code', thing.code.code);
  }

  if (thing.type === THING_TYPES.CB && thing.cb) {
    const { number, expiration_date, crypto, label, code } = thing.cb;
    return (
      <Grid container size={12}>
        {renderField('cb.number', number)}
        {renderField('cb.expiration_date', expiration_date)}
        {renderField('cb.crypto', crypto)}
        {renderField('cb.label', label)}
        {renderField('cb.code', code)}
      </Grid>
    );
  }

  return <Typography>Type inconnu</Typography>;
};