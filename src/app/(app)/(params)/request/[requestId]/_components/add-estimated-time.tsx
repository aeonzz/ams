"use client";

import { PermissionGuard } from "@/components/permission-guard";
import { P } from "@/components/typography/text";
import React, { useState, useRef, useEffect } from "react";
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
import { cn } from "@/lib/utils";
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
  params: string;
}

const predefinedHours = [1, 2, 4, 8, 12, 20, 24];

export default function AddEstimatedTime({
  data,
  params,
}: AddEstimatedTimeProps) {
  const currentUser = useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customHours, setCustomHours] = useState("");
  const customInputRef = useRef<HTMLInputElement>(null);
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

  useHotkeys(
    "t",
    (event) => {
      event.preventDefault();
      setPopoverOpen(true);
    },
    { enableOnFormTags: false }
  );

  useHotkeys(
    "a",
    (event) => {
      if (popoverOpen) {
        event.preventDefault();
        setShowCustomInput(true);
      }
    },
    { enableOnFormTags: true }
  );

  predefinedHours.forEach((hours, index) => {
    useHotkeys(
      `${index + 1}`,
      (event) => {
        if (popoverOpen) {
          if (
            !showCustomInput ||
            document.activeElement !== customInputRef.current
          ) {
            event.preventDefault();
            form.setValue("estimatedTime", hours);
            form.handleSubmit(onSubmit)();
          }
        }
      },
      { enableOnFormTags: true }
    );
  });

  useEffect(() => {
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
        requestId: params,
      }),
      {
        loading: "Updating estimated time...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [params],
          });
          return "Estimated time updated successfully";
        },
        error: (err) => {
          console.error(err);
          return "Failed to update estimated time";
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
    <PermissionGuard
      allowedRoles={["DEPARTMENT_HEAD"]}
      currentUser={currentUser}
    >
      <div>
        <P className="mb-1 text-sm">Estimated time</P>
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
                      "w-full justify-start",
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
        </TooltipProvider>
      </div>
    </PermissionGuard>
  );
}
