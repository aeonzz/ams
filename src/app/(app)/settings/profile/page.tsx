import React from "react";

import SettingsLayout from "@/components/layouts/settings-layout";
import ProfileScreen from "@/components/screens/settings/profile";

export default function ProfilePage() {
  return (
    <SettingsLayout title="Settings">
      <ProfileScreen />
    </SettingsLayout>
  );
}
