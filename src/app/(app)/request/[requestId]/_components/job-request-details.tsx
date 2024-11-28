"use client";

import LoadingSpinner from "@/components/loaders/loading-spinner";
import { H3, H4, H5, P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CommandShortcut } from "@/components/ui/command";
import CommandTooltip from "@/components/ui/command-tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateJobRequest } from "@/lib/actions/requests";
import { fillJobRequestEvaluationPDF } from "@/lib/fill-pdf/job-evaluation";
import { fillJobRequestFormPDF } from "@/lib/fill-pdf/job-request-form";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import {
  cn,
  formatFullName,
  getJobStatusColor,
  isDateInPast,
  textTransform,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addDays, format } from "date-fns";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Circle,
  CircleMinus,
  CirclePlus,
  Clock,
  Dot,
  Download,
  FileCheck,
  FileText,
  MapPin,
  Plus,
  RotateCw,
  Timer,
  User,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { type JobRequestWithRelations } from "prisma/generated/zod";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { toast } from "sonner";
import EditInput from "./edit-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
} from "@/components/ui/command";
import {
  updateJobRequestSchemaServer,
  UpdateJobRequestSchemaServer,
  UpdateJobRequestSchemaServerWithPath,
} from "@/lib/schema/request";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/text-area";
import { AlertCard } from "@/components/ui/alert-card";
import { jobType } from "@/app/(app)/dashboard/_components/job-request-input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JobRequestDetailsProps {
  data: JobRequestWithRelations;
  requestId: string;
  rejectionReason: string | null;
  cancellationReason: string | null;
  onHoldReason: string | null;
  requestStatus: RequestStatusTypeType;
  isCurrentUser: boolean;
}

