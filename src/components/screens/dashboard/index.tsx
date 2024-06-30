'use client';

import { useStore } from '@/hooks/use-store';
import { useCreateRequest } from '@/hooks/use-create-request';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardScreen() {
  const createRequest = useCreateRequest();

  return (
    <div>
      <Button onClick={() => createRequest.setIsOpen()}>Open</Button>
    </div>
  );
}
