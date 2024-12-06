import { create } from "zustand";
import { Navigation } from "../navigation";

export interface NavigationStore {
  navigation: Navigation | null;
  setNavigation: (newNavigation: Navigation) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  navigation: null,
  setNavigation: (newNavigation) => set({ navigation: newNavigation }),
}));
