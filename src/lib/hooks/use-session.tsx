'use client'

import { User } from 'prisma/generated/zod';
import { createContext, useContext } from 'react';

export const UserSessionContext = createContext<User | undefined>(undefined);

export function useSession() {
  const session = useContext(UserSessionContext);

  if (!session) {
    throw new Error('useSession must be used within a UserSessionProvider.');
  }

  return session;
}
