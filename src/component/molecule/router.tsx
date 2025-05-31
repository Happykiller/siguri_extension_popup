import * as React from 'react';
import { Trans } from 'react-i18next';

import Login from '@vues/Login';
import { Home } from '@component/home';
import { Chest } from '@component/chest';
import { Password } from '@component/password';

import { routerStore } from '@component/store/routerStore';
import { contextStore } from '@component/store/contextStore';
import inversify from '@src/common/inversify';
import { CODES } from '@src/common/codes';

export const Router: React.FC = () => {
  const routeur = routerStore();
  const context = contextStore();

  const [state, setState] = React.useState<{
    loading: boolean;
    error: string | null;
    validated: boolean;
  }>(() => {
    console.log('[Router] Initializing state...');
    return {
      loading: true,
      error: null,
      validated: false,
    };
  });

  React.useEffect(() => {
    console.log('[Router] useEffect triggered');
    const hasToken = Boolean(context.access_token);
    console.log(`[Router] Has token? ${hasToken}`, context.access_token);

    if (!hasToken) {
      console.warn('[Router] No token → skipping session check.');
      setState({ loading: false, error: null, validated: false });
      return;
    }

    let cancelled = false;

    const checkSession = async () => {
      console.log('[Router] Checking session via inversify.sessionInfo');
      try {
        const response = await inversify.sessionInfoUsecase.execute();
        if (cancelled) {
          console.warn('[Router] Cancelled, aborting session check.');
          return;
        }

        console.log('[Router] SessionInfo response:', response);

        if (response.message !== CODES.SUCCESS) {
          console.error('[Router] Session invalid:', response.message);
          throw new Error('Invalid session');
        }

        setState({ loading: false, error: null, validated: true });
        console.log('[Router] Session validated');
      } catch (error: any) {
        if (cancelled) return;
        console.error('[Router] Session check failed:', error);
        setState({
          loading: false,
          error: error.message || 'Unknown error',
          validated: false,
        });
      }
    };

    checkSession();

    return () => {
      console.log('[Router] Cleaning up (cancelled = true)');
      cancelled = true;
    };
  }, [context.access_token, context.id]);

  // === Affichage conditionnel ===
  if (state.loading) {
    console.log('[Router] Still loading...');
    return <div><Trans>common.loading</Trans></div>;
  }

  if (!state.validated) {
    console.warn('[Router] Invalid session → Login shown');
    return <Login />;
  }

  console.log(`[Router] Routing to: ${routeur.route}`);

  switch (routeur.route) {
    case '/':
    case '/home':
      console.log('[Router] Displaying Home');
      return <Home />;
    case '/chest':
      console.log('[Router] Displaying Chest');
      return <Chest />;
    case '/password':
      console.log('[Router] Displaying Password');
      return <Password />;
    default:
      console.warn('[Router] Unknown route, fallback to Home');
      return <Home />;
  }
};
