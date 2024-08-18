import React from "react";

import CommandSearchDialog from "../dialogs/command-search-dialog";
import CreateRequest from "@/app/(app)/dashboard/_components/create-request";

export default function CommandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CreateRequest />
      <CommandSearchDialog />
      {children}
    </>
  );
}
