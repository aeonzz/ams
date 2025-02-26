"use client";

import React from "react";

import { type TransportRequestWithRelations } from "prisma/generated/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { H4, H5, P } from "@/components/typography/text";
import {
  Book,
  Calendar,
  CalendarCheck,
  Dot,
  Download,
  Ellipsis,
  Gauge,
  LandPlot,
  MapPin,
  PencilLine,
  Users,
  UsersRound,
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatFullName,
  getVehicleStatusColor,
  textTransform,
} from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateTransportRequestSchema,
  UpdateTransportRequestSchema,
  UpdateTransportRequestSchemaWithPath,
} from "@/lib/schema/request";
import { InputIcon } from "@radix-ui/react-icons";
import { Textarea } from "@/components/ui/text-area";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateTransportRequest } from "@/lib/actions/requests";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useHotkeys } from "react-hotkeys-hook";
import { CommandShortcut } from "@/components/ui/command";
import EditInput from "./edit-input";
import { TagInput } from "@/components/ui/tag-input";
import TransportEditTimeInput from "./transport-edit-time-input";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import CommandTooltip from "@/components/ui/command-tooltip";
import { fillTransportRequestFormPDF } from "@/lib/fill-pdf/transport-request-form";
import { AlertCard } from "@/components/ui/alert-card";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { PermissionGuard } from "@/components/permission-guard";
import CalendarVehicleScheduleSheet from "./calendar-vehicle-schedule-sheet";
import { useSession } from "@/lib/hooks/use-session";

interface TransportRequestDetailsProps {
  data: TransportRequestWithRelations;
  requestId: string;
  rejectionReason: string | null;
  cancellationReason: string | null;
  onHoldReason: string | null;
  requestStatus: RequestStatusTypeType;
  isCurrentUser: boolean;
  completedAt: Date | null;
  departmentId: string;
}

