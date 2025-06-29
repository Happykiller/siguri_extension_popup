// src/presentation/molecule/chestSecretAccessForm.tsx
import { Trans } from 'react-i18next';
import React, { useState } from 'react';
import { Key } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Visibility, VisibilityOff, Info as InfoIcon } from '@mui/icons-material';

import { REGEX } from '@src/common/REGEX';
import { Input } from '@happykiller/sunny-ui';
import { chestsSecretStore } from '@stores/chestSecretStore';

interface ChestSecretAccessFormProps {
  chestId: string;
  onSuccess: (secret: string) => void;
}

export const ChestSecretAccessForm = ({ chestId, onSuccess }: ChestSecretAccessFormProps) => {
  const [secret, setSecret] = useState({ value: '', valid: false });
  const { addChest } = chestsSecretStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = {
      id: chestId,
      secret: secret.value,
    };

    addChest(updated);

    onSuccess(secret.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Input
            startIcon={<VpnKeyIcon />}
            label={<Trans>chest.secret</Trans>}
            tooltip={<Trans>REGEX.CHEST_KEY</Trans>}
            regex={REGEX.CHEST_KEY}
            autoComplete="new-password"
            type="password"
            entity={secret}
            onChange={setSecret}
            require
            virgin
            icons={{
              visibility: <Visibility fontSize="small" />,
              visibilityOff: <VisibilityOff fontSize="small" />,
              help: <InfoIcon fontSize="small" />,
            }}
          />
        </Grid>
        <Grid size={12} textAlign="center">
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={!secret.valid}
            startIcon={<Key />}
          >
            <Trans>chest.submit</Trans>
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
