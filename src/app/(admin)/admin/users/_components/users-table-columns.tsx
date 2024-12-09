"use client";

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { P } from "@/components/typography/text";
import { UpdateUserSheet } from "./update-user-sheet";
import { DeleteUsersDialog } from "./delete-users-dialog";
import { type UserType } from "@/lib/types/user";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CircleMinus,
  CirclePlus,
  RotateCw,
  X,
} from "lucide-react";
import CreateUserRole from "./create-user-role";
import { format, formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import placeholder from "public/placeholder.svg";
import AddUserDepartments from "./add-user-departments";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { removeUserDepartment } from "@/lib/actions/users";
import { RemoveUserDepartmentSchema } from "./schema";
import { usePathname } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import DataTableExpand from "@/components/data-table/data-table-expand";
import { PhotoProvider, PhotoView } from "react-photo-view";
import LoadingSpinner from "@/components/loaders/loading-spinner";

export function getUsersColumns(): ColumnDef<UserType>[] {
  const columns: ColumnDef<UserType>[] = [
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
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
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
            <PhotoProvider
              speed={() => 300}
              maskOpacity={0.8}
              loadingElement={<LoadingSpinner />}
              toolbarRender={({ onScale, scale, rotate, onRotate }) => {
                return (
                  <>
                    <div className="flex gap-3">
                      <CirclePlus
                        className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                        onClick={() => onScale(scale + 1)}
                      />
                      <CircleMinus
                        className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                        onClick={() => onScale(scale - 1)}
                      />
                      <RotateCw
                        className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                        onClick={() => onRotate(rotate + 90)}
                      />
                    </div>
                  </>
                );
              }}
            >
              <div>
                <PhotoView src={row.original.profileUrl ?? placeholder}>
                  <div className="relative aspect-square h-10 cursor-pointer transition-colors hover:brightness-75">
                    <Image
                      src={row.original.profileUrl ?? placeholder}
                      alt={`Image of ${row.original.firstName}`}
                      fill
                      className="rounded-md border object-cover"
                    />
                  </div>
                </PhotoView>
              </div>
            </PhotoProvider>
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
          <div className="flex space-x-2">
            <P className="truncate font-medium">{row.getValue("email")}</P>
          </div>
        );
      },
    },
    {
      accessorKey: "userDepartments",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Departments" />
      ),
      cell: function Cell({ row }) {
        const pathname = usePathname();
        const [hoveredDepartment, setHoveredDepartment] = React.useState<
          string | null
        >(null);
        const [isAlertOpen, setIsAlertOpen] = React.useState(false);
        const [departmentToRemove, setDepartmentToRemove] = React.useState<{
          id: string;
          name: string;
        } | null>(null);
        const { mutateAsync, isPending } =
          useServerActionMutation(removeUserDepartment);

        const handleRemoveDepartment = (department: {
          id: string;
          name: string;
        }) => {
          setDepartmentToRemove(department);
          setIsAlertOpen(true);
        };

        const confirmRemoveDepartment = () => {
          if (departmentToRemove) {
            const data: RemoveUserDepartmentSchema = {
              id: departmentToRemove.id,
              path: pathname,
            };
            toast.promise(mutateAsync(data), {
              loading: "Removing...",
              success: () => {
                setIsAlertOpen(false);
                return "User department removed successfuly";
              },
              error: (err) => {
                return err.message;
              },
            });
          }
          setIsAlertOpen(false);
        };

        return (
          <>
            <div className="flex max-w-[30vw] flex-wrap gap-2">
              {row.original.userDepartments.length > 0 ? (
                <>
                  {row.original.userDepartments.map((userDepartment) => (
                    <Badge
                      key={userDepartment.department.id}
                      variant="outline"
                      className="relative"
                      onMouseEnter={() =>
                        setHoveredDepartment(userDepartment.department.id)
                      }
                      onMouseLeave={() => setHoveredDepartment(null)}
                    >
                      {userDepartment.department.name}
                      {hoveredDepartment === userDepartment.department.id && (
                        <Button
                          variant="ghost"
                          disabled={isPending}
                          size="sm"
                          className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveDepartment({
                              id: userDepartment.id,
                              name: userDepartment.department.name,
                            });
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will remove the user from the department{" "}
                    {departmentToRemove?.name}. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmRemoveDepartment}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
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
    {
      id: "userRole",
      header: () => <P>User Roles</P>,
      cell: ({ row }) => <DataTableExpand<UserType> row={row} />,
      size: 0,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date Created" />
      ),
      cell: ({ cell }) => {
        return (
          <P className="text-muted-foreground">
            {format(cell.getValue() as Date, "PP")}
          </P>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Modified" />
      ),
      cell: ({ cell }) => {
        return (
          <P className="text-muted-foreground">
            {format(cell.getValue() as Date, "PP")}
          </P>
        );
      },
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
          React.useState(false);
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false);

        return (
          <div className="grid place-items-center">
            <UpdateUserSheet
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              user={row.original}
            />
            <DeleteUsersDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              users={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
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
                <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
                  Edit
                </DropdownMenuItem>
                <AddUserDepartments userId={row.original.id} />
                <CreateUserRole userId={row.original.id} />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteTaskDialog(true)}
                  className="focus:bg-destructive focus:text-destructive-foreground"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 40,
    },
  ];

  // if (!isDepartmentScreen) {
  //   columns.splice(3, 0, {
  //     accessorKey: "userDepartments",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Departments" />
  //     ),
  //     cell: ({ row }) => {
  //       const pathname = usePathname();
  //       const [hoveredDepartment, setHoveredDepartment] = React.useState<
  //         string | null
  //       >(null);
  //       const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  //       const [departmentToRemove, setDepartmentToRemove] = React.useState<{
  //         id: string;
  //         name: string;
  //       } | null>(null);
  //       const { mutateAsync, isPending } =
  //         useServerActionMutation(removeUserDepartment);

  //       const handleRemoveDepartment = (department: {
  //         id: string;
  //         name: string;
  //       }) => {
  //         setDepartmentToRemove(department);
  //         setIsAlertOpen(true);
  //       };

  //       const confirmRemoveDepartment = () => {
  //         if (departmentToRemove) {
  //           const data: RemoveUserDepartmentSchema = {
  //             id: departmentToRemove.id,
  //             path: pathname,
  //           };
  //           toast.promise(mutateAsync(data), {
  //             loading: "Removing...",
  //             success: () => {
  //               setIsAlertOpen(false);
  //               return "User department removed successfuly";
  //             },
  //             error: (err) => {
  //               return err.message;
  //             },
  //           });
  //         }
  //         setIsAlertOpen(false);
  //       };

  //       return (
  //         <>
  //           <div className="flex max-w-[15vw] flex-wrap gap-2">
  //             {row.original.userDepartments.map((userDepartment) => (
  //               <Badge
  //                 key={userDepartment.department.id}
  //                 variant="outline"
  //                 className="relative"
  //                 onMouseEnter={() =>
  //                   setHoveredDepartment(userDepartment.department.id)
  //                 }
  //                 onMouseLeave={() => setHoveredDepartment(null)}
  //               >
  //                 {userDepartment.department.name}
  //                 {hoveredDepartment === userDepartment.department.id && (
  //                   <Button
  //                     variant="ghost"
  //                     size="sm"
  //                     className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0"
  //                     onClick={(e) => {
  //                       e.stopPropagation();
  //                       handleRemoveDepartment({
  //                         id: userDepartment.id,
  //                         name: userDepartment.department.name,
  //                       });
  //                     }}
  //                   >
  //                     <X className="h-3 w-3" />
  //                   </Button>
  //                 )}
  //               </Badge>
  //             ))}
  //           </div>
  //           <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
  //             <AlertDialogContent>
  //               <AlertDialogHeader>
  //                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
  //                 <AlertDialogDescription>
  //                   This action will remove the user from the department{" "}
  //                   {departmentToRemove?.name}. This action cannot be undone.
  //                 </AlertDialogDescription>
  //               </AlertDialogHeader>
  //               <AlertDialogFooter>
  //                 <AlertDialogCancel>Cancel</AlertDialogCancel>
  //                 <AlertDialogAction onClick={confirmRemoveDepartment}>
  //                   Continue
  //                 </AlertDialogAction>
  //               </AlertDialogFooter>
  //             </AlertDialogContent>
  //           </AlertDialog>
  //         </>
  //       );
  //     },
  //   });
  // }

  return columns;
}
