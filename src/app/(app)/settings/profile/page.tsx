import React from "react";
import SettingsLayout from "../_components/settings-layout";
import ProfileScreen from "./_components";


export default function ProfilePage() {
  return (
    <SettingsLayout title="Settings">
      <ProfileScreen />
    </SettingsLayout>
  );
}
