"use client";

import React from "react";
import { User } from "prisma/generated/zod";

import { UserSessionContext } from "@/lib/hooks/use-session";

interface SessionProviderProps {
  children: React.ReactNode;
  user: User;
}

export default function SessionProvider({ children, user }: SessionProviderProps) {
  return <UserSessionContext.Provider value={user}>{children}</UserSessionContext.Provider>;
}
