"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H5 } from "@/components/typography/text";
import Link from "next/link";
import { cn, getStatusColor, textTransform } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type RequestWithRelations } from "prisma/generated/zod";
import { CirclePlus, Dot, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FetchDataError from "@/components/card/fetch-data-error";
import DashboardSkeleton from "./dashboard-skeleton";
import { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import NumberFlow from "@number-flow/react";
import { pusherClient } from "@/lib/pusher-client";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";

interface UserRequestOverviewProps {
  isDesktop: boolean;
}

export default function UserRequestOverview({
  isDesktop,
}: UserRequestOverviewProps) {
  const dialogManager = useDialogManager();
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

  React.useEffect(() => {
    const channel = pusherClient.subscribe("request");
    channel.bind("request_update", (data: { message: string }) => {
      console.log(data.message);
      refetch();
    });

    return () => {
      pusherClient.unsubscribe("request");
    };
  }, []);

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
            href="/request/my-requests?page=1&per_page=10&sort=createdAt.desc"
            className={cn(
              buttonVariants({ variant: "link", size: "sm" }),
              "text-sm"
            )}
            prefetch
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-3 lg:grid-cols-5">
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
          {!isDesktop && (
            <Button
              variant="shine"
              onClick={() => dialogManager.setActiveDialog("requestDialog")}
              className="h-full flex-col truncate"
            >
              <CirclePlus className="text-yellow mb-5 size-7" />
              Create request
            </Button>
          )}
        </div>
      </div>
      <div className="border-t">
        <div className="flex items-center justify-between bg-tertiary px-3 py-1">
          <H5 className="font-semibold text-muted-foreground">
            Pending Requests
          </H5>
        </div>
        <div className="flex flex-col gap-3 p-3">
          {getPendingRequests().length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <svg
                className="mb-4 h-24 w-24 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 12v4M12 8v.01"
                />
              </svg>
              <p className="text-lg font-medium text-muted-foreground">
                Nothing to show here
              </p>
              <p className="text-sm text-muted-foreground">
                You don&apos;t have any pending requests at the moment.
              </p>
            </div>
          ) : (
            getPendingRequests().map((request) => {
              const { color, stroke, variant } = getStatusColor(request.status);
              return (
                <Link
                  key={request.id}
                  href={`request/${request.id}`}
                  className="group"
                  prefetch
                >
                  <Card className="bg-secondary group-hover:bg-tertiary">
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
    </div>
  );
}
