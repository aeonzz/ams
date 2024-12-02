"use client";

import React from "react";
import { useSession } from "@/lib/hooks/use-session";
import { ScrollArea } from "@/components/ui/scroll-area";
import { H1, P } from "@/components/typography/text";
import Inbox from "../../dashboard/_components/inbox";
import { useQueryClient } from "@tanstack/react-query";
import { type Notification } from "prisma/generated/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCircle, ChevronDown, InboxIcon, Trash } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useUserNotifications } from "@/lib/hooks/use-user-notifications";
import { pusherClient } from "@/lib/pusher-client";
import { useMediaQuery } from "usehooks-ts";
import MenuSheet from "../../dashboard/_components/menu-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function NotificationScreen() {
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const queryClient = useQueryClient();
  const currentUser = useSession();
  const [selectedNotificationId, setSelectedNotificationId] = React.useState<
    string | null
  >(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("all");

  const { mutateAsync: deleteNotificationMutate, isPending: isDeletePending } =
    useServerActionMutation(deleteNotification);

  const { mutateAsync: updateStatusMutate, isPending: isUpdatePending } =
    useServerActionMutation(updateNotificationStatus);

  const {
    notificationsData,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    notificationsStatus,
  } = useUserNotifications(currentUser.id);

  const handleNotification = React.useCallback(() => {
    console.log("Notification received in NotificationScreen");
    refetch();
  }, [refetch]);

  React.useEffect(() => {
    const channel = pusherClient.subscribe("request");
    channel.bind("notifications", handleNotification);

    return () => {
      pusherClient.unsubscribe("request");
    };
  }, [handleNotification]);

  const filteredNotifications = React.useMemo(() => {
    if (activeTab === "all") return notificationsData;
    return notificationsData.filter((notification) =>
      activeTab === "unread" ? !notification.isRead : notification.isRead
    );
  }, [notificationsData, activeTab]);

  const selectedNotification: Notification | undefined = React.useMemo(() => {
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
        refetch();
      });
    }
  }, [selectedNotification, updateStatusMutate, refetch]);

  React.useEffect(() => {
    if (filteredNotifications.length > 0 && !selectedNotificationId) {
      setSelectedNotificationId(filteredNotifications[0].id);
    }
  }, [filteredNotifications, selectedNotificationId]);

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

  // const handleNotificationDelete = () => {
  //   if (selectedNotification) {
  //     toast.promise(
  //       deleteNotificationMutate({
  //         notificationId: selectedNotification.id,
  //       }),
  //       {
  //         loading: "Deleting...",
  //         success: () => {
  //           queryClient.invalidateQueries({
  //             queryKey: [
  //               "get-user-notifications-with-params",
  //               currentUser.id,
  //               activeTab,
  //             ],
  //           });
  //           setIsAlertOpen(false);
  //           setSelectedNotificationId(null);
  //           if (!isDesktop) {
  //             setIsSheetOpen(false);
  //           }
  //           return "Notification successfully deleted";
  //         },
  //         error: (err) => {
  //           console.log(err);
  //           return err.message;
  //         },
  //       }
  //     );
  //   }
  // };

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
      queryKey: ["get-user-notifications-with-params", currentUser.id],
    });
  };

  const tabOptions = [
    { value: "all", label: "All", icon: Bell },
    { value: "read", label: "Read", icon: CheckCircle },
  ];

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
    <div className="flex h-full w-full">
      <div className="w-full border-r lg:w-[36%]">
        <div className="flex h-[50px] items-center justify-between border-b px-3">
          {!isDesktop && (
            <div className="flex items-center">
              <MenuSheet />
              <P className="font-medium">Notifications</P>
            </div>
          )}
          {!isDesktop ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit justify-between"
                >
                  {tabOptions.find((tab) => tab.value === activeTab)?.label}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {tabOptions.map((tab) => (
                  <DropdownMenuItem
                    key={tab.value}
                    onSelect={() => handleTabChange(tab.value)}
                  >
                    <tab.icon className="mr-2 h-4 w-4" />
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Tabs
              value={activeTab}
              className="w-full"
              onValueChange={handleTabChange}
            >
              <TabsList className="grid w-full grid-cols-2">
                {tabOptions.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    <tab.icon className="mr-2 h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>
        <Inbox
          key={currentUser.id}
          className="w-full bo"
          notifications={filteredNotifications}
          onNotificationSelect={handleNotificationSelect}
          selectedNotificationId={selectedNotificationId}
          status={notificationsStatus}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
      {isDesktop ? (
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
                    prefetch
                  >
                    View
                  </Link>
                )}
                {/* <Tooltip>
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
                </Tooltip> */}
              </div>
            ) : null}
          </div>
          {renderNotificationDetails()}
        </div>
      ) : (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent
            side="bottom"
            className="h-[85vh] overflow-hidden rounded-t-[10px] px-1 outline"
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
              {/* <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
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
                </AlertDialogTrigger>
                <AlertDialogContent
                  onCloseAutoFocus={(e) => e.preventDefault()}
                  className={cn(!isDesktop && "max-w-[calc(100vw_-_20px)]")}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the notification from our servers.
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
              </AlertDialog> */}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
