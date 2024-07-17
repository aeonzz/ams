"use client";

import React, { useEffect, useState } from "react";

import { useDialog } from "@/lib/hooks/use-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import RequestTypeOption from "./request-type-option";
import {
  ChevronLeft,
  Lightbulb,
  LucideIcon,
  Theater,
  Wrench,
} from "lucide-react";
import ServiceRequestInput from "@/components/screens/dashboard/service-request-input";

export type RequestType = {
  value: "service" | "venue" | "resource";
  label: string;
  icon: LucideIcon;
};

const RequestTypes: RequestType[] = [
  {
    value: "service",
    label: "Service",
    icon: Wrench,
  },
  {
    value: "venue",
    label: "Venue",
    icon: Theater,
  },
  {
    value: "resource",
    label: "Resource",
    icon: Lightbulb,
  },
];

export default function CreateRequest() {
  const dialog = useDialog();
  const [type, setType] = useState<RequestType | null>(null);

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
      onOpenChange={(open) => {
        dialog.setActiveDialog(open ? "requestDialog" : "");

        if (!open) {
          setTimeout(() => {
            setType(null);
          }, 350);
        }
      }}
    >
      <DialogContent className="max-w-3xl">
        {type?.value === "service" ? (
          <ServiceRequestInput setType={setType} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>New Request</DialogTitle>
              <div className="flex h-full items-center space-x-4 pb-4">
                {RequestTypes.map(({ icon: Icon, ...type }, index) => (
                  <Button
                    key={index}
                    variant="ringHover"
                    onClick={() => setType({ icon: Icon, ...type })}
                    className="aspect-square h-auto flex-1 flex-col gap-2 bg-secondary-accent"
                  >
                    <Icon className="size-12 text-muted-foreground" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
