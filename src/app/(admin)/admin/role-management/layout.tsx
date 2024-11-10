import ThemeDialog from "@/components/dialogs/theme-dialog";
import AdminSettingsDialog from "@/components/dialogs/settings-dialog";
import CreateRoleDialog from "./_components/create-role-dialog";
import CreateUserRoleDialog from "./_components/create-user-role-dialog";
import AdminCommandSearchDialog from "@/components/dialogs/admin-command-search-dialog";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminCommandSearchDialog>
      <ThemeDialog />
      <AdminSettingsDialog />
      <CreateRoleDialog />
      <CreateUserRoleDialog />
      {children}
    </AdminCommandSearchDialog>
  );
}
