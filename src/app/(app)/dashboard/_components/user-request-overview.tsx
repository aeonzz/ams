"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H5 } from "@/components/typography/text";
import Link from "next/link";
import { cn, getStatusColor, textTransform } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type RequestWithRelations } from "prisma/generated/zod";
import { Dot, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FetchDataError from "@/components/card/fetch-data-error";
import DashboardSkeleton from "./dashboard-skeleton";
import EventsCalendar from "./events-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import NumberFlow from "@number-flow/react";

export default function UserRequestOverview() {
  const { data, isLoading, refetch, isError } = useQuery<
    RequestWithRelations[]
  >({
    queryFn: async () => {
      const res = await axios.get("/api/overview/user-dashboard-overview");
      return res.data.data;
    },
    queryKey: ["user-dashboard-overview"],
  });

  const getRequestTypeCount = (type: string) => {
    return data?.filter((request) => request.type === type).length || 0;
  };

  const getPendingRequests = () => {
    return data?.filter((request) => request.status === "PENDING") || [];
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  if (isError) {
    return (
      <div className="flex h-[75%] w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }

  const requestTypes: RequestTypeType[] = [
    "JOB",
    "SUPPLY",
    "BORROW",
    "VENUE",
    "TRANSPORT",
  ];

  return (
    <div className="space-y-3">
      <div className="border-y">
        <div className="flex items-center justify-between bg-tertiary px-3 py-1">
          <H5 className="font-semibold text-muted-foreground">Your Requests</H5>
          <Link
            href="/requests/my-requests?page=1&per_page=10&sort=createdAt.desc"
            className={cn(
              buttonVariants({ variant: "link", size: "sm" }),
              "text-sm"
            )}
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-3 p-3">
          {requestTypes.map((type) => (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {textTransform(type)} Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberFlow
                    willChange
                    continuous
                    value={getRequestTypeCount(type)}
                    format={{ useGrouping: false }}
                    aria-hidden
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Total {type.toLowerCase()} requests
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Tabs defaultValue="calendar" className="w-full">
        <div className="px-3">
          <TabsList className="">
            <TabsTrigger value="calendar" className="text-xs">
              Event
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Pending Requests
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="calendar">
          <EventsCalendar />
        </TabsContent>
        <TabsContent value="pending">
          <div className="border-t">
            <div className="flex items-center justify-between bg-tertiary px-3 py-1">
              <H5 className="font-semibold text-muted-foreground">
                Pending Requests
              </H5>
              <Link
                href="/requests/my-requests?page=1&per_page=10&sort=createdAt.desc&status=PENDING"
                className={cn(
                  buttonVariants({ variant: "link", size: "sm" }),
                  "text-sm"
                )}
              >
                See all
              </Link>
            </div>
            <div className="flex flex-col gap-3 p-3">
              {getPendingRequests().length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No pending requests
                </p>
              ) : (
                getPendingRequests().map((request) => {
                  const { color, stroke, variant } = getStatusColor(
                    request.status
                  );
                  return (
                    <Link key={request.id} href={`request/${request.id}`}>
                      <Card className="bg-secondary">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                              {request.title}
                            </CardTitle>
                            <Badge variant="secondary">
                              {textTransform(request.type)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {request.jobRequest?.description ||
                              request.venueRequest?.purpose ||
                              request.returnableRequest?.purpose ||
                              request.supplyRequest?.purpose ||
                              request.transportRequest?.description ||
                              "No description available"}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant={variant} className="pr-3.5">
                              <Dot
                                className="mr-1 size-3"
                                strokeWidth={stroke}
                                color={color}
                              />
                              {textTransform(request.status)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Created:{" "}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
