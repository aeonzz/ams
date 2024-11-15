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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "@/lib/hooks/use-session";
import { CommandList, CommandShortcut } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn, permissionGuard } from "@/lib/utils";
import { Check, Clock, Plus } from "lucide-react";
import type { RequestWithRelations } from "prisma/generated/zod";
import { useHotkeys } from "react-hotkeys-hook";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateJobRequest } from "@/lib/actions/job";
import { useForm } from "react-hook-form";
import { updateJobRequestSchema, UpdateJobRequestSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface AddEstimatedTimeProps {
  data: RequestWithRelations;
}

const predefinedHours = [1, 2, 4, 8, 12, 20, 24];

export default function AddEstimatedTime({ data }: AddEstimatedTimeProps) {
  const currentUser = useSession();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [customHours, setCustomHours] = React.useState("");
  const customInputRef = React.useRef<HTMLInputElement>(null);
  const form = useForm<UpdateJobRequestSchema>({
    resolver: zodResolver(updateJobRequestSchema),
    defaultValues: {
      estimatedTime: data.jobRequest?.estimatedTime ?? undefined,
    },
  });

  const { isPending, mutateAsync } = useServerActionMutation(updateJobRequest);

  const handlePopoverOpenChange = (open: boolean) => {
    setPopoverOpen(open);
    if (open) {
      setTooltipOpen(false);
    } else {
      setShowCustomInput(false);
      setCustomHours("");
    }
  };

  const handleTooltipOpenChange = (open: boolean) => {
    if (!popoverOpen) {
      setTooltipOpen(open);
    }
  };

  const handleHotkeySubmit = React.useCallback(
    (hours: number) => {
      if (
        !showCustomInput ||
        document.activeElement !== customInputRef.current
      ) {
        form.setValue("estimatedTime", hours);
        form.handleSubmit(onSubmit)();
      }
    },
    [showCustomInput, form, onSubmit]
  );

  const canEdit = permissionGuard({
    allowedRoles: ["OPERATIONS_MANAGER"],
    currentUser,
  });

  useHotkeys(
    "t",
    (event) => {
      event.preventDefault();
      setPopoverOpen(true);
    },
    {
      enableOnFormTags: false,
      enabled: canEdit && data.status === "PENDING",
    }
  );

  useHotkeys(
    "a",
    (event) => {
      event.preventDefault();
      setShowCustomInput(true);
    },
    {
      enableOnFormTags: true,
      enabled: popoverOpen,
    }
  );

  useHotkeys(
    predefinedHours.map((_, index) => (index + 1).toString()),
    (event, handler) => {
      event.preventDefault();
      if (handler.keys && handler.keys.length > 0) {
        const index = parseInt(handler.keys[0], 10) - 1;
        if (index >= 0 && index < predefinedHours.length) {
          handleHotkeySubmit(predefinedHours[index]);
        }
      }
    },
    {
      enableOnFormTags: true,
      enabled: popoverOpen,
    }
  );

  React.useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [showCustomInput]);

  async function onSubmit(formData: UpdateJobRequestSchema) {
    if (data.jobRequest?.estimatedTime === formData.estimatedTime) {
      setPopoverOpen(false);
      return;
    }
    toast.promise(
      mutateAsync({
        ...formData,
        path: pathname,
        requestId: data.id,
      }),
      {
        loading: "Updating estimated time...",
        success: () => {
          queryClient.invalidateQueries({ queryKey: [data.id] });
          return "Estimated time updated successfully";
        },
        error: (err) => {
          console.error(err);
          return err.message;
        },
      }
    );
    setPopoverOpen(false);
    setShowCustomInput(false);
    setCustomHours("");
  }

  const handleCustomHoursSubmit = () => {
    const hours = parseInt(customHours, 10);
    if (!isNaN(hours) && hours > 0) {
      form.setValue("estimatedTime", hours);
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      <P className="mb-1 text-sm">Estimated time</P>
      {canEdit && data.status === "PENDING" ? (
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
                  <Clock className="mr-2 size-4" />
                  {data.jobRequest?.estimatedTime ? (
                    `${data.jobRequest.estimatedTime} hours`
                  ) : (
                    <P className="text-muted-foreground">Add</P>
                  )}
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
                    name="estimatedTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Command>
                            <CommandInput placeholder="Search hours...">
                              <CommandShortcut>T</CommandShortcut>
                            </CommandInput>
                            <CommandList>
                              <CommandEmpty>No hours found.</CommandEmpty>
                              <CommandGroup>
                                {predefinedHours.map((hours, index) => (
                                  <CommandItem
                                    key={hours}
                                    onSelect={() => {
                                      field.onChange(hours);
                                      form.handleSubmit(onSubmit)();
                                    }}
                                  >
                                    <Clock className="mr-2 size-4" />
                                    {hours} {hours === 1 ? "hour" : "hours"}
                                    <div className="ml-auto flex items-center gap-1">
                                      {data.jobRequest?.estimatedTime ===
                                        hours && <Check className="size-4" />}
                                      <CommandShortcut>
                                        {index + 1}
                                      </CommandShortcut>
                                    </div>
                                  </CommandItem>
                                ))}
                                <CommandItem
                                  onSelect={() =>
                                    setShowCustomInput(!showCustomInput)
                                  }
                                >
                                  <Plus className="mr-2 size-4" />
                                  Add custom time
                                  <CommandShortcut>A</CommandShortcut>
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </FormControl>
                        {showCustomInput && (
                          <>
                            <Separator />
                            <div className="flex flex-col items-center gap-1 px-2 pb-1">
                              <Input
                                type="number"
                                placeholder="Enter hours"
                                ref={customInputRef}
                                className="w-full"
                                value={customHours}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    (parseInt(value, 10) >= 0 &&
                                      parseInt(value, 10) <= 999)
                                  ) {
                                    setCustomHours(value);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleCustomHoursSubmit();
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCustomHoursSubmit}
                                disabled={isPending}
                                className="w-full"
                              >
                                Add
                              </Button>
                            </div>
                          </>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </PopoverContent>
          </Popover>
          <TooltipContent className="flex items-center gap-3" side="bottom">
            <P>Add time</P>
            <CommandShortcut>T</CommandShortcut>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button
          variant="ghost2"
          size="sm"
          className={cn("w-full justify-start px-2 hover:bg-transparent")}
        >
          <Clock className="mr-2 size-4" />
          {data.jobRequest?.estimatedTime ? (
            `${data.jobRequest.estimatedTime} hours`
          ) : (
            <P className="text-muted-foreground">Add</P>
          )}
        </Button>
      )}
    </div>
  );
}
