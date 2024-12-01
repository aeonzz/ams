"use client";

import VenueDateTimePicker from "@/app/(app)/dashboard/_components/venue-date-time-picker";
import { useVenueReservedDates } from "@/lib/hooks/use-venue-reservation";
import type { UpdateVenueRequestSchema } from "@/lib/schema/request";
import React from "react";
import { type UseFormReturn } from "react-hook-form";

interface VenueEditTimeInputProps {
  form: UseFormReturn<UpdateVenueRequestSchema>;
  venueId: string;
  isPending: boolean;
  label: string;
  name: "startTime" | "endTime";
}

export default function VenueEditTimeInput({
  form,
  venueId,
  isPending,
  label,
  name,
}: VenueEditTimeInputProps) {
  const { disabledTimeRanges, data, isLoading } = useVenueReservedDates({
    venueId,
  });

  return (
    <VenueDateTimePicker
      form={form}
      name={name}
      label={label}
      isLoading={isLoading}
      disabled={isPending || !venueId}
      disabledTimeRanges={disabledTimeRanges}
      reservations={data}
    />
  );
}
