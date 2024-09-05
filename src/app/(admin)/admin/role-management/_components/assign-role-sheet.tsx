"use client";

import * as React from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Department, User } from "prisma/generated/zod";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface AssignRoleSheetProps {
  roleId: string;
  roleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
}

export default function AssignRoleSheet({
  roleId,
  roleName,
  open,
  onOpenChange,
  isPending,
}: AssignRoleSheetProps) {
  const [selectedDepartment, setSelectedDepartment] = React.useState<
    string | null
  >(null);
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);

  const {
    data: departmentsData,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useQuery<Department[]>({
    queryFn: async () => {
      const res = await axios.get("/api/department");
      return res.data.data;
    },
    queryKey: ["get-departments-for-role-assignment"],
  });

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useQuery<User[]>({
    queryFn: async () => {
      const res = await axios.get("/api/user/get-users");
      return res.data.data;
    },
    queryKey: ["get-users-for-role-assignment"],
  });

  const departments = departmentsData || [];
  const users = usersData || [];

  const filteredUsers = React.useMemo(() => {
    if (!users.length) return [];
    return selectedDepartment && selectedDepartment !== "all"
      ? users.filter((user) => user.department === selectedDepartment)
      : users;
  }, [users, selectedDepartment]);

  const selectedUsersList = React.useMemo(() => {
    return users.filter((user) => selectedUsers.includes(user.id));
  }, [users, selectedUsers]);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = async () => {
    try {
      await axios.post(`/api/role/${roleId}/assign-users`, {
        userIds: selectedUsers,
      });
      console.log(`Assigned role ${roleId} to users:`, selectedUsers);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to assign role:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (isDepartmentsError || isUsersError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const isLoading = isDepartmentsLoading || isUsersLoading;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          if (isPending) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle>Assign Role: {roleName}</SheetTitle>
          <SheetDescription>
            Select users to assign the role. You can filter by department.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="flex h-screen flex-col justify-between">
            <div className="scroll-bar relative max-h-[75vh] space-y-2 overflow-y-auto px-4 pb-1">
              <div className="py-1">
                <Select onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="bg-secondary">
                    <CardHeader className="flex-row items-center gap-3 space-y-0 p-3">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserToggle(user.id)}
                      />
                      <div className="flex gap-2">
                        <Avatar>
                          <AvatarImage
                            src={user.profileUrl || undefined}
                            alt={user.username}
                          />
                          <AvatarFallback>
                            {user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.username}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.department}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <Separator className="my-2" />
              <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px]">
                      Selected Users ({selectedUsers.length})
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-3">
                    <div className="scroll-bar h-[200px] w-full overflow-y-auto">
                      {selectedUsersList.map((user) => (
                        <Card key={user.id} className="bg-secondary">
                          <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 p-3">
                            <div className="flex gap-2">
                              <Avatar>
                                <AvatarImage
                                  src={user.profileUrl || undefined}
                                  alt={user.username}
                                />
                                <AvatarFallback>
                                  {user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                  {user.username}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {user.department}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserToggle(user.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  disabled={isPending}
                  onClick={handleAssign}
                  className="w-20"
                >
                  Assign
                </Button>
              </SheetFooter>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
