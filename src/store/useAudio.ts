import { create } from "zustand";
import { BGM, SFX } from "../audio";

export const useBGM = create<{
  bgm: BGM;
  setBgm: (newBGM: BGM) => void;
}>((set) => ({
  bgm: new BGM(),
  setBgm: (newBGM) => set({ bgm: newBGM }),
}));

export const useSFX = create<{
  sfx: SFX;
  setSfx: (newSFX: SFX) => void;
}>((set) => ({
  sfx: new SFX(),
  setSfx: (newSFX) => set({ sfx: newSFX }),
}));
