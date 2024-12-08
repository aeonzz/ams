"use client";

import React from "react";

import type { SupplyRequestWithRelations } from "prisma/generated/zod";
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
  getSupplyStatusColor,
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
import {
  updateSupplyResourceRequestSchema,
  UpdateSupplyResourceRequestSchemaWithPath,
  type UpdateSupplyResourceRequestSchema,
} from "@/lib/schema/resource/supply-resource";
import { updateSupplyRequest } from "@/lib/actions/resource";
import { AlertCard } from "@/components/ui/alert-card";
import DateTimePicker from "@/components/ui/date-time-picker";
import { useSupplyResourceData } from "@/lib/hooks/use-supply-resource-data";
import SupplyRequestItemCard from "@/app/(app)/dashboard/_components/supply-request-item-card";
import AddSupplyItem from "./add-supply-item";
import AddSupplyItemWrapper from "./add-supply-item-wrapper";

interface SupplyResourceDetailsProps {
  data: SupplyRequestWithRelations;
  requestId: string;
  rejectionReason: string | null;
  requestStatus: RequestStatusTypeType;
  isCurrentUser: boolean;
  departmentId: string;
}

export default function SupplyResourceDetails({
  data,
  requestId,
  rejectionReason,
  requestStatus,
  isCurrentUser,
  departmentId,
}: SupplyResourceDetailsProps) {
  const [editField, setEditField] = React.useState<string | null>(null);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const form = useForm<UpdateSupplyResourceRequestSchema>({
    resolver: zodResolver(updateSupplyResourceRequestSchema),
    defaultValues: {
      items: data.items,
      dateAndTimeNeeded: data.dateAndTimeNeeded
        ? new Date(data.dateAndTimeNeeded)
        : undefined,
      purpose: data.purpose,
    },
  });
  const { mutateAsync, isPending } =
    useServerActionMutation(updateSupplyRequest);

  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  async function onSubmit(values: UpdateTransportRequestSchema) {
    try {
      const payload: UpdateSupplyResourceRequestSchemaWithPath = {
        path: pathname,
        id: requestId,
        ...values,
      };

      toast.promise(mutateAsync(payload), {
        loading: "Saving...",
        success: () => {
          form.reset({
            items: payload.items,
            dateAndTimeNeeded: payload.dateAndTimeNeeded,
            purpose: payload.purpose,
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

  const canEdit =
    (requestStatus === "PENDING" || requestStatus === "ON_HOLD") &&
    isCurrentUser;

  React.useEffect(() => {
    if (!canEdit) {
      setEditField(null);
    }
  }, [canEdit]);

  return (
    <>
      <div className="space-y-4 pb-10">
        <div className="space-y-1">
          {requestStatus === "APPROVED" && (
            <AlertCard
              variant="success"
              title="Ready for Pickup"
              description="The items is now ready to be picked up."
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
          <H4 className="font-semibold text-muted-foreground">
            Supply Request Details
          </H4>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <H5 className="font-semibold leading-none text-muted-foreground">
              Items:
            </H5>
            {canEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  if (editField === "addSupplyItem") {
                    setEditField(null);
                  } else {
                    setEditField("addSupplyItem");
                  }
                }}
              >
                {editField === "addSupplyItem" ? "Close" : "Add"}
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {editField === "addSupplyItem" ? (
              <AddSupplyItemWrapper
                departmentId={departmentId}
                items={data.items}
                setEditField={setEditField}
                supplyRequestId={data.id}
              />
            ) : (
              <>
                {data.items.map((item) => (
                  <SupplyRequestItemCard
                    key={item.id}
                    item={item}
                    canEdit={canEdit}
                    editField={editField}
                    setEditField={setEditField}
                    itemsCount={data.items.length}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {editField === "dateAndTimeNeeded" ? (
              <EditInput
                isPending={isPending}
                isFieldsDirty={isFieldsDirty}
                setEditField={setEditField}
                label="Date and Time Needed"
                reset={form.reset}
              >
                <DateTimePicker
                  form={form}
                  name="dateAndTimeNeeded"
                  disabled={isPending}
                />
              </EditInput>
            ) : (
              <div className="group flex items-center justify-between">
                <div className="flex w-full flex-col items-start">
                  <div className="flex space-x-1 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
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
                    className="group-hover:opacity-100 lg:opacity-0"
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
                    className="group-hover:opacity-100 lg:opacity-0"
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
          </form>
        </Form>
      </div>
      <Separator className="my-6" />
    </>
  );
}
