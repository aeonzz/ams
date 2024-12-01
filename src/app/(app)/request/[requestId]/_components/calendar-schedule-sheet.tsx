"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { VenueRequestWithRelations } from "prisma/generated/zod";
import { Button } from "@/components/ui/button";
import VenueRequestCalendar from "@/app/(app)/department/[departmentId]/resources/venue/_components/venue-request-calendar";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { CalendarIcon } from "lucide-react";
import LoadingSpinner from "@/components/loaders/loading-spinner";

interface CalendarSchedulaSheetProps {
  venueId: string;
}

export default function CalendarSchedulaSheet({
  venueId,
}: CalendarSchedulaSheetProps) {
  const dialogManager = useDialogManager();
  const { data, isLoading } = useQuery<VenueRequestWithRelations[]>({
    queryFn: async () => {
      const res = await axios.get(
        `/api/request/venue-request/get-venue-request/${venueId}`
      );
      return res.data.data;
    },
    queryKey: ["get-department-venue-schedules"],
  });

  const formattedData = data?.map((request) => ({
    requestId: request.request.id,
    title: request.request.title,
    status: request.request.status,
    createdAt: request.request.createdAt,
    startTime: request.startTime,
    endTime: request.endTime,
    actualStart: request.actualStart,
    completedAt: request.request.completedAt,
  }));

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        disabled={isLoading}
        onClick={() => dialogManager.setActiveDialog("scheduleCalendar")}
      >
        {isLoading ? (
          <LoadingSpinner className="mr-1 size-4" />
        ) : (
          <CalendarIcon className="mr-1 size-4 text-muted-foreground" />
        )}
        Schedules
      </Button>
      <Sheet
        open={dialogManager.activeDialog === "scheduleCalendar"}
        onOpenChange={handleOpenChange}
      >
        <SheetContent className="!max-w-[50vw]">
          <SheetHeader>
            <SheetTitle>Schedules</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div>
            <VenueRequestCalendar data={formattedData} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
