import React from "react";
import { GetUsersSchema } from "@/lib/schema";
import { getDepartmentUsers } from "@/lib/actions/department";

interface DepartmentUsersProps {
  params: GetUsersSchema;
  departmentId: string
}

export default function DepartmentUsers({ params, departmentId }: DepartmentUsersProps) {
  const usersPromise = getDepartmentUsers({ ...params, departmentId });
  return <div>DepartmentUsers</div>;
}
