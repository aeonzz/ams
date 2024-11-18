import React from "react";
import SettingsLayout from "../_components/settings-layout";
import ProfileScreen from "./_components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings > Account",
};

export default function ProfilePage() {
  return (
    <SettingsLayout title="Settings">
      <ProfileScreen />
    </SettingsLayout>
  );
}
