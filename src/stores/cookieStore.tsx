// src\stores\contextStore.tsx
import { create } from 'zustand';

import config from '@src/common/config';

export interface CookieState {
  access_token: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
}

export const cookieStore = create<CookieState>()((set) => ({
  access_token: null,
  hydrated: false,
  chests_secret: [],

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
