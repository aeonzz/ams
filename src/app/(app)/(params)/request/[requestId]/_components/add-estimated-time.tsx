"use client";

import { PermissionGuard } from "@/components/permission-guard";
import { P } from "@/components/typography/text";
import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "@/lib/hooks/use-session";
import { CommandShortcut } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import type { RequestWithRelations } from "prisma/generated/zod";
import { useHotkeys } from "react-hotkeys-hook";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";

interface AddEstimatedTimeProps {
  data: RequestWithRelations;
}

export default function AddEstimatedTime({ data }: AddEstimatedTimeProps) {
  const currentUser = useSession();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const { isPending, mutateAsync } = useServerActionMutation();

  const handlePopoverOpenChange = (open: boolean) => {
    setPopoverOpen(open);
    if (open) {
      setTooltipOpen(false);
    }
  };

  const handleTooltipOpenChange = (open: boolean) => {
    if (!popoverOpen) {
      setTooltipOpen(open);
    }
  };

  useHotkeys(
    "t",
    (event) => {
      event.preventDefault();
      setPopoverOpen(true);
    },
    { enableOnFormTags: false }
  );

  return (
    <PermissionGuard
      allowedRoles={["DEPARTMENT_HEAD"]}
      currentUser={currentUser}
    >
      <div>
        <P className="mb-1 text-sm">Estimated time</P>
        <TooltipProvider>
          <Tooltip open={tooltipOpen} onOpenChange={handleTooltipOpenChange}>
            <Popover open={popoverOpen} onOpenChange={handlePopoverOpenChange}>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost2"
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      popoverOpen && "bg-secondary-accent"
                    )}
                  >
                    <Clock className="mr-2 size-4" />
                    {data.jobRequest?.estimatedTime ? (
                      data.jobRequest?.estimatedTime
                    ) : (
                      <P className="text-muted-foreground">Add</P>
                    )}
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent
                className="h-32 w-[200px] p-0"
                side="left"
                align="start"
              ></PopoverContent>
            </Popover>
            <TooltipContent className="flex items-center gap-3" side="bottom">
              <P>Add time</P>
              <CommandShortcut>T</CommandShortcut>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </PermissionGuard>
  );
}
