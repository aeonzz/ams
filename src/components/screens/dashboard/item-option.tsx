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
import { Textarea } from "@/components/ui/text-area";
import { Selection } from "./job-request-input";
import { P } from "@/components/typography/text";

interface ItemOptionProps {
  selection: Selection;
  setSelection: React.Dispatch<React.SetStateAction<Selection>>;
  isLoading: boolean;
}

export default function ItemOption({
  selection,
  setSelection,
  isLoading,
}: ItemOptionProps) {
  const [open, setOpen] = useState(false);
  const [openTextbox, setOpenTextbox] = useState(false);

  const { category, item } = selection;
  const { items } = category;

  useEffect(() => {
    setSelection({
      ...selection,
      item: category.items[0].value,
    });
  }, [category]);

  return (
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
          {item ? (
            <>{`${item.charAt(0).toUpperCase()}${item.slice(1)}`}</>
          ) : (
            <>{items[0].label}</>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[230px] p-0"
        align="start"
        onInteractOutside={() => {
          setOpenTextbox(false);
        }}
      >
        <Command className="max-h-72">
          <CommandInput placeholder="Choose issue..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(value) => {
                    if (type.value === "other") {
                      setOpenTextbox(true);
                    } else {
                      setOpenTextbox(false);
                      setSelection({
                        ...selection,
                        item:
                          items.find((type) => type.value === value)?.value ??
                          item,
                      });
                      setOpen(false);
                    }
                  }}
                >
                  {type.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      item === type.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {openTextbox && (
              <div className="p-1">
                <Textarea
                  rows={1}
                  maxRows={8}
                  onChange={(e) => {
                    setSelection({
                      ...selection,
                      item: `${e.target.value.charAt(0).toUpperCase()}${e.target.value.slice(1)}`,
                    });
                  }}
                  placeholder="Specify the issue"
                  className="min-h-20"
                  maxLength={20}
                  defaultSize="text-sm"
                  small="text-xs"
                  large="text-base"
                />
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
