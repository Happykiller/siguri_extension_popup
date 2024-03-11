import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface RouterStoreModel {
  route: string
  data: any
  navigateTo: (route: string) => void
}

const routerPersist = persist<RouterStoreModel>(
  (set) => ({
    route: '/',
    data: null,
    navigateTo: (route: string) => set({ route })
  }),
  {
      name: "siguri-router-storage",
      storage: createJSONStorage(() => localStorage),
  }
);

export const routerStore = create<RouterStoreModel>()(routerPersist);