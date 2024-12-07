"use client";

import MenuSheet from "@/app/(app)/dashboard/_components/menu-sheet";
import React from "react";
import { useMediaQuery } from "usehooks-ts";

interface MobileMenuProps {
  children: React.ReactNode;
}

export default function MobileMenu({ children }: MobileMenuProps) {
  const isDesktop = useMediaQuery("(min-width: 769px)");

  return (
    <>
      {!isDesktop && <MenuSheet />}
      {children}
    </>
  );
}
