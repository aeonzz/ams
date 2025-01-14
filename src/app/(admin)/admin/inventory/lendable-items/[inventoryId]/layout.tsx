import ThemeDialog from "@/components/dialogs/theme-dialog";
import AdminSettingsDialog from "@/components/dialogs/settings-dialog";
import CreateInventorySubItemDialog from "./_components/create-inventory-sub-item-dialog";
import AdminCommandSearchDialog from "@/components/dialogs/admin-command-search-dialog";

interface Props {
  params: {
    inventoryId: string;
  };
  children: React.ReactNode;
}

export default async function CommandLayout({ params, children }: Props) {
  return (
    <AdminCommandSearchDialog>
      <ThemeDialog />
      <AdminSettingsDialog />
      <CreateInventorySubItemDialog inventoryId={params.inventoryId} />
      {children}
    </AdminCommandSearchDialog>
  );
}
