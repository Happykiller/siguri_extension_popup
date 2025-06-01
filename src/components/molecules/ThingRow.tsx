// src\presentation\molecule\thingRow.tsx
import NotesIcon from '@mui/icons-material/Notes';
import PasswordIcon from '@mui/icons-material/Password';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { Grid2 as Grid, Tooltip, Typography, useTheme } from '@mui/material';

import { THING_TYPES } from '@src/common/thingTypes';
import { ThingUsecaseModel } from '@usecase/model/thing.usecase.model';
import { ThingRowDetails } from '@components/molecules/ThingRowDetails';
import { ThingMaskedPreview } from '@components/molecules/ThingMaskedPreview';

export const ThingRow = ({ thing, isOpen, onToggle }: {
  thing: ThingUsecaseModel,
  isOpen: boolean,
  onToggle: () => void
}) => {
  const theme = useTheme();

  return (<>
    <Grid container
      sx={{
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        background: 'none',
        '&:hover': { backgroundColor: 'rgba(90,100,130,0.12)' },
        cursor: 'pointer'
      }}
      alignItems="center"
      onClick={() => onToggle()}
    >
      <Grid size={4} display="flex" alignItems="center" gap={1}>
        {thing.type === THING_TYPES.CB && <Tooltip title="Carte de paiement"><CreditCardIcon fontSize="small" /></Tooltip>}
        {thing.type === THING_TYPES.CODE && <Tooltip title="Code"><KeyboardIcon fontSize="small" /></Tooltip>}
        {thing.type === THING_TYPES.NOTE && <Tooltip title="Note"><NotesIcon fontSize="small" /></Tooltip>}
        {thing.type === THING_TYPES.CREDENTIAL && <Tooltip title="Identifiant"><PasswordIcon fontSize="small" /></Tooltip>}
        {thing.type === THING_TYPES.TOTP && <Tooltip title="TOTP"><HourglassTopIcon fontSize="small" /></Tooltip>}
        <Typography noWrap fontWeight={500}>{thing.label}</Typography>
      </Grid>
      <Grid size={5}>
        <Typography noWrap fontSize="0.875rem">{thing.description}</Typography>
      </Grid>
      <Grid size={3} display="flex" alignItems="center">
        <ThingMaskedPreview thing={thing} />
      </Grid>
    </Grid>

    {isOpen && (
      <Grid
        container
        sx={{
          borderRadius: 2,
          backgroundColor: `${theme.palette.primary.main}11`, // très léger voile
          border: `1px solid ${theme.palette.primary.main}33`, // bord doux
        }}
      >
        <ThingRowDetails thing={thing} />
      </Grid>
    )}
  </>
  );
};