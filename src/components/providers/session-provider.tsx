"use client";

import React from "react";

import { UserSessionContext } from "@/lib/hooks/use-session";
import { UserType } from "@/lib/types/user";

interface SessionProviderProps {
  children: React.ReactNode;
  user: UserType;
}

export default function SessionProvider({ children, user }: SessionProviderProps) {
  return <UserSessionContext.Provider value={user}>{children}</UserSessionContext.Provider>;
}
