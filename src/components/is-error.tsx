"use client";

import { AlertCircle } from "lucide-react";
import React from "react";
import { P } from "./typography/text";
import { Button } from "./ui/button";

interface IsErrorProps {
  error: Error;
  refetch: () => void;
}

export default function IsError({ error, refetch }: IsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-4">
      <AlertCircle className="h-6 w-6 text-red-500" />
      <P className="text-sm text-red-500">
        {error?.message || "An error occurred"}
      </P>
      <Button onClick={() => refetch()} variant="outline" size="sm">
        Retry
      </Button>
    </div>
  );
}
