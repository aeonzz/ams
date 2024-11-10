import React from "react";

import PasswordScreen from "@/app/(app)/settings/password/_components";
import SettingsLayout from "@/app/(app)/settings/_components/settings-layout";

export default function PasswordPage() {
  return (
    <SettingsLayout title="Settings">
      <PasswordScreen />
    </SettingsLayout>
  );
}
