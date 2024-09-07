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
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { H3, P } from "@/components/typography/text";
import { UseFormReturn } from "react-hook-form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CreateJobRequestSchema } from "./schema";

interface Section {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

interface JobSectionFieldProps {
  form: UseFormReturn<CreateJobRequestSchema>;
  name: keyof CreateJobRequestSchema;
  isPending: boolean;
}

export default function JobSectionField({
  form,
  name,
  isPending,
}: JobSectionFieldProps) {
  const [open, setOpen] = React.useState(false);

  const { data, isLoading } = useQuery<Section[]>({
    queryFn: async () => {
      const res = await axios.get("/api/job-section/job-sections");
      return res.data.data;
    },
    queryKey: ["get-input-job-sections"],
  });

  const selectedSection = data?.find(
    (section) => section.id === form.watch(name)
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-muted-foreground">Job Section</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="secondary"
                  role="combobox"
                  disabled={isPending || isLoading}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    <span className="truncate">{selectedSection?.name}</span>
                  ) : (
                    "Select section"
                  )}
                  {isLoading ? (
                    <LoadingSpinner className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Search sections..." />
                <CommandList>
                  <CommandEmpty>No sections found.</CommandEmpty>
                  <CommandGroup>
                    {data?.map((section) => (
                      <HoverCard key={section.id} openDelay={300}>
                        <HoverCardTrigger asChild>
                          <CommandItem
                            value={section.id}
                            onSelect={() => {
                              form.setValue(name, section.id);
                              setOpen(false);
                            }}
                            className="flex items-center"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                section.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <P className="truncate">{section.name}</P>
                          </CommandItem>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-80"
                          side="right"
                        >
                          <div className="space-y-2">
                            <H3 className="font-semibold">{section.name}</H3>
                            <div className="scroll-bar overflow-y-auto max-h-52">
                              <P className="text-muted-foreground">
                                {section.description ||
                                  "No description available."}
                              </P>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
