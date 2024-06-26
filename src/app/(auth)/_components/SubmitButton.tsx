'use client';

import LoadingSpinner from '@/components/loaders/loading-spinner';
import { Button } from '@/components/ui/button';

export default function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button
      className="w-full"
      type="submit"
      disabled={isLoading}
      variant="ringHover"
    >
      {isLoading ? <LoadingSpinner /> : 'Sign In'}
    </Button>
  );
}
