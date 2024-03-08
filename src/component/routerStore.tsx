import { create } from 'zustand';

export interface RouterStoreModel {
  route: string
  data: any
  navigateTo: (route: string) => void
}

export const routerStore = create<RouterStoreModel>((set) => ({
  route: '/',
  data: null,
  navigateTo: (route: string) => set({ route }),
}))