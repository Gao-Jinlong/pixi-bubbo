import { create } from "zustand";
import { AppScreenConstructor } from "../navigation";

export interface NavigationStore {
  currentScreen: AppScreenConstructor | null;
  setCurrentScreen: (newCurrentScreen: AppScreenConstructor) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentScreen: null,
  setCurrentScreen: (newCurrentScreen) =>
    set({ currentScreen: newCurrentScreen }),
}));
