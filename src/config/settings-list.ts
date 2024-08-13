import { Group } from "@/lib/types/menu";

export function getSettingsList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/settings/profile",
          label: "Profile",
          active: pathname.includes("/profile"),
          icon: "",
          submenus: [],
        },
        {
          href: "/settings/password",
          label: "Password",
          active: pathname.includes("/password"),
          icon: "",
          submenus: [],
        },
        {
          href: "/settings/preferences",
          label: "Preferences",
          active: pathname.includes("/preferences"),
          icon: "",
          submenus: [],
        },
      ],
    },
  ];
}
