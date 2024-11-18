import React from "react";

import SettingsLayout from "../_components/settings-layout";
import PasswordScreen from "./_components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings > Password",
};


export default function PasswordPage() {
  return (
    <SettingsLayout title="Settings">
      <PasswordScreen />
    </SettingsLayout>
  );
}
