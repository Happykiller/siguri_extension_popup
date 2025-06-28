// src/presentation/chest.tsx
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Box, Typography, Button, Grid2 as Grid, useTheme
} from '@mui/material';
import { KeyOff } from '@mui/icons-material';
import { ArrowBackIosNew } from '@mui/icons-material';

import { CODES } from '@src/common/codes';
import inversify from '@src/common/inversify';
import { useFlashStore } from '@happykiller/sunny-ui';
import { ThingRow } from '@components/molecules/ThingRow';
import { chestsSecretStore } from '@stores/chestSecretStore';
import { routerStore, RouterStoreModel } from '@stores/routerStore';
import { ThingUsecaseModel } from '@usecase/model/thing.usecase.model';
import { GetThingsUsecaseModel } from '@usecase/getThings/getThings.usecase.model';
import { ChestSecretAccessForm } from '@components/molecules/ChestSecretAccessForm';

export const Chest = () => {
  const flash = useFlashStore();
  const { t } = useTranslation();
  const routeur: RouterStoreModel = routerStore();
  const { openRowId, setOpenRowId } = routerStore();
  const chest_id = routeur.data.chest_id;
  const chest_label = routeur.data.chest_label;
  const { chests, addChest, removeChest } = chestsSecretStore();
  const secret = chests?.find(c => c.id === chest_id)?.secret ?? '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [things, setThings] = useState<ThingUsecaseModel[] | null>(null);

  const fetchThings = async () => {
    if (!secret) return;

    setLoading(true);
    try {
      const res: GetThingsUsecaseModel = await inversify.getThingsUsecase.execute({
        chest_id, chest_secret: secret
      });
      if (res.message === CODES.SUCCESS && res.data) {
        setThings(res.data);
      } else {
        setError(res.message);
        flash.open(t(`chest.${res.message}`));
      }
    } catch (err: any) {
      setError(err.message);
      flash.open(t(`chest.${err.message}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (secret) fetchThings();
  }, [secret]);

  const handleSecretSet = (value: string) => {
    addChest({ id: chest_id, secret: value });
    fetchThings();
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ px: 2 }}>
      <Box
        sx={{
          width: '100%',
          p: 1,
        }}
      >

        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Grid display="flex" alignItems="center">
            <Button
              onClick={() => routerStore.setState({ route: '/bank' })}
              color="primary"
              startIcon={<ArrowBackIosNew />}
              sx={{ mr: 1, minWidth: 0, padding: '6px' }}
            >
              {/* Icône seule, pas besoin de texte */}
            </Button>
            <Typography color="primary.light" variant="h5" fontWeight={700}>
              {chest_label}
            </Typography>
          </Grid>

          {secret && (
            <Grid>
              <Button
                size="small"
                color="warning"
                startIcon={<KeyOff />}
                onClick={() => {
                  removeChest(chest_id);
                  routerStore.setState({
                    route: '/bank',
                    openRowId: null
                  });
                }}
              >
                <Trans>chest.keyoff</Trans>
              </Button>
            </Grid>
          )}
        </Grid>

        {!secret ? (
          <ChestSecretAccessForm chestId={chest_id} onSuccess={handleSecretSet} />
        ) : error ? (
          <Typography color="error"><Trans>chest.{error}</Trans></Typography>
        ) : loading || !things ? (
          <Typography><Trans>common.loading</Trans></Typography>
        ) : (
          <>
            {/* Lignes */}
            {things.map(thing => (
              <ThingRow
                key={thing.id}
                thing={thing}
                isOpen={openRowId === thing.id}
                onToggle={() => setOpenRowId(openRowId === thing.id ? null : thing.id)}
              />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};
