import React from "react";

import PreferencesScreen from "@/app/(app)/settings/preferences/_components";
import SettingsLayout from "@/app/(app)/settings/_components/settings-layout";

export default function PreferencesPage() {
  return (
    <SettingsLayout title="Settings">
      <PreferencesScreen />
    </SettingsLayout>
  );
}
