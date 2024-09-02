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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { type ReturnableResourceRequestSchema } from "@/lib/schema/resource/returnable-resource";
import { P } from "@/components/typography/text";
import Image from "next/image";
import {
  SupplyItemCategorySchema,
  type SupplyItemWithRelations,
} from "prisma/generated/zod";
import { type SupplyResourceRequestSchema } from "@/lib/schema/resource/supply-resource";

interface SupplyItemsFieldProps {
  form: UseFormReturn<SupplyResourceRequestSchema>;
  name: Path<SupplyResourceRequestSchema>;
  isPending: boolean;
}

export default function SupplyItemsField({
  form,
  name,
  isPending,
}: SupplyItemsFieldProps) {
  const [open, setOpen] = React.useState(false);

  const { data, isLoading } = useQuery<SupplyItemWithRelations[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/resource-items/supply");
      return res.data.data;
    },
    queryKey: ["get-input-supply-resource"],
  });

  const handleSubItemSelect = (item: SupplyItemWithRelations) => {
    form.setValue(name, item);
    setOpen(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-muted-foreground">Supplies</FormLabel>
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
                      {field.value}
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
              <PopoverContent className="w-[470px] p-0">
                <Command className="max-h-[300px]">
                  <CommandInput placeholder="Search items..." />
                  <CommandList>
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup>
                      {data?.map((item) => {
                        return (
                          <CommandItem
                            value={item.id}
                            key={item.id}
                            onSelect={() => handleSubItemSelect(item)}
                          >
                            <div className="flex w-full space-x-4">
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="relative aspect-square h-20 cursor-pointer transition-colors hover:brightness-75">
                                {/* <Image
                                  src={item.imageUrl}
                                  alt={`Image of ${item.name}`}
                                  fill
                                  className="rounded-md border object-cover"
                                /> */}
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
                                    {item.quantity} available
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
                      })}
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
