"use client";

import React from "react";
import { useSession } from "@/lib/hooks/use-session";
import { ScrollArea } from "@/components/ui/scroll-area";
import { H1, P } from "@/components/typography/text";
import Inbox from "../../dashboard/_components/inbox";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type Notification } from "prisma/generated/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCircle, InboxIcon, Trash } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deleteNotification,
  updateNotificationStatus,
} from "@/lib/actions/notification";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CommandShortcut } from "@/components/ui/command";
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
import LoadingSpinner from "@/components/loaders/loading-spinner";
import Link from "next/link";
import { cn, textTransform } from "@/lib/utils";
import { socket } from "@/app/socket";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 10;

export default function NotificationScreen() {
  const queryClient = useQueryClient();
  const currentUser = useSession();
  const [selectedNotificationId, setSelectedNotificationId] = React.useState<
    string | null
  >(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("all");

  const { mutateAsync: deleteNotificationMutate, isPending: isDeletePending } =
    useServerActionMutation(deleteNotification);

  const { mutateAsync: updateStatusMutate, isPending: isUpdatePending } =
    useServerActionMutation(updateNotificationStatus);

  const fetchNotifications = async ({ pageParam = 1 }) => {
    const res = await axios.get(
      `/api/notification/get-user-notification-with-params/${currentUser.id}?page=${pageParam}&limit=${ITEMS_PER_PAGE}`
    );
    return res.data;
  };

  const {
    data: notificationsData,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    status: notificationsStatus,
  } = useInfiniteQuery({
    queryKey: ["get-user-notifications-with-params", currentUser.id, activeTab],
    queryFn: fetchNotifications,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < ITEMS_PER_PAGE) return undefined;
      return pages.length + 1;
    },
  });

  const handleNotification = React.useCallback(() => {
    console.log("Notification received in NotificationScreen");
    refetch();
  }, [queryClient, currentUser.id]);

  React.useEffect(() => {
    socket.on("notifications", handleNotification);

    return () => {
      socket.off("notifications", handleNotification);
    };
  }, [handleNotification]);

  const allNotifications = React.useMemo(() => {
    return notificationsData?.pages.flatMap((page) => page.data) || [];
  }, [notificationsData]);

  const filteredNotifications = React.useMemo(() => {
    if (activeTab === "all") return allNotifications;
    return allNotifications.filter((notification) =>
      activeTab === "unread" ? !notification.isRead : notification.isRead
    );
  }, [allNotifications, activeTab]);

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
        refetch();
        socket.emit("notifications");
        console.log("Notification updated and socket event emitted");
      });
    }
  }, [selectedNotification, updateStatusMutate, queryClient, currentUser.id]);

  React.useEffect(() => {
    if (filteredNotifications.length > 0 && !selectedNotificationId) {
      setSelectedNotificationId(filteredNotifications[0].id);
    }
  }, [filteredNotifications, selectedNotificationId]);

  React.useEffect(() => {
    if (allNotifications.length > 0 && !selectedNotificationId) {
      setSelectedNotificationId(allNotifications[0].id);
    }
  }, [allNotifications, selectedNotificationId]);

  const handleNotificationSelect = (notificationId: string) => {
    setSelectedNotificationId(notificationId);
  };

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
                "get-user-notifications-with-params",
                currentUser.id,
                activeTab,
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

  useHotkeys(
    "d",
    (event) => {
      event.preventDefault();
      setIsAlertOpen(true);
    },
    {
      enableOnFormTags: false,
      enabled: selectedNotification !== undefined,
    }
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedNotificationId(null);
    queryClient.invalidateQueries({
      queryKey: ["get-user-notifications-with-params", currentUser.id, value],
    });
  };

  return (
    <div className="flex h-full w-full">
      <div className="w-[36%] border-r">
        <div className="flex h-[50px] items-center border-b px-3">
          <Tabs
            value={activeTab}
            className="w-full"
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">
                <Bell className="mr-2 h-4 w-4" /> All
              </TabsTrigger>
              <TabsTrigger value="read">
                <CheckCircle className="mr-2 h-4 w-4" /> Read
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Inbox
          key={currentUser.id}
          className="w-full"
          notifications={filteredNotifications}
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
                  className={cn(buttonVariants({ size: "sm" }), "text-sm")}
                >
                  View
                </Link>
              )}
              <Tooltip>
                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
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
                        This action cannot be undone. This will permanently
                        delete the notification from our servers.
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
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </P>
              <P>{selectedNotification.message}</P>
            </div>
          ) : null}
        </ScrollArea>
      </div>
    </div>
  );
}
