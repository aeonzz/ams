"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { P } from "@/components/typography/text";
import type { UserType } from "@/lib/types/user";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import placeholder from "public/placeholder.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import {
  SquareUser,
  Trash,
  User,
  User2Icon,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import { UserRolesDialog } from "./user-roles-dialog";
import { RolesDialog } from "./roles-dialog";
import { useQuery } from "@tanstack/react-query";
import { Role } from "prisma/generated/zod";
import axios from "axios";
import { format } from "date-fns";

export function getDepartmentUsersColumns({
  departmentId,
}: {
  departmentId: string;
}): ColumnDef<UserType>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="px-3">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-3">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 20,
    },
    {
      accessorKey: "profileUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Avatar" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative size-7 cursor-pointer rounded-full transition-colors hover:brightness-75">
                  <Image
                    src={row.original.profileUrl ?? placeholder}
                    alt={`Image of ${row.original.firstName}`}
                    fill
                    className="rounded-full border object-cover"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="aspect-square w-[80vw]">
                <Image
                  src={row.original.profileUrl ?? placeholder}
                  alt={`Image of ${row.original.firstName}`}
                  fill
                  className="rounded-md border object-cover"
                />
              </DialogContent>
            </Dialog>
          </div>
        );
      },
      enableSorting: false,
      size: 0,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-1">
            <P className="truncate font-medium">{row.getValue("email")}</P>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {row.original.userRole.find(
                    (role) => role.role.name === "DEPARTMENT_HEAD"
                  ) && (
                    <SquareUser className="size-5 cursor-pointer text-yellow-500" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <P>Department Head</P>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.firstName}</P>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "middleName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Middle Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.middleName}</P>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.lastName}</P>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    // {
    //   accessorKey: "joined",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Date Joined" />
    //   ),
    //   cell: ({ cell }) => {
    //     return (
    //       <P className="text-muted-foreground">
    //         {format(cell.getValue() as Date, "PP")}
    //       </P>
    //     );
    //   },
    //   size: 0,
    // },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [openUserRoles, setOpenUserRoles] = React.useState(false);
        const [openRoles, setOpenRoles] = React.useState(false);

        const { data, isLoading } = useQuery<Role[]>({
          queryFn: async () => {
            const res = await axios.get("/api/role/get-roles");
            return res.data.data;
          },
          queryKey: ["get-roles-department-users-column"],
        });

        return (
          <div className="grid place-items-center">
            <UserRolesDialog
              user={row.original}
              open={openUserRoles}
              setOpen={setOpenUserRoles}
            />
            <RolesDialog
              userIds={[row.original.id]}
              open={openRoles}
              setOpen={setOpenRoles}
              departmentId={departmentId}
              data={data}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={() => setOpenUserRoles(!openUserRoles)}
                >
                  <UserRound className="mr-2 size-4" />
                  User roles
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setOpenRoles(!openRoles)}
                  disabled={isLoading}
                >
                  <UserRoundPlus className="mr-2 size-4" />
                  Add role
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 40,
    },
  ];
}
