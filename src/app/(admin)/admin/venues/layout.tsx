import AdminCommandSearchDialog from "../_components/admin-command-search-dialog";
import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import CreateVenueDialog from "./_components/create-venue-dialog";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminCommandSearchDialog>
      <ThemeDialog />
      <SettingsDialog />
      <CreateVenueDialog />
      {children}
    </AdminCommandSearchDialog>
  );
}
