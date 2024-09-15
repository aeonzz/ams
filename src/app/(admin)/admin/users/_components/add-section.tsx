"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import {
  type AssignUserSchema,
  assignUserSchema,
} from "../../job-sections/_components/schema";
import { assignSection } from "@/lib/actions/job";
import { type Section } from "prisma/generated/zod";
import AddSectionForm from "./add-section-form";

interface AddSectionProps {
  userId: string;
}

export default function AddSection({ userId }: AddSectionProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<AssignUserSchema>({
    resolver: zodResolver(assignUserSchema),
    defaultValues: {
      userId: userId,
      sectionId: undefined,
    },
  });

  const { mutateAsync, isPending } = useServerActionMutation(assignSection);

  const { data, isLoading } = useQuery<Section[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/sections");
      return res.data.data;
    },
    queryKey: ["add-section-to-user-selection-users-table"],
  });

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <DropdownMenuItem
          disabled={isLoading}
          onSelect={(e) => e.preventDefault()}
          className="flex"
        >
          <span>Add section</span>
          {isLoading && <LoadingSpinner className="ml-auto" />}
        </DropdownMenuItem>
      </PopoverTrigger>
      <PopoverContent
        onInteractOutside={(e) => {
          if (isPending) {
            e.preventDefault();
          }
        }}
        className="p-0 w-56"
        align="start"
        side="left"
      >
        {isLoading || !data ? null : (
          <AddSectionForm
            mutateAsync={mutateAsync}
            isPending={isPending}
            setOpen={setOpen}
            form={form}
            data={data}
            userId={userId}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
