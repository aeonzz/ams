import React from "react";

import PreferencesScreen from "@/components/screens/settings/preferences";
import SettingsLayout from "@/components/layouts/settings-layout";

export default function PreferencesPage() {
  return (
    <SettingsLayout title="Settings">
      <PreferencesScreen />
    </SettingsLayout>
  );
}
