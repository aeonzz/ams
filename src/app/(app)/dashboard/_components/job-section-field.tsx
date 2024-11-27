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
import { H3, H5, P } from "@/components/typography/text";
import { UseFormReturn } from "react-hook-form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CreateJobRequestSchema } from "./schema";
import { type Department } from "prisma/generated/zod";

interface JobSectionFieldProps {
  form: UseFormReturn<CreateJobRequestSchema>;
  name: keyof CreateJobRequestSchema;
  isPending: boolean;
  data: Department[] | undefined;
}

export default function JobSectionField({
  form,
  name,
  isPending,
  data,
}: JobSectionFieldProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDepartment = data?.find(
    (department) => department.id === form.watch(name)
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-1 flex-col">
          <FormLabel>Department</FormLabel>
          <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={isPending}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    <span>{selectedDepartment?.name}</span>
                  ) : (
                    <span>Select department</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search departments..." />
                <CommandList>
                  <CommandEmpty>No departments found.</CommandEmpty>
                  <CommandGroup>
                    {data?.map((department) => (
                      <HoverCard key={department.id} openDelay={300}>
                        <HoverCardTrigger asChild>
                          <CommandItem
                            value={department.id}
                            onSelect={() => {
                              field.onChange(department.id);
                              setOpen(false);
                            }}
                            className="flex items-center"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                department.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <P className="truncate">{department.name}</P>
                          </CommandItem>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-60"
                          side="left"
                          align="start"
                        >
                          <div className="space-y-2">
                            <H5 className="truncate font-semibold">
                              {department.name}
                            </H5>
                            <div className="scroll-bar max-h-52 overflow-y-auto">
                              <P className="tracking-tight text-muted-foreground">
                                {department.responsibilities ||
                                  "Nothing to show here!"}
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
