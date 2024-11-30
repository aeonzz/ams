"use client";

import React from "react";

import {
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Check,
  ChevronsUpDown,
  Plus,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePathname } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { FileUploader } from "@/components/file-uploader";
import { toast } from "sonner";
import {
  UseMutateAsyncFunction,
  useQuery,
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
import { type Department } from "prisma/generated/zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "usehooks-ts";
import DepartmentInput from "./department-input";
import { AnimatePresence, motion } from "framer-motion";
import { outExpo } from "@/lib/easings";

const fadeScaleVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const jobType = [
  "REPAIRS",
  "INSTALLATION",
  "INSPECTION",
  "UPGRADES_RENOVATIONS",
  "PREVENTIVE_MAINTENANCE",
  "CALIBRATION_TESTING",
  "CLEANING_JANITORIAL",
  "PAINTING_SURFACE_TREATMENT",
  "LANDSCAPING_GROUNDS_MAINTENANCE",
  "TROUBLESHOOTING",
] as const;

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
  const pathname = usePathname();
  const currentUser = useSession();
  const customInputRef = React.useRef<HTMLInputElement>(null);
  const [customJob, setCustomJob] = React.useState("");
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const selectedDepartment = form.watch("department");

  const { data, isLoading } = useQuery<Department[]>({
    queryFn: async () => {
      const res = await axios.get("/api/department/get-job-departments");
      return res.data.data;
    },
    queryKey: ["get-input-job-departments"],
  });

  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] }
  );

  async function onSubmit(values: CreateJobRequestSchema) {
    try {
      const uploadAndSubmit = async () => {
        let currentFiles = uploadedFiles;

        if (values.images && values.images.length > 0) {
          currentFiles = await onUpload(values.images);
        }

        const data: ExtendedJobRequestSchemaServer = {
          description: values.description,
          type: type,
          department: values.department,
          departmentId: values.departmentId,
          jobType: values.jobType,
          location: values.location,
          path: pathname,
          priority: "NO_PRIORITY",
          ...(currentFiles.length > 0 && {
            images: currentFiles.map((result) => result.url),
          }),
        };

        await mutateAsync(data);
      };

      toast.promise(uploadAndSubmit(), {
        loading: "Submitting...",
        success: () => {
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

  const departmentItems = currentUser.userDepartments.map((ud) => ({
    id: ud.department.id,
    name: ud.department.name,
  }));

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {selectedDepartment ? (
              <motion.div
                key="form-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1, ease: outExpo }}
              >
                <div className="scroll-bar flex max-h-[60vh] gap-6 overflow-y-auto px-4 py-1">
                  <div className="flex flex-1 flex-col space-y-2">
                    <JobSectionField
                      form={form}
                      name="departmentId"
                      isPending={isPending || isUploading}
                      data={data}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="off"
                              placeholder="Quadrangle"
                              disabled={isPending || isUploading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div
                      className={cn(
                        "flex gap-2 py-1",
                        isDesktop ? "flex-row items-center" : "flex-col"
                      )}
                    >
                      {/* <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel>Due date</FormLabel>
                    <Popover modal>
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
              /> */}
                      <FormField
                        control={form.control}
                        name="jobType"
                        render={({ field }) => (
                          <FormItem className="flex flex-1 flex-col">
                            <FormLabel>Job type</FormLabel>
                            <Popover modal>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    disabled={isUploading || isPending}
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between",
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
                              <PopoverContent
                                className="w-[230px] p-0"
                                align="start"
                              >
                                <Command className="max-h-64">
                                  <CommandInput placeholder="Search job..." />
                                  <CommandList>
                                    <CommandEmpty>No job found.</CommandEmpty>
                                    <CommandGroup>
                                      <CommandItem
                                        onSelect={() => {
                                          setShowCustomInput(!showCustomInput);
                                          if (!showCustomInput) {
                                            setTimeout(
                                              () =>
                                                customInputRef.current?.focus(),
                                              0
                                            );
                                          }
                                        }}
                                      >
                                        <Plus className="mr-2 size-4" />
                                        Other
                                      </CommandItem>
                                      {jobType.map((job, index) => (
                                        <CommandItem
                                          value={job}
                                          key={index}
                                          onSelect={() => {
                                            field.onChange(job);
                                            setCustomJob("");
                                            setShowCustomInput(false);
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
                                {showCustomInput && (
                                  <>
                                    <Separator />
                                    <div className="flex flex-col items-center gap-1 p-2">
                                      <Input
                                        type="text"
                                        autoFocus
                                        placeholder="Enter custom job type"
                                        ref={customInputRef}
                                        className="w-full"
                                        value={customJob}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setCustomJob(value);
                                          field.onChange(value);
                                        }}
                                      />
                                    </div>
                                  </>
                                )}
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
                                className="border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
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
                      variant="secondary"
                      disabled={isUploading || isPending}
                    >
                      Back
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
              </motion.div>
            ) : (
              <motion.div
                key="department-select"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1, ease: outExpo }}
                className="flex h-[350px] w-full items-center justify-center"
              >
                <DepartmentInput
                  form={form}
                  name="department"
                  label="Requesting as"
                  items={departmentItems}
                  isPending={isPending}
                  isLoading={isLoading}
                  placeholder="Select a department"
                  emptyMessage="No departments found"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </>
  );
}
