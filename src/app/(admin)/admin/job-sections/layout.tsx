import AdminCommandSearchDialog from "../_components/admin-command-search-dialog";
import ThemeDialog from "@/components/dialogs/theme-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import CreateJobSectionDialog from "./_components/create-job-section-dailog";
import AssignUserDialog from "./_components/assign-user-dialog";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminCommandSearchDialog>
      <ThemeDialog />
      <SettingsDialog />
      <CreateJobSectionDialog />
      <AssignUserDialog />
      {children}
    </AdminCommandSearchDialog>
  );
}
