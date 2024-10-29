"use client";

import React from "react";
import { H4, H5, P } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Book,
  CalendarIcon,
  Clock,
  Dot,
  Download,
  Info,
  MapPin,
  Settings,
} from "lucide-react";
import type {
  VenueRequestWithRelations,
  VenueSetupRequirement,
} from "prisma/generated/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatFullName,
  getVenueStatusColor,
  textTransform,
} from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  updateVenueRequestSchema,
  type UpdateVenueRequestSchemaWithPath,
  type UpdateVenueRequestSchema,
} from "@/lib/schema/request";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import EditInput from "./edit-input";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import VenueEditTimeInput from "./venue-edit-time-input";
import { Button } from "@/components/ui/button";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import { udpateVenueRequest } from "@/lib/actions/requests";
import { socket } from "@/app/socket";
import { usePathname } from "next/navigation";
import MultiSelect from "@/components/multi-select";
import { Textarea } from "@/components/ui/text-area";
import { useHotkeys } from "react-hotkeys-hook";
import RejectionReasonCard from "./rejection-reason-card";
import { AlertCard } from "@/components/ui/alert-card";
import CommandTooltip from "@/components/ui/command-tooltip";
import { CommandShortcut } from "@/components/ui/command";
import { fillVenueRequestFormPDF } from "@/lib/fill-pdf/venue-request-form";

interface VenueRequestDetailsProps {
  data: VenueRequestWithRelations;
  requestId: string;
  rejectionReason: string | null;
  requestStatus: RequestStatusTypeType;
  isCurrentUser: boolean;
}

