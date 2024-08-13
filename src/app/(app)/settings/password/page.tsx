import React from "react";

import SettingsLayout from "@/components/layouts/settings-layout";
import PasswordScreen from "@/components/screens/settings/password";

export default function PasswordPage() {
  return (
    <SettingsLayout title="Settings">
      <PasswordScreen />
    </SettingsLayout>
  );
}
