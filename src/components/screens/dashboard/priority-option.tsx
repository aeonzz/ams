"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { P } from "@/components/typography/text";
import { PriorityTypeType } from "prisma/generated/zod/inputTypeSchemas/PriorityTypeSchema";
import {
  CheckIcon,
  LucideIcon,
  Minus,
  SignalHigh,
  SignalLow,
  SignalMedium,
  TriangleAlert,
} from "lucide-react";

interface PriorityOptionProps {
  prio: Priority;
  setPrio: React.Dispatch<React.SetStateAction<Priority>>;
  isLoading: boolean;
}

export type Priority = {
  value: PriorityTypeType;
  label: string;
  icon: LucideIcon;
};

export const priorities: Priority[] = [
  {
    value: "NOPRIORITY",
    label: "No priority",
    icon: Minus,
  },
  {
    value: "URGENT",
    label: "Urgent",
    icon: TriangleAlert,
  },
  {
    value: "HIGH",
    label: "High",
    icon: SignalHigh,
  },
  {
    value: "MEDIUM",
    label: "Medium",
    icon: SignalMedium,
  },
  {
    value: "LOW",
    label: "Low",
    icon: SignalLow,
  },
];

export default function PriorityOption({ prio, setPrio, isLoading }: PriorityOptionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            role="combobox"
            aria-expanded={open}
            className={cn(
              prio.value === "NOPRIORITY" && "text-muted-foreground",
              "px-2"
            )}
            disabled={isLoading}
          >
            {prio ? (
              <>
                <prio.icon
                  className={cn(
                    "mr-2 size-4",
                    prio.value === "URGENT" && "text-amber-500"
                  )}
                />
                {prio.label}
              </>
            ) : (
              <>Priority</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[230px] p-0" align="start">
          <Command className="max-h-72">
            <CommandInput placeholder="Change priority..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {priorities.map((type) => (
                  <CommandItem
                    key={type.value}
                    value={type.value}
                    onSelect={(value) => {
                      setPrio(
                        priorities.find((p) => p.value === value) ?? prio
                      );
                      setOpen(false);
                    }}
                  >
                    <type.icon className="mr-2 size-5" />
                    {type.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        prio.value === type.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <P className="text-muted-foreground">Priority</P>
    </div>
  );
}
