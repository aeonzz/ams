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
import {
  CheckIcon,
  CircleArrowUp,
  Cog,
  Construction,
  FileQuestion,
  Hammer,
  LucideIcon,
  Paintbrush,
  PocketKnife,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JobTypeOptionProps {
  jobType: Job | undefined;
  setJobType: (type: Job | undefined) => void;
}

export type Job = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const Jobs: Job[] = [
  {
    value: "repair",
    label: "Repair",
    icon: Wrench,
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: Construction,
  },
  {
    value: "installation",
    label: "Installation",
    icon: PocketKnife,
  },
  {
    value: "troubleshooting",
    label: "Troubleshooting",
    icon: FileQuestion,
  },
  {
    value: "cleaning",
    label: "Cleaning",
    icon: Paintbrush,
  },
  {
    value: "replacement",
    label: "Replacement",
    icon: CircleArrowUp,
  },
  {
    value: "configuration",
    label: "Configuration",
    icon: Cog,
  },
];

export default function JobTypeOption({
  jobType,
  setJobType,
}: JobTypeOptionProps) {
  const [open, setOpen] = useState(false);
  let Icon = null;

  if (jobType) {
    Icon = jobType.icon;
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="px-2"
        >
          {jobType ? (
            <>
              {Icon && <Icon className="mr-2 size-4" />}
              {jobType.label}
            </>
          ) : (
            <>
              <Hammer className="mr-2 size-4" />
              Job type
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[230px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Choose job type..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {Jobs.map((type) => {
                const { icon: Icon } = type;
                return (
                  <CommandItem
                    key={type.value}
                    value={type.value}
                    onSelect={(value) => {
                      setJobType(
                        Jobs.find((type) => type.value === value) || undefined
                      );
                      setOpen(false);
                    }}
                  >
                    <Icon className="mr-2 size-4" />
                    {type.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        jobType?.value === type.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
