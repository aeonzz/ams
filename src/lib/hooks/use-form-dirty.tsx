import { create } from "zustand";

export interface IsFormDirtyStore {
  isFormDirty: boolean;
  setIsFormDirty: (isFormDirty: boolean) => void;
}

export const useIsFormDirty = create<IsFormDirtyStore>((set) => ({
  isFormDirty: false,
  setIsFormDirty: (isFormDirty: boolean) => {
    set(() => ({ isFormDirty }));
  },
}));
