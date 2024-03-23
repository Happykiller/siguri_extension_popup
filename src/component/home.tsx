import * as React from 'react';
import { Trans } from 'react-i18next';
import LoginIcon from '@mui/icons-material/Login';
import GroupIcon from '@mui/icons-material/Group';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';

import '@component/common.scss';
import Bar from '@component/molecule/bar';
import { CODES } from '@src/common/codes';
import inversify from '@src/common/inversify';
import { Footer } from '@component/molecule/footer';
import { routerStore } from '@component/store/routerStore';
import { ChestUsecaseModel } from '@usecase/model/chest.usecase.model';
import { ContextStoreModel, contextStore } from '@component/store/contextStore';
import { GetChestsUsecaseModel } from '@usecase/getChests/getChests.usecase.model';

export const Home = () => {
  const context:ContextStoreModel = contextStore();
  const [chests, setChest] = React.useState<ChestUsecaseModel[]>(null);
  const [qry, setQry] = React.useState({
    loading: true,
    data: null,
    error: null
  });

  if(chests === null) {
    setChest([]);
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.getChestsUsecase.execute()
      .then((response:GetChestsUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          setChest(response.data);
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
  }
  
  const joinChest = (dto:{
    chest_id: string,
    label: string
  }) => {
    routerStore.setState({ 
      route: '/chest',
      data: {
        chest_id: dto.chest_id,
        chest_label: dto.label
      }
    });
  }

  let content = <div></div>;
  if(qry.loading) {
    content = <div><Trans>common.loading</Trans></div>;
  } else {
    content = <div>
    {/* Table */}
    <Grid
      container
      sx={{
        minWidth: "350px"
      }}
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
          xs={3}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Trans>home.label</Trans>
        </Grid>
        <Grid
          item
          xs={7}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Trans>home.description</Trans>
        </Grid>
        <Grid
          item
          xs={2}
        >
        </Grid>
      </Grid>
      
      {chests?.map((chest) => {
        return (
        <Grid
          key={chest.id}
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
            xs={3}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
            title={chest.label}
          >
            <Typography noWrap>{chest.label}</Typography>
          </Grid>
          <Grid 
            item
            xs={7}
            display="flex"
            justifyContent="center"
            alignItems="center"
            title={chest.description}
          >
            <Typography noWrap>{chest.description}</Typography>
          </Grid>
          <Grid
            xs={2}
            item
            display="flex"
            justifyContent="right"
            alignItems="center"
          >
            {/* Other user ? */}
            {
              (chest.members.filter((member) => member.user_id !== context.id).length > 0)?
                <Tooltip title={
                  <>
                    {chest.members.filter((member) => member.user_id !== context.id).map((member) => {
                      return <li key={member.user_id}>{member.user.code}</li>
                    })}
                  </>
                }>
                  <IconButton>
                    <GroupIcon />
                  </IconButton>
                </Tooltip>
              :''
            }

            {/* Enter  */}
            <IconButton 
              title="Entrer dans le coffre"
              onClick={(e) => {
              e.preventDefault();
              joinChest({
                chest_id: chest.id,
                label: chest.label
              })
            }}>
              <LoginIcon />
            </IconButton>
          </Grid>
        </Grid>
      )})}

    </Grid>
  </div>
  }

  return (
    <div>
      <Bar/>
      <div className="app">
        <div>
          {content}
        </div>
      </div>
      <Footer />
    </div>
  )
};

