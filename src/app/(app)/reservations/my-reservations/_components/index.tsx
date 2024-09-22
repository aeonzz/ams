"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { H1, P } from "@/components/typography/text";
import SearchInput from "@/app/(app)/_components/search-input";
import { type RequestWithRelations } from "prisma/generated/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VenueRequestCard from "./venue-request-card";
import TransportRequestCard from "./transport-request-card";
import ReturnableRequestCard from "./returnable-request-card";
import { MyReservationsScreenSkeleton } from "./my-reservations-screen-skeleton";
import { CalendarX } from "lucide-react";

export default function MyReservationsScreen() {
  const { data, isLoading, refetch, isError } = useQuery<
    RequestWithRelations[]
  >({
    queryFn: async () => {
      const res = await axios.get("/api/reservation/reservations");
      return res.data.data;
    },
    queryKey: ["user-reservations-page"],
  });

  if (isLoading) return <MyReservationsScreenSkeleton />;

  if (isError) {
    return <div>Error loading reservations. Please try again.</div>;
  }

  const venueRequests =
    data?.filter((request) => request.type === "VENUE") || [];
  const transportRequests =
    data?.filter((request) => request.type === "TRANSPORT") || [];
  const returnableRequests =
    data?.filter((request) => request.type === "RESOURCE") || [];

  const NoDataMessage = ({ message }: { message: string }) => (
    <div className="flex min-h-[calc(100vh_-_200px)] flex-col items-center justify-center space-y-2 p-8 text-center">
      <CalendarX className="size-16" strokeWidth={1} />
      <P className="text-muted-foreground">{message}</P>
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <P className="font-medium">My Reservations</P>
        <SearchInput />
      </div>
      <div className="scroll-bar flex-1 overflow-y-auto p-3">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="venue">Venue</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="returnable">Resource</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {venueRequests.length === 0 &&
            transportRequests.length === 0 &&
            returnableRequests.length === 0 ? (
              <NoDataMessage message="You don't have any reservations yet." />
            ) : (
              <>
                {venueRequests.map((request) => (
                  <VenueRequestCard key={request.id} request={request} />
                ))}
                {transportRequests.map((request) => (
                  <TransportRequestCard key={request.id} request={request} />
                ))}
                {returnableRequests.map((request) => (
                  <ReturnableRequestCard key={request.id} request={request} />
                ))}
              </>
            )}
          </TabsContent>
          <TabsContent value="venue" className="space-y-4">
            {venueRequests.length === 0 ? (
              <NoDataMessage message="You don't have any venue reservations." />
            ) : (
              venueRequests.map((request) => (
                <VenueRequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>
          <TabsContent value="transport" className="space-y-4">
            {transportRequests.length === 0 ? (
              <NoDataMessage message="You don't have any transport reservations." />
            ) : (
              transportRequests.map((request) => (
                <TransportRequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>
          <TabsContent value="returnable" className="space-y-4">
            {returnableRequests.length === 0 ? (
              <NoDataMessage message="You don't have any resrouce item reservations." />
            ) : (
              returnableRequests.map((request) => (
                <ReturnableRequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
