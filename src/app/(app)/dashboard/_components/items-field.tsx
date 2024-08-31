"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronsUpDown, Check } from "lucide-react";
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
import { type ReturnableItem } from "prisma/generated/zod";
import { P } from "@/components/typography/text";
import Image from "next/image";

interface ItemsFieldProps {
  form: UseFormReturn<ReturnableResourceRequestSchema>;
  name: Path<ReturnableResourceRequestSchema>;
  isPending: boolean;
}

export default function ItemsField({ form, name, isPending }: ItemsFieldProps) {
  const [open, setOpen] = React.useState(false);

  const { data, isLoading } = useQuery<ReturnableItem[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/resource-items/returnable");
      return res.data.data;
    },
    queryKey: ["get-input-returnable-resource"],
    refetchOnWindowFocus: false,
  });
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-muted-foreground">Resources</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
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
                      {data?.find((item) => item.id === field.value)?.name}
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
              <PopoverContent className="w-[450px] p-0">
                <Command>
                  <CommandInput placeholder="Search items..." />
                  <CommandList>
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup>
                      {data?.map((item) => {
                        const { icon: Icon, variant } =
                          getReturnableItemStatusIcon(item.status);
                        return (
                          <CommandItem
                            value={item.id}
                            key={item.id}
                            onSelect={() => {
                              form.setValue("itemId", item.id);
                              setOpen(false);
                            }}
                          >
                            <div className="flex w-full justify-between">
                              <div className="flex space-x-2 truncate">
                                <div className="relative aspect-square h-14 cursor-pointer transition-colors hover:brightness-75">
                                  <Image
                                    src={item.imageUrl}
                                    alt={`Image of ${item.name}`}
                                    fill
                                    className="rounded-md border object-cover"
                                  />
                                </div>
                                <div className="flex flex-col justify-between">
                                  <P className="truncate">{item.name}</P>
                                  <Badge variant={variant} className="ml-auto">
                                    <Icon className="mr-1 size-4" />
                                    {textTransform(item.status)}
                                  </Badge>
                                </div>
                              </div>
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  item.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
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
