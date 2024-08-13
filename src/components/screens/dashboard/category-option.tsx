"use client";

import React, { useEffect, useState } from "react";

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
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { P } from "@/components/typography/text";
import { Selection } from "./job-request-input";
import ItemOption from "./item-option";

interface CategoryOptionProps {
  selection: Selection;
  setSelection: React.Dispatch<React.SetStateAction<Selection>>;
  isLoading: boolean;
}

export default function CategoryOption({
  selection,
  setSelection,
  isLoading,
}: CategoryOptionProps) {
  const { jobType, category } = selection;
  const { categories } = jobType;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelection({
      ...selection,
      category: categories[0],
    });
  }, [jobType]);

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
              {category ? <>{category.label}</> : <>{categories[0].label}</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[230px] p-0" align="start">
            <Command className="max-h-72">
              <CommandInput placeholder="Choose category..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((type) => (
                    <CommandItem
                      key={type.value}
                      value={type.value}
                      onSelect={(value) => {
                        setSelection({
                          ...selection,
                          category:
                            categories.find((type) => type.value === value) ??
                            category,
                        });
                        setOpen(false);
                      }}
                    >
                      {type.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          type.value === category?.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <P className="text-muted-foreground">Issue</P>
      </div>
      <ItemOption selection={selection} setSelection={setSelection} isLoading={isLoading} />
    </>
  );
}
