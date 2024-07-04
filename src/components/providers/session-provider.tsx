'use client';

import { UserSessionContext } from '@/lib/hooks/use-session';
import { User } from 'prisma/generated/zod';
import React from 'react';

interface SessionProviderProps {
  children: React.ReactNode;
  user: User;
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
