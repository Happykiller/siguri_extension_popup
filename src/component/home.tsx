import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import ShareIcon from '@mui/icons-material/Share';
import GroupIcon from '@mui/icons-material/Group';
import { Trans, useTranslation } from 'react-i18next';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { Button, Divider, Grid, IconButton, InputBase, Paper, TextField, Tooltip, Typography } from '@mui/material';

import '@component/common.scss';
import Bar from '@component/bar';
import { CODES } from '@src/common/codes';
import { Footer } from '@component/footer';
import inversify from '@src/common/inversify';
import { RouterStoreModel, routerStore } from '@component/routerStore';
import { ChestUsecaseModel } from '@usecase/model/chest.usecase.model';
import { ContextStoreModel, contextStore } from '@component/contextStore';
import { GetChestsUsecaseModel } from '@usecase/getChests/getChests.usecase.model';

export const Home = () => {
  const routeur:RouterStoreModel = routerStore();
  const { t } = useTranslation();
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
          backgroundColor: "#BB86FC",
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
          Label
        </Grid>
        <Grid 
          xs={1}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          Auteur
        </Grid>
        <Grid
          item
          xs={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          Description
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
            backgroundColor: '#1A2027'
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
            xs={1}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
            title={chest.author.code}
          >
            <Typography noWrap>{chest.author.code}</Typography>
          </Grid>
          <Grid 
            item
            xs={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
            title={chest.description}
          >
            <Typography noWrap>{chest.description}</Typography>
          </Grid>
          <Grid
            xs={2}
            sx={{
              paddingRight: '15px'
            }}
            item
            display="flex"
            justifyContent="center"
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
