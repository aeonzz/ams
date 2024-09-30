"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import JobRequestInput from "@/app/(app)/dashboard/_components/job-request-input";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import {
  jobRequestSchema,
  type JobRequestSchema,
} from "@/lib/db/schema/request";
import { createJobRequest } from "@/lib/actions/job";
import {
  createjobRequestSchema,
  type CreateJobRequestSchema,
} from "@/app/(app)/dashboard/_components/schema";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { P } from "../typography/text";

export default function JobDialog() {
  const dialogManager = useDialogManager();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const currentUser = useSession();

  const form = useForm<CreateJobRequestSchema>({
    resolver: zodResolver(createjobRequestSchema),
    defaultValues: {
      description: "",
      images: undefined,
    },
  });

  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  const { mutateAsync, isPending } = useServerActionMutation(createJobRequest);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  React.useEffect(() => {
    form.reset();
  }, [dialogManager.activeDialog]);

  return (
    <Dialog
      open={dialogManager.activeDialog === "jobDialog"}
      onOpenChange={handleOpenChange}
    >
      <DialogContent
        onInteractOutside={(e) => {
          if (isPending) {
            e.preventDefault();
          }
          if (isFieldsDirty && !isPending) {
            e.preventDefault();
            setAlertOpen(true);
          }
        }}
        isLoading={isPending}
      >
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          {isFieldsDirty && !isPending && (
            <AlertDialogTrigger disabled={isPending} asChild>
              <button
                disabled={isPending}
                className="absolute right-4 top-4 z-50 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none"
              >
                <X className="h-5 w-5" />
              </button>
            </AlertDialogTrigger>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to leave?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  dialogManager.setActiveDialog(null);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>Job Request</DialogTitle>
            <TooltipProvider>
              <Tooltip>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen} modal>
                  <PopoverTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost2"
                        size="sm"
                        className={cn(
                          "w-fit justify-start px-2 text-muted-foreground",
                          popoverOpen && "bg-secondary-accent"
                        )}
                      >
                        {value
                          ? currentUser.userDepartments.find(
                              (department) => department.departmentId === value
                            )?.department.name
                          : "Select department..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </TooltipTrigger>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[300px] p-0"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Search department..." />
                      <CommandList>
                        <CommandEmpty>No department found.</CommandEmpty>
                        <CommandGroup>
                          {currentUser.userDepartments.map((department) => (
                            <CommandItem
                              key={department.departmentId}
                              value={department.departmentId}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === department.departmentId
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {department.department.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <TooltipContent
                  className="flex items-center gap-3"
                  side="bottom"
                >
                  <P>Add time</P>
                  <CommandShortcut>T</CommandShortcut>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogHeader>
        <JobRequestInput
          form={form}
          isPending={isPending}
          mutateAsync={mutateAsync}
          type="JOB"
          handleOpenChange={handleOpenChange}
          isFieldsDirty={isFieldsDirty}
        />
      </DialogContent>
    </Dialog>
  );
}
