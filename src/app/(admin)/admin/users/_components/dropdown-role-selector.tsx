"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { assignRole } from "@/lib/actions/users";
import { type Role } from "prisma/generated/zod";
import { type UserType } from "@/lib/types/user";

interface DropdownRoleSelectorProps {
  user: UserType;
}

export default function DropdownRoleSelector({
  user,
}: DropdownRoleSelectorProps) {
  const [value, setValue] = React.useState("");

  const {
    data: roles,
    isLoading,
    error,
  } = useQuery<Role[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/roles");
      return res.data.data;
    },
    queryKey: ["users-table-assign-role-input-data"],
  });

  const { isPending, mutateAsync } = useServerActionMutation(assignRole);

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="w-full">
        <span className="flex items-center justify-between">
          Assign roles...
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="p-0">
        <Command className="w-[200px]">
          <CommandInput placeholder="Search role..." />
          <CommandList>
            <CommandEmpty>No roles found.</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <CommandItem>Loading...</CommandItem>
              ) : error ? (
                <CommandItem>Error loading roles.</CommandItem>
              ) : roles && roles.length > 0 ? (
                roles.map((role) => (
                  <CommandItem key={role.id} onSelect={() => setValue(role.id)}>
                    <DropdownMenuItem>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === role.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {role.name}
                    </DropdownMenuItem>
                  </CommandItem>
                ))
              ) : (
                <CommandItem>No roles available.</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
