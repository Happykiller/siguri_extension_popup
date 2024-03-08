import * as React from 'react';
import { Trans } from 'react-i18next';
import { Done } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, InputAdornment, TextField } from '@mui/material';

import '@component/login.scss';
import { Footer } from '@component/footer';
import inversify from '@src/common/inversify';
import { routerStore } from '@component/routerStore';
import { contextStore } from '@component/contextStore';
import { AuthUsecaseModel } from '@usecase/auth/model/auth.usecase.model';

export const Login = () => {
  const routeur = routerStore();
  const [currentMsg, setCurrentMsg] = React.useState('');
  const [currentLogin, setCurrentLogin] = React.useState('');
  const [passVisible, setPassVisible] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');

  let errorMessage = <div></div>;
  if(currentMsg) {
    errorMessage = <div><Trans>login.error</Trans><Trans>{currentMsg}</Trans></div>
  }

  const handleClick = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const response:AuthUsecaseModel = await inversify.authUsecase.execute({
      login: currentLogin,
      password: currentPassword
    });
    if (response.data) {
      contextStore.setState({ 
        id: response.data.id,
        code: response.data.code,
        access_token: response.data.access_token,
        name_first: response.data.name_first,
        name_last: response.data.name_last,
      });
      routeur.navigateTo('/');
    } else {
      setCurrentMsg(response.message);
    }
  }

  return (
    <div className="login">
      <div className='title'>
        <Trans>login.title</Trans>
      </div>
      <div>
        <form
          onSubmit={handleClick}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{ 
              flexDirection: 'column',
              gap: '10px;'
            }}
          >
            {/* Field Login */}
            <TextField
              sx={{ marginRight:1}}
              label={<Trans>login.login</Trans>}
              variant="standard"
              size="small"
              onChange={(e) => { 
                e.preventDefault();
                setCurrentLogin(e.target.value);
              }}
            />

            {/* Field Password */}
            <TextField
              sx={{ marginRight:1}}
              label={<Trans>login.password</Trans>}
              variant="standard"
              size="small"
              type={(passVisible)?'text':'password'}
              onChange={(e) => { 
                e.preventDefault();
                setCurrentPassword(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment 
                    position="end"
                    onClick={(e) => { 
                      e.preventDefault();
                      setPassVisible(!passVisible);
                    }}
                  >
                    {(passVisible?<VisibilityOffIcon/>:<VisibilityIcon />)}
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit button */}
            <Button 
              type="submit"
              variant="contained"
              size="small"
              startIcon={<Done />}
              disabled={!(currentLogin.length > 3 && currentPassword.length > 3)}
            ><Trans>common.done</Trans></Button>
            {errorMessage}
          </Box>
        </form>
      </div>
      <Footer />
    </div>
  )
};
