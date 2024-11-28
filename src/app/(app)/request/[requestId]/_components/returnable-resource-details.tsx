"use client";

import { H4, H5, P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getReturnableItemStatusIcon, textTransform } from "@/lib/utils";
import { format } from "date-fns";
import {
  Book,
  Calendar,
  CalendarIcon,
  ClipboardCheck,
  Dot,
  FileText,
  MapPin,
  User,
} from "lucide-react";
import Image from "next/image";
import type { ReturnableRequestWithRelations } from "prisma/generated/zod";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateReturnableResourceRequestSchema,
  type UpdateReturnableResourceRequestSchemaWithPath,
  type UpdateReturnableResourceRequestSchema,
} from "@/lib/schema/resource/returnable-resource";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { udpateReturnableResourceRequest } from "@/lib/actions/requests";
import { Button } from "@/components/ui/button";
import EditInput from "./edit-input";
import ResourceDateTimePicker from "@/app/(app)/dashboard/_components/resource-date-time-picker";
import { useQuery } from "@tanstack/react-query";
import { ReservedReturnableItemDateAndTime } from "@/lib/schema/utils";
import axios from "axios";
import { Textarea } from "@/components/ui/text-area";
import { Input } from "@/components/ui/input";
import { AlertCard } from "@/components/ui/alert-card";

interface ReturnableResourceDetailsProps {
  data: ReturnableRequestWithRelations;
  requestId: string;
  rejectionReason: string | null;
  cancellationReason: string | null;
  onHoldReason: string | null;
  requestStatus: RequestStatusTypeType;
  isCurrentUser: boolean;
}

