import { Group } from "@/lib/types/menu";

export function getSettingsList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/settings/account",
          label: "Account",
          active: pathname.includes("/account"),
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
