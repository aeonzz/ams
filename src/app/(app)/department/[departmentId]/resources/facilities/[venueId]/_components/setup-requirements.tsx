"use client";

import React from "react";
import { VenueSetupRequirement } from "prisma/generated/zod";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateSetupStatus } from "@/lib/actions/venue";
import { useQueryClient } from "@tanstack/react-query";

interface SetupRequirementsProps {
  data: VenueSetupRequirement[];
  queryKey: string[];
}

export default function SetupRequirements({
  data,
  queryKey,
}: SetupRequirementsProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { isPending, mutateAsync } = useServerActionMutation(updateSetupStatus);

  const handleStatusUpdate = async (id: string, currentAvailable: boolean) => {
    const newAvailable = !currentAvailable;
    toast.promise(
      mutateAsync({
        id: id,
        status: newAvailable,
        path: pathname,
      }),
      {
        loading: "Updating availability...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: queryKey,
          });
          return `Availability updated to ${newAvailable ? "available" : "unavailable"}`;
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      }
    );
  };

  return (
    <div className="flex max-w-64 flex-wrap items-center gap-1">
      {data.map((value) => (
        <TooltipProvider key={value.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={value.available ? "outline" : "destructive"}
                size="sm"
                onClick={() => handleStatusUpdate(value.id, value.available)}
                disabled={isPending}
                className="h-7 px-2"
              >
                {value.name}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{value.available ? "Available" : "Unavailable"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
