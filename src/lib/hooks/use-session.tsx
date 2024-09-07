"use client";

import { createContext, useContext } from "react";
import { UserWithRelations } from "prisma/generated/zod";

export const UserSessionContext = createContext<UserWithRelations | undefined>(undefined);

export function useSession() {
  const session = useContext(UserSessionContext);

  if (!session) {
    throw new Error("useSession must be used within a UserSessionProvider.");
  }

  return session;
}
