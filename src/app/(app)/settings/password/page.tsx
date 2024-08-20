import React from "react";

import SettingsLayout from "../_components/settings-layout";
import PasswordScreen from "./_components";

export default function PasswordPage() {
  return (
    <SettingsLayout title="Settings">
      <PasswordScreen />
    </SettingsLayout>
  );
}
