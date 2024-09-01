import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import AdminCommandSearchDialog from "../_components/admin-command-search-dialog";
import CreateInventorySubItemDialog from "./_components/create-inventory-sub-item-dialog";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminCommandSearchDialog>
      <ThemeDialog />
      <SettingsDialog />
      <CreateInventorySubItemDialog />
      {children}
    </AdminCommandSearchDialog>
  );
}
