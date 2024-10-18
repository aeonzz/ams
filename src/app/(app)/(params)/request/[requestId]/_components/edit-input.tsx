import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommandShortcut } from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { P } from "@/components/typography/text";
import { DefaultValues, KeepStateOptions } from "react-hook-form";

interface EditInputProps<T extends Record<string, any>> {
  isPending: boolean;
  isFieldsDirty: boolean;
  setEditField: (value: string | null) => void;
  label: string;
  reset: (
    values?: DefaultValues<T>,
    keepStateOptions?: KeepStateOptions
  ) => void;
  children: React.ReactNode;
}

export default function EditInput<T extends Record<string, any>>({
  isPending,
  isFieldsDirty,
  setEditField,
  label,
  reset,
  children,
}: EditInputProps<T>) {
  return (
    <div className="space-y-1 rounded-md border p-1">
      <div className="flex justify-between">
        <Badge variant="outline" className="bg-tertiary">
          {label}
        </Badge>
        <div className="space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost2"
                size="sm"
                disabled={isPending}
                onClick={(e) => {
                  e.preventDefault();
                  setEditField(null);
                  reset();
                }}
              >
                Cancel
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-3">
              <P>Exit</P>
              <CommandShortcut>Esc</CommandShortcut>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                disabled={isPending || !isFieldsDirty}
                type="submit"
              >
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-3">
              <P>Save</P>
              <div className="space-x-1">
                <CommandShortcut>Shift</CommandShortcut>
                <CommandShortcut>Enter</CommandShortcut>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {children}
    </div>
  );
}
