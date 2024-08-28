"use client";

import React from "react";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { cn, getItemStatusIcon, textTransform } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { ResourceItem } from "prisma/generated/zod";
import { type ResourceRequestSchema } from "@/lib/schema/resource";

interface ResourceFieldProps {
  form: UseFormReturn<ResourceRequestSchema>;
  name: "resourceItems";
  isPending: boolean;
}

export default function ResourceField({
  form,
  name,
  isPending,
}: ResourceFieldProps) {
  const [open, setOpen] = React.useState(false);

  const { data, isLoading } = useQuery<ResourceItem[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/resource-items");
      return res.data.data;
    },
    queryKey: ["get-input-resources"],
    refetchOnWindowFocus: false,
  });

  const selectedResources = form.watch(name) || [];

  const handleSelect = (resource: ResourceItem) => {
    const currentValues = form.getValues(name);
    const updatedValues = currentValues.some((item) => item.id === resource.id)
      ? currentValues.filter((item) => item.id !== resource.id)
      : [...currentValues, resource];
    form.setValue(name, updatedValues, { shouldValidate: true });
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-muted-foreground">Resources</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="secondary"
                  role="combobox"
                  disabled={isPending || isLoading}
                  className={cn(
                    "justify-start",
                    !field.value?.length && "text-muted-foreground"
                  )}
                >
                  {field.value?.length
                    ? `${field.value.length} resource${
                        field.value.length > 1 ? "s" : ""
                      } selected`
                    : "Select resources"}
                  {isLoading ? (
                    <LoadingSpinner className="ml-auto" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Search resources..." />
                <CommandList>
                  <CommandEmpty>No resources found.</CommandEmpty>
                  <CommandGroup>
                    {data?.map((resource) => {
                      const { icon: Icon, variant } = getItemStatusIcon(
                        resource.status
                      );
                      const isSelected = selectedResources.some((item) => item.id === resource.id);
                      return (
                        <CommandItem
                          value={resource.id}
                          key={resource.id}
                          onSelect={() => handleSelect(resource)}
                        >
                          <div className="self-start pt-1">
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </div>
                          <div className="space-y-1 truncate">
                            <P className="truncate">{resource.name}</P>
                            <Badge variant={variant} className="ml-auto">
                              <Icon className="mr-1 size-4" />
                              {textTransform(resource.status)}
                            </Badge>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedResources.map((resource) => (
              <Badge key={resource.id} variant="secondary">
                {resource.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 p-0 h-auto"
                  onClick={() => handleSelect(resource)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}