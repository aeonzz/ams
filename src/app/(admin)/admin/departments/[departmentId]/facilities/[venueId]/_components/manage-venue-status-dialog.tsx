"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { P } from "@/components/typography/text";
import { Check, Dot } from "lucide-react";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { createUserRole } from "@/lib/actions/userRole";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { VenueStatusSchema } from "prisma/generated/zod";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useHotkeys } from "react-hotkeys-hook";
import { cn, getVenueStatusColor, textTransform } from "@/lib/utils";
import { updateVenue } from "@/lib/actions/venue";
import type { VenueStatusType } from "prisma/generated/zod/inputTypeSchemas/VenueStatusSchema";
import { useQueryClient } from "@tanstack/react-query";
import { useGetVenue } from "@/lib/hooks/use-get-venue-hook";

interface ManageVenueStatusDialogProps {
  venueId: string;
  queryKey?: string[];
}

export function ManageVenueStatusDialog({
  venueId,
  queryKey,
}: ManageVenueStatusDialogProps) {
  const pathname = usePathname();
  const dialogManager = useDialogManager();
  const queryClient = useQueryClient();
  const { isPending, mutateAsync } = useServerActionMutation(updateVenue);
  const { data } = useGetVenue(venueId);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  const handleStatusSelect = (status: VenueStatusType) => {
    if (data?.status === status) {
      dialogManager.setActiveDialog(null);
      return;
    }
    toast.promise(
      mutateAsync({
        id: venueId,
        status: status,
        path: pathname,
        changeType: "STATUS_CHANGE",
      }),
      {
        loading: "Updating status...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: queryKey,
          });
          return "Status updated successfully";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      }
    );
    dialogManager.setActiveDialog(null);
  };

  useHotkeys(
    "s",
    (event) => {
      if (!dialogManager.isAnyDialogOpen()) {
        event.preventDefault();
        dialogManager.setActiveDialog("updateVenueStatusCommand");
      }
    },
    { enableOnFormTags: false }
  );

  // VenueStatusSchema.options.forEach((status, index) => {
  //   useHotkeys(
  //     `${index + 1}`,
  //     () => {
  //       if (dialogManager.activeDialog === "updateVenueStatusCommand") {
  //         handleStatusSelect(status);
  //       }
  //     },
  //     { enableOnFormTags: true }
  //   );
  // });

  return (
    <>
      <CommandDialog
        open={dialogManager.activeDialog === "updateVenueStatusCommand"}
        onOpenChange={handleOpenChange}
      >
        <CommandInput placeholder="Change status..." />
        <CommandList>
          <CommandGroup heading="Status">
            <CommandEmpty>No results found.</CommandEmpty>
            {VenueStatusSchema.options.map((status, index) => {
              const { color, stroke } = getVenueStatusColor(status);
              return (
                <CommandItem
                  key={status}
                  onSelect={() => handleStatusSelect(status)}
                  className="justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Dot
                      className="mr-1 size-3"
                      strokeWidth={stroke}
                      color={color}
                    />
                    <P className="font-semibold">{textTransform(status)}</P>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    {data?.status === status && <Check />}
                    <CommandShortcut>{index + 1}</CommandShortcut>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
