"use client";

import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DisableMobileProps {
  children: React.ReactNode;
}

export default function DisableMobile({ children }: DisableMobileProps) {
  const isDesktop = useMediaQuery("(min-width: 769px)");

  if (!isDesktop) {
    return (
      <div className="flex h-[calc(100vh_-_70px)] items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Device Not Supported</AlertTitle>
          <AlertDescription>
            We're sorry, but this section is optimized for desktop use only.
            Please access it from a desktop computer for the best experience.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return children;
}
