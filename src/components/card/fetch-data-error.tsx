import { Button } from "@/components/ui/button";
import { H3, P } from "../typography/text";

interface FetchDataErrorProps {
  refetch: () => void;
}

export default function FetchDataError({ refetch }: FetchDataErrorProps) {
  return (
    <div className="mx-auto max-w-sm text-center">
      <H3 className="font-bold tracking-tight text-foreground">
        Oops, something went wrong!
      </H3>
      <P className="mt-2 text-muted-foreground">
        There was an error fetching the data. Please try again later.
      </P>
      <div className="mt-4">
        <Button
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={refetch}
        >
          Retry
        </Button>
      </div>
    </div>
  );
}
