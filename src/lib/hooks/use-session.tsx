import { create } from 'zustand';

export interface UserSessionStore {
  userId: number | null;
  setSession: (user: number) => void;
}

export const userSession = create<UserSessionStore>((set) => ({
  userId: null,
  setSession: (userId: number) => {
    set(() => ({ userId }));
  },
}));
