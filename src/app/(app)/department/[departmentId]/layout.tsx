import React from "react";

import { currentUser } from "@/lib/actions/users";
import { redirect } from "next/navigation";
import { PageGuard } from "@/components/page-guard";

export interface Props {
  params: {
    departmentId: string;
  };
  children: React.ReactNode;
}

export default async function PageLayout({ children, params }: Props) {
  const [data] = await currentUser();

  if (!data) {
    redirect("/sign-in");
  }

  return (
    <>
      <PageGuard
        allowedRoles={["DEPARTMENT_HEAD", "REQUEST_MANAGER"]}
        allowedDepartment={params.departmentId}
        //@ts-ignore
        currentUser={data}
      >
        {children}
      </PageGuard>
    </>
  );
}