export default function JobRequestDetails({
  data,
  requestId,
  rejectionReason,
  cancellationReason,
  onHoldReason,
  requestStatus,
  isCurrentUser,
}: JobRequestDetailsProps) {
  const customInputRef = React.useRef<HTMLInputElement>(null);
  const [customJob, setCustomJob] = React.useState("");
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [editField, setEditField] = React.useState<string | null>(null);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const form = useForm<UpdateJobRequestSchemaServer>({
    resolver: zodResolver(updateJobRequestSchemaServer),
    defaultValues: {
      jobType: data.jobType,
      location: data.location,
      description: data.description,
    },
  });

  const { mutateAsync, isPending } = useServerActionMutation(updateJobRequest);
  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  const existingFormFile = data.request.department.files.find(
    (file) => file.filePurpose === "JOB_FORM"
  )?.url;

  async function onSubmit(values: UpdateJobRequestSchemaServer) {
    try {
      const data: UpdateJobRequestSchemaServerWithPath = {
        path: pathname,
        id: requestId,
        ...values,
      };

      toast.promise(mutateAsync(data), {
        loading: "Saving...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: [requestId],
          });
          form.reset({
            jobType: data.jobType,
            location: data.location,
            description: data.description,
          });
          setEditField(null);
          return "Request updated successfully";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      });
    } catch (error) {
      console.error("Error during update:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  }
  const JobStatusColor = getJobStatusColor(data.status);
  const isEvaluated = data.jobRequestEvaluation !== null;

  const handleDownloadEvaluation = async () => {
    const generateAndDownloadPDF = async () => {
      if (data.jobRequestEvaluation) {
        try {
          const pdfBlob = await fillJobRequestEvaluationPDF(
            data.jobRequestEvaluation
          );
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `job_request_evaluation_${requestId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          return "PDF downloaded successfully";
        } catch (error) {
          console.error("Error generating PDF:", error);
          throw new Error("Failed to generate PDF");
        }
      }
    };

    toast.promise(generateAndDownloadPDF(), {
      loading: "Generating PDF...",
      success: (message) => message,
      error: (err) => `Error: ${err.message}`,
    });
  };

  let personAttended: string;
  if (data.assignedUser) {
    personAttended = formatFullName(
      data.assignedUser.firstName,
      data.assignedUser.middleName,
      data.assignedUser.lastName
    );
  }
  const requestedBy = formatFullName(
    data.request.user.firstName,
    data.request.user.middleName,
    data.request.user.lastName
  );

  const handleDownloadJobRequestForm = async () => {
    if (!existingFormFile) return;
    const generateAndDownloadPDF = async () => {
      try {
        const pdfBlob = await fillJobRequestFormPDF({
          id: data.requestId,
          description: data.description,
          location: data.location,
          createdAt: data.createdAt,
          startDate: data.startDate,
          endDate: data.endDate,
          personAttended: personAttended,
          status: requestStatus,
          requestedBy: requestedBy,
          formUrl: existingFormFile,
        });
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${existingFormFile}_${requestId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return "PDF downloaded successfully";
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error("Failed to generate PDF");
      }
    };

    toast.promise(generateAndDownloadPDF(), {
      loading: "Generating PDF...",
      success: (message) => message,
      error: (err) => `Error: ${err.message}`,
    });
  };

  useHotkeys(
    "shift+enter",
    (event) => {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    },
    {
      enableOnFormTags: true,
      enabled: editField !== null && isFieldsDirty,
    }
  );

  useHotkeys(
    "esc",
    (event) => {
      event.preventDefault();
      setEditField(null);
    },
    { enableOnFormTags: true, enabled: editField !== null }
  );

  React.useEffect(() => {
    form.reset();
  }, [editField]);

  const canEdit =
    (requestStatus === "PENDING" || requestStatus === "ON_HOLD") &&
    isCurrentUser;

  return (
    <div className="pb-10">
      <div className="space-y-4">
        <div className="space-y-1">
          {data.status === "IN_PROGRESS" && requestStatus === "APPROVED" && (
            <AlertCard
              variant="info"
              title="Transport Request in Progress"
              description="This transport request is currently underway."
              className="mb-6"
            />
          )}
          {requestStatus === "CANCELLED" && cancellationReason && (
            <AlertCard
              variant="destructive"
              title="Request Cancelled"
              description={cancellationReason}
              className="mb-6"
            />
          )}
          {requestStatus === "REJECTED" && rejectionReason && (
            <AlertCard
              variant="destructive"
              title="Request Rejected"
              description={rejectionReason}
              className="mb-6"
            />
          )}
          {requestStatus === "ON_HOLD" && onHoldReason && (
            <div>
              <AlertCard
                variant="warning"
                title="Request On Hold"
                description={onHoldReason}
                className="mb-6"
              />
              <AlertCard
                variant="info"
                title="Next Steps"
                description="You can update your request to address the issue, cancel it if no longer needed, or contact support for assistance."
                className="mb-6"
              />
            </div>
          )}
          <div className="flex h-7 items-center justify-between">
            <H4 className="font-semibold text-muted-foreground">
              Job Request Details
            </H4>
            <div className="space-x-2">
              {existingFormFile && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost2"
                      size="icon"
                      className="size-7"
                      onClick={handleDownloadJobRequestForm}
                    >
                      <Download className="size-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="flex items-center gap-3"
                    side="bottom"
                  >
                    Download job request form
                  </TooltipContent>
                </Tooltip>
              )}
              {isEvaluated && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost2"
                      size="icon"
                      className="size-7"
                      onClick={handleDownloadEvaluation}
                    >
                      <FileCheck className="size-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="flex items-center gap-3"
                    side="bottom"
                  >
                    Download evaluation form
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {data.assignedUser && (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <User className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">
                      Assigned To:{" "}
                      {data.isReassigned && (
                        <span className="text-sm text-foreground">
                          (reassigned)
                        </span>
                      )}
                    </P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>
                      {formatFullName(
                        data.assignedUser.firstName,
                        data.assignedUser.middleName,
                        data.assignedUser.lastName
                      )}
                    </P>
                  </div>
                </div>
              </div>
            )}
            {editField === "jobType" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Job Type"
                reset={form.reset}
              >
                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Popover modal>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                disabled={isPending}
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
                            <Command className="max-h-72">
                              <CommandInput placeholder="Search job..." />
                              <CommandList>
                                <CommandEmpty>No job found.</CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    onSelect={() => {
                                      setShowCustomInput(!showCustomInput);
                                      if (!showCustomInput) {
                                        setTimeout(
                                          () => customInputRef.current?.focus(),
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <FileText className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">Job Type:</P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{textTransform(data.jobType)}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("jobType");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
            {editField === "location" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Location"
                reset={form.reset}
              >
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="Location"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">Location:</P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{data.location}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("location");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
            {/* {editField === "dueDate" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Due Date"
                reset={form.reset}
              >
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Popover modal>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start px-2 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={isPending}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <CalendarIcon className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">Due Date:</P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{format(new Date(data.dueDate), "PPP p")}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("dueDate");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )} */}
            {/* {data.estimatedTime && (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <Timer className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">
                      Estimated Time:
                    </P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{`${data.estimatedTime} hours`}</P>
                  </div>
                </div>
              </div>
            )} */}
            {requestStatus === "APPROVED" && (
              <>
                <div className="group flex items-center justify-between">
                  <div className="flex w-full flex-col items-start">
                    <div className="flex space-x-1 text-muted-foreground">
                      <Circle className="h-5 w-5" />
                      <P className="font-semibold tracking-tight">
                        Job Status:
                      </P>
                    </div>
                    <div className="w-full pl-5 pt-1">
                      <Badge
                        variant={JobStatusColor.variant}
                        className="pr-3.5"
                      >
                        <Dot
                          className="mr-1 size-3"
                          strokeWidth={JobStatusColor.stroke}
                          color={JobStatusColor.color}
                        />
                        {textTransform(data.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="group flex items-center justify-between">
                  <div className="flex w-full flex-col items-start">
                    <div className="flex space-x-1 text-muted-foreground">
                      <Clock className="h-5 w-5" />
                      <P className="font-semibold tracking-tight">
                        Start Date/Time:
                      </P>
                    </div>
                    <div className="w-full pl-5 pt-1">
                      <P>
                        {data.startDate
                          ? format(new Date(data.startDate), "PPP p")
                          : "-"}
                      </P>
                    </div>
                  </div>
                </div>
                <div className="group flex items-center justify-between">
                  <div className="flex w-full flex-col items-start">
                    <div className="flex space-x-1 text-muted-foreground">
                      <Clock className="h-5 w-5" />
                      <P className="font-semibold tracking-tight">
                        End Date/Time:
                      </P>
                    </div>
                    <div className="w-full pl-5 pt-1">
                      <P>
                        {data.endDate
                          ? format(new Date(data.endDate), "PPP p")
                          : "-"}
                      </P>
                    </div>
                  </div>
                </div>
              </>
            )}
            {editField === "description" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Job Description"
                reset={form.reset}
              >
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
                          className="text-sm"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">
                      Job Description:
                    </P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P className="break-all">{data.description}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("description");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
        <PhotoProvider
          speed={() => 300}
          maskOpacity={0.8}
          loadingElement={<LoadingSpinner />}
          toolbarRender={({ onScale, scale, rotate, onRotate }) => {
            return (
              <>
                <div className="flex gap-3">
                  <CirclePlus
                    className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                    onClick={() => onScale(scale + 1)}
                  />
                  <CircleMinus
                    className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                    onClick={() => onScale(scale - 1)}
                  />
                  <RotateCw
                    className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                    onClick={() => onRotate(rotate + 90)}
                  />
                </div>
              </>
            );
          }}
        >
          <div>
            {data.images.map((image, index) => (
              <PhotoView key={index} src={image}>
                <div
                  key={index}
                  className="relative mb-3 w-full cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`Image of ${image}`}
                    placeholder="empty"
                    quality={100}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-auto w-full rounded-sm border object-contain"
                  />
                </div>
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>
      </div>
      <Separator className="my-6" />
      {/* {data.reworkAttempts.length > 0 && (
        <div className="space-y-2 pb-20">
          <P className="font-semibold text-muted-foreground">
            Rework Information
          </P>
          <div className="space-y-5">
            {data.reworkAttempts.map((rework) => (
              <div key={rework.id} className="space-y-4 rounded-md border p-3">
                <div className="space-y-1">
                  <div className="flex w-full justify-between">
                    <P className="font-semibold">Reason</P>
                    <P className="text-muted-foreground">
                      {format(new Date(rework.createdAt), "P")}
                    </P>
                  </div>
                  <P className="break-all text-muted-foreground">
                    {rework.rejectionReason}
                  </P>
                  <P>Assignee: {rework.jobRequest.assignedUser?.email}</P>
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="group flex items-center justify-between">
                    <div className="flex w-full flex-col items-start">
                      <div className="flex space-x-1 text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        <P className="font-semibold tracking-tight">
                          Start Date/Time:
                        </P>
                      </div>
                      <div className="w-full pl-5 pt-1">
                        <P>
                          {rework.reworkStartDate
                            ? format(new Date(rework.reworkStartDate), "PPP p")
                            : "-"}
                        </P>
                      </div>
                    </div>
                  </div>
                  <div className="group flex items-center justify-between">
                    <div className="flex w-full flex-col items-start">
                      <div className="flex space-x-1 text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        <P className="font-semibold tracking-tight">
                          End Date/Time:
                        </P>
                      </div>
                      <div className="w-full pl-5 pt-1">
                        <P>
                          {rework.reworkEndDate
                            ? format(new Date(rework.reworkEndDate), "PPP p")
                            : "-"}
                        </P>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
