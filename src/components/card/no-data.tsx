import { FileWarning } from "lucide-react";
import { H2, P } from "../typography/text";

interface NoDataProps {
  message?: string;
}

export default function NoData({message}: NoDataProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <FileWarning className="size-10 text-muted-foreground mb-2" />
      <H2 className="font-semibold">No data available</H2>
      <P className="text-sm text-muted-foreground">
        {message}
      </P>
    </div>
  );
}
