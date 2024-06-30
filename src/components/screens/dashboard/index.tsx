'use client';

import { useCreateRequest } from '@/hooks/use-create-request';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/hooks/use-dialog';

export default function DashboardScreen() {
  const createRequest = useCreateRequest();

  return (
    <div>
      <Button onClick={() => createRequest.setIsOpen(true)}>Open</Button>
    </div>
  );
}
