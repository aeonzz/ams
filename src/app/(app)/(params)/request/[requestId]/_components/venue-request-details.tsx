"use client";

import React from "react";
import { H4, H5, P } from "@/components/typography/text";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Clock, Dot, MapPin } from "lucide-react";
import { VenueRequestWithRelations } from "prisma/generated/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVenueStatusColor, textTransform } from "@/lib/utils";
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
  type UpdateVenueRequestSchema,
} from "@/lib/schema/request";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import EditInput from "./edit-input";
import { useFormState } from "react-dom";

interface VenueRequestDetailsProps {
  data: VenueRequestWithRelations;
}

export default function VenueRequestDetails({
  data,
}: VenueRequestDetailsProps) {
  const { variant, color, stroke } = getVenueStatusColor(data.venue.status);
  const [editField, setEditField] = React.useState<string | null>(null);
  const form = useForm<UpdateVenueRequestSchema>({
    resolver: zodResolver(updateVenueRequestSchema),
  });

  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  async function onSubmit(values: UpdateVenueRequestSchema) {
    try {
      // const data: UpdateTransportRequestSchemaWithPath = {
      //   path: pathname,
      //   id: requestId,
      //   ...values,
      // };
      // toast.promise(mutateAsync(data), {
      //   loading: "Saving...",
      //   success: () => {
      //     queryClient.invalidateQueries({
      //       queryKey: ["activity", requestId],
      //     });
      //     queryClient.invalidateQueries({
      //       queryKey: [requestId],
      //     });
      //     socket.emit("request_update", requestId);
      //     form.reset({
      //       department: data.department,
      //       description: data.description,
      //       destination: data.destination,
      //       passengersName: data.passengersName,
      //     });
      //     setEditField(null);
      //     return "Request updated successfully";
      //   },
      //   error: (err) => {
      //     console.log(err);
      //     return err.message;
      //   },
      // });
    } catch (error) {
      console.error("Error during update:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  }
  return (
    <>
      <div className="space-y-4">
        <div className="flex h-7 items-center justify-between">
          <H4 className="font-semibold text-muted-foreground">
            Venue Request Details
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
                Request is in progress
              </TooltipContent>
            </Tooltip>
          )}
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
          </form>
        </Form>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <P>Start: {format(new Date(data.startTime), "PPP p")}</P>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <P>End: {format(new Date(data.endTime), "PPP p")}</P>
        </div>
        <div>
          <H5 className="mb-2 font-semibold text-muted-foreground">
            Setup Requirements:
          </H5>
          <ul className="ml-4 mt-2 list-disc">
            {data.setupRequirements.map((requirement, index) => (
              <li key={index} className="mb-1 text-sm">
                {requirement}
              </li>
            ))}
          </ul>
        </div>
        <Separator className="my-6" />
      </div>
    </>
  );
}
