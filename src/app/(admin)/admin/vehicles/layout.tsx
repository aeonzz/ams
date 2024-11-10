import ThemeDialog from "@/components/dialogs/theme-dialog";
import AdminSettingsDialog from "@/components/dialogs/settings-dialog";
import CreateVehicleDialog from "./_components/create-vehicle-dialog";
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
      <CreateVehicleDialog />
      {children}
    </AdminCommandSearchDialog>
  );
}
