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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ItemsFieldProps {
  form: UseFormReturn<ReturnableResourceRequestSchema>;
  name: Path<ReturnableResourceRequestSchema>;
  isPending: boolean;
  data: InventoryItemWithRelations[] | undefined;
  onDepartmentIdChange: (departmentId: string) => void;
}

export default function ItemsField({
  form,
  name,
  isPending,
  data,
  onDepartmentIdChange,
}: ItemsFieldProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] =
    useState<InventoryItemWithRelations | null>(null);

  const handleItemSelect = (item: InventoryItemWithRelations) => {
    setSelectedItem(item);
    onDepartmentIdChange(item.departmentId);
  };

  const handleSubItemSelect = (subItemId: string) => {
    form.setValue(name, subItemId, { shouldDirty: true });
    setOpen(false);
  };

  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const handleImageLoad = (img: HTMLImageElement) => {
    setDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  const maxWidth = 400;
  const maxHeight = 300;
  const aspectRatio = dimensions.width / dimensions.height;

  let hoverCardWidth = dimensions.width;
  let hoverCardHeight = dimensions.height;

  if (hoverCardWidth > maxWidth) {
    hoverCardWidth = maxWidth;
    hoverCardHeight = hoverCardWidth / aspectRatio;
  }

  if (hoverCardHeight > maxHeight) {
    hoverCardHeight = maxHeight;
    hoverCardWidth = hoverCardHeight * aspectRatio;
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Resources</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={isPending}
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
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw_-_20px)] p-0 lg:w-[470px]">
                <Command className="max-h-[300px]">
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
                          {selectedItem.inventorySubItems.map((subItem) => {
                            const { icon: Icon, variant } =
                              getReturnableItemStatusIcon(subItem.status);
                            return (
                              <CommandItem
                                key={subItem.id}
                                onSelect={() => handleSubItemSelect(subItem.id)}
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
                                <HoverCard closeDelay={0} openDelay={300}>
                                  <HoverCardTrigger asChild>
                                    <div className="relative mr-2 aspect-square h-16 cursor-pointer transition-colors hover:brightness-75">
                                      <Image
                                        src={subItem.imageUrl}
                                        alt={`Image of ${subItem.id}`}
                                        fill
                                        className="rounded-md border object-cover"
                                        onLoadingComplete={handleImageLoad}
                                      />
                                    </div>
                                  </HoverCardTrigger>
                                  <HoverCardContent
                                    className="p-0"
                                    style={{
                                      width: hoverCardWidth,
                                      height: hoverCardHeight,
                                    }}
                                  >
                                    <div className="relative h-full w-full">
                                      <Image
                                        src={subItem.imageUrl}
                                        alt={`Enlarged image of ${subItem.id}`}
                                        fill
                                        className="rounded-md object-contain"
                                      />
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                                {subItem.subName}
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
                              <div className="flex w-full space-x-3">
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
                                    <Badge variant="outline">
                                      {item.department.name}
                                    </Badge>
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
