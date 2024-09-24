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
import { User2Icon, Trash } from "lucide-react";
import { UserType } from "@/lib/types/user";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { removeUserRole } from "@/lib/actions/userRole";
import { toast } from "sonner";
import { RemoveUserRoleSchema } from "@/lib/schema/userRole";
import { usePathname } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface UserRolesDialogProps {
  user: UserType;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function UserRolesDialog({ user, open, setOpen }: UserRolesDialogProps) {
  const pathname = usePathname();
  const [action, setAction] = React.useState(false);
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(
    null
  );
  const [showAlert, setShowAlert] = React.useState(false);

  const { mutateAsync, isPending } = useServerActionMutation(removeUserRole);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    setAction(true);
    setOpen(false);
  };

  const handleAction = () => {
    setShowAlert(true);
  };

  const confirmRemove = () => {
    if (selectedRoleId) {
      const data: RemoveUserRoleSchema = {
        path: pathname,
        userRoleId: selectedRoleId,
      };

      toast.promise(mutateAsync(data), {
        loading: "Removing...",
        success: () => {
          setAction(false);
          setShowAlert(false);
          return "User role removed successfully";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      });
    }
  };

  const role = user.userRole.find((role) => role.id === selectedRoleId);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="User roles..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="User roles">
            {user.userRole.map((role) => (
              <CommandItem
                key={role.id}
                onSelect={() => handleRoleSelect(role.id)}
                className="justify-between"
              >
                <div className="flex items-center gap-2">
                  <User2Icon className="h-4 w-4" />
                  <P className="font-semibold">{role.role.name}</P>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(role.createdAt).toLocaleDateString()}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <CommandDialog open={action} onOpenChange={setAction}>
        <CommandInput placeholder="Action..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading={role?.role.name}>
            <CommandItem onSelect={handleAction} disabled={isPending}>
              <Trash className="mr-2 h-4 w-4" />
              Remove
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              user role
              {role && ` "${role.role.name}"`} for {user.firstName}{" "}
              {user.lastName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>
              {isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
