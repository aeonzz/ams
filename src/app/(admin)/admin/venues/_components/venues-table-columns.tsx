"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { formatDate, getPriorityIcon } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

import { P } from "@/components/typography/text";
import { type Venue } from "prisma/generated/zod";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export function getVenuesColumns(): ColumnDef<Venue>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.original.name}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.location}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Capacity" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.capacity}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="status" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <P>{row.original.status}</P>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    // {
    //   id: "actions",
    //   cell: function Cell({ row }) {
    //     const pathname = usePathname();
    //     const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
    //       React.useState(false);
    //     const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
    //       React.useState(false);

    //     const { isPending, mutateAsync } = useServerActionMutation(updateUser);

    //     return (
    //       <div className="grid place-items-center">
    //         <UpdateUserSheet
    //           open={showUpdateTaskSheet}
    //           onOpenChange={setShowUpdateTaskSheet}
    //           user={row.original}
    //         />
    //         <DeleteUsersDialog
    //           open={showDeleteTaskDialog}
    //           onOpenChange={setShowDeleteTaskDialog}
    //           users={[row.original]}
    //           showTrigger={false}
    //           onSuccess={() => row.toggleSelected(false)}
    //         />
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <Button
    //               aria-label="Open menu"
    //               variant="ghost"
    //               className="flex size-8 p-0 data-[state=open]:bg-muted"
    //             >
    //               <DotsHorizontalIcon className="size-4" aria-hidden="true" />
    //             </Button>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent align="end" className="w-40">
    //             <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
    //               Edit
    //             </DropdownMenuItem>
    //             <DropdownMenuSub>
    //               <DropdownMenuSubTrigger>Roles</DropdownMenuSubTrigger>
    //               <DropdownMenuSubContent>
    //                 <DropdownMenuRadioGroup
    //                   value={row.original.role}
    //                   onValueChange={(value) => {
    //                     toast.promise(
    //                       mutateAsync({
    //                         id: row.original.id,
    //                         role: value as RoleTypeType,
    //                         path: pathname,
    //                       }),
    //                       {
    //                         loading: "Saving...",
    //                         success: () => {
    //                           return "Role updated successfully";
    //                         },
    //                         error: (err) => {
    //                           console.log(err);
    //                           return err.message;
    //                         },
    //                       }
    //                     );
    //                   }}
    //                 >
    //                   {RoleTypeSchema.options.map((role) => (
    //                     <DropdownMenuRadioItem
    //                       key={role}
    //                       value={role}
    //                       className="capitalize"
    //                       disabled={isPending}
    //                     >
    //                       {role}
    //                     </DropdownMenuRadioItem>
    //                   ))}
    //                 </DropdownMenuRadioGroup>
    //               </DropdownMenuSubContent>
    //             </DropdownMenuSub>
    //             <DropdownMenuSeparator />
    //             <DropdownMenuItem
    //               onSelect={() => setShowDeleteTaskDialog(true)}
    //               className="focus:bg-destructive focus:text-destructive-foreground"
    //             >
    //               Delete
    //             </DropdownMenuItem>
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </div>
    //     );
    //   },
    //   size: 40,
    // },
  ];
}
