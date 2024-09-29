"use client";

import React from "react";

import {
  type JobRequestWithRelations,
  JobStatusSchema,
} from "prisma/generated/zod";
import {
  cn,
  getJobStatusColor,
  permissionGuard,
  textTransform,
} from "@/lib/utils";
import { useSession } from "@/lib/hooks/use-session";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { Button } from "@/components/ui/button";
import { Check, Clock, Dot, Plus } from "lucide-react";
import { P } from "@/components/typography/text";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateJobRequestSchema, type UpdateJobRequestSchema } from "./schema";
import { updateJobRequest } from "@/lib/actions/job";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useHotkeys } from "react-hotkeys-hook";
import { Badge } from "@/components/ui/badge";

interface UpdateJobStatusProps {
  data: JobRequestWithRelations;
  requestId: string;
}

export default function UpdateJobStatus({
  data,
  requestId,
}: UpdateJobStatusProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const statusColor = getJobStatusColor(data.status);
  const form = useForm<UpdateJobRequestSchema>({
    resolver: zodResolver(updateJobRequestSchema),
    defaultValues: {
      status: data.status,
    },
  });

  const { isPending, mutateAsync } = useServerActionMutation(updateJobRequest);

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

  const canEdit = permissionGuard({
    allowedRoles: ["PERSONNEL"],
    currentUser,
  });

  useHotkeys(
    "s",
    (event) => {
      event.preventDefault();
      setPopoverOpen(true);
    },
    {
      enableOnFormTags: false,
      enabled: canEdit,
    }
  );

  JobStatusSchema.options
    .filter((status) => status !== "PENDING")
    .forEach((status, index) => {
      useHotkeys(
        `${index + 1}`,
        (event) => {
          event.preventDefault();
          form.setValue("status", status);
          form.handleSubmit(onSubmit)();
        },
        {
          enableOnFormTags: true,
          enabled: popoverOpen,
        }
      );
    });

  async function onSubmit(formData: UpdateJobRequestSchema) {
    if (data.status === formData.status) {
      setPopoverOpen(false);
      return;
    }

    toast.promise(
      mutateAsync({
        ...formData,
        path: pathname,
        requestId: requestId,
      }),
      {
        loading: "Updating status...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [requestId],
          });
          queryClient.invalidateQueries({
            queryKey: ["activity", requestId],
          });
          return "Status updated successfully";
        },
        error: (err) => {
          console.error(err);
          return "Failed to update status";
        },
      }
    );
    setPopoverOpen(false);
  }

  return (
    <div>
      <P className="mb-1 text-sm">Job Status</P>
      {canEdit ? (
        <TooltipProvider>
          <Tooltip open={tooltipOpen} onOpenChange={handleTooltipOpenChange}>
            <Popover
              open={popoverOpen}
              onOpenChange={handlePopoverOpenChange}
              modal
            >
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost2"
                    size="sm"
                    className={cn(
                      "w-full justify-start px-2",
                      popoverOpen && "bg-secondary-accent"
                    )}
                  >
                    <Badge variant={statusColor.variant} className="pr-3.5">
                      <Dot
                        className="mr-1 size-3"
                        strokeWidth={statusColor.stroke}
                        color={statusColor.color}
                      />
                      {textTransform(data.status)}
                    </Badge>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent
                className="w-[200px] p-0"
                onCloseAutoFocus={(e) => e.preventDefault()}
                side="left"
                align="start"
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Command>
                              <CommandInput placeholder="Search status...">
                                <CommandShortcut>S</CommandShortcut>
                              </CommandInput>
                              <CommandList>
                                <CommandEmpty>No status found.</CommandEmpty>
                                <CommandGroup>
                                  {JobStatusSchema.options
                                    .filter((status) => status !== "PENDING")
                                    .map((status, index) => {
                                      const { stroke, color } =
                                        getJobStatusColor(status);
                                      return (
                                        <CommandItem
                                          key={status}
                                          onSelect={() => {
                                            field.onChange(status);
                                            form.handleSubmit(onSubmit)();
                                          }}
                                        >
                                          <Dot
                                            className="mr-2 size-4"
                                            strokeWidth={stroke}
                                            color={color}
                                          />
                                          {textTransform(status)}
                                          <div className="ml-auto flex items-center gap-1">
                                            {data.status === status && (
                                              <Check className="size-4" />
                                            )}
                                            <CommandShortcut>
                                              {index + 1}
                                            </CommandShortcut>
                                          </div>
                                        </CommandItem>
                                      );
                                    })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
            <TooltipContent className="flex items-center gap-3" side="bottom">
              <P>Change status</P>
              <CommandShortcut>S</CommandShortcut>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Button
          variant="ghost2"
          size="sm"
          className={cn(
            "w-full justify-start px-2",
            popoverOpen && "bg-secondary-accent"
          )}
        >
          <Badge variant={statusColor.variant} className="pr-3.5">
            <Dot
              className="mr-1 size-3"
              strokeWidth={statusColor.stroke}
              color={statusColor.color}
            />
            {textTransform(data.status)}
          </Badge>
        </Button>
      )}
    </div>
  );
}