export default function VenueRequestDetails({
  data,
  requestId,
  rejectionReason,
  requestStatus,
  isCurrentUser,
}: VenueRequestDetailsProps) {
  const pathname = usePathname();
  const { variant, color, stroke } = getVenueStatusColor(data.venue.status);
  const [editField, setEditField] = React.useState<string | null>(null);
  const form = useForm<UpdateVenueRequestSchema>({
    resolver: zodResolver(updateVenueRequestSchema),
    defaultValues: {
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      purpose: data.purpose,
      notes: data.notes ?? undefined,
      setupRequirements: data.setupRequirements,
    },
  });

  const { mutateAsync, isPending } =
    useServerActionMutation(udpateVenueRequest);
  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  async function onSubmit(values: UpdateVenueRequestSchema) {
    try {
      if (
        values.startTime &&
        values.endTime &&
        values.startTime > values.endTime
      ) {
        form.setError("startTime", {
          type: "manual",
          message: "Start time must not be later than the end time",
        });
        form.setError("endTime", {
          type: "manual",
          message: "The end time must be after the start time.",
        });
        return;
      }

      const data: UpdateVenueRequestSchemaWithPath = {
        path: pathname,
        id: requestId,
        ...values,
      };
      toast.promise(mutateAsync(data), {
        loading: "Saving...",
        success: () => {
          socket.emit("request_update", requestId);
          form.reset({
            startTime: data.startTime,
            endTime: data.endTime,
            purpose: data.purpose,
            notes: data.notes ?? undefined,
            setupRequirements: data.setupRequirements,
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

  const departmentHead = data.request.department.userRole.find(
    (role) => role.role.name === "DEPARTMENT_HEAD"
  )?.user;
  console.log(data.request.department.userRole, departmentHead)

  const existingFormFile = data.request.department.files.find(
    (file) => file.filePurpose === "VENUE_FORM"
  )?.url;

  const handleDownloadVenueRequestForm = async () => {
    if (!existingFormFile) return;

    const requestedBy = formatFullName(
      data.request.user.firstName,
      data.request.user.middleName,
      data.request.user.lastName
    );

    const generateAndDownloadPDF = async () => {
      try {
        const pdfBlob = await fillVenueRequestFormPDF({
          requestedBy: requestedBy,
          requestedByAlt: requestedBy,
          createdAt: data.createdAt,
          venue: data.venue.name,
          dateReserved: data.startTime,
          purpose: data.purpose,
          equipmentNeeded: data.setupRequirements.join(", "),
          status: requestStatus,
          departmentHead: departmentHead
            ? formatFullName(
                departmentHead.firstName,
                departmentHead.middleName,
                departmentHead.lastName
              )
            : "N/A",
          formUrl: existingFormFile,
        });
        const url = URL.createObjectURL(pdfBlob);
        const cleanedFileName = existingFormFile.replace("/resources/", "");
        console.log("Original filename:", existingFormFile);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${cleanedFileName}_${requestId}.pdf`;
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

  const canEdit = requestStatus === "PENDING" && isCurrentUser;

  return (
    <>
      <div className="space-y-4 pb-10">
        <div className="space-y-1">
          {data.inProgress && (
            <div>
              <AlertCard
                variant="info"
                title="Ongoing Venue Reservation"
                description="This venue reservation is currently active. Please ensure that all necessary preparations and arrangements are in place."
              />

              <Separator className="my-6" />
            </div>
          )}
          <RejectionReasonCard rejectionReason={rejectionReason} />
          <div className="flex h-7 items-center justify-between">
            <H4 className="font-semibold text-muted-foreground">
              Venue Request Details
            </H4>
            {existingFormFile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost2"
                    size="icon"
                    className="size-7"
                    onClick={handleDownloadVenueRequestForm}
                  >
                    <Download className="size-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="flex items-center gap-3"
                  side="bottom"
                >
                  <CommandTooltip text="Download venue request form">
                    <CommandShortcut>Ctrl</CommandShortcut>
                    <CommandShortcut>Shift</CommandShortcut>
                    <CommandShortcut>D</CommandShortcut>
                  </CommandTooltip>
                </TooltipContent>
              </Tooltip>
            )}
            {/* {data.inProgress && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex animate-pulse cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-tertiary">
                  <div className="size-1.5 rounded-full bg-blue-500" />
                  <P className="font-semibold leading-none text-blue-500">
                    In Progress
                  </P>
                </div>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-3" side="bottom">
                Transport is in progress
              </TooltipContent>
            </Tooltip>
          )} */}
          </div>
        </div>
        <div>
          <H5 className="mb-2 font-semibold text-muted-foreground">Venue:</H5>
          <Card>
            <CardHeader className="p-3">
              <div className="flex w-full space-x-3">
                <div className="relative aspect-square h-16 cursor-pointer transition-colors hover:brightness-75">
                  <Image
                    src={data.venue.imageUrl}
                    alt={`Image of ${data.venue.name}`}
                    fill
                    className="rounded-md border object-cover"
                  />
                </div>
                <div className="flex flex-grow flex-col justify-between">
                  <div className="space-y-1 truncate">
                    <P className="truncate font-semibold">{data.venue.name}</P>
                    <Badge variant={variant} className="pr-3.5">
                      <Dot
                        className="mr-1 size-3"
                        strokeWidth={stroke}
                        color={color}
                      />
                      {textTransform(data.venue.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {editField === "startTime" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Start Time"
                reset={form.reset}
              >
                <VenueEditTimeInput
                  form={form}
                  venueId={data.venueId}
                  isPending={isPending}
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <CalendarIcon className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">Start Time:</P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{format(new Date(data.startTime), "PPP p")}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("startTime");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
            {editField === "endTime" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="End Time"
                reset={form.reset}
              >
                <VenueEditTimeInput
                  form={form}
                  venueId={data.venueId}
                  isPending={isPending}
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <CalendarIcon className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">End Time:</P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{format(new Date(data.endTime), "PPP p")}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("endTime");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
            {data.actualEndtime && (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <CalendarIcon className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">
                      Actual End Time:
                    </P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{format(new Date(data.actualEndtime), "PPP p")}</P>
                  </div>
                </div>
              </div>
            )}
            {editField === "setupRequirements" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Setup Requirements"
                reset={form.reset}
              >
                <MultiSelect
                  form={form}
                  name="setupRequirements"
                  label="Setup Requirements"
                  items={data.venue.venueSetupRequirement}
                  isPending={isPending}
                  placeholder="Select items"
                  emptyMessage="No items found."
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <Settings className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">
                      Setup Requirements:
                    </P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <ul className="ml-4 mt-2 list-disc">
                      {data.setupRequirements.map((requirement, index) => (
                        <li key={index} className="mb-1 text-sm">
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("setupRequirements");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
            {editField === "purpose" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Purpose"
                reset={form.reset}
              >
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          autoComplete="off"
                          autoFocus
                          maxLength={700}
                          disabled={isPending}
                          className="text-sm"
                          spellCheck={false}
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
                    <Book className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">Purpose:</P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P className="text-wrap break-all">{data.purpose}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("purpose");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
            {editField === "info" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Other Info"
                reset={form.reset}
              >
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          autoComplete="off"
                          autoFocus
                          maxLength={700}
                          disabled={isPending}
                          className="text-sm"
                          spellCheck={false}
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
                    <Info className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">Other Info:</P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P className="text-wrap break-all">{data.notes}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("info");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
        <Separator className="my-6" />
      </div>
    </>
  );
}
