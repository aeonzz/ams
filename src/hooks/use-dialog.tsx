import { create } from 'zustand';

export interface useDialogStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useDialog = create<useDialogStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => {
    set(() => ({ isOpen }));
  },
}));
