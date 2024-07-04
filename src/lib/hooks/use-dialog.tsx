import { create } from 'zustand';

export interface UseDialogStore {
  activeDialog: string;
  setActiveDialog: (activeDialog: string) => void;
}

export const useDialog = create<UseDialogStore>((set) => ({
  activeDialog: '',
  setActiveDialog: (activeDialog: string) => {
    set(() => ({ activeDialog }));
  },
}));
