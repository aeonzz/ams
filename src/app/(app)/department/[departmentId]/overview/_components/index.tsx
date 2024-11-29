"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Notification } from "prisma/generated/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { H1, H4, P } from "@/components/typography/text";
import FetchDataError from "@/components/card/fetch-data-error";
import { cn, textTransform } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import OpenRequestsTable from "./open-requests-table";
import TotalOpenRequests from "./total-open-requests";
import Inbox from "@/app/(app)/dashboard/_components/inbox";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import {
  deleteNotification,
  updateNotificationStatus,
} from "@/lib/actions/notification";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { InboxIcon, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import DepartmentOverviewSkeleton from "./department-overview-skeleton";
import { useDepartmentData } from "@/lib/hooks/use-department-data";
import { useDepartmentNotifications } from "@/lib/hooks/use-department-notifications";
import { pusherClient } from "@/lib/pusher-client";
import { useMediaQuery } from "usehooks-ts";
import LoadingSpinner from "@/components/loaders/loading-spinner";

const ITEMS_PER_PAGE = 10;

interface DepartmentOverviewScreenProps {
  departmentId: string;
}

export default function DepartmentOverviewScreen({
  departmentId,
}: DepartmentOverviewScreenProps) {
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [selectedNotificationId, setSelectedNotificationId] = React.useState<
    string | null
  >(null);

  const { mutateAsync: updateStatusMutate, isPending: isUpdatePending } =
    useServerActionMutation(updateNotificationStatus);

  const { data, isLoading, isError, refetch } = useDepartmentData(departmentId);

  const {
    notificationsData,
    fetchNextPage,
    hasNextPage,
    refetch: refetchNotifications,
    isFetchingNextPage,
    notificationsStatus,
  } = useDepartmentNotifications(departmentId);

  // const allNotifications = React.useMemo(() => {
  //   return notificationsData?.pages.flatMap((page) => page.data) || [];
  // }, [notificationsData]);

  const handleNotification = React.useCallback(() => {
    refetchNotifications();
    refetch();
  }, [queryClient, departmentId]);

  React.useEffect(() => {
    const channel = pusherClient.subscribe("request");
    channel.bind("notifications", (data: { message: string }) => {
      handleNotification;
    });

    return () => {
      pusherClient.unsubscribe("request");
    };
  }, []);

  React.useEffect(() => {
    if (notificationsData.length > 0 && !selectedNotificationId) {
      setSelectedNotificationId(notificationsData[0].id);
    }
  }, [notificationsData, selectedNotificationId]);

  const handleNotificationSelect = (notificationId: string) => {
    setSelectedNotificationId(notificationId);
    if (!isDesktop) {
      setIsSheetOpen(true);
    }
  };

  const selectedNotification: Notification = React.useMemo(() => {
    return notificationsData.find(
      (notification) => notification.id === selectedNotificationId
    );
  }, [notificationsData, selectedNotificationId]);

  React.useEffect(() => {
    if (selectedNotification && !selectedNotification.isRead) {
      updateStatusMutate({
        notificationId: selectedNotification.id,
        isRead: true,
      }).then(() => {
        refetchNotifications();
      });
    }
  }, [selectedNotification, updateStatusMutate, queryClient, departmentId]);

  if (isLoading) {
    return (
      <>
        {isDesktop ? (
          <DepartmentOverviewSkeleton />
        ) : (
          <div className="h-screen">
            <LoadingSpinner />
          </div>
        )}
      </>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FetchDataError refetch={refetch} />
      </div>
    );
  }

  const openRequests = data.request.filter(
    (request) =>
      request.status !== "COMPLETED" &&
      request.status !== "CANCELLED" &&
      request.status !== "REJECTED"
  );

  const pendingJobs = data.request.filter(
    (request) => request.jobRequest?.status === "PENDING"
  );

  const renderNotificationDetails = () => (
    <ScrollArea className="h-full p-4">
      {notificationsStatus === "pending" ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : notificationsStatus === "error" ? (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <InboxIcon className="size-16" strokeWidth={1} />
            <P className="text-muted-foreground">Error loading notifications</P>
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
  );

  return (
    <div className="container w-full p-0">
      <div className="grid grid-flow-row grid-cols-2 gap-3">
        <div className="col-span-2 flex h-[450px] rounded-md border">
          <div className="w-full border-r lg:w-[36%]">
            <div className="flex h-[50px] items-center justify-between border-b px-3">
              <P className="font-medium">Inbox</P>
            </div>
            <Inbox
              key={departmentId}
              className="w-full"
              notifications={notificationsData}
              onNotificationSelect={handleNotificationSelect}
              selectedNotificationId={selectedNotificationId}
              status={notificationsStatus}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              height="h-[400px]"
            />
          </div>

          {isDesktop ? (
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
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "text-sm"
                        )}
                        prefetch
                      >
                        View
                      </Link>
                    )}
                  </div>
                ) : null}
              </div>
              {renderNotificationDetails()}
            </div>
          ) : (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetContent
                side="bottom"
                className="h-[85vh] overflow-hidden rounded-t-[10px] px-1"
              >
                <SheetHeader>
                  <SheetTitle>Notification Details</SheetTitle>
                </SheetHeader>
                {renderNotificationDetails()}
                <div className="flex justify-between p-4">
                  {selectedNotification?.resourceId && (
                    <Link
                      href={selectedNotification.resourceId}
                      className={cn(buttonVariants({ size: "sm" }), "text-sm")}
                      prefetch
                    >
                      View
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex h-fit gap-2">
            <div className="flex-1">
              <TotalOpenRequests totalRequestsCount={openRequests.length} />
            </div>
          </div>
          <div className="">
            <OpenRequestsTable data={openRequests} />
          </div>
        </div>
      </div>
    </div>
  );
}
