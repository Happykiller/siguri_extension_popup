// src\presentation\bank.tsx
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Box,
  Grid2 as Grid,
  Typography,
  useTheme,
} from '@mui/material';

import { CODES } from '@src/common/codes';
import inversify from '@src/common/inversify';
import { routerStore } from '@stores/routerStore';
import { useFlashStore } from '@happykiller/sunny-ui';
import { ChestUsecaseModel } from '@usecase/model/chest.usecase.model';
import { GetChestsUsecaseModel } from '@usecase/getChests/getChests.usecase.model';

export const Bank = () => {
  const theme = useTheme();
  const flash = useFlashStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chests, setChests] = useState<ChestUsecaseModel[]>([]);

  useEffect(() => {
    const fetchChests = async () => {
      try {
        const res: GetChestsUsecaseModel = await inversify.getChestsUsecase.execute();
        if (res.message === CODES.SUCCESS && res.data) {
          setChests(res.data);
        } else {
          flash.open(t(`bank.${res.message}`));
          setError(res.message);
        }
      } catch (err: any) {
        setError(err.message);
        flash.open(t(`bank.${err.message}`));
      } finally {
        setLoading(false);
      }
    };

    fetchChests();
  }, [t, flash]);

  const goTo = (path: string, params: Record<string, string>) => {
    routerStore.setState({
      route: path,
      data: params
    });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ px: 2 }}>
      <Box
        sx={{
          width: '100%',
          p: 1,
        }}
      >
        {/* Liste des coffres */}
        {loading ? (
          <Typography><Trans>common.loading</Trans></Typography>
        ) : error ? (
          <Typography color="error"><Trans>bank.{error}</Trans></Typography>
        ) : chests.length === 0 ? (
          <Typography><Trans>bank.empty</Trans></Typography>
        ) : (
          <>
            {/* Lignes */}
            {chests.map((chest) => (
              <Grid
                container
                key={chest.id}
                sx={{
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  background: 'none',
                  '&:hover': { backgroundColor: 'rgba(90,100,130,0.12)' },
                  cursor: 'pointer'
                }}
                alignItems="center"
                onClick={() => goTo('/chest', {
                  chest_id: chest.id,
                  chest_label: chest.label
                })}
              >
                <Grid size={5}>
                  <Typography noWrap variant="subtitle1" color="text.primary" fontWeight={500}>
                    {chest.label}
                  </Typography>
                </Grid>

                <Grid size={7}>
                  <Typography noWrap variant="body2" color="text.secondary">
                    {chest.description}
                  </Typography>
                </Grid>
              </Grid>
            ))}

          </>
        )}
      </Box>
    </Box>
  );
};
