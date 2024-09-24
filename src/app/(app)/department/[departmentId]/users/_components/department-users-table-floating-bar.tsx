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
import CommandTooltip from "@/components/ui/command-tooltip";
import { CommandShortcut } from "@/components/ui/command";
import { P } from "@/components/typography/text";
import { User2 } from "lucide-react";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { deleteUsers } from "@/lib/actions/users";
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
import { Badge } from "@/components/ui/badge";
import { type UserType } from "@/lib/types/user";
import { createUserRole } from "@/lib/actions/userRole";
import { RolesDialog } from "./roles-dialog";
import { useQuery } from "@tanstack/react-query";
import { Role } from "prisma/generated/zod";
import axios from "axios";

interface DepartmentUsersTableFloatingBarProps {
  table: Table<UserType>;
  departmentId: string;
}

export function DepartmentUsersTableFloatingBar({
  table,
  departmentId,
}: DepartmentUsersTableFloatingBarProps) {
  const pathname = usePathname();
  const [openRoles, setOpenRoles] = React.useState(false);
  const [method, setMethod] = React.useState<"add-role">();
  const rows = table.getFilteredSelectedRowModel().rows;

  const { data, isLoading } = useQuery<Role[]>({
    queryFn: async () => {
      const res = await axios.get("/api/role/get-roles");
      return res.data.data;
    },
    queryKey: ["get-roles-department-users-table-floating-bar"],
  });

  const { isPending, mutateAsync } = useServerActionMutation(createUserRole);

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
            <RolesDialog
              userIds={rows.map((row) => row.original.id)}
              open={openRoles}
              setOpen={setOpenRoles}
              departmentId={departmentId}
              data={data}
            />
            <Tooltip delayDuration={250}>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-10 border"
                  onClick={() => setOpenRoles(!openRoles)}
                  disabled={isPending || isLoading}
                >
                  {isPending && method === "add-role" ? (
                    <LoadingSpinner />
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
