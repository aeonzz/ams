import React, { createContext, useContext } from "react";

export type FontSizeContextType = {
  fontSize?: string;
  setFontSize: (size: string | undefined) => void;
};

export const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
);

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
}
