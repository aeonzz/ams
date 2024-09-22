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
} from "lucide-react";
import { H1, H4, H5, P } from "@/components/typography/text";
import SearchInput from "@/app/(app)/_components/search-input";
import FetchDataError from "@/components/card/fetch-data-error";
import NotFound from "@/app/not-found";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getVenueStatusColor, textTransform } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { VenueFeaturesType } from "@/lib/types/venue";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import VenueRequestsTable from "./venue-requests-table";

interface ManageVenueScreenProps {
  venueId: string;
}

export default function ManageVenueScreen({ venueId }: ManageVenueScreenProps) {
  const { data, isLoading, refetch, isError } = useQuery<VenueWithRelations>({
    queryFn: async () => {
      const res = await axios.get(`/api/venue/get-venue/${venueId}`);
      return res.data.data;
    },
    queryKey: [venueId],
  });

  if (isLoading) return <h1>Loading...</h1>;
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
        <H5 className="truncate font-semibold">{data.name}</H5>
        <SearchInput />
      </div>
      <div className="scroll-bar container flex overflow-y-auto p-0">
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
            <div className="space-y-1">
              <H1 className="w-[380px] text-3xl font-bold">{data.name}</H1>
              <Badge variant={status.variant} className="pr-3.5">
                <Dot
                  className="mr-1 size-3"
                  strokeWidth={status.stroke}
                  color={status.color}
                />
                {textTransform(data.status)}
              </Badge>
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
                {data.features && (
                  <div className="flex flex-wrap items-center">
                    {(data.features as VenueFeaturesType[]).map((value) => (
                      <Badge
                        key={value.id}
                        className="mr-2 mt-1"
                        variant="teal"
                      >
                        {value.name}
                      </Badge>
                    ))}
                  </div>
                )}
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
