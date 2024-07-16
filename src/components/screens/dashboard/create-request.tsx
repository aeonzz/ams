"use client";

import React, { useEffect } from "react";

import { useDialog } from "@/lib/hooks/use-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateRequest() {
  const dialog = useDialog();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "c" &&
        e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        dialog.setActiveDialog("requestDialog");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog
      open={dialog.activeDialog === "requestDialog"}
      onOpenChange={(open) =>
        dialog.setActiveDialog(open ? "requestDialog" : "")
      }
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>New Request</DialogTitle>
          <DialogDescription>
            Submit a new request for resources, venues, or assistance. Please
            provide the necessary details to process your request efficiently.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
