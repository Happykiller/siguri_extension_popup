import * as React from 'react';
import { authenticator  } from 'otplib';
import { Key } from '@mui/icons-material';
import NotesIcon from '@mui/icons-material/Notes';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import { Trans, useTranslation } from 'react-i18next';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PasswordIcon from '@mui/icons-material/Password';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, Grid, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';

import '@component/chest.scss';
import '@component/common.scss';
import Bar from '@component/molecule/bar';
import { CODES } from '@src/common/codes';
import { REGEX } from '@src/common/REGEX';
import inversify from '@src/common/inversify';
import { Footer } from '@component/molecule/footer';
import { THING_TYPES } from '@src/common/thingTypes';
import { FlashStore, flashStore} from '@component/molecule/flash';
import { ThingUsecaseModel } from '@usecase/model/thing.usecase.model';
import { RouterStoreModel, routerStore } from '@component/store/routerStore';
import { ContextStoreModel, contextStore } from '@component/store/contextStore';
import { GetThingsUsecaseModel } from '@usecase/getThings/getThings.usecase.model';
import { Input } from './molecule/input';

export const Chest = () => {
  const { t } = useTranslation();
  const flash:FlashStore = flashStore();
  const routeur:RouterStoreModel = routerStore();
  const context:ContextStoreModel = contextStore();
  const [time, setTime] = React.useState(new Date());
  const [things, setThings] = React.useState<ThingUsecaseModel[]>(null);
  const se = context.chests_secret?.find((elt) => elt.id === routeur.data.chest_id)?.secret ?? '';
  const [secretForm, setSecretForm] = React.useState({
    value: se,
    valid: false
  });
  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSetSecret = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if(!context.chests_secret) {
      context.chests_secret = [{
        id: routeur.data.chest_id,
        secret: secretForm.value
      }];
    } else {
      context.chests_secret.push({
        id: routeur.data.chest_id,
        secret: secretForm.value
      });
    }
    contextStore.setState({ 
      chests_secret: context.chests_secret
    });
  }

  const keyOff = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const index = context.chests_secret.findIndex((elt) => elt.id === routeur.data.chest_id);
    if (index > -1) {
      context.chests_secret.splice(index, 1);
    }
    contextStore.setState({ 
      chests_secret: context.chests_secret
    });
    routeur.navigateTo('/');
  }

  const copy = (dto: { value: string, type: string}) => {
    navigator.clipboard.writeText(dto.value);
    flash.open(t(`chest.copy.${dto.type}`));
  }

  const TokenTotp = (props: { secret: string }) => {
    const { secret } = props;
    const token = authenticator.generate(secret);
    const left = (time.getSeconds() > 30)?60-time.getSeconds():30-time.getSeconds();
    return (
      <>
        <Typography noWrap>{token}</Typography>
        <IconButton
          aria-label="copier"
          size="small"
          onClick={(e) => {
            e.preventDefault();
            copy({
              value: token,
              type: 'totp.token'
            })
          }}
        >
          <ContentCopyIcon />
        </IconButton>
        {left}s
      </>
    )
  }

  const RowChild = (props: { thing: ThingUsecaseModel }) => {
    const { thing } = props;

    if (thing.type === 'CREDENTIAL') {
      return (
        <Grid 
          container
        >
          <Grid 
            xs={6}
            item
            display={(thing.credential.id) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.credential.id`)+thing.credential.id}
          >
            <Typography noWrap>{thing.credential.id}</Typography>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.credential.id,
                  type: 'credential.id'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={6}
            item
            display={(thing.credential.password) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.credential.password`)+thing.credential.password}
          >
            <Typography noWrap>{thing.credential.password}</Typography>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.credential.password,
                  type: 'credential.password'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={12}
            item
            display={(thing.credential.address) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.credential.address`)+thing.credential.address}
          >
            <Typography noWrap>{thing.credential.address}</Typography>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.credential.address,
                  type: 'credential.address'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                window.open(thing.credential.address, '_blank').focus();
              }}
            >
              <OpenInNewIcon />
            </IconButton>
          </Grid>

        </Grid>
      )
    } else if (thing.type === 'CB') {
      return (
        <Grid 
          container
        >
          <Grid 
            xs={6}
            item
            display={(thing.cb.number) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.cb.number`)+thing.cb.number}
          >
            <Typography noWrap>{thing.cb.number}</Typography>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.cb.number,
                  type: 'cb.number'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={3}
            item
            display={(thing.cb.expiration_date) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.cb.expiration_date`)+thing.cb.expiration_date}
          >
            <Typography noWrap>{thing.cb.expiration_date}</Typography>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.cb.expiration_date,
                  type: 'cb.expiration_date'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={3}
            item
            display={(thing.cb.crypto) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.cb.crypto`)+thing.cb.crypto}
          >
            <Typography noWrap>{thing.cb.crypto}</Typography>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.cb.crypto,
                  type: 'cb.crypto'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={9}
            item
            display={(thing.cb.label) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.cb.label`)+thing.cb.label}
          >
            <Typography noWrap>{thing.cb.label}</Typography>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.cb.label,
                  type: 'cb.label'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

          <Grid 
            xs={3}
            item
            display={(thing.cb.code) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.cb.code`)+thing.cb.code}
          >
            <Typography noWrap>{thing.cb.code}</Typography>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.cb.code,
                  type: 'cb.code'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>

        </Grid>
      )
    } else if (thing.type === 'CODE') {
      return (
        <Grid 
          container
        >
          <Grid 
            xs={12}
            item
            display={(thing.code.code) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.code.code`)+thing.code.code}
          >
            <Typography noWrap>{thing.code.code}</Typography>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.code.code,
                  type: 'code.code'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>
        </Grid>
      )
    } else if (thing.type === THING_TYPES.TOTP) {
      return (
        <Grid 
          container
        >
          <Grid 
            xs={6}
            item
            display={(thing.totp.secret) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.totp.secret`)+thing.totp.secret}
          >
            <Typography noWrap>{thing.totp.secret}</Typography>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.totp.secret,
                  type: 'totp.secret'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>
          <Grid 
            xs={6}
            item
            display={(thing.totp.secret) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.totp.token`)}
          >
            <TokenTotp
              secret={thing.totp.secret}
            />
          </Grid>
        </Grid>
      )
    } else if (thing.type === 'NOTE') {
      return (
        <Grid 
          container
        >
          <Grid 
            xs={12}
            item
            display={(thing.note.note) ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            title={t(`chest.note.note`)+thing.note.note}
          >
            <Typography 
              sx={{
                'white-space': 'pre-wrap'
              }}
            >{thing.note.note}</Typography>
            <IconButton
              aria-label="copier"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                copy({
                  value: thing.note.note,
                  type: 'note.note'
                })
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>
        </Grid>
      )
    } else {
      return (
        <p>Type inconnu</p>
      )
    }
  }

  const Row = (props: { thing: ThingUsecaseModel }) => {
    const { thing } = props;

    return (
      <Grid
        container
        sx={{
          backgroundColor: '#3C4042',
          marginBottom:'1px',
          "&:hover": {
            backgroundColor: "#606368"
          }
        }}
      >
        <Grid 
          xs={5}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={thing.label}
        >
          {(thing.type === THING_TYPES.CB)?<Tooltip title='Carte de payement' ><CreditCardIcon/></Tooltip>:''}
          {(thing.type === THING_TYPES.CODE)?<KeyboardIcon />:''}
          {(thing.type === THING_TYPES.NOTE)?<NotesIcon />:''}
          {(thing.type === THING_TYPES.CREDENTIAL)?<PasswordIcon />:''}
          {(thing.type === THING_TYPES.TOTP)?<HourglassTopIcon />:''}
          &nbsp;
          <Typography noWrap>{thing.label}</Typography>
        </Grid>
        <Grid 
          xs={6}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={thing.description}
        >
          <Typography noWrap>{thing.description}</Typography>
        </Grid>
        <Grid 
          xs={1}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              if (routeur.data?.thing_id === thing.id) {
                routerStore.setState({ 
                  route: routeur.route,
                  data: {
                    ... routeur.data,
                    thing_id: null
                  }
                });
              } else {
                routerStore.setState({ 
                  route: routeur.route,
                  data: {
                    ... routeur.data,
                    thing_id: thing.id 
                  }
                });
              }
            }}
          >
            {(routeur.data?.thing_id === thing.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Grid>
        <Grid 
          xs={12}
          item
          display={(routeur.data?.thing_id !== thing.id) ? "none" : "flex"}
        >
          <RowChild thing={thing} />
        </Grid>
      </Grid>
    )
  }

  let content = <div></div>;

  if(qry.loading) {
    content = <div><Trans>common.loading</Trans></div>;
  } else if (!se) {
    content = <form
      onSubmit = {handleSetSecret}
    ><Grid 
      container
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      {/* Field secret */}
      <Grid 
        xs={12}
        item
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Input
          label={<Trans>chest.secret</Trans>}
          tooltip={<Trans>REGEX.CHEST_KEY</Trans>}
          regex={REGEX.CHEST_KEY}
          type="password"
          entity={secretForm}
          onChange={(entity:any) => { 
            setSecretForm({
              value: entity.value,
              valid: entity.valid
            });
          }}
          require
          virgin
        />
      </Grid>

      {/* Button submit */}
      <Grid 
        xs={12}
        item
        textAlign='center'
      >
        <Button 
          sx={{
            m: 1,
          }}
          type="submit"
          variant="contained"
          size="small"
          startIcon={<Key />}
          disabled={!secretForm.valid}
        ><Trans>chest.submit</Trans></Button>
      </Grid>

    </Grid></form>;
  } else if(qry.error) {
    content = <Grid 
      container
      rowSpacing={1}
    >
      <Grid 
        container
        direction="row"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Trans>chest.{qry.error}</Trans>
      </Grid>
      <Grid 
        container
        direction="row" 
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button 
          sx={{
            m: 1
          }}
          type="submit"
          variant="contained"
          size="small"
          startIcon={<KeyOffIcon />}
          onClick={keyOff}
        ><Trans>chest.keyoff</Trans></Button>
      </Grid>
    </Grid>
  } else if (!things) {
      setQry(qry => ({
        ...qry,
        loading: true
      }));
      inversify.getThingsUsecase.execute({
        chest_id: routeur.data.chest_id,
        chest_secret: se
      })
        .then((response:GetThingsUsecaseModel) => {
          if(response.message === CODES.SUCCESS) {
            setThings(response.data);
          } else {
            inversify.loggerService.debug(response.error);
            setQry(qry => ({
              ...qry,
              error: response.message
            }));
          }
        })
        .catch((error:any) => {
          setQry(qry => ({
            ...qry,
            error: error.message
          }));
        })
        .finally(() => {
          setQry(qry => ({
            ...qry,
            loading: false
          }));
        });
  } else {
      content = <Grid 
        container
        sx={{
          minWidth: "350px"
        }}
      >
        <Grid 
          container
          direction="row" 
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button 
            sx={{
              m: 1
            }}
            variant="contained"
            size="small"
            color='warning'
            startIcon={<KeyOffIcon />}
            onClick={keyOff}
          ><Trans>chest.keyoff</Trans></Button>
        </Grid>

        {/* Table */}
        <Grid
          container
        >
          <Grid
            container
            sx={{
              color: "#000000",
              fontWeight: "bold",
              backgroundColor: "#EA80FC",
              borderRadius: "5px 5px 0px 0px",
              fontSize: "0.875rem"
            }}
          >
            <Grid 
              xs={5}
              item
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Trans>home.label</Trans>
            </Grid>
            <Grid 
              xs={6}
              item
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Trans>home.description</Trans>
            </Grid>
            <Grid
              xs={1}
              item>
            </Grid>
          </Grid>

          {things?.map((thing) => (
            <Row key={thing.id} thing={thing} />
          ))}

        </Grid>
      </Grid>;
  }

  return (
    <div>
      <Bar/>
      <div className="app">
        <div className='chestLabel'>
          {routeur.data.chest_label}
        </div>
        {content}
      </div>
      <Footer />
    </div>
  )
};

