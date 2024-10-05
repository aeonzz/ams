"use client";

import React from "react";

import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, Camera, Check, ChevronsUpDown } from "lucide-react";
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
import { usePathname } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { FileUploader } from "@/components/file-uploader";
import { toast } from "sonner";
import {
  UseMutateAsyncFunction,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/text-area";
import { Separator } from "@/components/ui/separator";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { cn, isDateInPast, textTransform } from "@/lib/utils";
import { useSession } from "@/lib/hooks/use-session";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { createJobRequest } from "@/lib/actions/job";
import { ExtendedJobRequestSchemaServer } from "@/lib/db/schema/job";
import JobSectionField from "./job-section-field";
import { type CreateJobRequestSchema } from "./schema";
import { type Department, JobTypeSchema } from "prisma/generated/zod";
import axios from "axios";
import JobRequestInputSkeleton from "./job-request-input-skeleton";
import { ComboboxInput } from "@/components/ui/combobox-input";
import { Input } from "@/components/ui/input";

interface JobRequestInputProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createJobRequest>[0],
    unknown
  >;
  isPending: boolean;
  type: RequestTypeType;
  form: UseFormReturn<CreateJobRequestSchema>;
  handleOpenChange: (open: boolean) => void;
  isFieldsDirty: boolean;
}

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

  const { data, isLoading } = useQuery<Department[]>({
    queryFn: async () => {
      const res = await axios.get("/api/department/get-job-departments");
      return res.data.data;
    },
    queryKey: ["get-input-job-departments"],
  });

  const { uploadFiles, progresses, isUploading, uploadedFiles } =
    useUploadFile();

  async function onSubmit(values: CreateJobRequestSchema) {
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      if (values.images && values.images.length > 0) {
        uploadedFilesResult = await uploadFiles(values.images);
      }

      const data: ExtendedJobRequestSchemaServer = {
        description: values.description,
        type: type,
        departmentId: values.departmentId,
        dueDate: values.dueDate,
        jobType: values.jobtype,
        location: values.location,
        path: pathname,
        priority: "LOW",
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

  if (isLoading) return <JobRequestInputSkeleton />;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="scroll-bar flex max-h-[60vh] gap-6 overflow-y-auto px-4 py-1">
            <div className="flex flex-1 flex-col space-y-2">
              <div className="flex items-center gap-2 py-1">
                <JobSectionField
                  form={form}
                  name="departmentId"
                  isPending={isPending}
                  data={data}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-muted-foreground">
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="Quadrangle"
                          disabled={isPending}
                          {...field}
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
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel className="text-muted-foreground">
                        Due date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
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
                              field.onChange(
                                addDays(new Date(), parseInt(value))
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="3">In 3 days</SelectItem>
                              <SelectItem value="5">In 5 days</SelectItem>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobtype"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-muted-foreground">
                        Job type
                      </FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              disabled={isUploading || isPending}
                              role="combobox"
                              className={cn(
                                "w-[230px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <span className="truncate">
                                {field.value
                                  ? textTransform(field.value)
                                  : "Select job type"}
                              </span>
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
                                {JobTypeSchema.options.map((job, index) => (
                                  <CommandItem
                                    value={job}
                                    key={index}
                                    onSelect={() => {
                                      form.setValue("jobtype", job);
                                    }}
                                  >
                                    {textTransform(job)}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        job === field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="rounded-md border p-3">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          rows={1}
                          maxRows={7}
                          minRows={3}
                          placeholder="Job description..."
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
            </div>
          </div>
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
            <SubmitButton disabled={isUploading || isPending} className="w-28">
              Submit
            </SubmitButton>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
