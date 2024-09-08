"use client";

import React from "react";

import { UserSessionContext } from "@/lib/hooks/use-session";
import { type UserWithRelations } from "prisma/generated/zod";

interface SessionProviderProps {
  children: React.ReactNode;
  user: UserWithRelations;
}

export default function SessionProvider({
  children,
  user,
}: SessionProviderProps) {
  return (
    <UserSessionContext.Provider value={user}>
      {children}
    </UserSessionContext.Provider>
  );
}
