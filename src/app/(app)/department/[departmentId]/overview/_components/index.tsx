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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { deleteNotification } from "@/lib/actions/notification";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { InboxIcon, Trash } from "lucide-react";
import { CommandShortcut } from "@/components/ui/command";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const { mutateAsync: deleteNotificationMutate, isPending: isDeletePending } =
    useServerActionMutation(deleteNotification);

  const { data, isLoading, refetch, isError } =
    useQuery<DepartmentWithRelations>({
      queryFn: async () => {
        const res = await axios.get(
          `/api/department/get-department-by-id/${departmentId}`
        );
        return res.data.data;
      },
      queryKey: [departmentId],
    });

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

  const handleNotificationSelect = (notificationId: string) => {
    setSelectedNotificationId(notificationId);
  };

  const selectedNotification: Notification = React.useMemo(() => {
    return allNotifications.find(
      (notification) => notification.id === selectedNotificationId
    );
  }, [allNotifications, selectedNotificationId]);

  const handleNotificationDelete = () => {
    if (selectedNotification) {
      toast.promise(
        deleteNotificationMutate({
          notificationId: selectedNotification.id,
        }),
        {
          loading: "Deleting...",
          success: () => {
            queryClient.invalidateQueries({
              queryKey: [
                "get-department-notifications-with-params",
                departmentId,
              ],
            });
            setIsAlertOpen(false);
            setSelectedNotificationId(null);
            return "Notification successfully deleted";
          },
          error: (err) => {
            console.log(err);
            return err.message;
          },
        }
      );
    }
  };

  if (isLoading) {
    return <DepartmentSkeleton />;
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
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[50px] items-center justify-between border-b px-3">
        <P className="font-medium">{data.name}</P>
        <div className="flex items-center gap-2">
          <div className="flex">
            <Link
              href={`/department/${departmentId}/overview`}
              className={cn(
                buttonVariants({ variant: "ghost2", size: "sm" }),
                "px-3 text-xs font-bold underline underline-offset-2"
              )}
            >
              Overview
            </Link>
            <Link
              href={`/department/${departmentId}/about`}
              className={cn(
                buttonVariants({ variant: "ghost2", size: "sm" }),
                "px-3 text-xs"
              )}
            >
              About
            </Link>
          </div>
          <SearchInput />
        </div>
      </div>
      <div className="scroll-bar flex flex-1 justify-center overflow-y-auto p-3">
        <div className="container w-full p-0">
          <div className="grid grid-flow-row grid-cols-2 gap-3">
            <div className="col-span-2 flex h-[350px] border">
              <div className="w-[36%] border-r">
                <Inbox
                  className="w-full"
                  notifications={allNotifications}
                  onNotificationSelect={handleNotificationSelect}
                  selectedNotificationId={selectedNotificationId}
                  status={notificationsStatus}
                  fetchNextPage={fetchNextPage}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                />
              </div>
              <div className="flex-1">
                <div className="flex h-[50px] items-center justify-between border-b px-3">
                  <P className="font-medium">Notification Details</P>
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
                        >
                          View
                        </Link>
                      )}
                      <Tooltip>
                        <AlertDialog
                          open={isAlertOpen}
                          onOpenChange={setIsAlertOpen}
                        >
                          <AlertDialogTrigger asChild>
                            <TooltipTrigger asChild>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="flex items-center pl-3"
                                disabled={isDeletePending}
                              >
                                {isDeletePending ? (
                                  <LoadingSpinner className="mr-1 size-3.5" />
                                ) : (
                                  <Trash className="mr-1 size-3.5" />
                                )}
                                Delete notification
                              </Button>
                            </TooltipTrigger>
                          </AlertDialogTrigger>
                          <AlertDialogContent
                            onCloseAutoFocus={(e) => e.preventDefault()}
                          >
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the notification from our
                                servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleNotificationDelete}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <TooltipContent
                          className="flex items-center gap-3"
                          side="bottom"
                        >
                          <P>Delete notification</P>
                          <CommandShortcut>D</CommandShortcut>
                        </TooltipContent>
                      </Tooltip>
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
                        {new Date(
                          selectedNotification.createdAt
                        ).toLocaleString()}
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
      </div>
    </div>
  );
}

function DepartmentSkeleton() {
  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="mb-6 flex h-[50px] items-center justify-between border-b px-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="space-y-6">
        <div className="rounded-lg border">
          <CardHeader>
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
