// src\stores\cookieStore.tsx
import { create } from 'zustand';

import config from '@src/common/config';

export interface CookieState {
  access_token: string | null;
  chests_secret: [] | null;
  code: string | null;
  id: string | null;
  name_first: string | null;
  name_last: string | null;
  themeMode: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
}

export const cookieStore = create<CookieState>()((set) => ({
  access_token: null,
  chests_secret: [],
  code: null,
  id: null,
  name_first: null,
  name_last: null,
  themeMode: null,
  hydrated: false,

  hydrate: async () => {
    try {
      chrome.cookies.get(
        {
          url: config.siguri_url,
          name: config.local_storage_name,
        },
        (cookie) => {
          if (cookie?.value) {
            try {
              const decoded = decodeURIComponent(cookie.value);
              const parsed = JSON.parse(decoded);

              const state = parsed.state ?? {};

              set({
                access_token: state.access_token ?? null,
                chests_secret: state.chests_secret,
                code: state.code,
                id: state.id,
                name_first: state.name_first,
                name_last: state.name_last,
                themeMode: state.themeMode,
                hydrated: true,
              });
            } catch (err) {
            set({ hydrated: true });
            }
          } else {
            set({ hydrated: true });
          }
        }
      );
    } catch (err) {
      console.error('[contextStore] hydrate() failed', err);
    }
  },
}));
