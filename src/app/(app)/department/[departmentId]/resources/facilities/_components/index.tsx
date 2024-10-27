"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type VenueWithRelations } from "prisma/generated/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Users,
  Calendar,
  Archive,
  Loader2,
  CalendarX,
  Dot,
  Search,
  ExternalLink,
  PlusIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FetchDataError from "@/components/card/fetch-data-error";
import { H4, P } from "@/components/typography/text";
import { Skeleton } from "@/components/ui/skeleton";
import DepartmentVenuesSkeleton from "./department-venues-skeleton";
import { useRouter } from "next/navigation";
import { cn, getVenueStatusColor, textTransform } from "@/lib/utils";
import Image from "next/image";
import { VenueFeaturesType } from "@/lib/types/venue";
import SearchInput from "@/app/(app)/_components/search-input";
import Link from "next/link";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import NotFound from "@/app/not-found";

interface DepartmentVenuesScreenProps {
  departmentId: string;
}

const NoDataMessage = ({ message }: { message: string }) => (
  <div className="flex min-h-[calc(100vh_-_200px)] flex-col items-center justify-center space-y-2 p-8 text-center">
    <CalendarX className="size-16" strokeWidth={1} />
    <P className="text-muted-foreground">{message}</P>
  </div>
);

export default function DepartmentVenuesScreen({
  departmentId,
}: DepartmentVenuesScreenProps) {
  const router = useRouter();
  const dialogManager = useDialogManager();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch, isError, error } = useQuery<
    VenueWithRelations[]
  >({
    queryFn: async () => {
      const res = await axios.get(
        `/api/venue/get-department-venues/${departmentId}`
      );
      return res.data.data;
    },
    queryKey: ["department-venues", departmentId],
  });

  const filteredVenues =
    data?.filter((venue) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isError && axios.isAxiosError(error) && error.response?.status === 404) {
    return <NotFound />;
  }

  return (
    <div className="scroll-bar flex flex-1 justify-center overflow-y-auto p-3">
      {isLoading ? (
        <DepartmentVenuesSkeleton />
      ) : isError ? (
        <div className="flex h-screen w-full items-center justify-center">
          <FetchDataError refetch={refetch} />
        </div>
      ) : data?.length === 0 ? (
        <NoDataMessage message="No facilities available." />
      ) : (
        <div className="w-[1280px]">
          <div className="mb-3 flex w-full justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search facilities..."
                className="h-9 w-[280px] bg-tertiary pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="default"
              onClick={() =>
                dialogManager.setActiveDialog("adminCreateVenueDialog")
              }
            >
              <PlusIcon className="mr-1 size-4" aria-hidden="true" />
              <P className="font-semibold">Add</P>
            </Button>
          </div>
          {filteredVenues.length === 0 ? (
            <NoDataMessage message="No facilities found. Try adjusting your search" />
          ) : (
            <div className="grid grid-cols-1 gap-3 pb-3 md:grid-cols-2 lg:grid-cols-3">
              {filteredVenues.map((venue) => {
                const status = getVenueStatusColor(venue.status);
                return (
                  <Link
                    key={venue.id}
                    href={`/department/${departmentId}/resources/facilities/${venue.id}`}
                  >
                    <Card className="relative cursor-pointer overflow-hidden shadow-md transition-all hover:border-primary">
                      <div className="relative aspect-video h-48 w-full">
                        <Image
                          src={venue.imageUrl}
                          alt={`Image of ${venue.name}`}
                          fill
                          priority
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="p-3">
                        <CardTitle className="flex max-w-64 items-center justify-between">
                          <H4 className="truncate">{venue.name}</H4>
                        </CardTitle>
                        <div className="flex items-center justify-between">
                          <Badge variant={status.variant} className="pr-3.5">
                            <Dot
                              className="mr-1 size-3"
                              strokeWidth={status.stroke}
                              color={status.color}
                            />
                            {textTransform(venue.status)}
                          </Badge>
                          <Link
                            href={`/department/${departmentId}/facilities/${venue.id}`}
                            className={cn(
                              buttonVariants({
                                variant: "ghost2",
                                size: "icon",
                              })
                            )}
                            prefetch
                          >
                            <ExternalLink className="size-5" />
                          </Link>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
