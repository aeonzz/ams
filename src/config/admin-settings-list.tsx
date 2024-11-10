import { Group } from "@/lib/types/menu";

export function getAdminSettingsList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin/settings/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: "",
          submenus: [],
        },
        {
          href: "/admin/settings/password",
          label: "Password",
          active: pathname.includes("/password"),
          icon: "",
          submenus: [],
        },
        {
          href: "/admin/settings/preferences",
          label: "Preferences",
          active: pathname.includes("/preferences"),
          icon: "",
          submenus: [],
        },
      ],
    },
  ];
}
