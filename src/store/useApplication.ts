import { Application } from "pixi.js";
import { create } from "zustand";

export interface AppStore {
  app: Application | null;
  setApp: (newApp: Application) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  app: null,
  setApp: (newApp) => set({ app: newApp }),
}));
