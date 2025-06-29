// src/stores/chestSecretStore.ts
import { create } from 'zustand';

// Type of the store
interface ChestsSecretState {
  chests: ChestSecret[];
  setChests: (chests: ChestSecret[]) => void;
  addChest: (chest: ChestSecret) => void;
  removeChest: (id: string) => void;
  loadFromStorage: () => Promise<void>;
}

export interface ChestSecret {
  id: string;
  secret: string;
}

// Create the store
export const chestsSecretStore = create<ChestsSecretState>((set, get) => ({
  chests: [],

  setChests: (chests) => {
    set({ chests });
    chrome.storage.local.set({ chests_secret: chests });
  },

  addChest: (chest) => {
    const updated = [...get().chests, chest];
    set({ chests: updated });
    chrome.storage.local.set({ chests_secret: updated });
  },

  removeChest: (id) => {
    const updated = get().chests.filter((c) => c.id !== id);
    set({ chests: updated });
    chrome.storage.local.set({ chests_secret: updated });
  },

  loadFromStorage: async () => {
    return new Promise<void>((resolve) => {
      chrome.storage.local.get(['chests_secret'], (result) => {
        if (result.chests_secret) {
          set({ chests: result.chests_secret });
        }
        resolve();
      });
    });
  },
}));
