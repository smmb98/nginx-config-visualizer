import { create } from "zustand";
import type { GlobalConfigState, GlobalConfigActions } from "./types";
import { DEFAULT_STATE } from "./defaults";

export type GlobalConfigStore = GlobalConfigState & GlobalConfigActions;

export const useGlobalConfigStore = create<GlobalConfigStore>((set) => ({
  ...DEFAULT_STATE,

  updateField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  resetToDefaults: () => set(DEFAULT_STATE),
}));
