"use client";

import VenueDateTimePicker from "@/app/(app)/dashboard/_components/venue-date-time-picker";
import DateTimePicker from "@/components/ui/date-time-picker";
import type { UpdateVenueRequestSchema } from "@/lib/schema/request";
import {
  ReservedDatesAndTimes,
  type ReservedTransportDateAndTime,
} from "@/lib/schema/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { type UseFormReturn } from "react-hook-form";

interface VenueEditTimeInputProps {
  form: UseFormReturn<UpdateVenueRequestSchema>;
  venueId: string;
  isPending: boolean;
}

export default function VenueEditTimeInput({
  form,
  venueId,
  isPending,
}: VenueEditTimeInputProps) {
  const { data, isLoading, refetch, isRefetching } = useQuery<
    ReservedDatesAndTimes[]
  >({
    queryFn: async () => {
      if (!venueId) return [];
      const res = await axios.get(`/api/reserved-dates/venue/${venueId}`);
      return res.data.data;
    },
    queryKey: [venueId],
    enabled: !!venueId,
    refetchOnWindowFocus: false,
  });

  const disabledTimeRanges = React.useMemo(() => {
    return (
      data
        ?.filter((item) => item.request.status === "APPROVED")
        .map(({ startTime, endTime }) => ({
          start: new Date(startTime),
          end: new Date(endTime),
        })) ?? []
    );
  }, [data]);

  return (
    <VenueDateTimePicker
      form={form}
      name="startTime"
      label="Start Time"
      isLoading={isLoading}
      disabled={isPending || !venueId}
      disabledTimeRanges={disabledTimeRanges}
      reservations={data}
    />
  );
}
