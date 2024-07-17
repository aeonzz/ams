"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { ChevronLeft } from "lucide-react";
import { Textarea } from "../../ui/text-area";
import RequestTypeOption from "./request-type-option";
import { Separator } from "../../ui/separator";
import { RequestType } from "./create-request";

interface ServiceRequestInputProps {
  setType: (type: RequestType | null) => void;
}

export default function ServiceRequestInput({
  setType,
}: ServiceRequestInputProps) {
  return (
    <>
      <DialogHeader className="px-2">
        <div className="flex items-center space-x-1">
          <Button
            size="icon"
            className="size-7"
            variant="ghost2"
            onClick={() => {
              setType(null);
            }}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <DialogTitle>Service Request</DialogTitle>
        </div>
      </DialogHeader>
      <div className="px-4">
        <Textarea
          rows={1}
          maxRows={8}
          placeholder="Add description..."
          className="min-h-32 border-none px-[2px] py-0 focus-visible:ring-0"
        />
        <div>
          <RequestTypeOption />
        </div>
      </div>
      <Separator className="my-2" />
      <DialogFooter>
        <div></div>
        <Button>Submit</Button>
      </DialogFooter>
    </>
  );
}
