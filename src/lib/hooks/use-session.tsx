"use client";

import { createContext, useContext } from "react";
import { User } from "prisma/generated/zod";

export const UserSessionContext = createContext<User | undefined>(undefined);

export function useSession() {
  const session = useContext(UserSessionContext);

  if (!session) {
    throw new Error("useSession must be used within a UserSessionProvider.");
  }

  return session;
}