export default function ReturnableResourceDetails({
  data,
  requestId,
  rejectionReason,
  cancellationReason,
  onHoldReason,
  requestStatus,
  isCurrentUser,
}: ReturnableResourceDetailsProps) {
  const { itemId } = data;
  const pathname = usePathname();
  const [editField, setEditField] = React.useState<string | null>(null);
  const { icon: Icon, variant } = getReturnableItemStatusIcon(data.item.status);

  const form = useForm<UpdateReturnableResourceRequestSchema>({
    resolver: zodResolver(updateReturnableResourceRequestSchema),
    defaultValues: {
      location: data.location,
      dateAndTimeNeeded: data.dateAndTimeNeeded
        ? new Date(data.dateAndTimeNeeded)
        : undefined,
      returnDateAndTime: data.returnDateAndTime
        ? new Date(data.returnDateAndTime)
        : undefined,
      purpose: data.purpose,
      notes: data.notes || "",
    },
  });

  const {
    data: reservedDates,
    isLoading: reservedDatesLoading,
    refetch,
  } = useQuery<ReservedReturnableItemDateAndTime[]>({
    queryFn: async () => {
      if (!itemId) return [];
      const res = await axios.get(
        `/api/reserved-dates/resource-items/returnable/${itemId}`
      );
      return res.data.data;
    },
    queryKey: [requestId, itemId],
    enabled: !!itemId,
  });

  const disabledTimeRanges = React.useMemo(() => {
    return (
      reservedDates
        ?.filter((reservation) => reservation.request.status === "APPROVED")
        .map(({ dateAndTimeNeeded, returnDateAndTime }) => ({
          start: new Date(dateAndTimeNeeded),
          end: new Date(returnDateAndTime),
        })) ?? []
    );
  }, [reservedDates]);

  const { mutateAsync, isPending } = useServerActionMutation(
    udpateReturnableResourceRequest
  );
  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  async function onSubmit(values: UpdateReturnableResourceRequestSchema) {
    try {
      if (
        values.dateAndTimeNeeded &&
        values.returnDateAndTime &&
        values.dateAndTimeNeeded > values.returnDateAndTime
      ) {
        form.setError("dateAndTimeNeeded", {
          type: "manual",
          message:
            "Date and time needed must not be later than the return date and time",
        });
        form.setError("returnDateAndTime", {
          type: "manual",
          message:
            "The return date and time must be after the date and time needed.",
        });
        return;
      }

      const data: UpdateReturnableResourceRequestSchemaWithPath = {
        path: pathname,
        id: requestId,
        ...values,
      };
      toast.promise(mutateAsync(data), {
        loading: "Saving...",
        success: () => {
          form.reset({
            location: data.location,
            dateAndTimeNeeded: data.dateAndTimeNeeded,
            returnDateAndTime: data.returnDateAndTime,
            purpose: data.purpose,
            notes: data.notes,
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
              title="Request In Progress"
              description="The request is being processed, or the item is currently being borrowed."
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
          {data.inProgress && data.isOverdue && (
            <AlertCard
              variant="warning"
              title="Request Overdue"
              description="This request is overdue. The item has not been returned yet. Please return it as soon as possible."
              className="mb-6"
            />
          )}
          {data.isOverdue && (
            <AlertCard
              variant="warning"
              title="Request Overdue"
              description="This request is overdue."
              className="mb-6"
            />
          )}
          {data.isLost && data.lostReason && (
            <AlertCard
              variant="destructive"
              title="Item Lost"
              description={`Reason: ${data.lostReason}`}
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
          <H4 className="font-semibold text-muted-foreground">
            Borrow Request Details
          </H4>
        </div>
        <div>
          <H5 className="mb-2 font-semibold text-muted-foreground">Item:</H5>
          <Card>
            <CardHeader className="p-3">
              <div className="flex w-full space-x-3">
                <div className="relative aspect-square h-16 cursor-pointer transition-colors hover:brightness-75">
                  <Image
                    src={data.item.imageUrl}
                    alt={`Image of ${data.item.subName}`}
                    fill
                    className="rounded-md border object-cover"
                  />
                </div>
                <div className="flex flex-grow flex-col justify-between">
                  <div className="space-y-1 truncate">
                    <P className="truncate font-semibold">
                      {data.item.inventory.name} - {data.item.subName}
                    </P>
                    <P className="text-xs text-muted-foreground">
                      {data.item.serialNumber}
                    </P>
                    <Badge variant={variant} className="ml-auto">
                      <Icon className="mr-1 size-4" />
                      {textTransform(data.item.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {editField === "location" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                reset={form.reset}
                label="Location"
              >
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="Comlab"
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
                    <P className="text-wrap break-all">{data.location}</P>
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
            {editField === "dateAndTimeNeeded" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Date and Time Needed"
                reset={form.reset}
              >
                <ResourceDateTimePicker
                  form={form}
                  name="dateAndTimeNeeded"
                  isLoading={reservedDatesLoading}
                  disabled={isPending}
                  disabledTimeRanges={disabledTimeRanges}
                  reservations={reservedDates}
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <CalendarIcon className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">
                      Date and Time Needed:
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
            {editField === "returnDateAndTime" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Return Date and Time"
                reset={form.reset}
              >
                <ResourceDateTimePicker
                  form={form}
                  name="returnDateAndTime"
                  isLoading={reservedDatesLoading}
                  disabled={isPending}
                  disabledTimeRanges={disabledTimeRanges}
                  reservations={reservedDates}
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <CalendarIcon className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">
                      Return Date and Time:
                    </P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P>{format(new Date(data.returnDateAndTime), "PPP p")}</P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("returnDateAndTime");
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
            {editField === "notes" ? (
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
                    <Book className="h-5 w-5" />
                    <P className="font-semibold tracking-tight">Notes:</P>
                  </div>
                  <div className="w-full pl-5 pt-1">
                    <P className="text-wrap break-all">
                      {data.notes ? data.notes : "-"}
                    </P>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="link"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditField("notes");
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
        {requestStatus === "COMPLETED" && (
          <>
            {data.isOverdue && <Badge variant="destructive">Overdue</Badge>}
            {!data.isLost && (
              <>
                <div className="group flex items-center justify-between">
                  <div className="flex w-full flex-col items-start">
                    <div className="flex space-x-1 text-muted-foreground">
                      <CalendarIcon className="h-5 w-5" />
                      <P className="font-semibold tracking-tight">
                        Actual Return Time:
                      </P>
                    </div>
                    <div className="w-full pl-5 pt-1">
                      <P>
                        {data.actualReturnDate
                          ? format(new Date(data.actualReturnDate), "PPP p")
                          : "-"}
                      </P>
                    </div>
                  </div>
                </div>
                <div className="group flex items-center justify-between">
                  <div className="flex w-full flex-col items-start">
                    <div className="flex space-x-1 text-muted-foreground">
                      <ClipboardCheck className="h-5 w-5" />
                      <P className="font-semibold tracking-tight">
                        Return Condition:
                      </P>
                    </div>
                    <div className="w-full pl-5 pt-1">
                      <P>{data.returnCondition}</P>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
