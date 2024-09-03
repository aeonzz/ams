"use client";

import React from "react";

import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  Camera,
  Check,
  ChevronLeft,
  ChevronsUpDown,
  CircleArrowUp,
  Cog,
  Construction,
  FileQuestion,
  Laptop,
  Leaf,
  Minus,
  Paintbrush,
  PenTool,
  PocketKnife,
  SignalHigh,
  SignalLow,
  SignalMedium,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MotionLayout } from "@/components/layouts/motion-layout";
import { usePathname } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { FileUploader } from "@/components/file-uploader";
import { toast } from "sonner";
import { createRequest } from "@/lib/actions/requests";
import { UseMutateAsyncFunction, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/text-area";
import { Separator } from "@/components/ui/separator";
import { type ExtendedJobRequestSchema } from "@/lib/schema/request";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { cn, isDateInPast } from "@/lib/utils";
import { useSession } from "@/lib/hooks/use-session";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PriorityTypeType } from "prisma/generated/zod/inputTypeSchemas/PriorityTypeSchema";
import { JobRequestSchema } from "@/lib/db/schema/request";

interface JobRequestInputProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createRequest>[0],
    unknown
  >;
  isPending: boolean;
  type: RequestTypeType;
  form: UseFormReturn<JobRequestSchema>;
  handleOpenChange: (open: boolean) => void;
  isFieldsDirty: boolean;
}

const jobs = [
  {
    value: "repair",
    label: "Repair",
    icon: Wrench,
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: Construction,
  },
  {
    value: "installation",
    label: "Installation",
    icon: PocketKnife,
  },
  {
    value: "troubleshooting",
    label: "Troubleshooting",
    icon: FileQuestion,
  },
  {
    value: "cleaning",
    label: "Cleaning",
    icon: Paintbrush,
  },
  {
    value: "replacement",
    label: "Replacement",
    icon: CircleArrowUp,
  },
  {
    value: "configuration",
    label: "Configuration",
    icon: Cog,
  },
  {
    value: "media_production",
    label: "Media Production",
    icon: Camera,
  },
  {
    value: "it_support",
    label: "IT Support",
    icon: Laptop,
  },
  {
    value: "engineering_support",
    label: "Engineering Support",
    icon: PenTool,
  },
  {
    value: "environmental_services",
    label: "Environmental Services",
    icon: Leaf,
  },
  {
    value: "event_support",
    label: "Event Support",
    icon: CalendarIcon,
  },
] as const;

const priorities = [
  {
    value: "NO_PRIORITY",
    label: "No priority",
    icon: Minus,
  },
  {
    value: "URGENT",
    label: "Urgent",
    icon: TriangleAlert,
  },
  {
    value: "HIGH",
    label: "High",
    icon: SignalHigh,
  },
  {
    value: "MEDIUM",
    label: "Medium",
    icon: SignalMedium,
  },
  {
    value: "LOW",
    label: "Low",
    icon: SignalLow,
  },
] as const;

export default function JobRequestInput({
  mutateAsync,
  isPending,
  type,
  form,
  handleOpenChange,
  isFieldsDirty,
}: JobRequestInputProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const currentUser = useSession();
  const { department } = currentUser;

  const { uploadFiles, progresses, isUploading, uploadedFiles } =
    useUploadFile();

  async function onSubmit(values: JobRequestSchema) {
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      // Check if there are files to upload
      if (values.images && values.images.length > 0) {
        uploadedFilesResult = await uploadFiles(values.images);
      }

      const data: ExtendedJobRequestSchema = {
        notes: values.notes,
        priority: values.priority as PriorityTypeType,
        dueDate: values.dueDate,
        type: type,
        department: department,
        jobType: values.jobtype,
        path: pathname,
        ...(uploadedFilesResult.length > 0 && {
          images: uploadedFilesResult.map(
            (result: { filePath: string }) => result.filePath
          ),
        }),
      };

      toast.promise(mutateAsync(data), {
        loading: "Submitting...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: ["user-dashboard-overview"],
          });
          handleOpenChange(false);
          return "Your request has been submitted and is awaiting approval.";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      });
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred during submission. Please try again.");
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Job Request</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative space-y-2 px-4">
            <div className="rounded-md border p-3">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        rows={1}
                        maxRows={10}
                        minRows={3}
                        placeholder="Describe your request..."
                        className="border-none p-0 focus-visible:ring-0"
                        disabled={isUploading || isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        progresses={progresses}
                        disabled={isUploading || isPending}
                        drop={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-wrap gap-2 py-1">
              <FormField
                control={form.control}
                name="jobtype"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="secondary"
                            disabled={isUploading || isPending}
                            role="combobox"
                            className={cn(
                              "w-[230px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? jobs.find((job) => job.value === field.value)
                                  ?.label
                              : "Select job"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[230px] p-0" align="start">
                        <Command className="max-h-72">
                          <CommandInput placeholder="Search job..." />
                          <CommandList>
                            <CommandEmpty>No job found.</CommandEmpty>
                            <CommandGroup>
                              {jobs.map((job) => (
                                <CommandItem
                                  value={job.label}
                                  key={job.value}
                                  onSelect={() => {
                                    form.setValue("jobtype", job.value);
                                  }}
                                >
                                  <job.icon className="mr-2 size-4" />
                                  {job.label}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      job.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormLabel>Job type</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="secondary"
                            role="combobox"
                            disabled={isUploading || isPending}
                            className={cn(
                              "w-[230px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? priorities.find(
                                  (priority) => priority.value === field.value
                                )?.label
                              : "Select priority"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[230px] p-0" align="start">
                        <Command className="max-h-72">
                          <CommandInput placeholder="Search priority..." />
                          <CommandList>
                            <CommandEmpty>No job found.</CommandEmpty>
                            <CommandGroup>
                              {priorities.map((priority) => (
                                <CommandItem
                                  value={priority.label}
                                  key={priority.value}
                                  onSelect={() => {
                                    form.setValue("priority", priority.value);
                                  }}
                                >
                                  <priority.icon className="mr-2 size-4" />
                                  {priority.label}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      priority.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormLabel>Priority type</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"secondary"}
                            className={cn(
                              "justify-start px-2 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isUploading || isPending}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Due date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                        <Select
                          onValueChange={(value) =>
                            field.onChange(addDays(new Date(), parseInt(value)))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="0">Today</SelectItem>
                            <SelectItem value="1">Tomorrow</SelectItem>
                            <SelectItem value="3">In 3 days</SelectItem>
                            <SelectItem value="7">In a week</SelectItem>
                            <SelectItem value="30">In a month</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="rounded-md border">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={isDateInPast}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormLabel>Due date</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <MotionLayout>
            <Separator className="my-4" />
            <DialogFooter>
              {isFieldsDirty ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    form.reset();
                  }}
                  variant="destructive"
                  disabled={isUploading || isPending}
                >
                  Reset form
                </Button>
              ) : (
                <div></div>
              )}
              <SubmitButton
                disabled={isUploading || isPending}
                className="w-28"
              >
                Submit
              </SubmitButton>
            </DialogFooter>
          </MotionLayout>
        </form>
      </Form>
    </>
  );
}
