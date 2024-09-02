"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H5 } from "@/components/typography/text";
import Link from "next/link";
import { cn, getStatusIcon, textTransform } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type RequestWithRelations } from "prisma/generated/zod";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import FetchDataError from "@/components/card/fetch-data-error";

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
    return (
      <div className="flex h-[75%] w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex h-[75%] w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }

  const requestTypes = ["JOB", "RESOURCE", "VENUE", "TRANSPORT"];

  return (
    <div className="space-y-3">
      <div className="border-y">
        <div className="flex items-center justify-between bg-tertiary px-3 py-1">
          <H5 className="font-semibold text-muted-foreground">Your Requests</H5>
          <Link
            href="/requests"
            className={cn(
              buttonVariants({ variant: "link", size: "sm" }),
              "text-sm"
            )}
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3 p-3">
          {requestTypes.map((type) => (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {textTransform(type)} Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getRequestTypeCount(type)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total {type.toLowerCase()} requests
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="border-y">
        <div className="flex items-center justify-between bg-tertiary px-3 py-1">
          <H5 className="font-semibold text-muted-foreground">
            Pending Requests
          </H5>
          <Link
            href="/requests"
            className={cn(
              buttonVariants({ variant: "link", size: "sm" }),
              "text-sm"
            )}
          >
            See all
          </Link>
        </div>
        <div className="space-y-3 p-3">
          {getPendingRequests().length === 0 ? (
            <p className="text-center text-muted-foreground">
              No pending requests
            </p>
          ) : (
            getPendingRequests().map((request) => {
              const { icon: Icon, variant } = getStatusIcon(request.status);

              return (
                <Card key={request.id} className="bg-secondary">
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
                      {request.jobRequest?.notes ||
                        request.venueRequest?.purpose ||
                        request.returnableRequest?.purpose ||
                        request.consumableRequest?.purpose ||
                        request.transportRequest?.description ||
                        "No description available"}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant={variant}>
                        <Icon className="mr-1 size-4" />
                        {textTransform(request.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Created:{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
