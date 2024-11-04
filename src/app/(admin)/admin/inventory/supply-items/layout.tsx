import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import CreateSupplyItemDialog from "./_components/create-supply-item-dialog";
import SupplyCategoriesDialog from "./_components/supply-categories-dialog";
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
      <SupplyCategoriesDialog />
      <CreateSupplyItemDialog />
      {children}
    </AdminCommandSearchDialog>
  );
}
