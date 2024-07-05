"use client";

import { createContext, useContext } from "react";
import { UserType } from "../types/user";

export const UserSessionContext = createContext<UserType | undefined>(undefined);

export function useSession() {
  const session = useContext(UserSessionContext);

  if (!session) {
    throw new Error("useSession must be used within a UserSessionProvider.");
  }

  return session;
}
