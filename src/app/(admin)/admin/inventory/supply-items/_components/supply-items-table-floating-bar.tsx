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

import { exportTableToCSV, exportTableToXLSX } from "@/lib/export";
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
import CommandTooltip from "@/components/ui/command-tooltip";
import { CommandShortcut } from "@/components/ui/command";
import { P } from "@/components/typography/text";
import { Activity, Dot } from "lucide-react";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
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
import {
  getReturnableItemStatusIcon,
  getSupplyStatusColor,
  textTransform,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type SupplyItemType } from "@/lib/types/item";
import {
  deleteSupplyItems,
  updateSupplyItemStatuses,
} from "@/lib/actions/supply";
import {
  SupplyItemStatusSchema,
  type SupplyItemStatusType,
} from "prisma/generated/zod/inputTypeSchemas/SupplyItemStatusSchema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SupplyitemsTableFloatingBarProps {
  table: Table<SupplyItemType>;
  fileName: string;
}

export function SupplyitemsTableFloatingBar({
  table,
  fileName,
}: SupplyitemsTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const pathname = usePathname();

  const [isLoading, startTransition] = React.useTransition();
  const [method, setMethod] = React.useState<
    "update-status" | "export" | "delete"
  >();

  const { isPending, mutateAsync } = useServerActionMutation(
    updateSupplyItemStatuses
  );
  const {
    isPending: isPendingDeletion,
    mutateAsync: deleteInventoryMutateAsync,
  } = useServerActionMutation(deleteSupplyItems);

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
              onValueChange={(value: SupplyItemStatusType) => {
                setMethod("update-status");
                toast.promise(
                  mutateAsync({
                    ids: rows.map((row) => row.original.id),
                    status: value as SupplyItemStatusType,
                    path: pathname,
                  }),
                  {
                    loading: "Updating...",
                    success: () => {
                      return "Status/es updated successfully";
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
                      (isPendingDeletion && method === "update-status") ? (
                        <LoadingSpinner />
                      ) : (
                        <Activity className="size-5" aria-hidden="true" />
                      )}
                    </Button>
                  </TooltipTrigger>
                </SelectTrigger>
                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                  <P>Update status</P>
                </TooltipContent>
              </Tooltip>
              <SelectContent align="center">
                <SelectGroup>
                  {SupplyItemStatusSchema.options.map((option) => {
                    const status = getSupplyStatusColor(option);
                    return (
                      <SelectItem
                        key={option}
                        value={option}
                        className="capitalize"
                      >
                        <Badge variant={status.variant} className="pr-3.5">
                          <Dot
                            className="mr-1 size-3"
                            strokeWidth={status.stroke}
                            color={status.color}
                          />
                          {textTransform(option)}
                        </Badge>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Tooltip delayDuration={250}>
              <DropdownMenu>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-10 border"
                      disabled={isLoading}
                    >
                      {isLoading && method === "export" ? (
                        <LoadingSpinner />
                      ) : (
                        <DownloadIcon className="size-5" aria-hidden="true" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem
                    onClick={() => {
                      setMethod("export");
                      startTransition(() => {
                        exportTableToCSV(table, {
                          filename: fileName,
                          excludeColumns: ["select", "actions"],
                          onlySelected: true,
                        });
                      });
                    }}
                  >
                    Export to CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setMethod("export");
                      startTransition(() => {
                        exportTableToXLSX(table, {
                          filename: fileName,
                          excludeColumns: ["select", "actions"],
                          onlySelected: true,
                        });
                      });
                    }}
                  >
                    Export to Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                <P>Export {fileName}</P>
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
                      the selected equipment/s and all related records from our
                      servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setMethod("delete");
                        toast.promise(
                          deleteInventoryMutateAsync({
                            ids: rows.map((row) => row.original.id),
                            path: pathname,
                          }),
                          {
                            loading: "Deleting...",
                            success: () => {
                              table.toggleAllRowsSelected(false);
                              return "equipment/s deleted successfully";
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
                <P>Delete inventory</P>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