export default function TransportRequestDetails({
  data,
  requestId,
  rejectionReason,
  requestStatus,
  isCurrentUser,
  cancellationReason,
  onHoldReason,
  completedAt,
  departmentId
}: TransportRequestDetailsProps) {
  const [editField, setEditField] = React.useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const currentUser = useSession()
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const form = useForm<UpdateTransportRequestSchema>({
    resolver: zodResolver(updateTransportRequestSchema),
    defaultValues: {
      description: data.description,
      destination: data.destination,
      passengersName: data.passengersName,
    },
  });
  const { mutateAsync, isPending } = useServerActionMutation(
    updateTransportRequest
  );
  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;
  const { variant, color, stroke } = getVehicleStatusColor(data.vehicle.status);

  async function onSubmit(values: UpdateTransportRequestSchema) {
    try {
      const data: UpdateTransportRequestSchemaWithPath = {
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
            description: data.description,
            destination: data.destination,
            passengersName: data.passengersName,
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

  const existingFormFile = data.request.department.files.find(
    (file) => file.filePurpose === "TRANSPORT_FORM"
  )?.url;

  const handleDownloadTransportRequestForm = async () => {
    if (!existingFormFile) return;

    const requestedBy = formatFullName(
      data.request.user.firstName,
      data.request.user.middleName,
      data.request.user.lastName
    );

    const departmentHead = data.request.department.userRole.find(
      (role) => role.role.name === "DEPARTMENT_HEAD"
    )?.user;

    const generateAndDownloadPDF = async () => {
      setIsGeneratingPdf(true);
      try {
        const pdfBlob = await fillTransportRequestFormPDF({
          createdAt: data.createdAt,
          requestedBy: requestedBy,
          requestedByCopy: requestedBy,
          office: data.department.name,
          destination: data.destination,
          numberOfPassengers: data.passengersName.length,
          passengersName: data.passengersName,
          vehicle: data.vehicle.name,
          dateOfTravel: data.dateAndTimeNeeded,
          description: data.description,
          status: requestStatus,
          formUrl: existingFormFile,
          departmentHead: departmentHead
            ? formatFullName(
                departmentHead.firstName,
                departmentHead.middleName,
                departmentHead.lastName
              )
            : "N/A",
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
        setIsGeneratingPdf(false);
        console.error("Error generating PDF:", error);
        throw new Error("Failed to generate PDF");
      }
    };

    toast.promise(generateAndDownloadPDF(), {
      loading: "Generating PDF...",
      success: (message) => {
        setIsGeneratingPdf(false);
        return message;
      },
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
    <>
      <div className="space-y-4 pb-10">
        <div className="space-y-1">
          {data.inProgress && requestStatus === "APPROVED" && (
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
              Transport Request Details
            </H4>
            {existingFormFile && requestStatus === "COMPLETED" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost2"
                    size="icon"
                    disabled={isGeneratingPdf}
                    className="size-7"
                    onClick={handleDownloadTransportRequestForm}
                  >
                    {isGeneratingPdf ? (
                      <LoadingSpinner className="size-4 text-muted-foreground" />
                    ) : (
                      <Download className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="flex items-center gap-3"
                  side="bottom"
                >
                  <P>Download transport request form</P>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <H5 className="mb-2 font-semibold text-muted-foreground">
              Vehicle:
            </H5>
            <PermissionGuard
              allowedRoles={["OPERATIONS_MANAGER"]}
              allowedDepartment={departmentId}
              currentUser={currentUser}
            >
              <CalendarVehicleScheduleSheet vehicleId={data.vehicleId} />
            </PermissionGuard>
          </div>
          <Card>
            <CardHeader className="p-3">
              <div className="flex w-full space-x-3">
                <div className="relative aspect-square h-16 cursor-pointer transition-colors hover:brightness-75">
                  <Image
                    src={data.vehicle.imageUrl}
                    alt={`Image of ${data.vehicle.name}`}
                    fill
                    className="rounded-md border object-cover"
                  />
                </div>
                <div className="flex flex-grow justify-between">
                  <div className="space-y-1 truncate">
                    <P className="truncate font-semibold">
                      {data.vehicle.name}
                    </P>
                    <P className="text-xs text-muted-foreground">
                      {data.vehicle.type}
                    </P>
                    <Badge variant={variant} className="pr-3.5">
                      <Dot
                        className="mr-1 size-3"
                        strokeWidth={stroke}
                        color={color}
                      />
                      {textTransform(data.vehicle.status)}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    Capacity: {data.vehicle.capacity}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="group flex items-center justify-between">
              <div className="flex w-full flex-col items-start">
                <div className="flex space-x-1 text-muted-foreground">
                  <UsersRound className="h-5 w-5" />
                  <P className="font-semibold tracking-tight">Department:</P>
                </div>
                <div className="w-full pl-5 pt-1">
                  <P>{data.department.name}</P>
                </div>
              </div>
            </div>
            {completedAt && (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <CalendarCheck className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">Completed:</P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{format(new Date(completedAt), "PPP p")}</P>
                  </div>
                </div>
              </div>
            )}
            {editField === "destination" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Destination"
                reset={form.reset}
              >
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          autoFocus
                          maxLength={70}
                          disabled={isPending}
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
                    <MapPin className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">Destination:</P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{data.destination}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="lg:opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("destination");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
            {/* {editField === "department" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Office/Dept."
                reset={form.reset}
              >
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          autoFocus
                          maxLength={50}
                          disabled={isPending}
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
                    <Users className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">
                      Office/Dept.:
                    </P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{data.department}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="lg:opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("department");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )} */}
            {editField === "passengersName" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Passengers."
                reset={form.reset}
              >
                <FormField
                  control={form.control}
                  name="passengersName"
                  render={({ field }) => {
                    const maxCapacity = data.vehicle.capacity ?? 0;

                    return (
                      <FormItem className="flex flex-grow flex-col">
                        <FormControl>
                          <TagInput
                            placeholder={`Enter passenger name (max: ${maxCapacity})`}
                            disabled={isPending || maxCapacity === 0}
                            value={field.value || []}
                            onChange={(value) => {
                              if (value.length <= maxCapacity) {
                                field.onChange(value);
                              } else {
                                toast.error(
                                  `Maximum capacity of ${maxCapacity} passengers reached.`
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <UsersRound className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">Passengers:</P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{data.passengersName.join(", ")}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="lg:opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("passengersName");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
            {editField === "dateAndTimeNeeded" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Date of Travel"
                reset={form.reset}
              >
                <TransportEditTimeInput
                  form={form}
                  vehicleId={data.vehicleId}
                  isPending={isPending}
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">
                      Date of Travel:
                    </P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{format(new Date(data.dateAndTimeNeeded), "PPP p")}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="lg:opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("dateAndTimeNeeded");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
            {editField === "description" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Purpose"
                reset={form.reset}
              >
                <FormField
                  control={form.control}
                  name="description"
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
                    <P className="text-wrap break-all">{data.description}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="lg:opacity-0 group-hover:opacity-100"
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
            {data.actualStart && (
              <>
                <div className="group flex items-center justify-between">
                  <div className="flex w-full flex-col items-start">
                    <div className="flex space-x-1 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                      <P className="font-semibold tracking-tight">
                        Actual Start Time:
                      </P>
                    </div>
                    <div className="w-full pl-5 pt-1">
                      <P>{format(new Date(data.actualStart), "PPP p")}</P>
                    </div>
                  </div>
                </div>
                <div className="group flex items-center justify-between">
                  <div className="flex w-full flex-col items-start">
                    <div className="flex space-x-1 text-muted-foreground">
                      <Gauge className="h-5 w-5" />
                      <P className="font-semibold tracking-tight">
                        Initial Odometer Reading:
                      </P>
                    </div>
                    <div className="w-full pl-5 pt-1">
                      <P>{data.odometerStart}</P>
                    </div>
                  </div>
                </div>
                <div className="group flex items-center justify-between">
                  <div className="flex w-full flex-col items-start">
                    <div className="flex space-x-1 text-muted-foreground">
                      <Gauge className="h-5 w-5" />
                      <P className="font-semibold tracking-tight">
                        Final Odometer Reading:
                      </P>
                    </div>
                    <div className="w-full pl-5 pt-1">
                      <P>{data.odometerEnd ? data.odometerEnd : "-"}</P>
                    </div>
                  </div>
                </div>
                <div className="group flex items-center justify-between">
                  <div className="flex w-full flex-col items-start">
                    <div className="flex space-x-1 text-muted-foreground">
                      <LandPlot className="h-5 w-5" />
                      <P className="font-semibold tracking-tight">
                        Total Distance Travelled:
                      </P>
                    </div>
                    <div className="w-full pl-5 pt-1">
                      <P>
                        {data.totalDistanceTravelled ? (
                          <>
                            {data.totalDistanceTravelled}{" "}
                            <span className="text-muted-foreground">km</span>
                          </>
                        ) : (
                          "-"
                        )}
                      </P>
                    </div>
                  </div>
                </div>
              </>
            )}
          </form>
        </Form>
        <Separator className="my-6" />
      </div>
    </>
  );
}
