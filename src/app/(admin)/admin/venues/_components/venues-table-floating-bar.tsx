import * as React from "react";
import {
  ArrowUpIcon,
  CheckCircledIcon,
  Cross2Icon,
  DownloadIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { SelectTrigger } from "@radix-ui/react-select";
import { type Table } from "@tanstack/react-table";
import { toast } from "sonner";

import { exportTableToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Venue } from "prisma/generated/zod";
import RoleTypeSchema, {
  RoleTypeType,
} from "prisma/generated/zod/inputTypeSchemas/RoleTypeSchema";
import CommandTooltip from "@/components/ui/command-tooltip";
import { CommandShortcut } from "@/components/ui/command";
import { P } from "@/components/typography/text";
import { User2 } from "lucide-react";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { deleteUsers, updateUsers } from "@/lib/actions/users";
import { usePathname } from "next/navigation";
import LoadingSpinner from "@/components/loaders/loading-spinner";
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

interface VenuesTableFloatingBarProps {
  table: Table<Venue>;
}

export function VenuesTableFloatingBar({ table }: VenuesTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const pathname = usePathname();

  const [isLoading, startTransition] = React.useTransition();
  const [method, setMethod] = React.useState<
    "update-role" | "export" | "delete"
  >();

  const { isPending, mutateAsync } = useServerActionMutation(updateUsers);
  const { isPending: isPendingDeletion, mutateAsync: deleteUsersMutateAsync } =
    useServerActionMutation(deleteUsers);

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-4">
      <div className="w-full overflow-x-auto">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-secondary p-2 shadow-2xl">
          <div className="flex h-10 items-center rounded-md border border-dashed bg-tertiary pl-2.5 pr-1">
            <P className="whitespace-nowrap">{rows.length} selected</P>
            <Separator orientation="vertical" className="ml-2 mr-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5 hover:border"
                  onClick={() => table.toggleAllRowsSelected(false)}
                >
                  <Cross2Icon
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
                <CommandTooltip text="Clear selection">
                  <CommandShortcut>Esc</CommandShortcut>
                </CommandTooltip>
              </TooltipContent>
            </Tooltip>
          </div>
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <div className="flex items-center gap-1.5">
            <Select
              onValueChange={(value: RoleTypeType) => {
                setMethod("update-role");
                toast.promise(
                  mutateAsync({
                    ids: rows.map((row) => row.original.id),
                    role: value as RoleTypeType,
                    path: pathname,
                  }),
                  {
                    loading: "Saving...",
                    success: () => {
                      return "Role updated successfully";
                    },
                    error: (err) => {
                      console.log(err);
                      return err.message;
                    },
                  }
                );
              }}
            >
              <Tooltip delayDuration={250}>
                <SelectTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-10 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                      disabled={isPending || isPendingDeletion}
                    >
                      {isPending ||
                      (isPendingDeletion && method === "update-role") ? (
                        <LoadingSpinner />
                      ) : (
                        <User2 className="size-5" aria-hidden="true" />
                      )}
                    </Button>
                  </TooltipTrigger>
                </SelectTrigger>
                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                  <P>Update role</P>
                </TooltipContent>
              </Tooltip>
              <SelectContent align="center">
                <SelectGroup>
                  {RoleTypeSchema.options.map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Tooltip delayDuration={250}>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-10 border"
                  onClick={() => {
                    setMethod("export");
                    startTransition(() => {
                      exportTableToCSV(table, {
                        excludeColumns: ["select", "actions"],
                        onlySelected: true,
                      });
                    });
                  }}
                  disabled={isPending || isLoading || isPendingDeletion}
                >
                  {isLoading && method === "export" ? (
                    <LoadingSpinner />
                  ) : (
                    <DownloadIcon className="size-5" aria-hidden="true" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                <P>Export users</P>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={250}>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-10 border"
                      disabled={isPending || isPendingDeletion}
                    >
                      {isPending ||
                      (isPendingDeletion && method === "delete") ? (
                        <LoadingSpinner />
                      ) : (
                        <TrashIcon className="size-5" aria-hidden="true" />
                      )}
                    </Button>
                  </TooltipTrigger>
                </AlertDialogTrigger>
                <AlertDialogContent bgOpacity="bg-black/50">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the selected user/s and all related records from our
                      servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setMethod("delete");
                        toast.promise(
                          deleteUsersMutateAsync({
                            ids: rows.map((row) => row.original.id),
                            path: pathname,
                          }),
                          {
                            loading: "Deleting...",
                            success: () => {
                              table.toggleAllRowsSelected(false);
                              return "user/s deleted successfully";
                            },
                            error: (err) => {
                              console.log(err);
                              return err.message;
                            },
                          }
                        );
                      }}
                      className="bg-destructive hover:bg-destructive/90"
                      disabled={isPending || isPendingDeletion}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                <P>Delete users</P>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
