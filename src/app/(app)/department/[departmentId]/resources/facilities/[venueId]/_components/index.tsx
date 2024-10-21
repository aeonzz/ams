"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type VenueWithRelations } from "prisma/generated/zod";
import {
  MapPin,
  Users,
  Calendar,
  Archive,
  Loader2,
  CalendarX,
  Dot,
  Search,
  ChevronLeft,
  Ellipsis,
  EllipsisVertical,
  Pencil,
  FileClock,
} from "lucide-react";
import { H1, H4, H5, P } from "@/components/typography/text";
import SearchInput from "@/app/(app)/_components/search-input";
import FetchDataError from "@/components/card/fetch-data-error";
import NotFound from "@/app/not-found";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn, getVenueStatusColor, textTransform } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { VenueFeaturesType } from "@/lib/types/venue";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import VenueRequestsTable from "./venue-requests-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { UpdateVenueSheet } from "@/app/(admin)/admin/venues/_components/update-venue-sheet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ManageVenueSkeleton from "./manage-venue-skeleton";
import { useSession } from "@/lib/hooks/use-session";
import { PermissionGuard } from "@/components/permission-guard";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useGetVenue } from "@/lib/hooks/use-get-venue-hook";
import { useHotkeys } from "react-hotkeys-hook";
import ManageVenueActions from "./manage-venue-actions";

interface ManageVenueScreenProps {
  params: {
    departmentId: string;
    venueId: string;
  };
}

export default function ManageVenueScreen({ params }: ManageVenueScreenProps) {
  const currentUser = useSession();
  const router = useRouter();
  const dialogManager = useDialogManager();
  const { departmentId, venueId } = params;
  const { data, isLoading, isError, error, refetch } = useGetVenue(venueId);

  if (isLoading) return <ManageVenueSkeleton />;
  if (isError && axios.isAxiosError(error) && error.response?.status === 404) {
    return <NotFound />;
  }
  if (isError)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  if (!data) return <NotFound />;

  const status = getVenueStatusColor(data.status);

  const formattedRequests = data.requests.map((request) => {
    return {
      id: request.requestId,
      requestsTitle: request.request.title,
      requestsStatus: request.request.status,
      createdAt: request.request.createdAt,
    };
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost2" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="size-4" />
          </Button>
          <H5 className="truncate font-semibold">{data.name}</H5>
        </div>
        <SearchInput />
      </div>
      <div className="scroll-bar container flex h-full overflow-y-auto p-0">
        <div className="flex flex-col gap-3 p-6 pr-0">
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative aspect-video h-64 w-[380px] cursor-pointer transition-all hover:brightness-75">
                <Image
                  src={data.imageUrl}
                  alt={`Image of ${data.name}`}
                  fill
                  priority
                  className="rounded-md border object-cover"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="aspect-square w-[80vw]">
              <Image
                src={data.imageUrl}
                alt={`Image of ${data.name}`}
                fill
                className="rounded-md border object-cover"
              />
            </DialogContent>
          </Dialog>
          <div className="flex h-full flex-col gap-3">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <H1 className="max-w-[320px] break-all text-3xl font-bold">
                    {data.name}
                  </H1>
                  <ManageVenueActions
                    venueId={venueId}
                    departmentId={departmentId}
                    data={data}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <PermissionGuard
                  allowedRoles={["DEPARTMENT_HEAD", "VENUE_MANAGER"]}
                  allowedDepartment={departmentId}
                  currentUser={currentUser}
                >
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() =>
                      dialogManager.setActiveDialog("updateVenueStatusCommand")
                    }
                  >
                    <Dot
                      className="mr-1 size-3"
                      strokeWidth={status.stroke}
                      color={status.color}
                    />
                    {textTransform(data.status)}
                  </Button>
                  {/* <Link
                    href={`/department/${departmentId}/facilities/${venueId}/logs`}
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      "flex-1"
                    )}
                  >
                    <P>Logs</P>
                  </Link> */}
                </PermissionGuard>
              </div>
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <P className="font-semibold text-muted-foreground">Location</P>
                <P>{data.location}</P>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <P className="font-semibold text-muted-foreground">Capacity</P>
                <P>{data.capacity}</P>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <P className="font-semibold text-muted-foreground">Created</P>
                <P>{format(data.createdAt, "Pp")}</P>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <P className="font-semibold text-muted-foreground">
                  Last Update
                </P>
                <P>{format(data.updatedAt, "Pp")}</P>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <P className="font-semibold text-muted-foreground">Type</P>
                <Badge variant="outline">{textTransform(data.venueType)}</Badge>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <P className="font-semibold text-muted-foreground">Features</P>
                {/* {data.features && (
                  <div className="flex max-w-64 flex-wrap items-center gap-1">
                    {(data.features as VenueFeaturesType[]).map((value) => (
                      <Badge key={value.id} variant="teal">
                        {value.name}
                      </Badge>
                    ))}
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
        <Separator orientation="vertical" className="mx-6 h-full" />
        <div className="flex-1">
          <VenueRequestsTable requests={formattedRequests} />
        </div>
      </div>
    </div>
  );
}
