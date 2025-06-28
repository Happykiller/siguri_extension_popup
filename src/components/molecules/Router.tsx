// src\component\molecule\router.tsx
import * as React from 'react';
import { Trans } from 'react-i18next';

import Login from '@vues/Login';
import { Password } from '@vues/password';

import { Bank } from '@vues/Bank';
import { Chest } from '@vues/Chest';
import { CODES } from '@src/common/codes';
import inversify from '@src/common/inversify';
import { routerStore } from '@stores/routerStore';
import { cookieStore } from '@src/stores/cookieStore';
import { LayoutExt } from '@components/layout/LayoutExt';

export const Router: React.FC = () => {
  const routeur = routerStore();
  const cookie = cookieStore();

  const [state, setState] = React.useState<{
    loading: boolean;
    error: string | null;
    validated: boolean;
  }>(() => {
    return {
      loading: true,
      error: null,
      validated: false,
    };
  });

  React.useEffect(() => {
    const hasToken = Boolean(cookie.access_token);
    if (!hasToken) {
      setState({ loading: false, error: null, validated: false });
      return;
    }

    let cancelled = false;

    const checkSession = async () => {
      try {
        const response = await inversify.sessionInfoUsecase.execute();
        if (cancelled) {
          return;
        }


        if (response.message !== CODES.SUCCESS) {
          throw new Error('Invalid session');
        }

        setState({ loading: false, error: null, validated: true });
      } catch (error: any) {
        if (cancelled) return;
        setState({
          loading: false,
          error: error.message || 'Unknown error',
          validated: false,
        });
      }
    };

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [cookie.access_token]);

  if (state.loading) {
    return <div><Trans>common.loading</Trans></div>;
  }

  if (!state.validated) {
    return <Login />;
  }

  switch (routeur.route) {
    case '/':
    case '/bank':
      return <LayoutExt><Bank /></LayoutExt>;
    case '/chest':
      return <LayoutExt><Chest /></LayoutExt>;
    case '/password':
      return <LayoutExt><Password /></LayoutExt>;
    default:
      return <LayoutExt><Bank /></LayoutExt>;
  }
};
