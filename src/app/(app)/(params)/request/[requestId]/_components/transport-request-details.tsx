"use client";

import React from "react";

import {
  type TransportRequestWithRelations,
  type GenericAuditLog,
} from "prisma/generated/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { H4, H5, P } from "@/components/typography/text";
import {
  Book,
  Calendar,
  Dot,
  Ellipsis,
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
  getChangeTypeInfo,
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
import EditTimeInput from "./edit-time-input";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

interface TransportRequestDetailsProps {
  data: TransportRequestWithRelations;
  requestId: string;
  cancellationReason: string | null;
  requestStatus: RequestStatusTypeType;
  isCurrentUser: boolean;
}

export default function TransportRequestDetails({
  data,
  requestId,
  cancellationReason,
  requestStatus,
  isCurrentUser,
}: TransportRequestDetailsProps) {
  const [editField, setEditField] = React.useState<string | null>(null);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const form = useForm<UpdateTransportRequestSchema>({
    resolver: zodResolver(updateTransportRequestSchema),
    defaultValues: {
      department: data.department,
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
  const { data: logs, isLoading } = useQuery<GenericAuditLog[]>({
    queryFn: async () => {
      const res = await axios.get(`/api/audit-log/request-log/${requestId}`);
      return res.data.data;
    },
    queryKey: ["activity", requestId],
  });

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
            queryKey: ["activity", requestId],
          });
          queryClient.invalidateQueries({
            queryKey: [requestId],
          });
          form.reset({
            department: data.department,
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
      <div className="space-y-4">
        <div className="flex h-7 items-center justify-between">
          <H4 className="font-semibold text-muted-foreground">
            Transport Request Details
          </H4>
          {data.inProgress && (
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
          )}
        </div>
        <div>
          <H5 className="mb-2 font-semibold text-muted-foreground">Vehicle:</H5>
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
                <div className="flex flex-grow flex-col justify-between">
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
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {editField === "destination" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Destination"
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
                    className="opacity-0 group-hover:opacity-100"
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
            {editField === "department" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Office/Dept."
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
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("department");
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
            {editField === "passengersName" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Passengers."
              >
                <FormField
                  control={form.control}
                  name="passengersName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TagInput
                          placeholder="Enter passenger name"
                          disabled={isPending}
                          value={field.value || []}
                          autoFocus
                          onChange={field.onChange}
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
                    className="opacity-0 group-hover:opacity-100"
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
              >
                <EditTimeInput
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
                    className="opacity-0 group-hover:opacity-100"
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
        {cancellationReason && (
          <Card>
            <CardHeader>
              <H5 className="font-semibold leading-none">
                Cancellation Reason
              </H5>
              <CardDescription>{cancellationReason}</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
      <Separator className="my-6" />
      <div className="space-y-4 pb-20">
        <H4 className="font-semibold">Activity</H4>
        {isLoading ? (
          <>
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </>
        ) : (
          <div className="space-y-4">
            {logs?.map((activity) => {
              const {
                color,
                icon: Icon,
                message,
              } = getChangeTypeInfo(activity.changeType);
              return (
                <div key={activity.id} className="flex items-center space-x-2">
                  <Icon className="size-5" color={color} />
                  <P className="inline-flex items-center text-muted-foreground">
                    {message}
                    <Dot /> {format(new Date(activity.timestamp), "MMM d")}
                  </P>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
