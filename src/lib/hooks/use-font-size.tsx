import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface useFontSizeStore {
  fontSize: string;
  setFontSize: (fontSize: string) => void;
}

export const useFontSize = create(
  persist<useFontSizeStore>(
    (set) => ({
      fontSize: "default",
      setFontSize: (fontSize: string) => {
        set(() => ({ fontSize }));
      },
    }),
    {
      name: "font",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
