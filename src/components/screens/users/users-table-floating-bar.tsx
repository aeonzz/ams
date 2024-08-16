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
import { User } from "prisma/generated/zod";
import RoleTypeSchema, {
  RoleTypeType,
} from "prisma/generated/zod/inputTypeSchemas/RoleTypeSchema";
import CommandTooltip from "@/components/ui/command-tooltip";
import { CommandShortcut } from "@/components/ui/command";
import { P } from "@/components/typography/text";
import { User2 } from "lucide-react";
// import { Kbd } from "@/components/kbd"

// import { deleteTasks, updateTasks } from "../_lib/actions"

interface UsersTableFloatingBarProps {
  table: Table<User>;
}

export function UsersTableFloatingBar({ table }: UsersTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const [isPending, startTransition] = React.useTransition();
  const [method, setMethod] = React.useState<
    "update-role" | "export" | "delete"
  >();

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
          <div className="flex h-10 items-center rounded-md border border-dashed pl-2.5 pr-1 bg-tertiary">
            <P className="whitespace-nowrap">
              {rows.length} selected
            </P>
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

                // startTransition(async () => {
                //   const { error } = await updateTasks({
                //     ids: rows.map((row) => row.original.id),
                //     status: value,
                //   })

                //   if (error) {
                //     toast.error(error)
                //     return
                //   }

                //   toast.success("Tasks updated")
                // })
              }}
            >
              <Tooltip delayDuration={250}>
                <SelectTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-10 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                      disabled={isPending}
                    >
                      {isPending && method === "update-role" ? (
                        <ReloadIcon
                          className="size-5 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <User2
                          className="size-5"
                          aria-hidden="true"
                        />
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
            {/* <Select
              onValueChange={(value: PriorityTypeType) => {
                setMethod("update-priority")

                // startTransition(async () => {
                //   const { error } = await updateTasks({
                //     ids: rows.map((row) => row.original.id),
                //     priority: value,
                //   })

                //   if (error) {
                //     toast.error(error)
                //     return
                //   }

                //   toast.success("Tasks updated")
                // })
              }}
            >
              <Tooltip delayDuration={250}>
                <SelectTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                      disabled={isPending}
                    >
                      {isPending && method === "update-priority" ? (
                        <ReloadIcon
                          className="size-3.5 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowUpIcon className="size-3.5" aria-hidden="true" />
                      )}
                    </Button>
                  </TooltipTrigger>
                </SelectTrigger>
                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                  <p>Update priority</p>
                </TooltipContent>
              </Tooltip>
              <SelectContent align="center">
                <SelectGroup>
                  {PriorityTypeSchema.options.map((priority) => (
                    <SelectItem
                      key={priority}
                      value={priority}
                      className="capitalize"
                    >
                      {priority}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select> */}
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
                  disabled={isPending}
                >
                  {isPending && method === "export" ? (
                    <ReloadIcon
                      className="size-5 animate-spin"
                      aria-hidden="true"
                    />
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
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-10 border"
                  onClick={() => {
                    setMethod("delete");

                    // startTransition(async () => {
                    //   const { error } = await deleteTasks({
                    //     ids: rows.map((row) => row.original.id),
                    //   })

                    //   if (error) {
                    //     toast.error(error)
                    //     return
                    //   }

                    //   table.toggleAllRowsSelected(false)
                    // })
                  }}
                  disabled={isPending}
                >
                  {isPending && method === "delete" ? (
                    <ReloadIcon
                      className="size-5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <TrashIcon className="size-5" aria-hidden="true" />
                  )}
                </Button>
              </TooltipTrigger>
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
