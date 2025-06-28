import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface RouterStoreModel {
  route: string;
  data: any;
  openRowId?: string | null;
  navigateTo: (route: string) => void;
  setOpenRowId: (id: string | null) => void;
}

const routerPersist = persist<RouterStoreModel>(
  (set) => ({
    route: '/',
    data: null,
    openRowId: null,
    navigateTo: (route: string) => set({ route }),
    setOpenRowId: (id: string | null) => set({ openRowId: id }),
  }),
  {
      name: "siguri-router-storage",
      storage: createJSONStorage(() => localStorage),
  }
);

export const routerStore = create<RouterStoreModel>()(routerPersist);