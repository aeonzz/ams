'use client';

import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending} variant="shine">
      Sign{pending ? 'ing' : ''} in
    </Button>
  );
}
