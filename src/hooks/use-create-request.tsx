import { create } from 'zustand';

export interface useCreateRequestStore {
  isOpen: boolean;
  setIsOpen: () => void;
}

export const useCreateRequest = create<useCreateRequestStore>((set, get) => ({
  isOpen: false,
  setIsOpen: () => {
    set({ isOpen: !get().isOpen });
  },
}));
