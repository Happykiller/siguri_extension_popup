// src\component\store\contextStore.tsx
import { create } from 'zustand';

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
          url: 'https://siguri.happykiller.net',
          name: 'siguri-storage',
        },
        (cookie) => {
          if (cookie?.value) {
            try {
              const decoded = decodeURIComponent(cookie.value);
              const parsed = JSON.parse(decoded);

              console.log('[contextStore] Cookie decoded:', parsed);

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
              console.error('[contextStore] Failed to parse cookie JSON:', err);
            set({ hydrated: true });
            }
          } else {
            console.warn('[contextStore] access_token cookie not found');
            set({ hydrated: true });
          }
        }
      );
    } catch (err) {
      console.error('[contextStore] hydrate() failed', err);
    }
  },
}));
