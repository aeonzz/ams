import React from "react";
import ProfileScreen from "@/app/(app)/settings/account/_components";
import SettingsLayout from "@/app/(app)/settings/_components/settings-layout";


export default function ProfilePage() {
  return (
    <SettingsLayout title="Settings">
      <ProfileScreen />
    </SettingsLayout>
  );
}
