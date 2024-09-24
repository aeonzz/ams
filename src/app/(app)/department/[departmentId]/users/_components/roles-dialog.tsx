"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { P } from "@/components/typography/text";
import { User2Icon, Trash, CirclePlus } from "lucide-react";
import { UserType } from "@/lib/types/user";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { createUserRole, removeUserRole } from "@/lib/actions/userRole";
import { toast } from "sonner";
import {
  CreateUserRoleSchemaWithPath,
  RemoveUserRoleSchema,
} from "@/lib/schema/userRole";
import { usePathname } from "next/navigation";
import { Role } from "prisma/generated/zod";

interface RolesDialogProps {
  userIds: string[];
  open: boolean;
  setOpen: (open: boolean) => void;
  departmentId: string;
  data: Role[] | undefined;
}

export function RolesDialog({
  userIds,
  open,
  setOpen,
  departmentId,
  data,
}: RolesDialogProps) {
  const pathname = usePathname();
  const [action, setAction] = React.useState(false);
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(
    null
  );

  const { mutateAsync, isPending } = useServerActionMutation(createUserRole);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    setAction(true);
    setOpen(false);
  };

  const confirmAdd = () => {
    if (selectedRoleId) {
      const values: CreateUserRoleSchemaWithPath = {
        path: pathname,
        departmentId: departmentId,
        userIds: userIds,
        roleId: selectedRoleId,
      };

      toast.promise(mutateAsync(values), {
        loading: "Adding...",
        success: () => {
          setAction(false);
          return "User role added successfully";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      });
    }
  };

  const role = data?.find((role) => role.id === selectedRoleId);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Roles..." />
        <CommandList>
          <CommandGroup heading="Roles">
            <CommandEmpty>No results found.</CommandEmpty>
            {data?.map((role) => (
              <CommandItem
                key={role.id}
                onSelect={() => handleRoleSelect(role.id)}
                className="justify-between"
              >
                <div className="flex items-center gap-2">
                  <User2Icon className="h-4 w-4" />
                  <P className="font-semibold">{role.name}</P>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <CommandDialog open={action} onOpenChange={setAction}>
        <CommandInput placeholder="Action..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading={role?.name}>
            <CommandItem onSelect={confirmAdd} disabled={isPending}>
              <CirclePlus className="mr-2 h-4 w-4" />
              Add
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
