"use client";

import { FontSizeContext } from "@/lib/hooks/use-font-size";
import { useState } from "react";

export default function FontSizeProvider({
  children,
  font,
}: {
  children: React.ReactNode;
  font?: string;
}) {
  const [fontSize, setFontSize] = useState<string | undefined>(font);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}
