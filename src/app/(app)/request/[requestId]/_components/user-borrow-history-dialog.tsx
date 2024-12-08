"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogState, useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useMediaQuery } from "usehooks-ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserBorrowTable from "./user-borrow-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import FetchDataError from "@/components/card/fetch-data-error";
import NotFound from "@/app/not-found";
import { Button } from "@/components/ui/button";
import { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

export type UserBorrowData = {
  title: string;
  id: string;
  isOverdue: boolean;
  isLost: boolean;
  inProgress: boolean;
  completed: Date | null;
  status: RequestStatusTypeType;
};

interface UserBorrowHistoryDialogProps {
  userId: string;
}

export default function UserBorrowHistoryDialog({
  userId,
}: UserBorrowHistoryDialogProps) {
  const dialogManager = useDialogManager();
  const isDesktop = useMediaQuery("(min-width: 769px)");

  const { data, isLoading, isError, refetch } = useQuery<UserBorrowData[]>({
    queryFn: async () => {
      const res = await axios.get(
        `/api/resource/returnable-items/get-user-borrow-request/${userId}`
      );
      return res.data.data;
    },
    queryKey: ["get-user-borrow-request", userId],
  });

  console.log(data);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dialogManager.setActiveDialog(null);
    }
  };

  if (isLoading) {
    return null;
  }

  if (isError) return <FetchDataError refetch={refetch} />;
  if (!data) return <NotFound />;

  if (isDesktop) {
    return (
      <>
        <Button
          size="sm"
          variant="ghost2"
          disabled={isLoading}
          onClick={() => dialogManager.setActiveDialog("userBorrowDialog")}
        >
          Borrow Log
        </Button>
        <Dialog
          open={dialogManager.activeDialog === "userBorrowDialog"}
          onOpenChange={handleOpenChange}
        >
          <DialogContent className="max-w-4xl overflow-hidden">
            <Component
              dialogManager={dialogManager}
              handleOpenChange={handleOpenChange}
              isDesktop={isDesktop}
              data={data}
            >
              <DialogHeader>
                <DialogTitle>User Borrow History</DialogTitle>
              </DialogHeader>
            </Component>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost2"
        disabled={isLoading}
        onClick={() => dialogManager.setActiveDialog("userBorrowDialog")}
      >
        Borrow Log
      </Button>
      <Sheet
        open={dialogManager.activeDialog === "userBorrowDialog"}
        onOpenChange={handleOpenChange}
      >
        <SheetContent className="rounded-t-[10px]" side="bottom" hideClose>
          <Component
            dialogManager={dialogManager}
            handleOpenChange={handleOpenChange}
            isDesktop={isDesktop}
            data={data}
          >
            <SheetHeader>
              <SheetTitle>User Borrow History</SheetTitle>
            </SheetHeader>
          </Component>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Component({
  children,
  dialogManager,
  handleOpenChange,
  isDesktop,
  data,
}: {
  children: React.ReactNode;
  dialogManager: DialogState;
  handleOpenChange: (open: boolean) => void;
  isDesktop: boolean;
  data: UserBorrowData[];
}) {
  return (
    <>
      {children}
      <UserBorrowTable data={data} />
    </>
  );
}
