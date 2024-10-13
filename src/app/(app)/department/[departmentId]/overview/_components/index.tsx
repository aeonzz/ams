"use client";

import React from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import type {
  DepartmentWithRelations,
  Notification,
  NotificationWithRelations,
} from "prisma/generated/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { H1, H4, P } from "@/components/typography/text";
import SearchInput from "@/app/(app)/_components/search-input";
import FetchDataError from "@/components/card/fetch-data-error";
import { cn, textTransform } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import OpenRequestsTable from "./open-requests-table";
import TotalOpenRequests from "./total-open-requests";
import Inbox from "@/app/(app)/dashboard/_components/inbox";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import {
  deleteNotification,
  updateNotificationStatus,
} from "@/lib/actions/notification";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { InboxIcon, Trash } from "lucide-react";
import { CommandShortcut } from "@/components/ui/command";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { socket } from "@/app/socket";
import DepartmentOverviewSkeleton from "./department-overview-skeleton";
import OverviewNavigationMenu from "../../_components/navigation-menu";
import { useDepartmentData } from "@/lib/hooks/use-department-data";

const ITEMS_PER_PAGE = 10;

interface DepartmentOverviewScreenProps {
  departmentId: string;
}

export default function DepartmentOverviewScreen({
  departmentId,
}: DepartmentOverviewScreenProps) {
  const queryClient = useQueryClient();
  const [selectedNotificationId, setSelectedNotificationId] = React.useState<
    string | null
  >(null);

  const { mutateAsync: updateStatusMutate, isPending: isUpdatePending } =
    useServerActionMutation(updateNotificationStatus);

  const { data, isLoading, isError, refetch } = useDepartmentData(departmentId);

  const fetchNotifications = async ({ pageParam = 1 }) => {
    const res = await axios.get(
      `/api/notification/get-department-notification-with-params/${departmentId}?page=${pageParam}&limit=${ITEMS_PER_PAGE}`
    );
    return res.data;
  };

  const {
    data: notificationsData,
    fetchNextPage,
    refetch: refetchNotifications,
    hasNextPage,
    isFetchingNextPage,
    status: notificationsStatus,
  } = useInfiniteQuery({
    queryKey: ["get-department-notifications-with-params", departmentId],
    queryFn: fetchNotifications,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < ITEMS_PER_PAGE) return undefined;
      return pages.length + 1;
    },
  });

  const allNotifications = React.useMemo(() => {
    return notificationsData?.pages.flatMap((page) => page.data) || [];
  }, [notificationsData]);

  React.useEffect(() => {
    socket.on("notifications", () => {
      console.log("wtf");
      refetchNotifications();
    });

    return () => {
      socket.off("notifications");
    };
  }, []);

  React.useEffect(() => {
    if (allNotifications.length > 0 && !selectedNotificationId) {
      setSelectedNotificationId(allNotifications[0].id);
    }
  }, [allNotifications, selectedNotificationId]);

  const handleNotificationSelect = (notificationId: string) => {
    setSelectedNotificationId(notificationId);
  };

  const selectedNotification: Notification = React.useMemo(() => {
    return allNotifications.find(
      (notification) => notification.id === selectedNotificationId
    );
  }, [allNotifications, selectedNotificationId]);

  React.useEffect(() => {
    if (selectedNotification && !selectedNotification.isRead) {
      updateStatusMutate({
        notificationId: selectedNotification.id,
        isRead: true,
      }).then(() => {
        refetchNotifications();
        socket.emit("notifications");
        console.log("Notification updated and socket event emitted");
      });
    }
  }, [selectedNotification, updateStatusMutate, queryClient, departmentId]);

  if (isLoading) {
    return <DepartmentOverviewSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }

  const openRequests = data.request.filter(
    (request) => request.status !== "COMPLETED" && request.status !== "PENDING"
  );

  const pendingJobs = data.request.filter(
    (request) => request.jobRequest?.status === "PENDING"
  );

  const pendingJobsCount = pendingJobs.length;
  const description =
    pendingJobsCount === 1
      ? "There is 1 pending job."
      : pendingJobsCount > 1
        ? `There are ${pendingJobsCount} pending jobs.`
        : "No pending jobs at the moment.";

  return (
    <div className="container w-full p-0">
      <div className="grid grid-flow-row grid-cols-2 gap-3">
        <div className="col-span-2 flex h-[450px] rounded-md border">
          <div className="w-[40%] border-r">
            <div className="flex h-[50px] items-center justify-between border-b px-3">
              <P className="font-medium">Inbox</P>
            </div>
            <Inbox
              className="w-full"
              notifications={allNotifications}
              onNotificationSelect={handleNotificationSelect}
              selectedNotificationId={selectedNotificationId}
              status={notificationsStatus}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              height="h-[400px]"
            />
          </div>
          <div className="flex-1">
            <div className="flex h-[50px] items-center justify-between border-b px-3">
              <P className="font-medium">Details</P>
              {notificationsStatus === "pending" ? (
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ) : selectedNotification ? (
                <div className="flex gap-1">
                  {selectedNotification.resourceId && (
                    <Link
                      href={selectedNotification.resourceId}
                      className={cn(buttonVariants({ size: "sm" }), "text-sm")}
                    >
                      View
                    </Link>
                  )}
                </div>
              ) : null}
            </div>
            <ScrollArea className="h-[calc(100%-50px)] p-4">
              {notificationsStatus === "pending" ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : notificationsStatus === "error" ? (
                <div className="flex h-[calc(100vh_-_80px)] items-center justify-center">
                  <div className="flex flex-col items-center space-y-3">
                    <InboxIcon className="size-16" strokeWidth={1} />
                    <P className="text-muted-foreground">
                      Error loading notifications
                    </P>
                  </div>
                </div>
              ) : selectedNotification ? (
                <div>
                  <div className="mb-4">
                    <H1 className="font-bold tracking-tight">
                      {selectedNotification.title}
                    </H1>
                    <Badge variant="outline">
                      {textTransform(selectedNotification.resourceType)}
                    </Badge>
                  </div>
                  <P className="mb-2 text-muted-foreground">
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </P>
                  <P>{selectedNotification.message}</P>
                </div>
              ) : null}
            </ScrollArea>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex h-fit gap-2">
            <div className="flex-1">
              <TotalOpenRequests totalRequestsCount={openRequests.length} />
            </div>
            <Card className="flex-1 bg-secondary">
              <CardHeader className="p-4 pb-0">
                <CardTitle>Pending Jobs</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
                <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                  {pendingJobsCount}
                  <span className="text-sm font-normal text-muted-foreground">
                    jobs
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="">
            <OpenRequestsTable data={openRequests} />
          </div>
        </div>
      </div>
    </div>
  );
}
