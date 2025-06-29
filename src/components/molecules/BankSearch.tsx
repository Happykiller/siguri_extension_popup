// src\components\molecules\BankSearch.tsx
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
import { Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import NotesIcon from '@mui/icons-material/Notes';
import PasswordIcon from '@mui/icons-material/Password';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { Box, Card, Grid, Tooltip, Typography } from '@mui/material';

import inversify from '@src/common/inversify';
import { routerStore } from '@stores/routerStore';
import { THING_TYPES } from '@src/common/thingTypes';
import { Input, useFlashStore } from '@happykiller/sunny-ui';
import { useActiveTab } from '@src/composables/useActiveTab';
import SearchThingsUsecaseModel from '@usecase/searchThings/searchThings.usecase.model';

interface ThingSearchResult {
  id: string;
  chest_id: string;
  chest_label: string;
  type: string;
  snippet: string;
}

export const BankSearch = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const flash = useFlashStore();
  const [searchTouched, setSearchTouched] = useState(false);
  const [search, setSearch] = useState({ value: '', valid: false });
  const [results, setResults] = useState<ThingSearchResult[]>([]);
  const [debouncedSearch] = useDebounce(search.value, 300);
  const { domainKeyword } = useActiveTab();

  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setResults([]);
      return;
    }

    inversify.searchThingsUsecase
      .execute({ query: debouncedSearch })
      .then((res: SearchThingsUsecaseModel) => {
        console.log(res)
        if (res.message === 'SUCCESS' && res.data) {
          setResults(res.data);
        } else if (res.message !== 'SUCCESS') {
          flash.open(t(`bank_search.${res.message}`));
        }
      })
      .catch((err: any) => {
        flash.open(t('common.error_occured'));
      });

  }, [debouncedSearch]);

  useEffect(() => {
    if (domainKeyword && !searchTouched && !search.value) {
      setSearch({ value: domainKeyword, valid: true });
    }
  }, [domainKeyword]);

  return (
    <Box mt={4}>
      <Input
        label={t('bank_search.search')}
        tooltip={t('bank_search.tooltip')}
        startIcon={<Search />}
        entity={search}
        onChange={(e) => {
          setSearchTouched(true);
          setSearch(e);
        }}
        require
        virgin
      />

      {search.value.length > 1 && (
        <Box mt={3}>
          {results.length > 0 ? (
            <Grid container spacing={2}>
              {results.map((thing) => (
                <Grid size={6} key={thing.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      p: 1,
                      borderRadius: `${theme.shape.borderRadius}px`,
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: `0 0 16px ${theme.palette.primary.main}66`,
                      border: `1px solid ${theme.palette.primary.main}44`,
                      transition: 'transform 0.2s, background-color 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        backgroundColor: theme.palette.background.default,
                      },
                    }}
                    onClick={() =>
                      routerStore.setState({
                        route: '/chest',
                        data: {
                          chest_id: thing.chest_id,
                          thing_id: thing.id,
                        }
                      })
                    }
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {thing.type === THING_TYPES.CB && (
                        <Tooltip title="Carte de paiement">
                          <CreditCardIcon fontSize="small" color="primary" />
                        </Tooltip>
                      )}
                      {thing.type === THING_TYPES.CODE && (
                        <Tooltip title="Code">
                          <KeyboardIcon fontSize="small" color="primary" />
                        </Tooltip>
                      )}
                      {thing.type === THING_TYPES.NOTE && (
                        <Tooltip title="Note">
                          <NotesIcon fontSize="small" color="primary" />
                        </Tooltip>
                      )}
                      {thing.type === THING_TYPES.CREDENTIAL && (
                        <Tooltip title="Identifiant">
                          <PasswordIcon fontSize="small" color="primary" />
                        </Tooltip>
                      )}
                      {thing.type === THING_TYPES.TOTP && (
                        <Tooltip title="TOTP">
                          <HourglassTopIcon fontSize="small" color="primary" />
                        </Tooltip>
                      )}

                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                        dangerouslySetInnerHTML={{
                          __html: `…${thing.snippet.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}…`,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      fontStyle="italic"
                      color="text.secondary"
                      gutterBottom
                    >
                      {t('bank_search.in_chest')}
                      <strong>{thing.chest_label}</strong>
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

          ) : (
            <Typography variant="body2" mt={2}>
              {t('bank_search.no_results')}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
