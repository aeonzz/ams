import AdminCommandSearchDialog from "../_components/admin-command-search-dialog";
import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import CreateRoleDialog from "./_components/create-role-dialog";
import CreateUserRoleDialog from "./_components/create-user-role-dialog";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminCommandSearchDialog>
      <ThemeDialog />
      <SettingsDialog />
      <CreateRoleDialog />
      <CreateUserRoleDialog />
      {children}
    </AdminCommandSearchDialog>
  );
}
