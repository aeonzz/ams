import React from 'react';
import CreateRequest from '../screens/dashboard/create-request';
import CommandSearchDialog from '../dialogs/command-search-dialog';

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
