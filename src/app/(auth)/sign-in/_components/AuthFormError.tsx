import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';

export default function AuthFormError({ state }: { state: { error: string } }) {
  if (state.error)
    return (
      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    );
  return null;
}
