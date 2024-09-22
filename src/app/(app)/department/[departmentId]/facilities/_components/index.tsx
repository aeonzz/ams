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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Users,
  Calendar,
  Archive,
  Loader2,
  CalendarX,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FetchDataError from "@/components/card/fetch-data-error";
import { P } from "@/components/typography/text";
import { Skeleton } from "@/components/ui/skeleton";
import ManageVenueSkelton from "./manage-venue-skeleton";

interface ManageVenueScreenProps {
  params: string;
}

const NoDataMessage = ({ message }: { message: string }) => (
  <div className="flex min-h-[calc(100vh_-_200px)] flex-col items-center justify-center space-y-2 p-8 text-center">
    <CalendarX className="size-16" strokeWidth={1} />
    <P className="text-muted-foreground">{message}</P>
  </div>
);

export default function ManageVenueScreen({ params }: ManageVenueScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch, isError } = useQuery<VenueWithRelations[]>({
    queryFn: async () => {
      const res = await axios.get(`/api/venue/get-department-venues/${params}`);
      return res.data.data;
    },
    queryKey: [params],
  });

  console.log(params);

  const filteredVenues =
    data?.filter(
      (venue) =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <P className="font-medium">Facilities</P>
        <Input
          type="text"
          placeholder="Search facilities..."
          className="h-9 w-[280px] bg-tertiary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ScrollArea className="flex-1 p-6">
        {isLoading ? (
          <ManageVenueSkelton />
        ) : isError ? (
          <FetchDataError refetch={refetch} />
        ) : filteredVenues.length === 0 ? (
          <NoDataMessage message="No venues found. Try adjusting your search or add new venues." />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden">
                <img
                  src={
                    venue.imageUrl || "/placeholder.svg?height=200&width=300"
                  }
                  alt={venue.name}
                  className="h-48 w-full object-cover"
                />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {venue.name}
                    <Badge
                      variant={
                        venue.status === "AVAILABLE" ? "default" : "destructive"
                      }
                    >
                      {venue.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{venue.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Capacity: {venue.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        Last Updated:{" "}
                        {new Date(venue.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {venue.isArchived && (
                      <div className="flex items-center text-yellow-500">
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Archived</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Manage Venue</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
