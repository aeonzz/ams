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
import { Selection } from "./job-request-input";
import CategoryOption from "./category-option";
import { CheckIcon, Hammer } from "lucide-react";
import { jobs } from "@/config/job-list";

interface JobTypeOptionProps {
  selection: Selection;
  setSelection: React.Dispatch<React.SetStateAction<Selection>>;
  isLoading: boolean;
}

export default function JobTypeOption({
  selection,
  setSelection,
  isLoading,
}: JobTypeOptionProps) {
  const [open, setOpen] = useState(false);

  const Icon = selection.jobType.icon;

  return (
    <>
      <div className="space-y-1">
        <Popover open={open} onOpenChange={setOpen} modal>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="px-2"
              disabled={isLoading}
            >
              {selection.jobType ? (
                <>
                  {Icon && <Icon className="mr-2 size-4" />}
                  {selection.jobType.label}
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
            <Command className="max-h-72">
              <CommandInput placeholder="Choose job type..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {jobs.map((type) => {
                    const { icon: Icon } = type;
                    return (
                      <CommandItem
                        key={type.value}
                        value={type.value}
                        onSelect={(value) => {
                          setSelection({
                            ...selection,
                            jobType:
                              jobs.find((type) => type.value === value) ??
                              selection.jobType,
                          });
                          setOpen(false);
                        }}
                      >
                        <Icon className="mr-2 size-4" />
                        {type.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selection.jobType.value === type.value
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
        <P className="text-muted-foreground">Service Type</P>
      </div>
      <CategoryOption selection={selection} setSelection={setSelection} isLoading={isLoading} />
    </>
  );
}
