"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronsUpDown, Check, ChevronRight } from "lucide-react";
import type { Path, UseFormReturn } from "react-hook-form";

import { cn, getReturnableItemStatusIcon, textTransform } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { type ReturnableResourceRequestSchema } from "@/lib/schema/resource/returnable-resource";
import { P } from "@/components/typography/text";
import Image from "next/image";
import { InventoryItemWithRelations } from "prisma/generated/zod";

interface ItemsFieldProps {
  form: UseFormReturn<ReturnableResourceRequestSchema>;
  name: Path<ReturnableResourceRequestSchema>;
  isPending: boolean;
}

export default function ItemsField({ form, name, isPending }: ItemsFieldProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] =
    useState<InventoryItemWithRelations | null>(null);

  const { data, isLoading } = useQuery<InventoryItemWithRelations[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/resource-items/returnable");
      return res.data.data;
    },
    queryKey: ["get-input-returnable-resource"],
  });

  const handleItemSelect = (item: InventoryItemWithRelations) => {
    setSelectedItem(item);
  };

  const handleSubItemSelect = (subItemId: string) => {
    form.setValue(name, subItemId);
    setOpen(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-muted-foreground">Resources</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  role="combobox"
                  disabled={isPending || isLoading}
                  className={cn(
                    "justify-start truncate",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    <p className="truncate">
                      {
                        data?.find((item) =>
                          item.inventorySubItems.some(
                            (subItem) => subItem.id === field.value
                          )
                        )?.name
                      }
                    </p>
                  ) : (
                    "Select item"
                  )}
                  {isLoading ? (
                    <LoadingSpinner className="ml-auto" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0">
                <Command className="max-h-[250px]">
                  <CommandInput placeholder="Search items..." />
                  <CommandList>
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup>
                      {selectedItem ? (
                        <>
                          <CommandItem onSelect={() => setSelectedItem(null)}>
                            <ChevronRight className="mr-2 h-4 w-4" />
                            Back to items
                          </CommandItem>
                          {selectedItem.inventorySubItems
                            // .filter((subItem) => subItem.status === "AVAILABLE")
                            .map((subItem) => {
                              const { icon: Icon, variant } =
                                getReturnableItemStatusIcon(subItem.status);
                              return (
                                <CommandItem
                                  key={subItem.id}
                                  onSelect={() =>
                                    handleSubItemSelect(subItem.id)
                                  }
                                  disabled={
                                    subItem.status === "MAINTENANCE" ||
                                    subItem.status === "LOST"
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      subItem.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {selectedItem.name} - SubItem {subItem.id}
                                  <Badge variant={variant} className="ml-auto">
                                    <Icon className="mr-1 size-4" />
                                    {textTransform(subItem.status)}
                                  </Badge>
                                </CommandItem>
                              );
                            })}
                        </>
                      ) : (
                        data?.map((item) => {
                          const availableSubItems =
                            item.inventorySubItems.filter(
                              (subItem) => subItem.status === "AVAILABLE"
                            ).length;
                          return (
                            <CommandItem
                              value={item.id}
                              key={item.id}
                              onSelect={() => handleItemSelect(item)}
                            >
                              <div className="flex w-full space-x-4">
                                <div className="relative aspect-square h-20 cursor-pointer transition-colors hover:brightness-75">
                                  <Image
                                    src={item.imageUrl}
                                    alt={`Image of ${item.name}`}
                                    fill
                                    className="rounded-md border object-cover"
                                  />
                                </div>
                                <div className="flex flex-grow flex-col justify-between">
                                  <div>
                                    <P className="font-semibold">{item.name}</P>
                                    <P className="line-clamp-2 text-sm text-muted-foreground">
                                      {item.description}
                                    </P>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="green">
                                      {availableSubItems} available
                                    </Badge>
                                    <P className="text-xs text-muted-foreground">
                                      Created:{" "}
                                      {new Date(
                                        item.createdAt
                                      ).toLocaleDateString()}
                                    </P>
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 opacity-50" />
                              </div>
                            </CommandItem>
                          );
                        })
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
