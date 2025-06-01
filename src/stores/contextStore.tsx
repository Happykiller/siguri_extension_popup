// src\stores\contextStore.tsx
import { create } from 'zustand';

import config from '@src/common/config';

export interface ContextState {
  access_token: string | null;
  id: string | null;
  name_first: string | null;
  name_last: string | null;
  chests_secret: {
    id: string
    secret: string
  }[];
  code: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
}

export const contextStore = create<ContextState>()((set) => ({
  access_token: null,
  id: null,
  name_first: null,
  name_last: null,
  code: null,
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
                id: state.id ?? null,
                code: state.code ?? null,
                name_first: state.name_first ?? null,
                name_last: state.name_last ?? null,
                chests_secret: state.chests_secret ?? [],
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
