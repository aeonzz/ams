"use client";

import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type User } from "prisma/generated/zod";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { P } from "../typography/text";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { assignPersonnel } from "@/lib/actions/job";
import { toast } from "sonner";
import { type AssignPersonnelSchemaWithPath } from "@/app/(app)/(params)/request/[requestId]/_components/schema";
import { usePathname } from "next/navigation";
import { getGlobalRequest } from "@/lib/hooks/use-request-store";
import { Button } from "@/components/ui/button";

export default function JobDetailsActionsDialog() {
  const dialogManager = useDialogManager();
  const pathname = usePathname();
  const requestId = pathname.split("/").pop();
  const queryClient = useQueryClient();
  const globalRequest = getGlobalRequest();
  const [selectedUserId, setSelectedUserId] = React.useState<
    string | undefined | null
  >(globalRequest?.jobRequest?.assignedTo);

  const { data, isLoading, isError, error, refetch } = useQuery<User[]>({
    queryFn: async () => {
      const res = await axios.get("/api/user/get-personnels");
      return res.data.data;
    },
    queryKey: ["get-personnels"],
  });

  const { mutateAsync, isPending } = useServerActionMutation(assignPersonnel);

  React.useEffect(() => {
    setSelectedUserId(globalRequest?.jobRequest?.assignedTo);
  }, [globalRequest?.jobRequest?.assignedTo]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  const handleSelect = async (id: string) => {
    if (id === selectedUserId) {
      toast.info("No changes made. The selected user is already assigned.");
      return;
    }

    setSelectedUserId(id);

    const data: AssignPersonnelSchemaWithPath = {
      path: pathname,
      requestId: globalRequest?.jobRequest?.id || "",
      personnelId: id,
    };

    toast.promise(mutateAsync(data), {
      loading: "Assigning...",
      success: () => {
        queryClient.invalidateQueries({
          queryKey: [requestId],
        });
        handleOpenChange(false);
        return "Personnel assigned successfully.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  };

  return (
    <CommandDialog
      open={dialogManager.activeDialog === "jobDetailsDialog"}
      onOpenChange={handleOpenChange}
    >
      <CommandInput placeholder="Assign personnel..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center justify-center space-y-2 p-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <P className="text-sm text-red-500">
              {error?.message || "An error occurred"}
            </P>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        )}
        {!isLoading && !isError && (
          <CommandGroup>
            {data?.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => handleSelect(item.id)}
                disabled={isPending}
              >
                <div className="flex w-full items-center">
                  <div className="flex space-x-3">
                    <Avatar className="size-10 rounded-full">
                      <AvatarImage
                        src={item.profileUrl ?? ""}
                        alt={item.username}
                      />
                      <AvatarFallback className="rounded-md">
                        {item.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <P className="font-medium">{item.username}</P>
                      <P className="text-muted-foreground">{item.department}</P>
                    </div>
                  </div>
                  {item.id === selectedUserId && (
                    <Check className="ml-auto h-4 w-4 text-green-500" />
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
