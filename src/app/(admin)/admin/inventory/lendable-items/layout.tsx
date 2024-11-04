import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import CreateInventoryDialog from "./_components/create-inventory-dialog";
import AdminCommandSearchDialog from "@/components/dialogs/admin-command-search-dialog";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminCommandSearchDialog>
      <ThemeDialog />
      <SettingsDialog />
      <CreateInventoryDialog />
      {children}
    </AdminCommandSearchDialog>
  );
}
