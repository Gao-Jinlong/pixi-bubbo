import { create } from "zustand";
import { Navigation } from "../navigation";

export interface NavigationStore {
  navigation: Navigation | null;
  currentScreen: AppScreenConstructor | null;
  setNavigation: (newNavigation: Navigation) => void;
  setCurrentScreen: (newCurrentScreen: AppScreenConstructor) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  navigation: null,
  currentScreen: null,
  setNavigation: (newNavigation) => set({ navigation: newNavigation }),
  setCurrentScreen: (newCurrentScreen) =>
    set({ currentScreen: newCurrentScreen }),
}));
