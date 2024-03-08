import * as React from 'react';
import { Trans } from 'react-i18next';

import { Chest } from '@component/chest';
import { Login } from '@component/login';
import { CODES } from '@src/common/codes';
import { Home } from '@src/component/home';
import inversify from '@src/common/inversify';
import { routerStore } from '@component/routerStore';
import { ContextStoreModel, contextStore } from '@component/contextStore';

export const Router = () => {
  const routeur = routerStore();
  const context:ContextStoreModel = contextStore();
  const reset = contextStore((state:any) => state.reset);
  const [qry, setQry] = React.useState({
    loading: null,
    data: null,
    error: null
  });

  if (routeur.route !== '/login') {
    if (qry.loading === null) {
      setQry(qry => ({
        ...qry,
        loading: true
      }));
      inversify.sessionInfo.execute()
        .then((response:any) => {
          if(response.message !== CODES.SUCCESS) {
            reset();
            routeur.navigateTo('/login');
          } else if (!context.id) {
            contextStore.setState({ 
              id: response.data.id,
              code: response.data.code,
              access_token: response.data.access_token,
              name_first: response.data.name_first,
              name_last: response.data.name_last,
            });
          }
        })
        .catch((error:any) => {
          reset();
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
    } else if (qry.loading) {
      return <div><Trans>common.loading</Trans></div>;
    } else if (qry.error || !context.id) {
      reset();
      routeur.navigateTo('/login');
    } else if (!qry.loading && !qry.error && context.id) {
      switch (routeur.route) {
        case '/':
        case '/home':
          return <div><Home /></div>
        case '/chest':
          return <div><Chest /></div>
        default:
          return <div><Home /></div>
      }
    }
  } else if (!qry.loading && !qry.error) {
    return <Login />
  }
};
